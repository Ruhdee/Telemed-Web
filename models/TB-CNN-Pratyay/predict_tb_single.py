import sys
import json
from pathlib import Path

try:
    import torch
    import torch.nn as nn
    from torchvision import transforms, models
    from PIL import Image
except ImportError as e:
    print(json.dumps({"error": f"Missing dependency: {str(e)}. Please install PyTorch and torchvision."}))
    sys.exit(1)

# Use torchvision ResNet as base model
from torchvision import models

def create_tb_model(num_classes=2):
    # Load ResNet18 directly to match checkpoint keys
    model = models.resnet18(weights=None)
    # Replace final layer for binary classification
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model

def predict_tb_single(image_path):
    try:
        script_dir = Path(__file__).parent
        model_path = script_dir / "outputs" / "checkpoints" / "best_model.pt"
        
        if not model_path.exists():
            raise FileNotFoundError("TB model file not found")
        
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Load model
        model = create_tb_model(num_classes=2)
        
        try:
            checkpoint = torch.load(str(model_path), map_location=device, weights_only=False)
            
            # Handle different checkpoint formats
            if 'model_state_dict' in checkpoint:
                model.load_state_dict(checkpoint['model_state_dict'])
            elif 'state_dict' in checkpoint:
                model.load_state_dict(checkpoint['state_dict'])
            else:
                # Direct state dict loading
                model.load_state_dict(checkpoint)
        except Exception as load_error:
            raise Exception(f"Failed to load model checkpoint: {str(load_error)}")
        
        model.to(device)
        model.eval()
        
        # Image preprocessing
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        
        # Load and preprocess image
        try:
            # Handle path resolution
            image_file = Path(image_path).resolve()
            if not image_file.exists():
                # Try relative to script directory
                script_dir = Path(__file__).parent
                image_file = (script_dir / "../../.." / image_path).resolve()
                if not image_file.exists():
                    raise FileNotFoundError(f"Image file not found at: {image_path}")
            
            image = Image.open(str(image_file)).convert('RGB')
            image_tensor = transform(image).unsqueeze(0).to(device)
        except Exception as img_error:
            raise Exception(f"Failed to process image: {str(img_error)}")
        
        # Make prediction
        try:
            with torch.no_grad():
                outputs = model(image_tensor)
                probabilities = torch.softmax(outputs, dim=1)
                prediction = torch.argmax(outputs, dim=1).item()
                confidence = torch.max(probabilities).item()
                
                prob_normal = probabilities[0][0].item()
                prob_tb = probabilities[0][1].item()
        except Exception as pred_error:
            raise Exception(f"Model prediction failed: {str(pred_error)}")
        
        result = {
            "prediction": int(prediction),
            "confidence": float(confidence),
            "probability_normal": float(prob_normal),
            "probability_tb": float(prob_tb),
            "risk_level": "High" if prediction == 1 else "Low"
        }
        
        return result
        
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}

if __name__ == "__main__":
    try:
        if len(sys.argv) != 2:
            print(json.dumps({"error": "Usage: python predict_tb_single.py <image_path>"}))
            sys.exit(1)
        
        image_path = sys.argv[1]
        
        if not Path(image_path).exists():
            print(json.dumps({"error": "Image file not found"}))
            sys.exit(1)
        
        result = predict_tb_single(image_path)
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({"error": f"Script execution failed: {str(e)}"}))
        sys.exit(1)