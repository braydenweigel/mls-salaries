import argparse
import csv
import unicodedata

def remove_accents(text: str) -> str:
    return ''.join(
        c for c in unicodedata.normalize('NFKD', text)
        if not unicodedata.combining(c)
    )

parser = argparse.ArgumentParser()
parser.add_argument("input_file")
parser.add_argument("output_file")
args = parser.parse_args()

input_file = args.input_file
output_file = args.output_file

with open(input_file, "r") as f_in, open(output_file, "w", newline="") as f_out:
    reader = csv.DictReader(f_in)
    writer = csv.DictWriter(f_out, fieldnames=reader.fieldnames)

    writer.writeheader()

    for row in reader:
        # clean specific fields
        row["firstname"] = remove_accents(row["firstname"])
        row["lastname"] = remove_accents(row["lastname"])

        writer.writerow(row)