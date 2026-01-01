const Sequelize = require('sequelize');

// const config = require('../config/database');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
db.Patient = require('./Patient')(sequelize, Sequelize);
db.Doctor = require('./Doctor')(sequelize, Sequelize);
db.Nurse = require('./Nurse')(sequelize, Sequelize); // New
db.Inventory = require('./Inventory')(sequelize, Sequelize);
db.Order = require('./Order')(sequelize, Sequelize);
db.Appointment = require('./Appointment')(sequelize, Sequelize);
db.OfflineConsultation = require('./OfflineConsultation')(sequelize, Sequelize);

// Associations

// 1. Appointments (Patient <-> Doctor)
db.Patient.hasMany(db.Appointment, { foreignKey: 'patientId', as: 'appointments' });
db.Appointment.belongsTo(db.Patient, { foreignKey: 'patientId', as: 'patient' });

db.Doctor.hasMany(db.Appointment, { foreignKey: 'doctorId', as: 'appointments' });
db.Appointment.belongsTo(db.Doctor, { foreignKey: 'doctorId', as: 'doctor' });

// 2. Orders (Patient <-> Inventory)
db.Patient.hasMany(db.Order, { foreignKey: 'patientId', as: 'orders' });
db.Order.belongsTo(db.Patient, { foreignKey: 'patientId', as: 'patient' });

db.Inventory.hasMany(db.Order, { foreignKey: 'medicineId' });
db.Order.belongsTo(db.Inventory, { foreignKey: 'medicineId', as: 'medicine' });

// 3. Offline Consultations (Patient)
db.Patient.hasMany(db.OfflineConsultation, { foreignKey: 'patientId', as: 'offlineConsultations' });
db.OfflineConsultation.belongsTo(db.Patient, { foreignKey: 'patientId', as: 'patient' });

db.Patient.hasMany(db.OfflineConsultation, { foreignKey: 'reviewedBy', as: 'reviewedConsultations' });
db.OfflineConsultation.belongsTo(db.Patient, { foreignKey: 'reviewedBy', as: 'reviewer' });

module.exports = db;
