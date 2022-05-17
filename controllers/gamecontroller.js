const express = require("express");
const router = express.Router();
const {Game, Category} = require('../models');
const validateSession = require("../middleware/validateSession");

router.get("/test", (req, res) => res.send("Game: Start A New Game"));

router.post('/addgame', validateSession, async (req, res)=>{
    try {
        const {name, platform, coverArt, categories} = req.body;
        let newGame = await Game.create({name, platform, coverArt, userId: req.user.id});
        res.status(200).json({
            status: 'SUCCESS',
            game: newGame,
            message: 'Game Added'
        });
        const mygamescategory = await Category.findOne({where: {name: 'My Games', userId: req.user.id}});
        const gameToAdd = await Game.findOne({where: {id: newGame.id}});
        mygamescategory.addGames(gameToAdd);

        categories.forEach(async category=>{
            const currentCategory = await Category.findOne({where: {id: category}});
            currentCategory.addGames(gameToAdd)
        })

    } catch (error) {
        res.status(500).json({
            message: 'Game Crashed!!!'
        })
    }
})

router.get('/usergames', validateSession, async (req, res)=>{
    try {
        let userGames = await Game.findAll({
            where: {userId: req.user.id}
        });
        res.status(200).json({
            userGames: userGames,
            message: `${req.user.username}'s Games: Downloaded and Ready To Play`
        });
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.delete('/:id', validateSession, async (req, res)=>{
    let current_game = await Game.findOne({where: {id: req.params.id}});
    if (current_game.userId === req.user.id){
        try {
            await Game.destroy({
                where: {id: req.params.id}
            });
            res.status(200).json({
                status: 'SUCCESS',
                message: 'Game Deleted'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                error: 'something went wrong'
            });
        }
    } else {
        res.status(500).json({
            status: 'error',
            error: 'You Do Not Have Permission'
        })
    }
})

module.exports = router;