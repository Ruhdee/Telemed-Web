const { Appointment, Doctor, User } = require('../models');

// Get Doctor Appointments (Doctor view)
exports.getDoctorAppointments = async (req, res) => {
    try {
        // Assuming the user is a doctor, we need to find their Doctor Profile ID first
        // Or if logged in as user, find associated doctor profile
        const doctorProfile = await Doctor.findOne({ where: { userId: req.user.user_id } });

        if (!doctorProfile) return res.status(404).json({ message: "Doctor profile not found" });

        const appointments = await Appointment.findAll({
            where: { doctorId: doctorProfile.id },
            include: [{ model: User, as: 'patient', attributes: ['name', 'email'] }]
        });

        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).send("Error fetching appointments");
    }
};

// Book Appointment (Patient view)
exports.bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, symptoms, type } = req.body;

        // AI Score Mock logic (In real app, call python service or logic here)
        const riskScores = ['Low', 'Medium', 'High'];
        const aiRiskScore = riskScores[Math.floor(Math.random() * riskScores.length)];
        const priorityFlag = aiRiskScore === 'High';

        const appointment = await Appointment.create({
            patientId: req.user.user_id,
            doctorId,
            date,
            symptoms,
            type: type || 'Video Consult',
            aiRiskScore,
            priorityFlag,
            status: 'Pending',
            summary: 'Automated AI Check: ' + aiRiskScore + ' Risk detected based on symptoms.'
        });

        res.status(201).json(appointment);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error booking appointment");
    }
};

// Update Status (Doctor)
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await Appointment.update({ status }, { where: { id } });
        res.status(200).json({ message: "Updated successfully" });
    } catch (err) {
        res.status(500).send("Error updating appointment");
    }
}
