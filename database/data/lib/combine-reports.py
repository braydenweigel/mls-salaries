import csv
import unicodedata

data = []

duplicateList = [
    {"fname": "Marko", "lname": "Maric"},
    {"fname": "David", "lname": "Martinez"},
    {"fname": "Diego", "lname": "Gutierrez"},
    {"fname": "Eddie", "lname": "Johnson"}
]

def checkDuplicates(row):
    res = ""

    for i in duplicateList:
        if (row['FirstName'] == i['fname'] and row['LastName'] == i['lname']):
            res = "DUPLICATE"

            print("FOUND DUPLICATE: " + i['fname'] + " " + i['lname'] + " " + row['Club'] + " " + row['Year'])

    return res


def parseCSV(filepath, year):
    with open(filepath, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            #Normalizes names to only include English characters (due to inconsistencies in yearly reports)
            fn = unicodedata.normalize('NFKD', row['FirstName'])
            fName = ''.join([c for c in fn if not unicodedata.combining(c)])

            ln = unicodedata.normalize('NFKD', row['LastName'])
            lName = ''.join([c for c in ln if not unicodedata.combining(c)])

            row['FirstName'] = fName
            row['LastName'] = lName

            row['Year'] = year 
  
            row['Duplicate'] = checkDuplicates(row)

            data.append(row)

for i in range(2007, 2025):
    filepath = "../playerData/yearlyReports/" + str(i) + "-data.csv"
    parseCSV(filepath, str(i))

parseCSV("../playerData/yearlyReports/2025-spring-data.csv", "2025 Sp")

sortedData = sorted(data, key=lambda d: (d['FirstName'], d['LastName'], d['Year']))
print(len(sortedData))

with open("../playerData/compiledReports/compiled-data-2.csv", "w", encoding="utf-8")as newfile:
    newfile.write("FirstName,LastName,Club,Position,BaseSalary,GuaranteedComp,Year,Duplicate\n")

    for row in sortedData:
        newfile.write(row['FirstName'] + "," + row['LastName'] + "," + row['Club'] + "," + row['Position'] + ',"' + row['BaseSalary'] + '","' + row['GuaranteedComp'] + '",' + row['Year'] + "," + row['Duplicate'] + "\n")