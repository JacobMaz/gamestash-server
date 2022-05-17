const express = require('express');
const router = express.Router();
const {Category, Game} = require('../models');
const validateSession = require('../middleware/validateSession');

router.get('/test', (req,res)=>res.send('Category: The Category Is...'));

router.post('/createcategory', validateSession, async (req, res)=>{
    try {
        const {name}=req.body;
        let newCategory = await Category.create({name, userId: req.user.id});
        res.status(200).json({
            status: 'SUCCESS',
            category: newCategory,
            message: 'Category Created'
        })
    } catch (error) {
        res.status(500).json({
            message: 'Category Not Created'
        })
    }
})

router.put('/:id', validateSession, async (req,res)=>{
    try {
        let category = await Category.findOne({where: {id: req.params.id}});
        if(category.userId===req.user.id){
            let query = req.params.id;
            await Category.update(req.body, {where: {id: query}}).then(
                targetedCategory=>{
                    Category.findOne({where: {id:query}}).then(
                        updatedCategory=>{
                            res.status(200).json({
                                status: 'SUCCESS',
                                updatedCategory: updatedCategory,
                                targetedCategory: targetedCategory
                            })
                        }
                    )
                }
            )
        } else {
            res.status(500).json({
                error: 'You Do Not Have Permission!'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Update Did Not Work!'
        });
    }
})

router.get('/usercategories', validateSession, async (req,res)=>{
    try {
        let userCategories = await Category.findAll({
            where: {userId: req.user.id},
            include: ['games']
        });
        res.status(200).json({
            status: 'SUCCESS',
            userCategories: userCategories
        })
    } catch (error) {
        res.status(500).json({error: error})
    }
})

router.post('/addgametocategory', validateSession, async (req,res)=>{
    try {
        const category = await Category.findOne({where: {id: req.body.categoryId}});
        const gameToAdd = await Game.findOne({where: {id: req.body.gameId}});
        category.addGames(gameToAdd);
        res.status(200).json({
            status: 'SUCCESS',
            category: category,
            gameToAdd: gameToAdd
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
})

router.delete('/:id', validateSession, async (req,res)=>{
    try {
        let category = await Category.findOne({where: {id:req.params.id}});
        if(category.userId===req.user.id){
            await Category.destroy({
                where: {id:req.params.id}
            });
            res.status(200).json({
                status: 'SUCCESS'
            })
        } else {
            console.log('You Do Not Have Permission');
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/removegamefromcategory', validateSession, async (req,res)=>{
    try {

        const category = await Category.findOne({where: {id: req.body.categoryId}});
        const gameToRemove = await Game.findOne({where: {id: req.body.gameId}});
        category.removeGames(gameToRemove);
        res.status(200).json({
            status: 'SUCCESS',
            category: category,
            gameToRemove: gameToRemove
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
})

module.exports = router;