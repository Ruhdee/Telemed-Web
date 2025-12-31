const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Appointment = sequelize.define('Appointment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: {
            type: DataTypes.DATE, // Includes time
            allowNull: false
        },
        type: {
            type: DataTypes.STRING, // 'Video Consult', 'Offline Review'
            defaultValue: 'Video Consult'
        },
        symptoms: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        aiRiskScore: {
            type: DataTypes.ENUM('Low', 'Medium', 'High'),
            defaultValue: 'Low'
        },
        priorityFlag: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled'),
            defaultValue: 'Pending'
        },
        summary: {
            type: DataTypes.TEXT
        }
    });

    return Appointment;
};
