import csv
import json
import random
import string

def randomString(length):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

input_file = "fall_2025_updated.csv"
output_csv = "fall_2025_final.csv"
output_json = "players_new_only.json"

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