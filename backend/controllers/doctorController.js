const { Doctor } = require('../models');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.findAll({
            attributes: ['id', 'name', 'email', 'specialization', 'availability', 'isOnline']
        });
        res.status(200).json(doctors);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching doctors");
    }
};
