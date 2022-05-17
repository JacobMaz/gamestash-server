const User = require('./user');
const Game = require('./game');
const Category = require('./category');

Game.belongsTo(User);
Category.belongsTo(User);
Game.belongsToMany(Category, {through: 'gamesincategory'})
Category.belongsToMany(Game, {through: 'gamesincategory'})
User.hasMany(Game);
User.hasMany(Category);

module.exports = {User, Game, Category};