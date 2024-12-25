const { ValidationError } = require("sequelize")
const fs = require('fs');
const { parse } = require("csv-parse")
const sequelize = require('../lib/sequelize')

const Player = require('../models/player')
const Club = require('../models/club')

//load player data from csv
async function loadPlayerData(){
    sequelize.sync().then(async function () {
        fs.createReadStream("../data/mls-salaries-2024.csv")
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", async function (row) {
                    let s = row[4].replace("$", "")
                    s = s.replaceAll(",", "")
                    const salary = parseFloat(s)
    
                    s = row[5].replace("$", "")
                    s = s.replaceAll(",", "")
                    const comp = parseFloat(s)
    
                    row[4] = salary
                    row[5] = comp
    
                    const player = await Player.create({
                        fname: row[0],
                        lname: row[1],
                        club: row[2],
                        position: row[3], 
                        baseSalary: row[4],
                        guaranteedComp: row[5]
                    })
                    console.log("Created Player: ", player.fname, " ", player.lname, " with id: ", player.id)
                })
    })
}



//load club data from csv
async function loadClubData(){

}

loadPlayerData()