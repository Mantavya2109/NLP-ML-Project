# 📰 Fake News Detector — AI-Powered NLP Web Application

A production-ready Fake News Detection web platform powered by a deep 2-layer Bidirectional Long Short-Term Memory (**BiLSTM**) neural network in PyTorch, with a serverless Python API and a React + Vite + TypeScript frontend styled in a Neo-Brutalist design.

---

## 🏗 Project Structure

```text
Fake News NLP/
├── api/
│   ├── index.py                       # Vercel Python Serverless Function entrypoint (Flask)
│   ├── model.py                       # PyTorch BiLSTM model architecture & Predictor
│   └── requirements.txt               # Lightweight Python runtime dependencies
├── backend/
│   ├── app.py                         # Standalone local Flask server entrypoint
│   ├── model.py                       # PyTorch model architecture & Predictor
│   └── requirements.txt               # Standalone Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx             # Header navigation
│   │   │   ├── Toolbar.tsx            # 3-view navigation bar (Detector, Real, Fake)
│   │   │   ├── NewsInput.tsx          # Article textarea workspace
│   │   │   ├── AnalysisPanel.tsx      # Real-time verdict & confidence panel
│   │   │   └── SampleNewsView.tsx     # Horizontal sample cards with 1-click copy & test
│   │   ├── data/
│   │   │   └── samples.ts             # 5 Real News & 5 Fake News sample articles
│   │   ├── services/
│   │   │   └── api.ts                 # Vercel & local API client with fallbacks
│   │   ├── App.tsx                    # Main state and layout coordinator
│   │   ├── main.tsx                   # React entrypoint
│   │   └── index.css                  # Neo-brutalist Tailwind styling
│   ├── package.json                   # Frontend dependencies
│   ├── tsconfig.json                  # TypeScript configuration
│   └── vite.config.ts                 # Vite build configuration
├── ml/
│   ├── fake_news_lstm_checkpoint.pth  # Trained model deployment checkpoint (~17.7 MB)
│   ├── best_fake_news_lstm.pth        # Best model state dictionary
│   └── train.ipynb                    # Training & evaluation Jupyter Notebook
├── package.json                       # Root monorepo package configuration
├── vercel.json                        # Vercel deployment configuration
├── .gitignore                         # Git ignore configuration
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
- **Deployment Checkpoint:** `ml/fake_news_lstm_checkpoint.pth` (17.7 MB)

---

## 🌐 Deploying to Vercel

This repository is pre-configured for one-click deployment to **Vercel** with both the React frontend and Python serverless inference API.

### Steps to Deploy:

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy Fake News NLP on Vercel"
   git push origin main
   ```

2. **Import into Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new).
   - Select your GitHub repository.
   - Vercel automatically detects `vercel.json` and root `package.json`.

3. **Project Settings on Vercel:**
   - **Framework Preset:** `Vite` or `Other`
   - **Build Command:** `npm run build` (or `cd frontend && npm install && npm run build`)
   - **Output Directory:** `frontend/dist`
   - **Root Directory:** `./`

4. **Environment Variables (Optional):**
   - `VITE_API_URL`: Leave empty for unified Vercel deployment (the frontend will use same-origin relative `/api/*` endpoints). If using an external backend URL, set `VITE_API_URL=https://your-backend.com`.

---

## 💻 Local Development

### Option A: Run Full Stack (Frontend + Python API)

1. **Start the Python API:**
   ```bash
   cd api
   pip install -r requirements.txt
   python index.py
   ```
   *API starts at `http://localhost:5000`.*

2. **Start the React Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend starts at `http://localhost:5173`.*

---

## 🔌 API Endpoints

- **`GET /api`** or **`GET /`** &mdash; Health check and model metadata:
  ```json
  {
    "status": "running",
    "model": "Fake News BiLSTM",
    "device": "cuda"
  }
  ```

- **`POST /api/predict`** or **`POST /predict`** &mdash; Classify news text:
  ```json
  // Request
  {
    "text": "WASHINGTON (Reuters) - The U.S. Senate approved funding legislation."
  }

  // Response
  {
    "prediction": "Real",
    "confidence": 92.65
  }
  ```
