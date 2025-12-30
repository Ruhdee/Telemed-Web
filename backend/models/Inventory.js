const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    requiresPrescription: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = Inventory;
