
const {DataTypes} = require('sequelize');
const db = require('../db');

const Category = db.define('category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    }
})

module.exports = Category;