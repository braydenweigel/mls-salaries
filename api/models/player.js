const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')

const Player = sequelize.define('player', {
    fname: {type: DataTypes.STRING, allowNull: false},
    lname: {type: DataTypes.STRING, allowNull: false},
    club: {type: DataTypes.STRING, allowNull: false},
    position: {type: DataTypes.STRING, allowNull: false},
    baseSalary: {type: DataTypes.FLOAT, allowNull: false},
    guaranteedComp: {type: DataTypes.FLOAT, allowNull: false}
})

module.exports = Player