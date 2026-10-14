# MindCheck — backend security handover and sign-off

**Status:** Frontend security improvements are deployed; backend verification is NOT complete. Do not mark this checklist complete using browser-only demonstrations.

## 1. Access and ownership

- Identify the **current owner / editor** of each Google Apps Script project used for: mood check-ins, official assessment/certificate issuance, and certificate verification.
- Identify the owner of the old SheetDB API project for the paused Leadership Summit certificate portal.
- Work only in the provider consoles with authenticated owner/editor access; do not paste tokens, sensitive responses, attendance lists, or real certificate IDs into GitHub.
- Before edits, inventory deployment IDs, code versions, script properties, Sheets IDs (stored privately), trigger configuration, and access settings. Preserve a rollback deployment and confirm maintenance/incident contacts.

## 2. Mood check-in receiver — blocking issue #79

The current static frontend includes a public authorization query value. **Anything delivered to a browser is public and cannot authenticate the caller.**

- Rotate or revoke the old credential **at the Apps Script backend**. Do not just change the value in `index.html`.
- Choose a secure server-controlled architecture. For example, authenticated API gateway → validation and authorization → rate-limited append-only check-in ledger; store all secrets in server-only configuration. Anonymous public check-ins need a carefully designed abuse-control mechanism and **must not be trusted for cash payouts**.
- Validate JSON structure, date format, mood enum 0–4, payload size, origin as an auxiliary (not sole) signal, and logging permissions. Reject malformed, duplicate, replayed and unauthorized writes. Do not trust client-supplied points, streak, award ID, user ID or payment status.
- Document what mood and metadata is collected, consent/notice, minimum retention and deletion procedure. Avoid storing sensitive data in public analytics.
- After the replacement is deployed and health-checked, change frontend routing and verify success, rejection, offline recovery, and monitoring. Retire the legacy public endpoint only after cutover.

## 3. Leadership Summit attendee records — blocking issue #80

The `/certificate/` portal is paused; its previous browser lookup has been removed. **The underlying SheetDB endpoint may still be accessible directly.**

- In the SheetDB admin account, disable or revoke the legacy API, remove unintended anonymous read/list permissions, and audit logs and downstream integrations.
- Confirm, from an **unauthenticated** browser/session, that the old API cannot return attendee records. Do not publish any returned content or share links containing credentials.
- Before future events: use an authenticated, rate-limited server endpoint that returns only a single authorized person's verification result (not the entire attendee list); require explicit attendee-consent and an expiry/retention policy.
- Preserve original portal designs and page assets in Git history for later reuse.

## 4. Official certificates — blocking issue #81

The public `verify.html` page requires a successful response and a matching certificate ID, but this is only a frontend safeguard.

- Confirm Apps Script response rules with the project owner: record source, eligibility, issuing authority, revocation/suspension, and least-privilege public response fields.
- With permission, test one valid synthetic/test certificate and three invalid conditions: unknown ID, incorrect ID response, and service failure. **No public sample ID that resolves to an actual person's certificate.**
- Confirm assessment pass records come from a trusted source and cannot be created by editing browser state; verify that a training completion document is not misrepresented as professional licensure.
- Verify the official certificate page and verification page use the same approved backend release/version.

## 5. Cash milestone verification — blocking issue #81

- Keep device-generated streaks, points, badges and milestone IDs as **personal progress only**, not evidence of earned or paid money.
- Build a private, append-only award ledger with unique user/milestone and an authorized approver. Verify eligibility independently and prevent duplicate approval or payment.
- Record states clearly: `submitted` → `under_review` → `approved/rejected` → `paid` (if applicable), each with timestamps and admin evidence. Only backend state can represent payout confirmation.
- Establish fraud/appeal/duplicate-account rules, admin access separation, budget limits, and a privacy-conscious retention schedule.

## 6. Acceptance checklist

- [ ] Backend owners and access confirmed
- [ ] Old exposed frontend credential revoked at source
- [ ] Authorized receiver and rate limits implemented
- [ ] Mood logging verified for success, bad inputs and duplicates
- [ ] Old SheetDB API read access independently blocked
- [ ] Verified certificate, unknown certificate, mismatch and outage tested
- [ ] Official certificate issuance controlled server-side
- [ ] Cash award ledger and authorizations confirmed
- [ ] No personal records, API keys or secrets committed to this repository
- [ ] Rollback and incident contacts recorded privately
- [ ] Site browser tests and production deployment pass

**Related tracked tasks:** #79, #80, #81.

## What is needed from the account owner

Share the Google Apps Script *editor project link* with an authorized connected account, or invite the authorized reviewer as editor. Separately provide access to the SheetDB administrative console or ask its owner to carry out item 3 and confirm the result. Never send passwords or API secrets in chat or PR comments.
