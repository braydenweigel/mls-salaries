#Sorts list by last names
import csv

data = []

def parseCSV(filepath):
    with open(filepath, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            data.append(row)
            

parseCSV("../playerData/compiledReports/compiled-data.csv")

sortedData = sorted(data, key=lambda d: (d['LastName'], d['FirstName'], d['Year']))

with open("../playerData/compiledReports/compiled-data-2.csv", "w", encoding="utf-8")as newfile:
    newfile.write("FirstName,LastName,Club,Position,BaseSalary,GuaranteedComp,Year,Duplicate\n")

    for row in sortedData:
        newfile.write(row['LastName'] + "," + row['FirstName'] + "," + row['Club'] + "," + row['Position'] + ',"' + row['BaseSalary'] + '","' + row['GuaranteedComp'] + '",' + row['Year'] + "," + row['Duplicate'] + "\n")