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
    isMember: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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