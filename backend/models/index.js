const sequelize = require('../config/database');
const User = require('./User');
const Doctor = require('./Doctor');
const Appointment = require('./Appointment');
const Inventory = require('./Inventory');
const Order = require('./Order');

// Associations

// User has a Doctor profile (if role is doctor)
User.hasOne(Doctor, { foreignKey: 'userId', onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

// Appointments
Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

User.hasMany(Appointment, { foreignKey: 'patientId', as: 'patientAppointments' });
Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

// Pharma / Orders
User.hasMany(Order, { foreignKey: 'patientId' });
Order.belongsTo(User, { foreignKey: 'patientId' });

Inventory.hasMany(Order, { foreignKey: 'medicineId' });
Order.belongsTo(Inventory, { foreignKey: 'medicineId', as: 'medicine' });

module.exports = {
    sequelize,
    User,
    Doctor,
    Appointment,
    Inventory,
    Order
};
