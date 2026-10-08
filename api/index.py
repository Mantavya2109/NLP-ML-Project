import os
import sys

# Ensure api directory is in python path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from flask import Flask, request, jsonify
from flask_cors import CORS
from model import Predictor

app = Flask(__name__)
# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})

# Deployment-safe model bundle resolution (loads lightweight model_bundle.pkl first, fallback to .pth)
POSSIBLE_PATHS = [
    os.path.abspath(os.path.join(CURRENT_DIR, "..", "ml", "model_bundle.pkl")),
    os.path.abspath(os.path.join(CURRENT_DIR, "model_bundle.pkl")),
    os.path.abspath(os.path.join(os.getcwd(), "ml", "model_bundle.pkl")),
    os.path.abspath(os.path.join(CURRENT_DIR, "..", "ml", "fake_news_lstm_checkpoint.pth")),
    os.path.abspath(os.path.join(os.getcwd(), "ml", "fake_news_lstm_checkpoint.pth")),
]

CHECKPOINT_PATH = None
for path in POSSIBLE_PATHS:
    if os.path.exists(path):
        CHECKPOINT_PATH = path
        break

_predictor_instance = None


def get_predictor():
    """
    Lazy-loads predictor singleton to optimize cold-starts and memory.
    """
    global _predictor_instance
    if _predictor_instance is None:
        if not CHECKPOINT_PATH:
            raise FileNotFoundError(f"Model package not found in any expected paths: {POSSIBLE_PATHS}")
        print(f"[INFO] Initializing Predictor with model file: {CHECKPOINT_PATH}")
        _predictor_instance = Predictor(CHECKPOINT_PATH)
    return _predictor_instance


@app.route("/api", methods=["GET"])
@app.route("/api/", methods=["GET"])
def health_check():
    """
    Health check endpoint for Vercel / local server.
    """
    return jsonify({
        "status": "running",
        "model": "Fake News BiLSTM",
        "checkpoint_located": CHECKPOINT_PATH is not None
    }), 200


@app.route("/api/predict", methods=["POST"])
@app.route("/predict", methods=["POST"])
def predict_news():
    """
    Predicts whether a given news article text is Fake or Real.
    Expects JSON:
        {"text": "..."}
    Returns JSON:
        {"prediction": "Fake" | "Real", "confidence": 87.42}
    """
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400

    data = request.get_json(silent=True)
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field in request body"}), 400

    text = data.get("text", "")
    if not isinstance(text, str) or not text.strip():
        return jsonify({"error": "Please provide non-empty text to analyze."}), 400

    try:
        predictor = get_predictor()
        result = predictor.predict(text)
        return jsonify(result), 200
    except Exception as e:
        app.logger.error(f"Prediction error: {e}", exc_info=True)
        return jsonify({"error": f"Failed to process text: {str(e)}"}), 500


# For local execution: python api/index.py
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[INFO] Starting Fake News API server on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
