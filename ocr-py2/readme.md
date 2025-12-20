# Blood Report Parser API

A FastAPI-based application to extract cardiac risk assessment parameters from digital blood reports (PDF or text files) and store them in JSON format.

## Features

- Upload PDF or text blood reports
- Automatically extract 13 cardiac parameters
- Convert text values to numeric codes
- Save results as JSON files
- Debug endpoints for troubleshooting

## Extracted Fields

| Field | Description | Value Type |
|-------|-------------|------------|
| `age` | Age | Integer |
| `sex` | Sex (Male/Female) | String |
| `cp` | Chest Pain Type | Integer (0-3) |
| `trestbps` | Resting Blood Pressure | Float (mmHg) |
| `chol` | Serum Cholesterol | Float (mg/dL) |
| `fbs` | Fasting Blood Sugar | Integer (0=Normal, 1=Elevated) |
| `restecg` | Resting ECG | Integer (0=Normal, 1=ST-T Abnormality, 2=Hypertrophy) |
| `thalach` | Max Heart Rate Achieved | Float (bpm) |
| `exang` | Exercise Induced Angina | Integer (0=Absent, 1=Present) |
| `oldpeak` | ST Depression | Float (mm) |
| `slope` | Slope of ST Segment | Integer (0=Upward, 1=Flat, 2=Downward) |
| `ca` | Major Vessels | Integer (0-3) |
| `thal` | Thalassemia | Integer (1=Normal, 2=Fixed Defect, 3=Reversible Defect) |

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## Installation

### Step 1: Clone or Download the Code

Save the FastAPI code as `main.py` in your project directory.

### Step 2: Create a Virtual Environment (Recommended)

**On Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Required Dependencies

```bash
pip install fastapi uvicorn PyPDF2 python-multipart
```

**Dependencies:**
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `PyPDF2` - PDF text extraction
- `python-multipart` - File upload support

### Step 4: Verify Installation

Check if PyPDF2 is installed correctly:

```bash
python -c "import PyPDF2; print('PyPDF2 version:', PyPDF2.__version__)"
```

## Running the Application

### Start the Server

**Basic command:**
```bash
python main.py
```

**Or using uvicorn directly:**
```bash
uvicorn main:app --reload 
and use http://localhost:8000/docs 
```

**Options:**
- `--reload` - Auto-reload on code changes (development mode)


### Verify Server is Running

Open your browser and visit:
```
http://localhost:8000
```

You should see:
```json
{
  "message": "Blood Report Parser API",
  "endpoints": {
    "upload": "/ocr/upload",
    "parse_text": "/parse-text/"
  }
}
```

## API Documentation

Once the server is running, access the interactive API documentation:

**Swagger UI:**
```
http://localhost:8000/docs
```

**ReDoc:**
```
http://localhost:8000/redoc
```

## Usage

### Method 1: Using the Web Interface

1. Go to `http://localhost:8000/docs`
2. Click on **POST /ocr/upload**
3. Click **"Try it out"**
4. Click **"Choose File"** and select your PDF
5. Click **"Execute"**
6. View the extracted data in the response

### Method 2: Using cURL (Command Line)

**Upload a PDF file:**
```bash
curl -X POST "http://localhost:8000/ocr/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/blood_report.pdf"
```

**Upload a text file:**
```bash
curl -X POST "http://localhost:8000/ocr/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/blood_report.txt"
```

### Method 3: Using Python Requests

```python
import requests

url = "http://localhost:8000/ocr/upload"
files = {"file": open("blood_report.pdf", "rb")}

response = requests.post(url, files=files)
print(response.json())
```

### Method 4: Using Postman

1. Set method to **POST**
2. URL: `http://localhost:8000/ocr/upload`
3. Go to **Body** tab
4. Select **form-data**
5. Add key: `file` (change type to **File**)
6. Choose your PDF file
7. Click **Send**

## Response Format

**Successful Response (200 OK):**
```json
{
  "message": "Report processed successfully",
  "filename": "blood_report_20251220_143052.json",
  "filepath": "/path/to/blood_report_20251220_143052.json",
  "extracted_text_length": 1234,
  "extracted_text_preview": "XYZ MULTISPECIALITY HOSPITAL...",
  "data": {
    "age": 54,
    "sex": "Male",
    "cp": 2,
    "trestbps": 138.0,
    "chol": 246.0,
    "fbs": 0,
    "restecg": 1,
    "thalach": 150.0,
    "exang": 0,
    "oldpeak": 1.6,
    "slope": 1,
    "ca": 0,
    "thal": 3
  }
}
```

## Output Files

The extracted data is automatically saved as JSON files in the same directory where the script is running.

**Filename format:** `blood_report_YYYYMMDD_HHMMSS.json`

**Example:** `blood_report_20251220_143052.json`

## Troubleshooting

### Issue: "Internal Server Error" or "PyPDF2 not installed"

**Solution:**
```bash
# Activate your virtual environment first
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Then install PyPDF2
pip install PyPDF2

# Restart the server
python main.py
```

### Issue: JSON file not created

**Check:**
1. Directory write permissions
2. View the debug endpoint:
   ```bash
   curl http://localhost:8000/debug
   ```

### Issue: Some fields are null

**Possible causes:**
- PDF format doesn't match expected patterns
- Text extraction failed
- Field names in PDF are different

**Solution:**
- Check the `extracted_text_preview` in the response
- Verify field names match the expected format
- Adjust regex patterns in `main.py` if needed

### Issue: Port already in use

**Solution:**
```bash
# Use a different port
python main.py  # or
uvicorn main:app --port 8001
```

## Debug Endpoints

### Check System Status
```bash
curl http://localhost:8000/debug
```

**Response:**
```json
{
  "current_directory": "/path/to/project",
  "directory_writable": true,
  "pypdf2_installed": true,
  "pypdf2_version": "3.0.0",
  "files_in_directory": ["main.py", "blood_report_20251220_143052.json"]
}
```

## Customization

### Adding New Fields

Edit the `patterns` dictionary in `main.py`:

```python
patterns = {
    'your_field': r'Field Name in PDF\s*(\d+\.?\d*)',
    # Add more patterns
}
```

### Changing Port

```bash
uvicorn main:app --port 9000
```

## Project Structure

```
project/
│
├── main.py                          # FastAPI application
├── venv/                            # Virtual environment (optional)
├── blood_report_YYYYMMDD_HHMMSS.json  # Output JSON files
└── README.md                        # This file
```

## Dependencies List

Create `requirements.txt`:
```
fastapi==0.104.1
uvicorn==0.24.0
PyPDF2==3.0.1
python-multipart==0.0.6
```

Install from requirements.txt:
```bash
pip install -r requirements.txt
```

## Notes

- The API expects blood reports in a specific format (see sample PDF)
- Text extraction quality depends on PDF quality
- Scanned PDFs may require OCR preprocessing
- All timestamps are in local server time
- JSON files accumulate - clean up old files periodically

## Example Report Format

The API expects reports with fields like:
```
Age / Sex: 54 Years / Male
Chest Pain Type (cp): 2
Resting Blood Pressure: 138 mmHg
Serum Cholesterol: 246 mg/dL
...
```

## Support

For issues or questions:
1. Check the server logs (terminal output)
2. Use the `/debug` endpoint
3. Verify PyPDF2 installation
4. Check file permissions

## License

This project is provided as-is for educational and diagnostic purposes.