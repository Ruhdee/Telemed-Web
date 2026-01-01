const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const pharmaController = require('../controllers/pharmaController');
const appointmentController = require('../controllers/appointmentController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Pharma Routes
router.get('/pharma/inventory', verifyToken, pharmaController.getInventory);
router.post('/pharma/inventory', verifyToken, verifyRole(['pharmacist', 'admin']), pharmaController.addMedicine);
router.post('/pharma/orders', verifyToken, pharmaController.createOrder);

// Appointment Routes
// Get appointments for the logged-in doctor
router.get('/appointments/doctor', verifyToken, verifyRole(['doctor']), appointmentController.getDoctorAppointments);
// Book appointment (Patient)
router.post('/appointments', verifyToken, appointmentController.bookAppointment);
// Update status (Doctor)
router.put('/appointments/:id/status', verifyToken, verifyRole(['doctor']), appointmentController.updateStatus);

module.exports = router;
