import csv

players = []

def parseCSV(filepath):
    with open(filepath, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            players.append(row)

parseCSV("../playerData/compiledReports/with-ids.csv")

with open("../playerData/databaseFiles/players.csv", "w", encoding="utf-8")as newfile:
    newfile.write("PlayerID,FirstName,LastName\n")

    prevID = "000000"

    for row in players:
        if (row['PlayerID'] != prevID): #new pleyer to add to file
            newfile.write(row['PlayerID'] + "," + row['LastName'] + "," + row['FirstName'] +  "\n")

        prevID = row['PlayerID'] #set previous ID to the current one