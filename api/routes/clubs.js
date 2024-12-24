const { Router } = require('express')
const { ValidationError } = require("sequelize")

const Player = require('../models/player')
const Club = require('../models/club')

const router = Router()

//get list of all clubs
router.get('/', async function (req, res, next) {
    res.status(200).send({})
})

//get individual club by id, plus list of all players in the club
router.get('/:id', async function (req, res, next) {
    const id = req.params.id
    res.status(200).send({})
})

module.exports = router