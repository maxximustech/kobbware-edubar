const { Sequelize, DataTypes } = require('sequelize');
const db = require('../utils/db');

const User = db.define('User',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pass: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUrl: DataTypes.TEXT,
    user_role: DataTypes.STRING
});

module.exports = User;