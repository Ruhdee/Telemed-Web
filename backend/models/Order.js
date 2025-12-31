const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
        },
        deliveryDate: {
            type: DataTypes.DATE,
            allowNull: true // Changed to allow null initially if needed, but controller enforces it
        }
    });

    return Order;
};
