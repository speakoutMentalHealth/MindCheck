# Section 2 — MindCheck launch acceptance checklist

Status: **review required**. This document is an audit checklist, not evidence that interactive tests passed. Do not change working production assessment or certificate issuance during this audit.

## 1. Screening functionality (critical)
- [ ] On a fresh mobile browser, complete WHO-5, PHQ-9, GAD-7 and PSS-10 with representative responses.
- [ ] Confirm scoring and interpretation against each instrument's approved guidance, including reverse-coded questions and missing-answer handling.
- [ ] Confirm results are clearly **screening information, not a diagnosis**; no treatment or medical certainty is implied.
- [ ] Confirm PHQ-9 self-harm responses trigger a compassionate immediate-safety pathway, without waiting for score thresholds or volunteers.
- [ ] Confirm no identifiable screening answers leak into analytics, query strings, public logs or other users' accounts.

## 2. Certificates and verification (critical)
- [ ] Issue a test certificate from the authorized training workflow only after its actual passing and eligibility conditions.
- [ ] Check ID, recipient, issue date, issuer, QR destination, signature, logo and A4 print layout.
- [ ] Verify the issued certificate through `verify.html` using the same ID.
- [ ] Confirm an invalid or altered ID is rejected and backend authorization prevents arbitrary certificate creation.
- [ ] Confirm repeated requests and enumeration attempts are rate-limited **server-side**; front-end limits alone are insufficient.
- [ ] Confirm public verification reveals only the minimum necessary recipient information and does not expose unrelated records.
- [ ] Confirm certificates are not represented as professional clinical licences.

## 3. Privacy and safeguarding (critical)
- [ ] Compare `privacy.html` to actual browser storage, analytics, certificate records, backend logs and third-party processors.
- [ ] Document concrete retention periods, lawful basis, contact for data requests, access controls and deletion/correction procedures.
- [ ] Verify age-appropriate school safeguards, consent/assent arrangements and escalation to approved safeguarding leads.
- [ ] Test authentication/permissions so volunteers cannot read personal screening data outside their authorized role.
- [ ] Ensure sensitive disclosures are not automatically forwarded to public or shared WhatsApp groups.

## 4. Referral and urgent help (critical)
- [ ] Confirm `resources.html` prominently distinguishes emergencies from non-emergency guidance.
- [ ] Confirm emergency number 112 is correctly scoped to Nigeria; users elsewhere must use local emergency services.
- [ ] Verify current contact details and availability with every listed clinic/referral provider; stale entries must be marked or removed.
- [ ] Confirm SpeakOut volunteers are described as guidance/referral support, not emergency responders or clinicians.
- [ ] Test crisis actions on mobile, including offline/failed-network behaviour and accessible keyboard navigation.

## 5. Release decision
- [ ] All critical checks have named tester, test date, evidence and outcome.
- [ ] Any failures have an owner, fix, retest and rollback plan.
- [ ] Confirm no regression to production training, assessment, issuance or verification.
- [ ] Sign off public launch only after the above acceptance evidence is recorded.

### Observed code and public-page evidence (2026-10-13)
- `index.html` states screenings are not diagnoses and includes emergency guidance.
- `verify.html` calls a Google Apps Script endpoint with `type=verify_cert`; this source review does **not** establish backend access control, rate limiting, or successful issuance.
- `privacy.html` describes local storage and certificate data; actual retention and backend practices need verification.
- `resources.html` lists Nigerian referral options; phone numbers and service availability require independent confirmation.
- Do not publish test identities, sensitive screening responses, API credentials or certificate secrets in this repository.

### Screening implementation boundary — confirmed in source review
- The homepage's `goScreenings` click handler sets `formFrame.src` to `https://tally.so/r/w2QbOV`. Questionnaire definitions, scoring, consent and data routing are controlled outside this GitHub repository.
- **Launch blocker until independently checked:** inspect the actual Tally form, its calculations, consent notice, notification recipients, data exports and self-harm response path. Do not infer these from the four screening names displayed on the homepage.
- Use synthetic test responses only; do not enter real student health data during acceptance testing.
- Record the responsible form administrator and clinical/safeguarding reviewer before sign-off. Keep access tokens and respondent records out of GitHub.
