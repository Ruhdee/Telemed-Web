const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 3001;

// Initialize Gemini AI with multiple model options
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE');

// Model configurations with fallback options
const MODELS = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
];

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Create data directories if they don't exist
const PRESCRIPTION_DIR = path.join(__dirname, 'prescription-data');
const REPORT_DIR = path.join(__dirname, 'report-data');

[PRESCRIPTION_DIR, REPORT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Helper function to convert buffer to base64
function bufferToBase64(buffer) {
    return buffer.toString('base64');
}

// Helper function to try models in sequence
async function tryModels(imageBuffer, mimeType, prompt) {
    let lastError = null;
    
    for (const modelName of MODELS) {
        try {
            console.log(`Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            
            const imagePart = {
                inlineData: {
                    data: bufferToBase64(imageBuffer),
                    mimeType: mimeType
                }
            };
            
            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();
            
            console.log(`Success with model: ${modelName}`);
            return { text, modelUsed: modelName };
        } catch (error) {
            console.error(`Model ${modelName} failed:`, error.message);
            lastError = error;
            continue;
        }
    }
    
    throw lastError || new Error('All models failed');
}

// Helper function to save data to JSON file
function saveToJson(directory, data) {
    const timestamp = Date.now();
    const filename = `scan_${timestamp}.json`;
    const filepath = path.join(directory, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    return filename;
}

// Helper function to parse JSON from response (handles markdown code blocks)
function parseJsonResponse(text) {
    // Remove markdown code blocks if present
    let cleanText = text.trim();
    
    // Remove ```json and ``` markers
    cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    try {
        return JSON.parse(cleanText);
    } catch (error) {
        // Try to extract JSON from the text
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('Could not parse JSON response');
    }
}

// POST /api/scan-prescription
app.post('/api/scan-prescription', upload.single('prescription'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const prompt = `Analyze this prescription image and extract the following information in JSON format:

{
  "patient_name": "string (patient's full name)",
  "medications": [
    {
      "name": "string (medicine name)",
      "dosage": "string (e.g., '500mg', '10ml')",
      "frequency": "string (e.g., '2x daily', 'once daily', 'every 8 hours')",
      "duration": "string (e.g., '5 days', '2 weeks', '1 month')",
      "instructions": "string (optional special instructions like 'take after food', 'take before sleep')"
    }
  ]
}

Rules:
- Extract ALL medications visible in the prescription
- If patient name is not visible, use null
- Be precise with dosages and frequencies
- If duration is not specified, use null
- Return ONLY valid JSON, no additional text
- If you cannot read certain information, use null for that field`;

        const { text, modelUsed } = await tryModels(
            req.file.buffer,
            req.file.mimetype,
            prompt
        );

        const extractedData = parseJsonResponse(text);

        // Prepare response data
        const responseData = {
            data: extractedData,
            timestamp: Date.now(),
            modelUsed: modelUsed
        };

        // Save to JSON file
        const filename = saveToJson(PRESCRIPTION_DIR, responseData);
        console.log(`Prescription data saved to: ${filename}`);

        res.json(responseData);

    } catch (error) {
        console.error('Error processing prescription:', error);
        res.status(500).json({
            error: 'Failed to process prescription image',
            details: error.message
        });
    }
});

// POST /api/scan-blood-report
app.post('/api/scan-blood-report', upload.single('report'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const prompt = `Analyze this blood test report image and extract the following information in JSON format:

{
  "patient_name": "string (patient's full name)",
  "tests": [
    {
      "name": "string (test name, e.g., 'Hemoglobin', 'Blood Sugar', 'Cholesterol')",
      "value": "string (test value)",
      "unit": "string (unit of measurement, e.g., 'g/dL', 'mg/dL', '%')",
      "reference_range": "string (normal reference range, e.g., '12-16 g/dL', '70-100 mg/dL')",
      "status": "string (optional: 'Normal', 'High', 'Low' based on reference range)"
    }
  ]
}

Rules:
- Extract ALL test results visible in the report
- If patient name is not visible, use null
- Be precise with values and units
- Include reference ranges if shown
- Determine status by comparing value to reference range if possible
- Return ONLY valid JSON, no additional text
- If you cannot read certain information, use null for that field`;

        const { text, modelUsed } = await tryModels(
            req.file.buffer,
            req.file.mimetype,
            prompt
        );

        const extractedData = parseJsonResponse(text);

        // Prepare response data
        const responseData = {
            data: extractedData,
            timestamp: Date.now(),
            modelUsed: modelUsed
        };

        // Save to JSON file
        const filename = saveToJson(REPORT_DIR, responseData);
        console.log(`Blood report data saved to: ${filename}`);

        res.json(responseData);

    } catch (error) {
        console.error('Error processing blood report:', error);
        res.status(500).json({
            error: 'Failed to process blood report image',
            details: error.message
        });
    }
});

// GET /api/prescriptions - Get all saved prescriptions
app.get('/api/prescriptions', (req, res) => {
    try {
        const files = fs.readdirSync(PRESCRIPTION_DIR)
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filepath = path.join(PRESCRIPTION_DIR, file);
                const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
                return { ...data, filename: file };
            })
            .sort((a, b) => b.timestamp - a.timestamp);
        
        res.json(files);
    } catch (error) {
        console.error('Error reading prescriptions:', error);
        res.status(500).json({ error: 'Failed to read prescriptions' });
    }
});

// GET /api/reports - Get all saved blood reports
app.get('/api/reports', (req, res) => {
    try {
        const files = fs.readdirSync(REPORT_DIR)
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filepath = path.join(REPORT_DIR, file);
                const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
                return { ...data, filename: file };
            })
            .sort((a, b) => b.timestamp - a.timestamp);
        
        res.json(files);
    } catch (error) {
        console.error('Error reading reports:', error);
        res.status(500).json({ error: 'Failed to read reports' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', models: MODELS });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        details: error.message
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Available models: ${MODELS.join(', ')}`);
    console.log(`Prescription data directory: ${PRESCRIPTION_DIR}`);
    console.log(`Report data directory: ${REPORT_DIR}`);
});