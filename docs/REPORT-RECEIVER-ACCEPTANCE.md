# MindCheck reporting receiver — end-to-end acceptance protocol
Status: **NOT VERIFIED**. No live test report has been sent by this change.

## What the public form can prove
A `200` response with a bounded JSON body containing boolean `ok: true` confirms only that the reachable receiver acknowledged the request. It **does not** prove durable storage, alert delivery, human review, guaranteed response time, or availability of a professional.

The form now stops reading a response after 8192 bytes; malformed, oversized, non-success HTTP, timed-out and network responses all remain **unconfirmed**. User text is retained on an unconfirmed result to allow an informed retry. Tests intercept all remote submissions.

## Authorized owner acceptance — use only nonidentifying synthetic data
1. Open the actual Apps Script editor as an authorized owner and identify the deployed script version and its storage destination; note the authorized operator, without exporting beneficiary records.
2. Identify where notifications should go, when they are expected to fire, their receiving account, and what happens if delivery fails.
3. Agree on coverage hours and timezone, named trained response owner, backup coverage and escalation policy. Do not promise a fixed response time until verified.
4. In a supervised test window, submit **one** report using concern `other`, `who=myself`, no location, age, name, contact details or personal history. Use a unique marker like `TEST ONLY — REPORT PATH ACCEPTANCE` in the details. Keep its submitted timestamp.
5. Verify that the **same marker** appears once in the approved destination, matches the intended timestamp and is readable only by authorized personnel.
6. Independently check whether the intended notification was actually delivered and logged. Note the recipient and whether an assigned person can acknowledge the case without revealing any beneficiary.
7. Test duplicate handling, an invalid payload, receiver outage, and delayed response **in staging or with intercepts**; never flood the live system or submit real safeguarding events.
8. Record date, reviewer, script version, observed outcomes, rollback steps and sign-off. If any link fails, leave the end-to-end status **unverified** and keep the user-facing no-continuous-monitoring notice.

## Privacy and age constraints
The youth education page has no reporting form. This adult report route uses browser navigation flags, not validated adult authorization; its endpoint may be reachable directly. Review applicable age and privacy obligations before accepting real data from minors. Avoid collection of exact addresses or other identifiers during QA.

## Release controls
- A green browser smoke suite is **not** a production receiver test.
- Do not log request bodies, phone numbers, sensitive report contents or returned recipient details.
- Do not change public hotline/referral statements until they are verified locally.
- Do not enable real report telemetry, automatic ticket distribution or referral routing on the assumption that `ok: true` means human handling.
