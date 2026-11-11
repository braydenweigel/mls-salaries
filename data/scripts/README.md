# Data processing scripts

## Add New Report Workflow
1) Get the new report as a CSV file in the format (firstname, lastname, club, position, basesalary, guaranteedcomp)
    - "club" should be a club id (ATX, POR) rather than the club name (Austin FC, Portland Timbers)
    - "position" should be in shortened format (GK, D, M, F)
    - "basesalary" and "guaranteedcomp" should be floating point numbers (1200000.0 not $1,200,000.00)

2) Run `add-ids-to-report.py` to assign each row a unique id and set the report's year/season:
    - `python add-ids-to-report.py <input_file> <output_file> <recordyear> <recordseason>`
    - Example: `python add-ids-to-report.py sp26.csv 2026-spring-ids.csv 2026 Spring`

3) Run `remove-chars.py` to strip accented characters from names:
    - `python remove-chars.py <input_file> <output_file>`
    - Example: `python remove-chars.py 2026-spring-ids.csv 2026-sp.csv`

4) Run `3-compare-reports.py` to match each new row to an existing `playerid` from the previous report, by matching on normalized first/last name (rows with no match are flagged "NEW", rows matching multiple previous players are flagged "DUPLICATE"):
    - `python 3-compare-reports.py <prev_file> <new_file> <output_file>`
    - Example: `python 3-compare-reports.py fall_2025_final.csv 2026-sp.csv spring_2026_updated.csv`

5) Check the output of step 4 for any errors. Errors mainly occur when a new player has the same name as a previous player, a player's name has changed in the new report, or a player has rejoined the league and already has an existing player record. Use the Summer/Fall MLS transfers on Transfermarkt to help with this.

6) Run `4-add-player-ids.py` to assign a new `playerid` to each row flagged "NEW" (reusing existing ids for everyone else), writing the finished report plus a JSON file of just the new players:
    - `python 4-add-player-ids.py <input_file> <output_csv> <output_json>`
    - Example: `python 4-add-player-ids.py spring_2026_updated.csv spring_2026_final.csv players_new_only.json`

7) Use `utils/records-csv-to-json.py` to convert the output csv from the previous step to json.

8) Add the output of step 7 to `../datasets/json-data/records.json`.

9) Add the output json of step 6 to `../datasets/json-data/players.json`.

10) Update globals.ts in webapp to the current report.

## Utility Scripts
- Converts Players, Records, Clubs from .csv to .json or .json to .csv
