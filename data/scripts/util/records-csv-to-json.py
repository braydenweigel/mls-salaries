import argparse
import csv
import json

parser = argparse.ArgumentParser()
parser.add_argument("input_file")
parser.add_argument("output_file")
args = parser.parse_args()

input_file = args.input_file
output_file = args.output_file

records = []

with open(input_file, "r") as f:
    reader = csv.DictReader(f)

    for row in reader:
        row["basesalary"] = float(row["basesalary"])
        row["guaranteedcomp"] = float(row["guaranteedcomp"])
        records.append(row)

with open(output_file, "w") as f:
    json.dump(records, f, indent=2)
