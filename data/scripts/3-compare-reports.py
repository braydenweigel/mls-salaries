import argparse
import csv

parser = argparse.ArgumentParser()
parser.add_argument("prev_file")
parser.add_argument("new_file")
parser.add_argument("output_file")
args = parser.parse_args()

prev_file = args.prev_file
new_file = args.new_file
output_file = args.output_file

# normalize names (important!)
def normalize(name: str) -> str:
    return name.strip().lower()

# build lookup from previous report
prev_lookup = {}

with open(prev_file, "r") as f:
    reader = csv.DictReader(f)

    for row in reader:
        key = (normalize(row["firstname"]), normalize(row["lastname"]))

        if key not in prev_lookup:
            prev_lookup[key] = []

        prev_lookup[key].append(row["playerid"])

# process new report
updated_rows = []

with open(new_file, "r") as f:
    reader = csv.DictReader(f)

    for row in reader:
        key = (normalize(row["firstname"]), normalize(row["lastname"]))

        matches = prev_lookup.get(key, [])

        if len(matches) == 1:
            row["playerid"] = matches[0]
        elif len(matches) > 1:
            row["playerid"] = "DUPLICATE"
        else:
            row["playerid"] = "NEW"

        updated_rows.append(row)

# write output
with open(output_file, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=reader.fieldnames)
    writer.writeheader()
    writer.writerows(updated_rows)
