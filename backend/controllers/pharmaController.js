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
        const { items, deliveryDate } = req.body; // Expecting items array and deliveryDate
        const userId = req.user.user_id || req.user.id; // Handle different token payloads if any

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).send("No items in order");
        }

        if (!deliveryDate) {
            return res.status(400).json({ error: 'Delivery date is required' });
        }

        const orders = [];
        let grandTotal = 0;

        for (const item of items) {
            const { medicineId, quantity } = item;

            const medicine = await Inventory.findByPk(medicineId);
            if (!medicine) return res.status(404).send(`Medicine with ID ${medicineId} not found`);

            if (medicine.stock < quantity) return res.status(400).send(`Insufficient stock for ${medicine.name}`);

            // Deduct stock
            medicine.stock -= quantity;
            await medicine.save();

            const totalPrice = medicine.price * quantity;
            grandTotal += totalPrice;

            const order = await Order.create({
                patientId: userId,
                medicineId,
                quantity,
                totalPrice,
                status: 'Pending',
                deliveryDate: deliveryDate
            });

            orders.push(order);
        }

        res.status(201).json({ message: 'Order placed successfully', orders, grandTotal });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating order");
    }
};
