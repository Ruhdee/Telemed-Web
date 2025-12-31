const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Patient, Doctor, Nurse } = require('../models');

// Register User (Generic for all roles)
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, specialization, experience, phone, shift } = req.body;
        const targetRole = role || 'patient';
        const emailLower = email.toLowerCase();
        let Model;

        // Determine which model to use
        if (targetRole === 'doctor') Model = Doctor;
        else if (targetRole === 'nurse') Model = Nurse;
        else Model = Patient;

        // Check if user exists in that table
        // Note: Ideally check across all tables to avoid email reuse, but per request keeping it simple
        const oldUser = await Model.findOne({ where: { email: emailLower } });
        if (oldUser) {
            return res.status(409).send("User Already Exists. Please Login");
        }

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user
        // Create user
        let userData = {
            name,
            email: emailLower,
            password: encryptedPassword,
            phone: phone || null
        };

        if (targetRole === 'doctor') {
            userData.specialization = specialization || 'General';
            userData.experience = experience || 0;
            userData.isOnline = true;
        } else if (targetRole === 'nurse') {
            userData.shift = shift || 'Morning';
        }

        const user = await Model.create(userData);

        // Create token
        const token = jwt.sign(
            { user_id: user.id, email, role: targetRole },
            process.env.JWT_SECRET || 'supersecretkey123',
            { expiresIn: "2h" }
        );

        res.status(201).json({ ...user.toJSON(), role: targetRole, token });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error registering user");
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const emailLower = email.toLowerCase();
        const targetRole = role || 'patient'; // Default to patient if not specified

        let Model;
        if (targetRole === 'doctor') Model = Doctor;
        else if (targetRole === 'nurse') Model = Nurse;
        else Model = Patient;

        // Validate if user exist
        const user = await Model.findOne({ where: { email: emailLower } });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user.id, email, role: targetRole }, // Added role to token
                process.env.JWT_SECRET || 'supersecretkey123',
                { expiresIn: "2h" }
            );

            // user
            return res.status(200).json({ ...user.toJSON(), role: targetRole, token });
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error logging in");
    }
};
