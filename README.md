# APDC Official V10

Updated:
- Only one top category menu remains.
- Duplicate lower and inner category buttons were removed.
- MC Korean wording uses '심사위원 여러분'.
- MC Korean script is shorter and more natural.
- Broadcast Korean captions use short, screen-friendly wording.
- Existing full translation and language dropdown remain included.

Upload every file directly to the root of the APDC_JUDGE repository.


V11 MC LIVE SYNC:
- MC event navigation writes activeEvent + floorStatus + publicLiveState together.
- LIVE updates immediately from Firebase floorStatus.
- State remains after refresh because Firebase is the source of truth.
- Future APDC timetable can subscribe to publicLiveState or floorStatus.
