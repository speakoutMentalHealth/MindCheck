# MindCheck platform quality audit — 23 October 2026

This release addresses observed usability and reliability defects. It is not a clinical validation, legal compliance certification or proof of live backend delivery.

## Changes

| Area | Observed problem | Result |
| --- | --- | --- |
| Learning routes | Three copied catalogues imported absent Firebase/auth files and linked to absent dashboards | Clear, accessible handoffs to the active SpeakOut library, SpeakHub and young-learner services; no cross-origin auth/config duplication |
| Contribution/partner routes | Missing contribution destinations, login routes and logo files | Existing contribution guide and verified portal paths used; unknown missing sponsor artwork removed rather than substituted |
| Certificates | Legacy provisional document accepted names/scores from URL and displayed a signature | Page now leads to official record lookup; practice exam feedback explicitly remains unverified and cannot mint an official certificate |
| Local progress | Valid JSON with invalid shapes could stop startup; a quota failure could save only part of a mood check-in | Defensive reads, validation of records, rollback of the mood/history/points/streak write group and usable resource links when storage is blocked |
| Reporting | An acknowledged report could be described as failed if a local badge write threw | Removed badge/storage dependency; strict receipt parsing, duplicate-submit guard, bounded response read and retained text on an unconfirmed attempt. No test report sent to the real backend |
| Mobile/accessibility | Certificate width, monitoring table, reporting steps, unnamed progress indicator and unreadable legacy text | Responsive layouts, keyboard-scrollable table, appropriate progress semantics, readable text and skip-to-content access |
| Privacy | No explicit controls for on-device wellbeing progress | Six-language private JSON download and reviewed local deletion; allowlisted wellbeing keys only. Account credentials, identifiers, training records and submitted/operational reports are excluded |
| Recovery | Blocking developer alert exposed technical errors | Dismissible plain-language recovery and offline notices; no automatic refresh or transmission of errors |
| Ecosystem navigation | Fixed blue platform switcher covered homepage content | SpeakOut/TV/website links now live in the existing home footer and open on request |
| Installation/offline | Blue launch metadata did not match the current app; query shortcuts lacked a cached-shell fallback | Matching launch colours, mood/calm/assessment shortcuts, cached app assets and working offline Calm space routing |

## Evidence

- All 39 root public HTML pages have existing local link/asset destinations, no detected horizontal overflow at 390px, no startup script errors, no blocking alerts and no serious/critical violations in the automated WCAG 2 A/AA and 2.1 AA checks.
- Focused 320px checks cover certificates, report, monitoring, privacy and learning handoffs. Expanded data tables scroll within their own region.
- Browser fixtures cover corrupted/blocked storage and rollback after a quota error, privacy export exclusions, cancelled/confirmed deletion, six-language controls, recoverable notices, intercepted report responses and duplicate submissions.
- A real local service worker installation activates the new cache and opens/starts Calm space while offline. External destinations still require internet.
- Existing responsive app, language, phone, monitoring and analytics-privacy suites are part of release verification. Additional scene/translation tests remain in CI.

Automated checks do not establish complete accessibility for every assistive technology, prove audio playback on a physical phone, validate translation quality or verify external service availability. Clinical source questionnaires remain in their approved source language.

## Outstanding acceptance

1. **Report receiver:** inspect the receiving Apps Script editor project, destination register and intended notification path, then match one authorised synthetic test marker end to end. No report containing a real beneficiary's information is needed.
2. **Support operations:** confirm support days/hours/timezone, response owner and active referral agreements before promising availability.
3. **Legacy access:** owner-console review/revocation for obsolete check-in, cash-claim and paused certificate data services remains necessary. Do not delete historic records or enumerate private data.
4. **Training/certificates:** an actual authorised signup → course → verified certificate journey is separate from the local practice exam and requires service-owner access. No real credential or certificate was created during this audit.
5. **Human review:** native-speaker review of draft interface translations and physical iPhone/Android acceptance remain valuable. The local data file is private and should be handled accordingly.

The owner’s earlier admin screenshots already confirmed traffic/sign-in reporting; this release does not require replacing analytics credentials.
