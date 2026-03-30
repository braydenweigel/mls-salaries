import csv

spring_file = "2025-spring.csv"
fall_file = "2025-fa.csv"
output_file = "fall_2025_updated.csv"

# normalize names (important!)
def normalize(name: str) -> str:
    return name.strip().lower()

# build lookup from spring
spring_lookup = {}

with open(spring_file, "r") as f:
    reader = csv.DictReader(f)

    for row in reader:
        key = (normalize(row["firstname"]), normalize(row["lastname"]))

        if key not in spring_lookup:
            spring_lookup[key] = []

        spring_lookup[key].append(row["playerid"])

# process fall data
updated_rows = []

with open(fall_file, "r") as f:
    reader = csv.DictReader(f)

    for row in reader:
        key = (normalize(row["firstname"]), normalize(row["lastname"]))

        matches = spring_lookup.get(key, [])

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