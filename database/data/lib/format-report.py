# Formats the yearly salary reports
# To run: python3 format-report.py <filename> <year>
import sys
import csv

dict = {
    "ATL": "Atlanta United",
    "CHI": "Chicago Fire",
    "CHV": "Chivas USA",
    "CLB": "Columbus Crew",
    "COL": "Colorado Rapids",
    "DAL": "FC Dallas",
    "DC": "DC United",
    "HOU": "Houston Dynamo",
    "KC": "Sporting Kansas City",
    "LA": "LA Galaxy",
    "LAFC": "LAFC",
    "MNUFC": "Minnesota United",
    "MTL": "CF Montreal",
    "NE": "New England Revolution",
    "NYCFC": "New York City FC",
    "NYRB": "New York Red Bulls",
    "NY": "New York Red Bulls",
    "ORL": "Orlando City SC",
    "PHI": "Philadelphia Union",
    "POR": "Portland Timbers",
    "RSL": "Real Salt Lake",
    "SEA": "Seattle Sounders FC",
    "SJ": "San Jose Earthquakes",
    "TOR": "Toronto FC",
    "TFC": "Toronto FC",
    "VAN": "Vancouver Whitecaps",
    "POOL": "MLS Pool",
    "Pool": "MLS Pool",
    "": "MLS Pool",
    "None": "MLS Pool"
}

def parseCSV(filepath):
    data = []
    with open(filepath, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)
    return data

filepath = sys.argv[1]
year = sys.argv[2]
data = parseCSV(filepath)


with open("../playerData/yearlyReports/" + year + "-data.csv", "w", encoding="utf-8")as newfile:
    newfile.write("FirstName,LastName,Club,Position,BaseSalary,GuaranteedComp\n")

    for row in data:
        newfile.write(row['first_name'] + "," + row['last_name'] + "," + dict[row['club']] + "," + row['position'] + ',"' + row['base_salary'] + '","' + row['guaranteed_compensation'] + '"\n')