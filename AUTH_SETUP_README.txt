APDC MC SECURITY UPDATE

1) Firebase Console > Authentication > Sign-in method > Email/Password > Enable.
2) Authentication > Users > Add user. Create the MC/admin email and password.
3) Upload this site version to GitHub and open MC. Log in with that Firebase account.
4) BEFORE changing Database Rules, test MC NEXT/PREV and confirm LIVE changes cross-device.
5) After the test passes, copy database.rules.SECURE.json into Realtime Database > Rules and Publish.

IMPORTANT
- Public SEARCH/LIVE reads remain available without login.
- MC live writes require Firebase Authentication.
- searchAnalytics remains public-write because the public search site records visitor/search analytics.
- Admin/Qualifiers/Judge write pages will also require an authenticated Firebase session after secure rules are published. On the same browser/origin, the MC Firebase login is persisted.
