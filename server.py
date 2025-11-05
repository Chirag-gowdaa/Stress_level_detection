import sys
import joblib
import numpy as np

model = joblib.load("model.pkl")

data = list(map(float, sys.argv[1:]))  # get data from command line args
pred = model.predict([data])
print(pred[0])
