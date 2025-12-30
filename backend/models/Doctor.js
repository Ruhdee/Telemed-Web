const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    experience: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    availability: {
        type: DataTypes.JSON, // Stores available slots e.g., ["10:00 AM", "11:00 AM"]
        defaultValue: []
    },
    isOnline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Doctor;
