import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import Predictor

app = Flask(__name__)
# Enable CORS for all routes so React frontend can call Flask
CORS(app, resources={r"/*": {"origins": "*"}})

# Locate checkpoint file: check ../ml/fake_news_lstm_checkpoint.pth and fallback locations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHECKPOINT_PATH = os.path.abspath(os.path.join(BASE_DIR, "..", "ml", "fake_news_lstm_checkpoint.pth"))

if not os.path.exists(CHECKPOINT_PATH):
    # Try alternative relative paths if executed from different working directory
    fallback = os.path.abspath(os.path.join(BASE_DIR, "fake_news_lstm_checkpoint.pth"))
    if os.path.exists(fallback):
        CHECKPOINT_PATH = fallback
    else:
        print(f"Error: Model checkpoint not found at {CHECKPOINT_PATH}", file=sys.stderr)

print(f"Initializing Predictor with checkpoint: {CHECKPOINT_PATH}")
predictor = Predictor(CHECKPOINT_PATH)


@app.route("/", methods=["GET"])
def health_check():
    """
    Health check endpoint.
    Returns:
        {"status": "running", "model": "Fake News BiLSTM"}
    """
    return jsonify({
        "status": "running",
        "model": "Fake News BiLSTM"
    }), 200


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
        result = predictor.predict(text)
        return jsonify(result), 200
    except Exception as e:
        app.logger.error(f"Prediction error: {e}", exc_info=True)
        return jsonify({"error": f"Failed to process text: {str(e)}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Fake News Detection API server on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
