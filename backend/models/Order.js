const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled'),
        defaultValue: 'Pending'
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = Order;
