const {DataTypes} = require('sequelize');
const db = require('../db');

const User = db.define('user',{
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('guest', 'user', 'admin'),
        defaultValue: 'user'
    },
    memberType: {
        type: DataTypes.ENUM('guest', 'month', 'year'),
        defaultValue: 'guest'
    },
    memeberActiveDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    memeberExpireDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expireToken: {
        type: DataTypes.DATE,
        allowNull: true
    },
})

module.exports = User;