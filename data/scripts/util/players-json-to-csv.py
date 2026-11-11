import argparse
import csv
import json

parser = argparse.ArgumentParser()
parser.add_argument("input_file")
parser.add_argument("output_file")
args = parser.parse_args()

input_file = args.input_file
output_file = args.output_file

with open(input_file, "r") as f:
    players = json.load(f)

fieldnames = [
    "playerid",
    "firstname",
    "lastname",
]

with open(output_file, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(players)
