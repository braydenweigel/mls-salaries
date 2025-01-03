const { Router } = require('express')
const { ValidationError } = require("sequelize")

const Player = require('../models/player')

const router = Router()

//get list of all players
router.get('/', async function (req, res, next) {
    const result = await Player.findAll({
        where: {club: "Portland Timbers"}
    })

    res.status(200).send({result})
})

//get individual player by id
router.get('/:id', async function (req, res, next) {
    const id = req.params.id
    res.status(200).send({})
})

module.exports = router