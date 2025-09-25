# Adds unique player ids for all players who don't have a duplicate name. 
# Adds a unique id for every record. 
# Replaces team names with the abbreviation (the primary key in the database)
import csv
import random
import string

dict = {
    "Austin FC": "ATX",
    "Atlanta United": "ATL",
    "Charlotte FC": "CLT",
    "Chicago Fire": "CHI",
    "Chivas USA": "CHV",
    "FC Cincinnati": "CIN",
    "Columbus Crew": "CLB",
    "Colorado Rapids": "COL",
    "FC Dallas": "DAL",
    "DC United": "DC",
    "Houston Dynamo": "HOU",
    "Sporting Kansas City": "KC",
    "LA Galaxy": "LA",
    "LAFC": "LAFC",
    "Inter Miami": "MIA",
    "Minnesota United": "MNUFC",
    "CF Montreal": "MTL",
    "Nashville SC": "NSH",
    "New England Revolution": "NE",
    "New York City FC": "NYC",
    "New York Red Bulls": "RBNY",
    "Orlando City SC": "ORL",
    "Philadelphia Union": "PHI",
    "Portland Timbers": "POR",
    "Real Salt Lake": "RSL",
    "St. Louis City SC": "STL",
    "Seattle Sounders FC": "SEA",
    "San Diego FC": "SD",
    "San Jose Earthquakes": "SJ",
    "Toronto FC": "TOR",
    "Vancouver Whitecaps": "VAN",
    "Whitecaps FC 2": "VAN2",
    "MLS Pool": "MLS",
    "Major League Soccer": "MLS",
    "": "MLS",
    "Retired": "MLS"
}

records = [] #List of records
players = [] #List of unique players

def randomString(length):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def parseCSV(filepath):
    with open(filepath, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            records.append(row)

parseCSV("../playerData/compiledReports/compiled-data-2.csv")

currentFirst = "0"
currentLast = "0"
currentID = "000000"

for row in records:
    row['PlayerID'] = "000000"



    if (row['Duplicate'] == ""):
        row['Duplicate'] = randomString(8)

        if (row['FirstName'] != currentFirst or row['LastName'] != currentLast):
            currentID = randomString(6)
            row['PlayerID'] = currentID
        else:
            row['PlayerID'] = currentID

        currentFirst = row['FirstName']
        currentLast = row['LastName']
    else:
        print(row['FirstName'] + "," + row['LastName'] + "," + row['Club'] + "," + row['Duplicate'])

with open("../playerData/compiledReports/with-ids.csv", "w", encoding="utf-8")as newfile:
    newfile.write("PlayerID,FirstName,LastName,Club,Position,BaseSalary,GuaranteedComp,Year,Duplicate\n")

    for row in records:
        newfile.write(row['PlayerID'] + "," + row['LastName'] + "," + row['FirstName'] + "," + dict[row['Club']] + "," + row['Position'] + ',"' + row['BaseSalary'] + '","' + row['GuaranteedComp'] + '",' + row['Year'] + "," + row['Duplicate'] + "\n")