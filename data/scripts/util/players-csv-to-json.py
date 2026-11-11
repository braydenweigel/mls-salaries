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
    reader = csv.DictReader(f)
    players = list(reader)

with open(output_file, "w") as f:
    json.dump(players, f, indent=2)
