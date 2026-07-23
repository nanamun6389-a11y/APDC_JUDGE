# APDC Official V10

Updated:
- Only one top category menu remains.
- Duplicate lower and inner category buttons were removed.
- MC Korean wording uses '심사위원 여러분'.
- MC Korean script is shorter and more natural.
- Broadcast Korean captions use short, screen-friendly wording.
- Existing full translation and language dropdown remain included.

Upload every file directly to the root of the APDC_JUDGE repository.


Update 20260717-1305: Under 18 Solo CSR merged into Under 18 Solo CRS; cache-busting enabled.


## V5 TIMETABLE SAFE LOAD
- Timetable page renders local/default data before Firebase loads.
- Firebase is connected afterward and saved override replaces the visible table.
- Prevents blank timetable when Firebase CDN/import is slow or unavailable.

## V7 EXACT RUNNING ORDER SYNC
- Single position source: Firebase `runningOrder/currentIndex`
- MC FIRST/PREV/NEXT/LAST write only this index
- LIVE NOW/NEXT UP/COMING SOON read only this index
- `floorStatus` remains only as a compatibility mirror and is not used by LIVE
- localStorage is not used as LIVE position source
