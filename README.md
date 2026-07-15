# APDC JUDGE — EMBEDDED PLAYERS FIX

The Judge page no longer depends on loading players.json.
Player data is embedded directly inside judge.js.

This fixes:
- FAILED TO LOAD PLAYERS.JSON
- GitHub Pages path/cache problems for the Judge page

players.json is still included for Admin and Live pages.

Upload every file directly to the root of APDC_JUDGE.
