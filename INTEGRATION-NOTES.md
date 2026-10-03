# Twinalyze npm integration notes

This project already contains direct npm calls for `identify()` and manual events.

It intentionally does **not** contain:

- `TwinalyzeAnalytics.init()`
- API key or secret key
- an active `public/twinalyze-fcm-sw.js`
- Firebase credentials or a VAPID key
- any CDN script
- any analytics helper/wrapper file

Follow `README.md` to initialize the SDK and enable FCM
