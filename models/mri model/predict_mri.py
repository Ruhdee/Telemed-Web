import tensorflow as tf
import numpy as np
import cv2
import sys
import json
import os

# Get the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'best_model.h5')

# Load the new model with optimizations
tf.config.threading.set_inter_op_parallelism_threads(1)
tf.config.threading.set_intra_op_parallelism_threads(1)
model = tf.keras.models.load_model(model_path)
model.compile()  # Ensure model is compiled

IMG_SIZE = (96, 96)
class_labels = ["glioma", "meningioma", "notumor", "pituitary"]

def preprocess_image(image_path):
    """Preprocess image according to new model requirements"""
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image: {image_path}")
    
    # Resize to new model input size
    img = cv2.resize(img, IMG_SIZE)
    # Normalize pixel values
    img = img.astype("float32") / 255.0
    # Add batch dimension
    img = np.expand_dims(img, axis=0)
    return img

def predict_mri(image_path):
    try:
        print(f"Processing image: {image_path}", file=sys.stderr)
        
        # Check if file exists
        if not os.path.exists(image_path):
            return {'error': f'Image file not found: {image_path}'}
        
        # Preprocess the image
        processed_img = preprocess_image(image_path)
        print(f"Image preprocessed successfully. Shape: {processed_img.shape}", file=sys.stderr)
        
        # Make prediction with optimizations
        probs = model.predict(processed_img, verbose=0, batch_size=1)[0]
        print(f"Prediction completed. Probabilities: {probs}", file=sys.stderr)
        
        # Get top prediction
        top_class = np.argmax(probs)
        confidence = float(probs[top_class]) * 100
        
        # Determine if tumor is present
        tumor_present = class_labels[top_class] != "notumor"
        
        result = {
            'prediction': class_labels[top_class],
            'confidence': confidence,
            'tumor_detected': tumor_present,
            'class': int(top_class),
            'all_probabilities': {label: float(prob * 100) for label, prob in zip(class_labels, probs)},
            'success': True
        }
        
        print(f"Prediction result: {result}", file=sys.stderr)
        return result
        
    except Exception as e:
        error_msg = f"MRI prediction error: {str(e)}"
        print(error_msg, file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return {'error': error_msg, 'success': False}

if __name__ == '__main__':
    print(f"Script called with {len(sys.argv)} arguments: {sys.argv}", file=sys.stderr)
    
    if len(sys.argv) != 2:
        print(f"Expected 2 arguments, got {len(sys.argv)}: {sys.argv}", file=sys.stderr)
        print(json.dumps({'error': 'Please provide image path'}))
        sys.exit(1)
    
    image_path = sys.argv[1]
    print(f"Using image path: {image_path}", file=sys.stderr)
    result = predict_mri(image_path)
    print(json.dumps(result))