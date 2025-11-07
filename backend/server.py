import joblib
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS 

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  

# Load model and scaler
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

@app.route('/')
def home():
    return "Server is running successfully!"

@app.route('/')
def serve():
    return send_from_directory('build', 'index.html')

@app.route('/<path:path>')
def static_serve(path):
    return send_from_directory('build', path)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json.get('data')
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    data = np.array(data).reshape(1, -1) #we are reshaping because we expect a single sample
    data_scaled = scaler.transform(data)
    pred = model.predict(data_scaled)[0]

    return jsonify({"predicted_stress_level": float(pred)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5200)
