import csv

records = []

def parseCSV(filepath):
    with open(filepath, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            records.append(row)

parseCSV("../playerData/compiledReports/with-ids.csv")

with open("../playerData/databaseFiles/records.csv", "w", encoding="utf-8")as newfile:
    newfile.write("RecordID,PlayerID,Club,Position,BaseSalary,GuaranteedComp,Year\n")

    for row in records:
        newfile.write(row['Duplicate'] + "," + row['PlayerID'] + "," + row['Club'] + "," + row['Position'] + ',"' + row['BaseSalary'] + '","' + row['GuaranteedComp'] + '",' + row['Year'] + "\n")