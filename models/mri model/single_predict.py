import tensorflow as tf
import numpy as np
import cv2
import sys

model = tf.keras.models.load_model("best_model.h5")

IMG_SIZE = (96, 96)

class_labels = ["glioma", "meningioma", "notumor", "pituitary"]  

def predict_image(image_path):
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not read {image_path}")
        return
    img = cv2.resize(img, IMG_SIZE)
    img = img.astype("float32") / 255.0 
    img = np.expand_dims(img, axis=0)   

    # Predict
    probs = model.predict(img)[0]
    top_class = np.argmax(probs)
    confidence = probs[top_class] * 100

    print(f"\nPrediction: {class_labels[top_class]} ({confidence:.2f}% confidence)")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path>")
    else:
        predict_image(sys.argv[1])


