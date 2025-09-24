#Checks for names that contain multiple capital letters. Players with multiple names may appear here
import csv
import re

pattern = re.compile(r"^(?:.*[A-Z]){2,}.*$")

def parseCSV(filepath):
    with open(filepath, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        i = 0
        for row in reader:
            i += 1

            if pattern.search(row["FirstName"]):
                print("Line: " + str(i + 1) + " " + row["FirstName"] + " " + row["LastName"])

parseCSV("../playerData/compiledReports/compiled-data.csv")