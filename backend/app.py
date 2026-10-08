import os
import sys

# Ensure api or backend directory is in path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
API_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "api"))
if API_DIR not in sys.path:
    sys.path.insert(0, API_DIR)

from index import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[INFO] Starting Fake News API server from backend on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
