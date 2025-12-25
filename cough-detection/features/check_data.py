import numpy as np
import pickle

X = np.load("X.npy")
y = pickle.load(open("labels.pkl", "rb"))

print("Samples:", X.shape[0])
print("Features per sample:", X.shape[1])
print("Cough:", y.count(1))
print("Not cough:", y.count(0))
