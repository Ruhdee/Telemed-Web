const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Doctor = sequelize.define('Doctor', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: false
        },
        experience: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        availability: {
            type: DataTypes.JSON,
            defaultValue: []
        },
        isOnline: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        role: {
            type: DataTypes.ENUM('patient', 'doctor', 'nurse'),
            defaultValue: 'doctor'
        }
    });

    return Doctor;
};
