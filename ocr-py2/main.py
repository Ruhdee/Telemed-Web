from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
import re
from datetime import datetime
import io
import os
import traceback

app = FastAPI(title="Blood Report Parser API")

class BloodReport(BaseModel):
    age: Optional[int] = None
    sex: Optional[str] = None
    cp: Optional[int] = None
    trestbps: Optional[float] = None
    chol: Optional[float] = None
    fbs: Optional[int] = None
    restecg: Optional[int] = None
    thalach: Optional[float] = None
    exang: Optional[int] = None
    oldpeak: Optional[float] = None
    slope: Optional[int] = None
    ca: Optional[int] = None
    thal: Optional[int] = None

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    print(f"[DEBUG] Attempting to extract text from PDF, size: {len(file_content)} bytes")
    
    try:
        import PyPDF2
        print("[DEBUG] PyPDF2 imported successfully")
    except ImportError as e:
        print(f"[ERROR] PyPDF2 not installed: {e}")
        raise HTTPException(
            status_code=500, 
            detail="PyPDF2 not installed. Run: pip install PyPDF2"
        )
    
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        print(f"[DEBUG] PDF loaded, pages: {len(pdf_reader.pages)}")
        
        text = ""
        for i, page in enumerate(pdf_reader.pages):
            page_text = page.extract_text()
            text += page_text
            print(f"[DEBUG] Page {i+1} extracted {len(page_text)} characters")
        
        print(f"[DEBUG] Total text extracted: {len(text)} characters")
        return text
    except Exception as e:
        print(f"[ERROR] PDF extraction failed: {e}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Error extracting PDF: {str(e)}"
        )

def parse_blood_report(text: str) -> BloodReport:
    """Parse blood report text and extract known fields"""
    print(f"[DEBUG] Parsing text of length: {len(text)}")
    report = BloodReport()
    
    # Pattern matching for cardiac blood test fields
    patterns = {
        'age': r'Age\s*[/]?\s*Sex\s*(\d+)\s*Years',
        'sex': r'Age\s*[/]?\s*Sex\s*\d+\s*Years\s*[/]?\s*(Male|Female|M|F)',
        'cp': r'Chest Pain Type\s*\(cp\)\s*(\d+)',
        'trestbps': r'Resting Blood Pressure\s*(\d+\.?\d*)',
        'chol': r'Serum Cholesterol\s*(\d+\.?\d*)',
        'fbs': r'Fasting Blood Sugar\s*(Normal|Elevated|\d+)',
        'restecg': r'Resting ECG\s*(Normal|ST-T Abnormality|Left Ventricular Hypertrophy|\d+)',
        'thalach': r'Max Heart Rate Achieved\s*(\d+\.?\d*)',
        'exang': r'Exercise Induced Angina\s*(Present|Absent|\d+)',
        'oldpeak': r'ST Depression\s*\(Oldpeak\)\s*(\d+\.?\d*)',
        'slope': r'Slope of ST Segment\s*(Upward|Flat|Downward|\d+)',
        'ca': r'Major Vessels\s*\(ca\)\s*(\d+)',
        'thal': r'Thalassemia\s*\(thal\)\s*(Normal|Fixed Defect|Reversible Defect|\d+)',
    }
    
    for field, pattern in patterns.items():
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            value = match.group(1).strip()
            print(f"[DEBUG] Found {field}: {value}")
            
            # Convert text values to numeric codes
            if field == 'fbs':
                if value.lower() == 'normal':
                    setattr(report, field, 0)
                elif value.lower() == 'elevated':
                    setattr(report, field, 1)
                else:
                    try:
                        setattr(report, field, int(value))
                    except ValueError:
                        pass
            elif field == 'restecg':
                if value.lower() == 'normal':
                    setattr(report, field, 0)
                elif 'st-t' in value.lower():
                    setattr(report, field, 1)
                elif 'hypertrophy' in value.lower():
                    setattr(report, field, 2)
                else:
                    try:
                        setattr(report, field, int(value))
                    except ValueError:
                        pass
            elif field == 'exang':
                if value.lower() == 'absent':
                    setattr(report, field, 0)
                elif value.lower() == 'present':
                    setattr(report, field, 1)
                else:
                    try:
                        setattr(report, field, int(value))
                    except ValueError:
                        pass
            elif field == 'slope':
                if value.lower() == 'upward':
                    setattr(report, field, 0)
                elif value.lower() == 'flat':
                    setattr(report, field, 1)
                elif value.lower() == 'downward':
                    setattr(report, field, 2)
                else:
                    try:
                        setattr(report, field, int(value))
                    except ValueError:
                        pass
            elif field == 'thal':
                if value.lower() == 'normal':
                    setattr(report, field, 1)
                elif 'fixed' in value.lower():
                    setattr(report, field, 2)
                elif 'reversible' in value.lower():
                    setattr(report, field, 3)
                else:
                    try:
                        setattr(report, field, int(value))
                    except ValueError:
                        pass
            elif field in ['age', 'cp', 'ca']:
                try:
                    setattr(report, field, int(value))
                except ValueError:
                    pass
            elif field in ['trestbps', 'chol', 'thalach', 'oldpeak']:
                try:
                    setattr(report, field, float(value))
                except ValueError:
                    pass
            else:  # sex field
                setattr(report, field, value)
    
    return report

@app.post("/ocr/upload")
async def upload_report(file: UploadFile = File(...)):
    """Upload and parse blood report (PDF or text file)"""
    print(f"\n[DEBUG] ========== NEW REQUEST ==========")
    print(f"[DEBUG] Received file: {file.filename}")
    print(f"[DEBUG] Content type: {file.content_type}")
    
    try:
        # Validate file
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        # Read file content
        content = await file.read()
        print(f"[DEBUG] File size: {len(content)} bytes")
        
        if not content:
            raise HTTPException(status_code=400, detail="Empty file")
        
        # Extract text based on file type
        if file.filename and file.filename.lower().endswith('.pdf'):
            print("[DEBUG] Processing as PDF")
            text = extract_text_from_pdf(content)
        else:
            print("[DEBUG] Processing as text file")
            try:
                text = content.decode('utf-8')
            except UnicodeDecodeError:
                raise HTTPException(
                    status_code=400, 
                    detail="Unable to decode file. Please upload a valid text or PDF file"
                )
        
        print(f"[DEBUG] Extracted text preview: {text[:200]}...")
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="No text extracted from file")
        
        # Parse the report
        report = parse_blood_report(text)
        report_dict = report.dict()
        print(f"[DEBUG] Parsed report: {report_dict}")
        
        # Save to JSON file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"blood_report_{timestamp}.json"
        
        # Check current directory
        current_dir = os.getcwd()
        print(f"[DEBUG] Current directory: {current_dir}")
        print(f"[DEBUG] Directory writable: {os.access(current_dir, os.W_OK)}")
        
        filepath = os.path.join(current_dir, filename)
        print(f"[DEBUG] Attempting to write to: {filepath}")
        
        try:
            with open(filepath, 'w') as f:
                json.dump(report_dict, f, indent=2)
            print(f"[DEBUG] File written successfully")
            print(f"[DEBUG] File exists: {os.path.exists(filepath)}")
            print(f"[DEBUG] File size: {os.path.getsize(filepath)} bytes")
        except Exception as e:
            print(f"[ERROR] Could not save to file: {e}")
            print(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Could not save JSON file: {str(e)}")
        
        return {
            "message": "Report processed successfully",
            "filename": filename,
            "filepath": filepath,
            "extracted_text_length": len(text),
            "extracted_text_preview": text[:500],
            "data": report_dict
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.get("/")
async def root():
    return {
        "message": "Blood Report Parser API", 
        "endpoints": {
            "upload": "/ocr/upload",
            "parse_text": "/parse-text/"
        },
        "current_directory": os.getcwd(),
        "directory_writable": os.access(os.getcwd(), os.W_OK)
    }

@app.get("/debug")
async def debug_info():
    """Get debug information"""
    try:
        import PyPDF2
        pypdf2_installed = True
        pypdf2_version = PyPDF2.__version__ if hasattr(PyPDF2, '__version__') else "unknown"
    except ImportError:
        pypdf2_installed = False
        pypdf2_version = None
    
    return {
        "current_directory": os.getcwd(),
        "directory_writable": os.access(os.getcwd(), os.W_OK),
        "pypdf2_installed": pypdf2_installed,
        "pypdf2_version": pypdf2_version,
        "files_in_directory": os.listdir(os.getcwd())
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)