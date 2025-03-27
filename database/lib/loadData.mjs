import * as fs from 'fs';
import { parse } from 'csv-parse'
import { supabase } from './connect.mjs'

//open file and read it
const filename = process.argv[2]
const year = process.argv[3]
console.log("Filename: ", filename)
console.log("Year: ", year)

function loadData(){
    let data = []
    return new Promise((resolve, reject) => {
        fs.createReadStream("../data/playerData/" + filename)
            .on('error', error => {
                reject(error)
            })
            .pipe(parse({ delimiter: ",", from_line: 1}))
            .on("data", function (row) {
                    let s = row[4].replace("$", "")
                    s = s.replaceAll(",", "")
                    const salary = parseFloat(s)
    
                    s = row[5].replace("$", "")
                    s = s.replaceAll(",", "")
                    const comp = parseFloat(s)
    
                    row[4] = salary
                    row[5] = comp
                    row[6] = year

                    const player = {
                        fname: row[0],
                        lname: row[1],
                        club: row[2],
                        position: row[3],
                        basesalary: row[4],
                        guaranteedcomp: row[5] ,
                        salaryyear: row[6]
                    }   
                    
                    data.push(player)
                })
                .on('end', () => {
                    resolve(data);
                });
            
    })
}

async function uploadData(){
    try { 
        const data = await loadData();
        //insert data into supabase
        const { error } = await supabase
            .from('player')
            .insert(data)

            if (error){
                throw error
            }

    } catch (error) {
        console.error("Error: ", error.message);
    }
}

uploadData()
