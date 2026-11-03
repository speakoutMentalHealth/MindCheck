# MindCheck controlled launch sign-off — 3 November 2026

**Decision:** Public, non-diagnostic educational and device-local self-care features may remain available. **HOLD** any claim of fully verified certificate issuance, backend-confirmed reporting, automated weekly monitoring, unrestricted private forum, or operational hospital referrals.

## Verified repository evidence

- Current main at review: `55dfebf909f156bd422cbc90d7e6740d7b3586f9`.
- Pages deployment [41630351450](https://github.com/speakoutMentalHealth/MindCheck/actions/runs/41630351450): success.
- Certificate published-UI privacy check [41630351618](https://github.com/speakoutMentalHealth/MindCheck/actions/runs/41630351618): success, **not backend minimization**.
- Youth gate [41630351597](https://github.com/speakoutMentalHealth/MindCheck/actions/runs/41630351597), legacy exposure [41630351835](https://github.com/speakoutMentalHealth/MindCheck/actions/runs/41630351835), report contract [41630351725](https://github.com/speakoutMentalHealth/MindCheck/actions/runs/41630351725): success.
- Community live read-only audit [41630351814](https://github.com/speakoutMentalHealth/MindCheck/actions/runs/41630351814): success, **not authenticated membership/moderation verification**.
- Connected Drive account has the older MindCheck Nigeria (Beta) spreadsheet, but no editable Google Apps Script project was found; do **not** assume that spreadsheet is the current authoritative backend.

This PR adds a public publication preflight that only uses GET and never creates records. Its results do not demonstrate report delivery, privacy of the Google Apps Script response, AI generation or official certificate eligibility.

## A. Programme lead: physical-device checks

- [ ] iPhone Safari first launch: select adult with an 18+ DOB, then select youth with under-18 DOB. Deliberately choose the wrong category once to verify the DOB routes to the correct experience. Continue button should be visible.
- [ ] Android Chrome: repeat, including small screen widths, enlarged text and accessible buttons.
- [ ] Install from the front door onto iPhone/Android Home Screen; relaunch and confirm app-like standalone experience and offline fallback.
- [ ] Mood check, My Buddy diary, saved tips, breathing and non-cash badges can be used, reloaded and cleared without false server-sync promises.
- [ ] Assessment Centre correctly labels external questionnaires, educational resources and not-yet-available tools.
- [ ] Check English and French on major pages; do not claim full Hausa, Igbo, Yoruba or Pidgin coverage without review.
- [ ] Urgent support and privacy information remain accessible without adult verification.

## B. Super Admin: real eligible adult AI test

- [ ] Open `https://speakoutmentalhealth.org/admin-mindcheck-access.html` with an authorized administrator.
- [ ] Use a **consenting synthetic test adult** in the portal with independently documented eligibility; approve the 30-day access grant. Ordinary MindCheck DOB selection and volunteer approval are not proof of adult eligibility.
- [ ] Sign in as that test adult, grant AI consent at `https://speakoutmentalhealth.org/mindcheck-access.html`, open MindCheck Guide, select a **public** topic, and click Explain with Gemini.
- [ ] Record whether the response actually says `source=gemini` on the server; prepared fallback is not AI generation. Do not send journal content, assessments or names.
- [ ] Verify denial, revoked grant, consent refusal and popup failure fall back safely. Document model, daily quota, owner and usage dashboard without conversation logging.

## C. Owner of Google Apps Script certificate backend

- [ ] In [script.google.com](https://script.google.com/home/projects), identify the active project(s) backing `certificate_issue`, `training_pass`, `verify_cert` and the old `award_claim` route; share editor access through Google's own permissions, never passwords or tokens in chat.
- [ ] Inventory active deployments, source records, editor permissions and a rollback version privately.
- [ ] With synthetic identity only, prove signup → course → assessment pass → server-authorized issuance → printable official certificate → matching verifier.
- [ ] Test invalid/mismatched/revoked certificate, unqualified user, duplicate issuance, outage and minimum fields returned by the **network endpoint** (not only what the page displays).
- [ ] Retire the old cash-claim backend case without deleting historic records.

## D. Owner of reporting and legacy services

- [ ] For [MindCheck #79](https://github.com/speakoutMentalHealth/MindCheck/issues/79), revoke the old browser-exposed check-in credential at the receiver; verify unauthorized and replayed writes are rejected.
- [ ] For [MindCheck #80](https://github.com/speakoutMentalHealth/MindCheck/issues/80), disable the former Summit SheetDB anonymous listing and verify with an unauthenticated request that no attendee rows are accessible.
- [ ] For the **separate safety concern form**, submit an approved synthetic report only: verify a persisted record, assigned receiver and notification/escalation, not just browser HTTP receipt.
- [ ] For [MindCheck #228](https://github.com/speakoutMentalHealth/MindCheck/issues/228), keep weekly monitoring local-only and export CSV using an approved secure channel. Do not reconnect browser-side credentials or `no-cors`. Implement authenticated/role-bound receipt only after backend tests and owner sign-off.

## E. GitHub administrator

- [ ] Enable `main` branch protection or ruleset: require reviewed pull requests, successful relevant checks, block force pushes; confirm Pages and emergency rollback workflow remain usable. At review `main` protection was **disabled**.
- [ ] Confirm a working site rollback, incident contacts, public version and post-deployment phone smoke test.

## Minimum evidence to mark an item complete

Each checkbox needs test date, responsible person, expected result and actual result with a link to non-sensitive evidence. Never put real reports, beneficiary data, credentials, production certificate IDs or private identity documents in GitHub.

Related roadmap: [MindCheck #161](https://github.com/speakoutMentalHealth/MindCheck/issues/161). Separate SpeakOut volunteer/forum gate: [portal #409](https://github.com/speakoutMentalHealth/speakout-landing-page/issues/409).
