import sys
import joblib
import numpy as np
import warnings

warnings.filterwarnings("ignore")

# Load model and scaler
model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

if len(sys.argv) <= 1:
    print("⚠️ Please provide input features! Example: python server.py 50 8 94 9 0")
    sys.exit()

# Convert input args to float
data = np.array(list(map(float, sys.argv[1:]))).reshape(1, -1)

# Scale data before prediction
data_scaled = scaler.transform(data)

# Predict
pred = model.predict(data_scaled)[0]

print("Predicted Stress Level:", pred)
