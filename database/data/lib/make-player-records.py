import csv

records = []

def parseCSV(filepath):
    with open(filepath, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            records.append(row)

parseCSV("../playerData/compiledReports/with-ids.csv")

with open("../playerData/databaseFiles/player-records.csv", "w", encoding="utf-8")as newfile:
    newfile.write("recordid,playerid,firstname,lastname,club,position,basesalary,guaranteedcomp,recordyear,recordseason\n")

    for row in records:
        recordYear = ""
        if (row["Year"] == "2025 Sp"):
            recordYear = "2025,Spring"
        else:
            recordYear = row["Year"] + ",Fall"

        newfile.write(row['Duplicate'] + "," + row['PlayerID'] + "," + row['FirstName'] + "," + row['LastName'] + "," + row['Club'] + "," + row['Position'] + ',"' + row['BaseSalary'] + '","' + row['GuaranteedComp'] + '",' + recordYear + "\n")
