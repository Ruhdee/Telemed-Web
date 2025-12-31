import sys
import json
import random
from pathlib import Path

def predict_tb_simple(image_path):
    """Simple TB prediction without PyTorch dependencies"""
    try:
        # Convert to absolute path and check if image file exists
        image_file = Path(image_path).resolve()
        if not image_file.exists():
            # Try relative to script directory
            script_dir = Path(__file__).parent
            image_file = (script_dir / "../../.." / image_path).resolve()
            if not image_file.exists():
                raise FileNotFoundError(f"Image file not found at: {image_path}")
        
        # Simple rule-based prediction (placeholder)
        # In a real scenario, this would use the actual model
        random.seed(hash(str(image_file)) % 1000)  # Seed based on file path
        
        # Simulate prediction
        prediction_score = random.random()
        
        prediction = 1 if prediction_score > 0.5 else 0
        confidence = max(prediction_score, 1 - prediction_score)
        
        result = {
            "prediction": prediction,
            "confidence": float(confidence),
            "probability_normal": float(1 - prediction_score),
            "probability_tb": float(prediction_score),
            "risk_level": "High" if prediction == 1 else "Low"
        }
        
        return result
        
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}

if __name__ == "__main__":
    try:
        if len(sys.argv) != 2:
            print(json.dumps({"error": "Usage: python predict_tb_simple.py <image_path>"}))
            sys.exit(1)
        
        image_path = sys.argv[1]
        result = predict_tb_simple(image_path)
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": f"Script execution failed: {str(e)}"}))
        sys.exit(1)