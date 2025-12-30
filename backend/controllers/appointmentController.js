const { Appointment, Doctor, Patient } = require('../models');

// Get Doctor Appointments (Doctor view)
exports.getDoctorAppointments = async (req, res) => {
    try {
        // Since the user is logged in as a doctor, req.user.user_id IS the doctor's ID.
        const doctorId = req.user.user_id;

        const appointments = await Appointment.findAll({
            where: { doctorId: doctorId },
            include: [{ model: Patient, as: 'patient', attributes: ['name', 'email'] }]
        });

        res.status(200).json(appointments);
    } catch (err) {
        console.error(err);
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
