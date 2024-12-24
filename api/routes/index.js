const { Router } = require('express')

const playersRouter = require('./players')
const clubsRouter = require('./clubs')

const apiRouter = Router()

apiRouter.use('/players', playersRouter)
apiRouter.use('/clubs', clubsRouter)

module.exports = apiRouter