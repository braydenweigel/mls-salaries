const { DataTypes } = require('sequelize')

const sequelize = require('../lib/sequelize')

const Club = sequelize.define('club', {
    name: {type: DataTypes.STRING, allowNull: false},
    logoUrl: {type: DataTypes.STRING, allowNull: false},
    colorPrimary: {type: DataTypes.STRING, allowNull: false},
    colorSecondary: {type: DataTypes.STRING, allowNull: false},
    colorThird: {type: DataTypes.STRING, allowNull: false}
})

module.exports = Club