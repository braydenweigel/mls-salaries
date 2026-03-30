import json
import csv

# load JSON file
with open("../convert-to-json/json/records.json", "r") as f:
    data = json.load(f)

# filter records
filtered = [
    record for record in data
    if record["recordyear"] == "2025" and record["recordseason"] == "Spring"
]

# write to CSV
with open("2025-spring.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=filtered[0].keys())
    writer.writeheader()
    writer.writerows(filtered)