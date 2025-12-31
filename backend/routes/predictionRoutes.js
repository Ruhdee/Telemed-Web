import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
    predictHeartDisease,
    predictDiabetes,
    predictLiver,
    predictCKD,
    predictPneumonia,
    predictTB,
    predictBrainTumor,
    predictRetinopathy,
    predictSkinDisease
} from "../predictionController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Uploads temporarily go to backend/uploads, cleaned up later or overwritten
        // Ensure this directory exists or is created on startup
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        // Unique filename to prevent collisions
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Tabular Data Routes
router.post("/heart", predictHeartDisease);
router.post("/diabetes", predictDiabetes);
router.post("/liver", predictLiver);
router.post("/ckd", predictCKD);

// Image Data Routes
router.post("/pneumonia", upload.single("image"), predictPneumonia);
router.post("/tb", upload.single("image"), predictTB);
router.post("/brain-tumor", upload.single("image"), predictBrainTumor);
router.post("/retinopathy", upload.single("image"), predictRetinopathy);
router.post("/skin", upload.single("image"), predictSkinDisease);

export default router;
