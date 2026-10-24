# Phase 1: production safety and operational acceptance

Status: **OPEN — not a safeguarding, legal, security, or clinical sign-off.**

This checklist applies to the existing login-free MindCheck experience. DOB routing is a convenience, **not age verification**. Do not claim restricted APIs are reliably adult-only on the strength of browser flags.

## Automated regression gate
- [x] Add a continuously enforced test for youth page structure, no personal-data forms, no browser-side network submission, age-navigation checks on known adult-sensitive pages, and basic keyboard/timer affordances.
- [ ] Confirm CI success on the exact reviewed commit and repeat on deployed `main`.
- [ ] Test real browsers and server endpoints separately; static tests alone are not authorization or privacy audits.

## Must independently verify before safety-sensitive expansion
- [ ] **Reporting:** authorized owner identifies the Apps Script receiver and destination, then verifies one nonidentifying synthetic submission through storage, notification, and human-response escalation. Do not send beneficiary details for testing.
- [ ] **Service coverage:** designate a trained report response owner, documented hours/timezone, backup contact, escalation steps, and a clearly displayed no-continuous-monitoring statement.
- [ ] **Child safety:** qualified child/adolescent mental-health reviewer signs off content, under-6 suitability, emergency language, support contacts and culturally sensitive wording. Safeguarding lead signs off abuse disclosures, unsafe caregivers, referrals and reporting obligations.
- [ ] **Privacy/legal:** review Nigerian and other applicable child data and privacy requirements, third-party analytics/ads on youth routes, and whether existing consent/age practices are appropriate. Do not introduce youth data collection before review.
- [ ] **AI/API:** audit guide worker deployments for `GUIDE_REQUIRE_ADULT_TOKEN` and trusted token issuance. Client `adult:true` and Origin headers do not establish trusted age authorization. If no trusted issuer exists, restrict the service to education and do not market as secure adult-only access.
- [ ] **Legacy access:** inventory previous Apps Script/SheetDB/Worker URLs and revoke credentials only with authenticated owner approval and a rollback plan. Preserve required historical records.
- [ ] **Real devices:** test physical iPhone Safari, Android Chrome, keyboard, VoiceOver/TalkBack, zoom, screen-reader status, offline/online recovery and service worker updates.
- [ ] **Languages:** human reviewers sign off five translated locales; age entry and youth routes require separate localization coverage.

## Release decision
A passing regression job permits engineering review, **not** clinical, legal, or youth AI authorization. The independent sign-off items above remain open unless supporting evidence, reviewer and date are recorded.

## Rollback
For static GitHub Pages releases, maintain the previous good `main` commit SHA and document an authorized revert or forward-fix. Confirm published build plus smoke tests, not only the merge result.
