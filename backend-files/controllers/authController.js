const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Doctor } = require('../models');

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, specialisation } = req.body;

        // Check if user exists
        const oldUser = await User.findOne({ where: { email } });
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: encryptedPassword,
            role: role || 'patient'
        });

        // If doctor, create profile
        if (role === 'doctor') {
            await Doctor.create({
                userId: user.id,
                name: name,
                email: email.toLowerCase(),
                phone: req.body.phone || null,
                specialization: specialisation || 'General',
                availability: []
            });
        }

        // Create token
        const token = jwt.sign(
            { user_id: user.id, email, role: user.role },
            process.env.JWT_SECRET || 'supersecretkey123',
            {
                expiresIn: "2h",
            }
        );

        // return new user
        res.status(201).json({ ...user.toJSON(), token });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error registering user");
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const emailLower = email.toLowerCase();

        // Validate if user exist
        const user = await User.findOne({ where: { email: emailLower } });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user.id, email, role: user.role },
                process.env.JWT_SECRET || 'supersecretkey123',
                {
                    expiresIn: "2h",
                }
            );

            // user
            return res.status(200).json({ ...user.toJSON(), token });
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error logging in");
    }
};
