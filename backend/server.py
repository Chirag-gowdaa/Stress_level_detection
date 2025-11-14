import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)

# Allow all origins for CORS (since frontend is on Vercel)
# In production, you can restrict this to your Vercel domain
CORS(app, resources={r"/*": {"origins": "*"}})

# Load model and scaler with error handling
try:
    model = joblib.load("model.pkl")
    scaler = joblib.load("scaler.pkl")
    print("Model and scaler loaded successfully")
except Exception as e:
    print(f"Error loading model/scaler: {e}")
    model = None
    scaler = None

# Health check endpoint
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None
    }), 200

# Prediction API
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Check if model is loaded
        if model is None or scaler is None:
            return jsonify({"error": "Model not loaded. Please check server logs."}), 500
        
        # Validate request
        if not request.json:
            return jsonify({"error": "No JSON data provided"}), 400
        
        data = request.json.get('data')
        if not data:
            return jsonify({"error": "No input data provided"}), 400
        
        # Validate data format
        if not isinstance(data, list):
            return jsonify({"error": "Data must be a list"}), 400
        
        if len(data) != 5:
            return jsonify({"error": f"Expected 5 features, got {len(data)}"}), 400
        
        # Convert to numpy array and validate
        try:
            data_array = np.array(data, dtype=float).reshape(1, -1)
        except (ValueError, TypeError) as e:
            return jsonify({"error": f"Invalid data format: {str(e)}"}), 400
        
        # Make prediction
        data_scaled = scaler.transform(data_array)
        pred = model.predict(data_scaled)[0]
        
        return jsonify({
            "predicted_stress_level": float(pred),
            "status": "success"
        }), 200
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
