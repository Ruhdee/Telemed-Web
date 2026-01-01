const { Inventory, Order, User } = require('../models');

// Get all inventory (Patients/Doctors view)
exports.getInventory = async (req, res) => {
    try {
        const medicines = await Inventory.findAll();
        res.status(200).json(medicines);
    } catch (err) {
        res.status(500).send("Error fetching inventory");
    }
};

// Add medicine (Pharmacist/Admin only)
exports.addMedicine = async (req, res) => {
    try {
        const { name, description, stock, price, requiresPrescription } = req.body;
        const medicine = await Inventory.create({
            name, description, stock, price, requiresPrescription
        });
        res.status(201).json(medicine);
    } catch (err) {
        res.status(500).send("Error adding medicine");
    }
};

// Create Order (Patient)
exports.createOrder = async (req, res) => {
    try {
        const { medicineId, quantity } = req.body;
        const userId = req.user.user_id;

        const medicine = await Inventory.findByPk(medicineId);
        if (!medicine) return res.status(404).send("Medicine not found");
        if (medicine.stock < quantity) return res.status(400).send("Insufficient stock");

        const totalPrice = medicine.price * quantity;

        const order = await Order.create({
            patientId: userId,
            medicineId,
            quantity,
            totalPrice,
            status: 'Pending'
        });

        // Deduct stock
        medicine.stock -= quantity;
        await medicine.save();

        res.status(201).json(order);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating order");
    }
};
