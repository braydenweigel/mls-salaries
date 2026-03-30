import csv
import unicodedata

def remove_accents(text: str) -> str:
    return ''.join(
        c for c in unicodedata.normalize('NFKD', text)
        if not unicodedata.combining(c)
    )

input_file = "2025-fall-ids.csv"
output_file = "2025-fa.csv"

with open(input_file, "r") as f_in, open(output_file, "w", newline="") as f_out:
    reader = csv.DictReader(f_in)
    writer = csv.DictWriter(f_out, fieldnames=reader.fieldnames)

    writer.writeheader()

    for row in reader:
        # clean specific fields
        row["firstname"] = remove_accents(row["firstname"])
        row["lastname"] = remove_accents(row["lastname"])

        writer.writerow(row)