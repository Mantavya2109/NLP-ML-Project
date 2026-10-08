import os
import re
import torch
import torch.nn as nn


class FakeNewsLSTM(nn.Module):
    """
    2-Layer Bidirectional LSTM model for Fake News Detection.
    Matches exact architecture used during training.
    """
    def __init__(
        self,
        vocab_size: int = 30000,
        embedding_dim: int = 128,
        hidden_dim: int = 128,
        num_layers: int = 2,
        dropout: float = 0.3
    ):
        super(FakeNewsLSTM, self).__init__()

        self.embedding = nn.Embedding(
            num_embeddings=vocab_size,
            embedding_dim=embedding_dim,
            padding_idx=0
        )

        self.lstm = nn.LSTM(
            input_size=embedding_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=True,
            dropout=dropout if num_layers > 1 else 0.0
        )

        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(hidden_dim * 2, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # x shape: [batch_size, sequence_length]
        embedded = self.embedding(x)
        # embedded shape: [batch_size, sequence_length, embedding_dim]

        output, (hidden, cell) = self.lstm(embedded)

        # Last hidden state from both directions (forward and backward)
        forward_hidden = hidden[-2]
        backward_hidden = hidden[-1]

        hidden_combined = torch.cat((forward_hidden, backward_hidden), dim=1)
        hidden_combined = self.dropout(hidden_combined)

        out = self.fc(hidden_combined)
        return out.squeeze(1)


class Predictor:
    """
    Handles preprocessing, tokenization, checkpoint loading, and inference.
    """
    def __init__(self, checkpoint_path: str):
        if not os.path.exists(checkpoint_path):
            raise FileNotFoundError(f"Checkpoint not found at: {checkpoint_path}")

        print(f"Loading checkpoint from: {checkpoint_path}")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Using device for inference: {self.device}")

        checkpoint = torch.load(checkpoint_path, map_location=self.device)

        self.word_to_idx = checkpoint.get("word_to_idx", {})
        self.max_len = checkpoint.get("max_len", 1000)
        vocab_size = checkpoint.get("vocab_size", len(self.word_to_idx))
        embedding_dim = checkpoint.get("embedding_dim", 128)
        hidden_dim = checkpoint.get("hidden_dim", 128)
        num_layers = checkpoint.get("num_layers", 2)
        dropout = checkpoint.get("dropout", 0.3)

        self.pad_idx = self.word_to_idx.get("<PAD>", 0)
        self.unk_idx = self.word_to_idx.get("<UNK>", 1)

        self.model = FakeNewsLSTM(
            vocab_size=vocab_size,
            embedding_dim=embedding_dim,
            hidden_dim=hidden_dim,
            num_layers=num_layers,
            dropout=dropout
        )

        self.model.load_state_dict(checkpoint["model_state_dict"])
        self.model.to(self.device)
        self.model.eval()
        print("[INFO] Model and vocabulary successfully initialized and ready for inference.")

    def clean_text(self, text: str) -> str:
        """
        Exact text cleaning pipeline from training notebook:
        1. Convert text to lowercase
        2. Remove URLs
        3. Remove HTML tags
        4. Keep letters, numbers, spaces and apostrophes
        5. Normalize whitespace
        """
        text = str(text).lower()
        # Remove URLs
        text = re.sub(r"http\S+|www\S+", " ", text)
        # Remove HTML tags
        text = re.sub(r"<.*?>", " ", text)
        # Keep letters, numbers, spaces and apostrophes
        text = re.sub(r"[^a-z0-9\s']", " ", text)
        # Normalize whitespace
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def text_to_sequence(self, text: str) -> list:
        """
        Converts raw text to integer token IDs padded/truncated to max_len.
        """
        cleaned = self.clean_text(text)
        tokens = cleaned.split()

        sequence = [
            self.word_to_idx.get(token, self.unk_idx)
            for token in tokens
        ]

        # Truncate
        sequence = sequence[:self.max_len]

        # Pad
        if len(sequence) < self.max_len:
            sequence += [self.pad_idx] * (self.max_len - len(sequence))

        return sequence

    def predict(self, text: str) -> dict:
        """
        Runs model prediction on input text.
        Returns:
            {
                "prediction": "Real" | "Fake",
                "confidence": float (percentage, e.g. 87.42)
            }
        """
        if not text or not str(text).strip():
            raise ValueError("Input text cannot be empty.")

        sequence = self.text_to_sequence(text)
        input_tensor = torch.tensor([sequence], dtype=torch.long, device=self.device)

        with torch.no_grad():
            output = self.model(input_tensor)
            # Sigmoid activation converts logit to probability in [0, 1]
            probability = torch.sigmoid(output).item()

        # Label mapping: 0 = Fake, 1 = Real
        if probability >= 0.5:
            prediction = "Real"
            confidence = round(probability * 100, 2)
        else:
            prediction = "Fake"
            confidence = round((1.0 - probability) * 100, 2)

        return {
            "prediction": prediction,
            "confidence": confidence
        }
