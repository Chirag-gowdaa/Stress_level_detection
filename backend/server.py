import joblib
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app, origins=["http://localhost:3000", "https://your-frontend-domain.onrender.com"])

# Load model and scaler
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

# Serve React build files
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_serve(path):
    return send_from_directory(app.static_folder, path)

# Prediction API
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json.get('data')
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    data = np.array(data).reshape(1, -1)
    data_scaled = scaler.transform(data)
    pred = model.predict(data_scaled)[0]

    return jsonify({"predicted_stress_level": float(pred)})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
