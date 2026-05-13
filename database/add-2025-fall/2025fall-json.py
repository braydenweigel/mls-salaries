import csv
import json

input_file = "spring_2026_final.csv"
output_file = "spring_2026_final.json"

data = []

with open(input_file, "r") as f:
    reader = csv.DictReader(f)

    for row in reader:
        row["basesalary"] = float(row["basesalary"])
        row["guaranteedcomp"] = float(row["guaranteedcomp"])
        data.append(row)

with open(output_file, "w") as f:
    json.dump(data, f, indent=2)