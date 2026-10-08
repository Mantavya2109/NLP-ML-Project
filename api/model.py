import os
import re
import pickle
import numpy as np


def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-np.clip(x, -50.0, 50.0)))


class BiLSTMInference:
    """
    Exact 2-layer Bidirectional LSTM forward engine in pure NumPy.
    Executes the exact mathematical operations of the trained PyTorch FakeNewsLSTM model:
    - Embedding lookup
    - 2-layer Bidirectional LSTM cells (forward & backward)
    - Concatenation of final forward and backward hidden states
    - Fully Connected classification layer
    - Sigmoid probability activation
    """
    def __init__(self, weights: dict):
        self.emb_w = weights["embedding.weight"]  # [30000, 128]

        # Layer 0 weights & biases
        self.w_ih_l0 = weights["lstm.weight_ih_l0"]  # [512, 128]
        self.w_hh_l0 = weights["lstm.weight_hh_l0"]  # [512, 128]
        self.b_ih_l0 = weights["lstm.bias_ih_l0"]    # [512]
        self.b_hh_l0 = weights["lstm.bias_hh_l0"]    # [512]
        self.b_l0 = self.b_ih_l0 + self.b_hh_l0

        self.w_ih_l0_r = weights["lstm.weight_ih_l0_reverse"]  # [512, 128]
        self.w_hh_l0_r = weights["lstm.weight_hh_l0_reverse"]  # [512, 128]
        self.b_ih_l0_r = weights["lstm.bias_ih_l0_reverse"]    # [512]
        self.b_hh_l0_r = weights["lstm.bias_hh_l0_reverse"]    # [512]
        self.b_l0_r = self.b_ih_l0_r + self.b_hh_l0_r

        # Layer 1 weights & biases
        self.w_ih_l1 = weights["lstm.weight_ih_l1"]  # [512, 256]
        self.w_hh_l1 = weights["lstm.weight_hh_l1"]  # [512, 128]
        self.b_ih_l1 = weights["lstm.bias_ih_l1"]    # [512]
        self.b_hh_l1 = weights["lstm.bias_hh_l1"]    # [512]
        self.b_l1 = self.b_ih_l1 + self.b_hh_l1

        self.w_ih_l1_r = weights["lstm.weight_ih_l1_reverse"]  # [512, 256]
        self.w_hh_l1_r = weights["lstm.weight_hh_l1_reverse"]  # [512, 128]
        self.b_ih_l1_r = weights["lstm.bias_ih_l1_reverse"]    # [512]
        self.b_hh_l1_r = weights["lstm.bias_hh_l1_reverse"]    # [512]
        self.b_l1_r = self.b_ih_l1_r + self.b_hh_l1_r

        # Linear classification head
        self.fc_w = weights["fc.weight"]  # [1, 256]
        self.fc_b = weights["fc.bias"]    # [1]

    @staticmethod
    def _step(x_t, h_prev, c_prev, w_ih, w_hh, b):
        gates = np.dot(w_ih, x_t) + np.dot(w_hh, h_prev) + b
        i_gate = sigmoid(gates[0:128])
        f_gate = sigmoid(gates[128:256])
        g_gate = np.tanh(gates[256:384])
        o_gate = sigmoid(gates[384:512])
        c_t = f_gate * c_prev + i_gate * g_gate
        h_t = o_gate * np.tanh(c_t)
        return h_t, c_t

    def forward(self, sequence: list) -> float:
        """
        Runs full forward pass for a sequence of 1000 token IDs.
        Returns prediction probability in [0, 1].
        """
        seq_len = len(sequence)
        # Embedding lookup: [seq_len, 128]
        emb = self.emb_w[sequence]

        # Layer 0 Forward pass
        h_f0 = np.zeros(128, dtype=np.float32)
        c_f0 = np.zeros(128, dtype=np.float32)
        outputs_f0 = [None] * seq_len
        for t in range(seq_len):
            h_f0, c_f0 = self._step(emb[t], h_f0, c_f0, self.w_ih_l0, self.w_hh_l0, self.b_l0)
            outputs_f0[t] = h_f0

        # Layer 0 Backward pass
        h_b0 = np.zeros(128, dtype=np.float32)
        c_b0 = np.zeros(128, dtype=np.float32)
        outputs_b0 = [None] * seq_len
        for t in reversed(range(seq_len)):
            h_b0, c_b0 = self._step(emb[t], h_b0, c_b0, self.w_ih_l0_r, self.w_hh_l0_r, self.b_l0_r)
            outputs_b0[t] = h_b0

        # Layer 0 combined output: [seq_len, 256]
        layer0_out = [np.concatenate([outputs_f0[t], outputs_b0[t]]) for t in range(seq_len)]

        # Layer 1 Forward pass (accumulate to last step)
        h_f1 = np.zeros(128, dtype=np.float32)
        c_f1 = np.zeros(128, dtype=np.float32)
        for t in range(seq_len):
            h_f1, c_f1 = self._step(layer0_out[t], h_f1, c_f1, self.w_ih_l1, self.w_hh_l1, self.b_l1)

        # Layer 1 Backward pass (accumulate to first step in reverse)
        h_b1 = np.zeros(128, dtype=np.float32)
        c_b1 = np.zeros(128, dtype=np.float32)
        for t in reversed(range(seq_len)):
            h_b1, c_b1 = self._step(layer0_out[t], h_b1, c_b1, self.w_ih_l1_r, self.w_hh_l1_r, self.b_l1_r)

        # Final hidden state concatenation: [256]
        hidden_combined = np.concatenate([h_f1, h_b1])

        # Classification logit
        logit = np.dot(self.fc_w, hidden_combined) + self.fc_b
        return float(sigmoid(logit[0]))


class Predictor:
    """
    Handles preprocessing, tokenization, model loading, and serverless inference.
    Loads lightweight model bundle (NumPy-based) to keep Vercel bundle < 25 MB.
    """
    def __init__(self, bundle_path: str):
        if not os.path.exists(bundle_path):
            raise FileNotFoundError(f"Model package not found at: {bundle_path}")

        print(f"[INFO] Loading model bundle from: {bundle_path}")

        # If loading from .pkl or .npz bundle
        if bundle_path.endswith(".pkl"):
            with open(bundle_path, "rb") as f:
                bundle = pickle.load(f)
            weights = bundle["weights"]
            self.word_to_idx = bundle["word_to_idx"]
            self.max_len = bundle.get("max_len", 1000)
        elif bundle_path.endswith(".pth"):
            import torch
            checkpoint = torch.load(bundle_path, map_location="cpu")
            weights = {k: v.numpy() for k, v in checkpoint["model_state_dict"].items()}
            self.word_to_idx = checkpoint.get("word_to_idx", {})
            self.max_len = checkpoint.get("max_len", 1000)
        else:
            raise ValueError(f"Unsupported model format: {bundle_path}")

        self.pad_idx = self.word_to_idx.get("<PAD>", 0)
        self.unk_idx = self.word_to_idx.get("<UNK>", 1)

        self.model = BiLSTMInference(weights)
        self.device = "cpu"
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
        text = re.sub(r"http\S+|www\S+", " ", text)
        text = re.sub(r"<.*?>", " ", text)
        text = re.sub(r"[^a-z0-9\s']", " ", text)
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
        probability = self.model.forward(sequence)

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
