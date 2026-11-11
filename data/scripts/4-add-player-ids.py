import argparse
import csv
import json
import random
import string

def randomString(length):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

parser = argparse.ArgumentParser()
parser.add_argument("input_file") #input file (output of 3-compare-reports)
parser.add_argument("output_csv") #csv of finished report
parser.add_argument("output_json") #json file of new player records
args = parser.parse_args()

input_file = args.input_file
output_csv = args.output_csv
output_json = args.output_json

rows = []
json_output = []
used_ids = set()

with open(input_file, "r") as f:
    reader = csv.DictReader(f)

    for row in reader:
        is_new = row["playerid"] == "NEW"  # track BEFORE changing it

        if is_new:
            new_id = randomString(6)
            while new_id in used_ids:
                new_id = randomString(6)

            row["playerid"] = new_id
            used_ids.add(new_id)
        else:
            used_ids.add(row["playerid"])

        rows.append(row)

        # ✅ only add NEW players to JSON
        if is_new:
            json_output.append({
                "playerid": row["playerid"],
                "firstname": row["lastname"],  # swapped
                "lastname": row["firstname"],  # swapped
            })

# write CSV
with open(output_csv, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=reader.fieldnames)
    writer.writeheader()
    writer.writerows(rows)

# write JSON
with open(output_json, "w") as f:
    json.dump(json_output, f, indent=2)