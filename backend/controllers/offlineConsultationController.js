const db = require("../models");
const OfflineConsultation = db.OfflineConsultation;
const Patient = db.Patient;
const path = require("path");
const fs = require("fs");

// Submit a new offline consultation
exports.submitConsultation = async (req, res) => {
    try {
        const { chiefComplaint, symptomsDescription } = req.body;

        // Debug: Log what req.user contains
        console.log('🔍 req.user:', req.user);

        const patientId = req.user.user_id || req.user.id; // From auth middleware (user_id in JWT)

        // Validate required fields
        if (!chiefComplaint || !symptomsDescription) {
            return res.status(400).json({
                success: false,
                message: "Chief complaint and symptoms description are required"
            });
        }

        // Check if at least one media file is uploaded
        if (!req.files || (!req.files.video && !req.files.photo)) {
            return res.status(400).json({
                success: false,
                message: "Please upload either a video or photo"
            });
        }

        const videoPath = req.files.video ? req.files.video[0].path : null;
        const photoPath = req.files.photo ? req.files.photo[0].path : null;

        // Create consultation record
        const consultation = await OfflineConsultation.create({
            patientId,
            chiefComplaint,
            symptomsDescription,
            videoPath,
            photoPath,
            submittedAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Consultation submitted successfully",
            data: consultation
        });
    } catch (error) {
        console.error("Error submitting consultation:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit consultation",
            error: error.message
        });
    }
};

// Get all consultations for a patient
exports.getPatientConsultations = async (req, res) => {
    try {
        const patientId = req.user.id;

        const consultations = await OfflineConsultation.findAll({
            where: { patientId },
            include: [
                {
                    model: Patient,
                    as: 'reviewer',
                    attributes: ['id', 'name', 'email']
                }
            ],
            order: [['submittedAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: consultations
        });
    } catch (error) {
        console.error("Error fetching patient consultations:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch consultations",
            error: error.message
        });
    }
};

// Get pending consultations for doctor review
exports.getDoctorReviewQueue = async (req, res) => {
    try {
        // Only doctors can access this
        if (req.user.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only doctors can view review queue."
            });
        }

        const consultations = await OfflineConsultation.findAll({
            where: { status: 'pending' },
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ],
            order: [['submittedAt', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: consultations
        });
    } catch (error) {
        console.error("Error fetching review queue:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch review queue",
            error: error.message
        });
    }
};

// Get a single consultation by ID
exports.getConsultationById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const consultation = await OfflineConsultation.findByPk(id, {
            include: [
                {
                    model: Patient,
                    as: 'patient',
                    attributes: ['id', 'name', 'email', 'phone']
                },
                {
                    model: Patient,
                    as: 'reviewer',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message: "Consultation not found"
            });
        }

        // Check authorization: patient can only view their own, doctors can view all
        if (userRole !== 'doctor' && consultation.patientId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        res.status(200).json({
            success: true,
            data: consultation
        });
    } catch (error) {
        console.error("Error fetching consultation:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch consultation",
            error: error.message
        });
    }
};

// Update consultation status
exports.updateConsultationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, prescriptionId } = req.body;
        const doctorId = req.user.id;

        // Only doctors can update status
        if (req.user.role !== 'doctor') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Only doctors can update consultation status."
            });
        }

        const consultation = await OfflineConsultation.findByPk(id);

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message: "Consultation not found"
            });
        }

        // Update fields
        const updateData = {
            status,
            reviewedBy: doctorId,
            reviewedAt: new Date()
        };

        if (prescriptionId) {
            updateData.prescriptionId = prescriptionId;
        }

        await consultation.update(updateData);

        res.status(200).json({
            success: true,
            message: "Consultation status updated successfully",
            data: consultation
        });
    } catch (error) {
        console.error("Error updating consultation status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update consultation status",
            error: error.message
        });
    }
};

// Delete a consultation
exports.deleteConsultation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const consultation = await OfflineConsultation.findByPk(id);

        if (!consultation) {
            return res.status(404).json({
                success: false,
                message: "Consultation not found"
            });
        }

        // Only the patient who created it or a doctor can delete
        if (userRole !== 'doctor' && consultation.patientId !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Delete associated files
        if (consultation.videoPath && fs.existsSync(consultation.videoPath)) {
            fs.unlinkSync(consultation.videoPath);
        }
        if (consultation.photoPath && fs.existsSync(consultation.photoPath)) {
            fs.unlinkSync(consultation.photoPath);
        }

        await consultation.destroy();

        res.status(200).json({
            success: true,
            message: "Consultation deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting consultation:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete consultation",
            error: error.message
        });
    }
};
