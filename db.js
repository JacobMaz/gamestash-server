const {Sequelize} = require("sequelize");

const db = new Sequelize('postgres://ypgnjxfnyrvgqo:372c54040709cbb530878762af2ebd9093b64d778b86b4a2131977b624b23904@ec2-3-228-235-79.compute-1.amazonaws.com:5432/d6m0d9pucr29fc', {
    dialect: 'postgres'
});

module.exports = db;