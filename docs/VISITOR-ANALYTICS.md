# MindCheck visitor analytics

Status: implementation prepared; owner account/endpoint and dashboard receipt verification pending. Do not describe traffic tracking as live until a real visit appears in the private dashboard.

## Owner setup

Create a SpeakOut-owned account at https://www.goatcounter.com/signup using the organisation email. Set its website domain to `mindcheck.speakoutmentalhealth.org`. Choose an available account name; do not assume a suggested name is available. Complete password creation and signup yourself. Keep the statistics dashboard private and choose Africa/Lagos as the reporting timezone if available in the account settings.

After signup, copy only the public `https://YOUR-ACCOUNT.goatcounter.com/count` URL from the installation snippet into `js/mindcheck-analytics-config.js`. Passwords and API tokens must never enter this repository. Activate through the existing pull request, rotate the service worker cache again if the prepared version has already shipped, and run the privacy tests and CI before deployment.

## What the owner can measure

Use date filters for today, the last week and the last month, and review pageviews, estimated unique visits, top public pages, referrer websites, device/browser and approximate location reports. Available reports and their definitions are controlled by GoatCounter; they are not audited counts of individual people.

MindCheck does not have account sign-in. Traffic figures are not the number of authenticated users. Login totals for the separate SpeakOut portal require a distinct authenticated-session measurement; never infer successful login from loading a login page. No portal tracking is added by this change.

The loader counts only allow-listed public pages. It sends static page titles, a normalized path without query/fragment, and external referrer origin only. Private reports, clinical screenings, support chat, monitoring and certificate routes have no analytics. Their visitors are therefore absent from direct-entry totals. No form reads, mood values, test scores, report text, identity or per-person activity events are sent. The wrapper creates no cookies or local identifiers, respects DNT/GPC, and does not load third-party code until an owned endpoint is configured. Blockers, offline visits and provider session estimation make counts approximate. There is no session replay.

## Acceptance check

1. Confirm the dashboard belongs to SpeakOut, its stats are private, and its public endpoint matches the configured one.
2. Open a normal public page in a browser with analytics allowed. Check the private dashboard for the new hit, allowing for provider processing delay. A loaded script is not proof of receipt.
3. Confirm a subsequent public-page visit appears with no query string, certificate ID, sensitive referrer path or custom health event.
4. Confirm excluded routes and browsers requesting privacy generate no analytics request. Run `node --test scripts/analytics-privacy.test.cjs`.
5. Record the activation date and owner access path. Historical traffic cannot be reconstructed from a previously inactive tracker.

Provider references: https://www.goatcounter.com/ , https://www.goatcounter.com/help/js , https://www.goatcounter.com/help/privacy . Hosted service currently advertises free reasonable public usage; review its terms during signup.
