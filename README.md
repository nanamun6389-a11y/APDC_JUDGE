# APDC Official V10

Updated:
- Only one top category menu remains.
- Duplicate lower and inner category buttons were removed.
- MC Korean wording uses '심사위원 여러분'.
- MC Korean script is shorter and more natural.
- Broadcast Korean captions use short, screen-friendly wording.
- Existing full translation and language dropdown remain included.

Upload every file directly to the root of the APDC_JUDGE repository.


## Certificate Print (added)
- `certificate.html`
- Password: `APDCPRINT0070`
- 508 certificate records from final APDC results
- Competition date: August 8, 2026
- Search by player / back number / event; click a result to generate and print.


## Certificate Print Grouping Update
- Password: APDCPRINT0070
- Group filter by academy/team/contact name
- Includes 개별 참가자 and 미분류
- SELECT ALL / DESELECT ALL
- PRINT THIS GROUP / PRINT SELECTED
- Certificate date: August 8, 2026

- Print fix: certificate artwork is now an actual IMG element, not a CSS background, so it prints even when browser background graphics are disabled.

- Certificate overlay fix: removed opaque boxes behind player/event/place text; original certificate artwork remains fully visible.

- Full certificate artwork fix: replaced the truncated PNG with a complete valid certificate image and realigned player/place/event text.

## Long-term free operation foundation (2026-08-13)
- `competition-context.js` added.
- `2026-apdc` stays in legacy Firebase paths for backwards compatibility.
- Any new competition ID uses `competitions/<competition-id>/...` Firebase paths.
- New Competition creates a local draft, activates the competition ID, provides competition-specific Admin/Judge/Control/MC URLs, and can download a config JSON.
- The 2026 archive under `archive/2026/` remains static/read-only and does not require Firebase for viewing saved entry/timetable/result data.
- New competitions intentionally start with no embedded 2026 judge entries, preventing accidental cross-year mixing.
