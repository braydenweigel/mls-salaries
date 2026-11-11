# Utility scripts

## records-json-to-csv.py
Converts a JSON array of records (id, playerid, firstname, lastname, club, position, basesalary, guaranteedcomp, recordyear, recordseason) to CSV.
- `python records-json-to-csv.py <input_file> <output_file>`
- Example: `python records-json-to-csv.py records.json records.csv`

## records-csv-to-json.py
Converts a CSV of records back to JSON, parsing `basesalary`/`guaranteedcomp` back into floats.
- `python records-csv-to-json.py <input_file> <output_file>`
- Example: `python records-csv-to-json.py records.csv records.json`

## players-json-to-csv.py
Converts a JSON array of players (playerid, firstname, lastname) to CSV.
- `python players-json-to-csv.py <input_file> <output_file>`
- Example: `python players-json-to-csv.py players.json players.csv`

## players-csv-to-json.py
Converts a CSV of players back to JSON.
- `python players-csv-to-json.py <input_file> <output_file>`
- Example: `python players-csv-to-json.py players.csv players.json`

## clubs-json-to-csv.py
Converts a JSON array of clubs (clubname, clubid, yearfirst, yearfinal, colorprimary, colorsecondary) to CSV.
- `python clubs-json-to-csv.py <input_file> <output_file>`
- Example: `python clubs-json-to-csv.py clubs.json clubs.csv`

## clubs-csv-to-json.py
Converts a CSV of clubs back to JSON.
- `python clubs-csv-to-json.py <input_file> <output_file>`
- Example: `python clubs-csv-to-json.py clubs.csv clubs.json`

## split-records.py
Splits a CSV of all records into one CSV per report, grouped by `recordyear`/`recordseason`. Only creates a file for report combinations that actually exist in the input. Output files are named `<output_directory>/<season>-<year><output_name_format>` (season lowercased).
- `python split-records.py <input_file> <output_directory> <output_name_format>`
- Example: `python split-records.py records.csv ./out -records.csv` produces files like `./out/spring-2026-records.csv` and `./out/fall-2025-records.csv`
