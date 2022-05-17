const {DataTypes} = require('sequelize');
const db = require('../db');

const Game = db.define('game',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
    },
    platform: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        unique: false
    },
    coverArt: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: false
    }
}) 

module.exports = Game;