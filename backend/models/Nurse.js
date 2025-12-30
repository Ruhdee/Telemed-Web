const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Nurse = sequelize.define('Nurse', {
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
        shift: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });

    return Nurse;
};
