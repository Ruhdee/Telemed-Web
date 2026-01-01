require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

/* Gemini Init */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* SAFE + SUPPORTED MODELS */
const MODELS = [
    "gemini-2.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash"
];

/* Multer Setup */
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype.startsWith("image/") &&
            file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)
        ) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});

/* Data Directories */
const PRESCRIPTION_DIR = path.join(__dirname, "../prescription-data");
const REPORT_DIR = path.join(__dirname, "../report-data");

[PRESCRIPTION_DIR, REPORT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

/* Helpers */
const bufferToBase64 = buffer => buffer.toString("base64");

async function tryModels(imageBuffer, mimeType, prompt) {
    let lastError = null;

    for (const modelName of MODELS) {
        try {
            console.log(`Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: bufferToBase64(imageBuffer),
                        mimeType
                    }
                }
            ]);

            if (!result.response || !result.response.text) {
                throw new Error("Empty response from Gemini");
            }

            return {
                text: result.response.text(),
                modelUsed: modelName
            };
        } catch (err) {
            console.error(`Model ${modelName} failed`);
            lastError = err;
        }
    }

    throw lastError || new Error("All Gemini models failed");
}

function saveToJson(directory, data) {
    const filename = `scan_${Date.now()}.json`;
    fs.writeFileSync(
        path.join(directory, filename),
        JSON.stringify(data, null, 2)
    );
    return filename;
}

function parseJsonResponse(text) {
    let clean = text.trim()
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "");

    try {
        return JSON.parse(clean);
    } catch {
        const match = clean.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("Invalid JSON from Gemini");
        return JSON.parse(match[0]);
    }
}

/* ------------------- ROUTES ------------------- */

/* Scan Prescription */
router.post("/scan-prescription", upload.single("prescription"), async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "OCR service not configured. Please set GEMINI_API_KEY." });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const prompt = `
Extract prescription data in JSON only:

{
  "patient_name": "string or null",
  "medications": [
    {
      "name": "string",
      "dosage": "string or null",
      "frequency": "string or null",
      "duration": "string or null",
      "instructions": "string or null"
    }
  ]
}

Rules:
- Extract ALL medicines
- Use null if unreadable
- Return ONLY valid JSON
`;

        const { text, modelUsed } = await tryModels(
            req.file.buffer,
            req.file.mimetype,
            prompt
        );

        const extractedData = parseJsonResponse(text);

        const responseData = {
            data: extractedData,
            timestamp: Date.now(),
            modelUsed
        };

        saveToJson(PRESCRIPTION_DIR, responseData);
        res.json(responseData);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to process prescription image",
            details: err.message
        });
    }
});

/* Scan Blood Report */
router.post("/scan-blood-report", upload.single("report"), async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "OCR service not configured. Please set GEMINI_API_KEY." });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const prompt = `
Extract blood report data in JSON only:

{
  "patient_name": "string or null",
  "tests": [
    {
      "name": "string",
      "value": "string",
      "unit": "string or null",
      "reference_range": "string or null",
      "status": "Normal | High | Low | null"
    }
  ]
}

Rules:
- Extract ALL tests
- Return ONLY valid JSON
`;

        const { text, modelUsed } = await tryModels(
            req.file.buffer,
            req.file.mimetype,
            prompt
        );

        const extractedData = parseJsonResponse(text);

        const responseData = {
            data: extractedData,
            timestamp: Date.now(),
            modelUsed
        };

        saveToJson(REPORT_DIR, responseData);
        res.json(responseData);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to process blood report image",
            details: err.message
        });
    }
});

/* Fetch Saved Data */
router.get("/prescriptions", (req, res) => {
    const files = fs.readdirSync(PRESCRIPTION_DIR)
        .filter(f => f.endsWith(".json"))
        .map(f => ({
            filename: f,
            ...JSON.parse(fs.readFileSync(path.join(PRESCRIPTION_DIR, f)))
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

    res.json(files);
});

router.get("/reports", (req, res) => {
    const files = fs.readdirSync(REPORT_DIR)
        .filter(f => f.endsWith(".json"))
        .map(f => ({
            filename: f,
            ...JSON.parse(fs.readFileSync(path.join(REPORT_DIR, f)))
        }))
        .sort((a, b) => b.timestamp - a.timestamp);

    res.json(files);
});

/* OCR Health */
router.get("/health", (req, res) => {
    res.json({
        status: "OK",
        models: MODELS,
        directories: {
            prescriptions: PRESCRIPTION_DIR,
            reports: REPORT_DIR
        }
    });
});

module.exports = router;
