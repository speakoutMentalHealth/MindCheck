# Operational acceptance — 20 October 2026

This records verified checks and remaining acceptance work. It is not a production-readiness sign-off.

## Current evidence

- **Admin analytics implementation:** the portal's ten traffic unit tests pass, including organisation-only authorization, deduplication, Lagos date ranges and privacy projections. The latest production Worker deployment (portal commit `e8785389c16396ce865b609039d340b66e12abba`) includes an executed deployment step, not only a skipped credential check.
- **Actual admin figures:** not verified. The live admin page redirected the remote browser to authentication. The Google sign-in credential request was declined; no further authentication attempts were made. The owner can check Today, Last 7 days and Last 30 days in their own browser and provide the displayed status without credentials.
- **API reachability from this environment:** a credential-free POST and preflight received HTTP 403, plain text, Cloudflare error 1010, rather than the application's JSON response. This establishes a client-specific edge rejection; it does not establish that ordinary visitors receive the same result. Do not disable protections or bypass the block to make a test pass. Correlate a failing ordinary-browser request with the owner's Cloudflare security events before changing configuration.
- **Safety report delivery:** the form sends to a separate Apps Script deployment and shows receipt only after an HTTP success with `ok: true`. That response alone cannot establish storage, notification delivery, monitoring coverage or a human response. No live test report was sent during this audit because the receiving project and destination were not available for verification.
- **Weekly monitoring:** the legacy `no-cors` request cannot provide a readable server receipt. The page previously claimed the register was updated anyway. The corrected flow stores a local backup first, labels online delivery unconfirmed, retains the backup during network failure, and prevents sending when local storage fails. This does not secure or validate the legacy receiver.
- **Support hours/referrals:** no confirmed schedule or active referral agreement is available in the repository. Keep the existing no-continuous-monitoring/no-guaranteed-response wording. Do not invent hours or describe proposed hospital referrals as live integrations.

## Separate systems and status

| System | Status | What still requires owner verification |
| --- | --- | --- |
| Mood history, breathing, tips and challenges | Active, on device | Physical-device acceptance remains separate from automated browser checks |
| Portal sign-in aggregates | Implemented in the separate SpeakOut portal Worker | Signed-in administrator report and actual stored aggregate totals |
| MindCheck visitor analytics | Configured frontend, private server connection | Real provider totals in the admin report; token value must stay private |
| Safety reporting | Active external form route | Apps Script source, destination register, notification mechanism and response owner |
| Weekly monitoring | Local backup plus unconfirmed legacy delivery attempt | Receiving script, authorization, rate limits and actual row receipt |
| Official certificate route | Current approved Apps Script route | Trusted assessment/issuance logic, synthetic issuance/verification and revocation checks |
| Old cloud check-in receiver | Legacy; current mood flow is local | Revoke the old exposed browser credential at its source; inspect other callers before retirement |
| Cash claims | Removed from the product; badges only | Verify obsolete claim writes are retired at the old backend; preserve historical records |
| Leadership Summit certificate portal | Paused | Owner must verify the underlying legacy SheetDB API cannot expose attendee records |

## To close acceptance

1. Owner checks the signed-in admin report in an ordinary browser. Capture only its displayed error/status and aggregate totals. If blocked, inspect the matching Cloudflare event; keep Firebase admin authentication enforced.
2. Identify the report Apps Script editor project and the intended destination. Prepare one unique `TEST ONLY — operational acceptance` report with concern `other`, no beneficiary details, no contact information, no location and no age. Submit only when the destination can be inspected. Match the same marker in the receiving register/log and independently verify any intended notification. An HTTP acknowledgement is not proof of human monitoring.
3. Confirm exact support days, operating hours, timezone, channel owner, fallback coverage and referral contacts. Publish only the confirmed arrangements.
4. Use authenticated owner consoles to review legacy deployments and access. Do not enumerate private records to demonstrate an exposure, grant broader roles, or delete historical data. Revoke obsolete credentials at their receiver with a rollback plan.

## Validation for the monitoring correction

The browser fixture intercepts every remote write. It checks an opaque acknowledgement, network failure, blocked local storage, numeric validation, literal rendering of user input, persistence and CSV download. These checks must never be described as proof of real report or register delivery.

Provider reference for error 1010: <https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/>.
