import argparse
import csv
import os
from collections import defaultdict

parser = argparse.ArgumentParser()
parser.add_argument("input_file")
parser.add_argument("output_directory")
parser.add_argument("output_name_format")
args = parser.parse_args()

input_file = args.input_file
output_directory = args.output_directory
output_name_format = args.output_name_format

os.makedirs(output_directory, exist_ok=True)

rows_by_report = defaultdict(list)

with open(input_file, "r") as f:
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames

    for row in reader:
        key = (row["recordyear"], row["recordseason"])
        rows_by_report[key].append(row)

for (recordyear, recordseason), rows in rows_by_report.items():
    filename = f"{recordseason.lower()}-{recordyear}{output_name_format}"
    output_file = os.path.join(output_directory, filename)

    with open(output_file, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
