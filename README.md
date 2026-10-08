# 📰 Fake News Detector — AI-Powered NLP Web Application

A production-ready Fake News Detection web platform powered by a deep 2-layer Bidirectional Long Short-Term Memory (**BiLSTM**) neural network with PyTorch, Flask REST API, and a React + Vite + TypeScript + Tailwind CSS frontend.

---

## 🏗 Project Architecture

```text
Fake News NLP/
├── backend/
│   ├── app.py                     # Flask REST API server with CORS
│   ├── model.py                   # PyTorch BiLSTM model & Text Preprocessor
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/            # Modular React components
│   │   │   ├── Navbar.tsx         # Header with live API connection indicator
│   │   │   ├── Hero.tsx           # Title & high-level overview
│   │   │   ├── NewsInput.tsx      # Textarea, word/character counter & samples
│   │   │   ├── ResultCard.tsx     # Real/Fake classification & confidence meter
│   │   │   ├── ModelStats.tsx     # Architecture & performance specifications
│   │   │   └── Disclaimer.tsx     # Disclaimer footer
│   │   ├── services/
│   │   │   └── api.ts             # API client & backend health check
│   │   ├── App.tsx                # Main application state coordinator
│   │   ├── main.tsx               # React application entrypoint
│   │   └── index.css              # Tailwind CSS stylesheet
│   ├── package.json               # Frontend dependencies & scripts
│   ├── tsconfig.json              # TypeScript configuration
│   └── vite.config.ts             # Vite build configuration
├── ml/
│   ├── fake_news_lstm_checkpoint.pth  # Complete model deployment checkpoint
│   ├── best_fake_news_lstm.pth        # Best model state dictionary
│   ├── train.ipynb                    # Training & evaluation Jupyter Notebook
│   ├── Fake.csv                       # ISOT Fake News Dataset
│   ├── True.csv                       # ISOT True News Dataset
│   └── bharatfakenewskosh.csv         # BharatFakeNewsKosh Dataset
├── .gitignore
└── README.md
```

---

## 🧠 Model Specifications

- **Architecture:** 2-Layer Bidirectional LSTM (`FakeNewsLSTM`)
- **Vocabulary Size:** 30,000 unique word tokens
- **Embedding Dimension:** 128
- **Hidden Dimension:** 128 (256 effective bidirectional features)
- **Sequence Length:** 1,000 tokens (padded / truncated)
- **Dropout Rate:** 0.3
- **Classification Labels:**
  - `0` → **Fake News**
  - `1` → **Real News**
- **Test Accuracy:** **84.46%**
- **Test F1 Score:** **0.8781**
- **Test Precision:** **0.7890**
- **Test Recall:** **0.9898**

---

## 🚀 Running the Project

### 1. Start the Flask Backend

Open a terminal and run:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The Flask API will start at `http://localhost:5000`.

#### API Endpoints:
- `GET /` — Health check & model metadata:
  ```json
  {
    "status": "running",
    "model": "Fake News BiLSTM"
  }
  ```
- `POST /predict` — Analyze news text:
  ```json
  // Request
  {
    "text": "WASHINGTON (Reuters) - The U.S. Senate passed a bipartisan spending bill on Thursday."
  }

  // Response
  {
    "prediction": "Real",
    "confidence": 92.65
  }
  ```

---

### 2. Start the React Frontend

Open a separate terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173` to access the interactive web application.

---

## 🛡 Disclaimer

This system is a machine learning prototype for research and educational purposes. Model predictions are probabilistic and should not be treated as definitive fact verification.
