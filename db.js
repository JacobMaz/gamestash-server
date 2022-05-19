const {Sequelize} = require("sequelize");

const db = new Sequelize('postgres://qigqoeiueiexgf:b492fa8ad8f82d4da5b3a44b6a32a26033f71cfef178e92e7be083d318833838@ec2-54-210-128-153.compute-1.amazonaws.com:5432/d1op435139ll2p', {
    dialect: 'postgres'
});

module.exports = db;