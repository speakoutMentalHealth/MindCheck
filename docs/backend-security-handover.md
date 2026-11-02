# MindCheck — backend security handover and sign-off

**Status:** Frontend improvements exist on merged `main`; backend verification is NOT complete. Do not mark this checklist complete using browser-only demonstrations or inferred public deployment state.

## November 1, 2026 — release evidence and outstanding gates

- PR [#225](https://github.com/speakoutMentalHealth/MindCheck/pull/225) was merged into `main` as `f8098ba8934dec42e6bac7719ce2ac9241407fd9`. Its candidate head `542972c11674ca04a35521160b47c83d089e5241` had four successful reported workflows: legacy exposure, youth safety, static release, and browser smoke.
- This is **source/CI evidence**, not proof that the custom-domain GitHub Pages deployment is at that commit. Post-merge public checks of `age-entry.html` and `sw.js` remain required, as does physical iPhone Safari/in-app browser testing of both adult and youth DOB routing and Add to Home Screen.
- Separate operational gates remain open: #79 exposed legacy check-in receiver, #80 paused Summit SheetDB permissions, #81 trusted certificate issuance/verification and retired cash-claim route. [SpeakOut portal #409](https://github.com/speakoutMentalHealth/speakout-landing-page/issues/409) governs the separate approved-volunteer forum pilot and is not cleared by MindCheck frontend CI.
- **Decision:** the age-entry engineering patch is merged and its PR workflows passed; wider safeguarding-sensitive, reporting-dependent, certificate-dependent or private forum rollout remains **HOLD** until the respective owner-side and physical-device evidence is documented.



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

## 5. Retired cash-claim route — blocking issue #81

MindCheck now offers **non-cash, device-local progress badges only**. There is no planned cash payout feature. Do **not** create a new cash-award ledger, redemption flow, payment states or participant-payment claims to satisfy this release gate.

- Keep streaks, points and badges explicitly non-monetary; do not treat browser-generated progress as evidence of an official certificate, verified participation or professional qualification.
- With the authorized Apps Script editor, inventory callers of the former `award_claim` backend route, retire that case **at the source**, and verify retired writes are rejected. Frontend removal alone does not disable the old endpoint.
- Preserve historical records according to the approved retention policy. Do not delete production records or change other active routes (`checkin`, `certificate_issue`, `training_pass`, `monitoring_week`, public verification) while retiring the claim handler.
- Record the backend deployment/version, owner sign-off and safe rollback procedure privately. Use synthetic data only and do not publish old credentials or award records.

## 6. Acceptance checklist

- [ ] Backend owners and access confirmed
- [ ] Old exposed frontend credential revoked at source
- [ ] Authorized receiver and rate limits implemented
- [ ] Mood logging verified for success, bad inputs and duplicates
- [ ] Old SheetDB API read access independently blocked
- [ ] Verified certificate, unknown certificate, mismatch and outage tested
- [ ] Official certificate issuance controlled server-side
- [ ] Old `award_claim` backend route retired and synthetic cash-claim writes rejected; device-local badges remain non-cash
- [ ] No personal records, API keys or secrets committed to this repository
- [ ] Rollback and incident contacts recorded privately
- [ ] Site browser tests and production deployment pass

**Related tracked tasks:** #79, #80, #81.

## What is needed from the account owner

Share the Google Apps Script *editor project link* with an authorized connected account, or invite the authorized reviewer as editor. Separately provide access to the SheetDB administrative console or ask its owner to carry out item 3 and confirm the result. Never send passwords or API secrets in chat or PR comments.
