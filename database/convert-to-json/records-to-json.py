import csv
import json

input_file = "csv/playerrecords.csv"
output_file = "json/records.json"

data = []

with open(input_file, mode="r", encoding="utf-8") as csv_file:
    reader = csv.DictReader(csv_file)

    for row in reader:
        row["basesalary"] = float(row["basesalary"]) if row["basesalary"] else None
        row["guaranteedcomp"] = float(row["guaranteedcomp"]) if row["guaranteedcomp"] else None

        data.append(row)

with open(output_file, mode="w", encoding="utf-8") as json_file:
    json.dump(data, json_file, indent=2)

