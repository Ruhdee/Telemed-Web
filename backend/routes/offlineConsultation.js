const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { verifyToken } = require("../middleware/authMiddleware");
const offlineConsultationController = require("../controllers/offlineConsultationController");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads/consultations");
const videosDir = path.join(uploadsDir, "videos");
const photosDir = path.join(uploadsDir, "photos");

[uploadsDir, videosDir, photosDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'video') {
            cb(null, videosDir);
        } else if (file.fieldname === 'photo') {
            cb(null, photosDir);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'video') {
        const allowedVideoTypes = /mp4|webm|avi|mov|mkv/;
        const extname = allowedVideoTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedVideoTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only video files (mp4, webm, avi, mov, mkv) are allowed'));
        }
    } else if (file.fieldname === 'photo') {
        const allowedImageTypes = /jpeg|jpg|png|gif/;
        const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedImageTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed'));
        }
    } else {
        cb(new Error('Unexpected field'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: fileFilter
});

// Routes
router.post(
    "/submit",
    verifyToken,
    upload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'photo', maxCount: 1 }
    ]),
    offlineConsultationController.submitConsultation
);

router.get(
    "/patient",
    verifyToken,
    offlineConsultationController.getPatientConsultations
);

router.get(
    "/pending",
    verifyToken,
    offlineConsultationController.getDoctorReviewQueue
);

router.get(
    "/:id",
    verifyToken,
    offlineConsultationController.getConsultationById
);

router.patch(
    "/:id/status",
    verifyToken,
    offlineConsultationController.updateConsultationStatus
);

router.delete(
    "/:id",
    verifyToken,
    offlineConsultationController.deleteConsultation
);

module.exports = router;
