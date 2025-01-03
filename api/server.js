const express = require("express")
const morgan = require('morgan')

const api = require('./routes')
const sequelize = require("./lib/sequelize")

const app = express()
const port = 8000

app.use(morgan('dev'))
app.use(express.json())
app.use('/', api)

app.use('*', function (req, res, next) {
    res.status(404).send({
        error: "Requested resource " + req.originalUrl + " does not exist"
    })
})

app.use('*', function (err, req, res, next) {
    console.error("== Error:", err)
    res.status(500).send({
        error: "Server error.  Please try again later."
    })
})

sequelize.sync().then(function () {
    app.listen(port, function () {
        console.log("== Server is running on port ", port)
    })
})