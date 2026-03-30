import csv
import random
import string

def randomString(length):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

input_file = "2025-fall.csv"
output_file = "2025-fall-ids.csv"

rows = []

with open(input_file, "r") as f:
    reader = csv.DictReader(f)

    for row in reader:
        # remove commas from salary fields
        basesalary = row["basesalary"].replace(",", "")
        guaranteedcomp = row["guaranteedcomp"].replace(",", "")

        new_row = {
            "id": randomString(8),
            "playerid": "",
            "firstname": row["firstname"],
            "lastname": row["lastname"],
            "club": row["club"],
            "position": row["position"].strip(),  # remove accidental spaces
            "basesalary": basesalary,
            "guaranteedcomp": guaranteedcomp,
            "recordyear": "2025",
            "recordseason": "Fall",
        }

        rows.append(new_row)

# write cleaned CSV
fieldnames = [
    "id",
    "playerid",
    "firstname",
    "lastname",
    "club",
    "position",
    "basesalary",
    "guaranteedcomp",
    "recordyear",
    "recordseason",
]

with open(output_file, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)