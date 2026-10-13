# MindCheck Premium Experience — implementation and QA plan

Status: Development only. No production deployment authorized by this document.

## Baseline
Based on `feat/mindcheck-premium-first-impression-20261013`, which was 2 commits ahead of `main` at inspection. Another branch, `feat/mindcheck-premium-ui-20261013`, was 1 commit ahead; both touch `index.html`.

## Guardrails
- Do not change assessment scoring, crisis pathways, certificate verification, rewards, or external integration endpoints.
- Keep existing locale identifiers and translation fallbacks; do not represent untranslated text as fully localized.
- Avoid new third-party tracking, sensitive mood analytics, or default cloud persistence.
- Keep Google Apps Script security work deferred pending access.

## Implementation order
1. Inventory current DOM IDs, inline handlers, navigation and locale dictionaries in `index.html`; capture mobile/desktop screenshots.
2. Extract and consolidate visual tokens and page-scoped styles without changing event handlers.
3. Improve welcome/onboarding with clear privacy notice, skip path, and language control.
4. Upgrade mood check-in with accessible labeled options, nonjudgmental copy and explicit save behavior.
5. Improve wellness dashboard information hierarchy and navigation; respect reduced-motion preferences.
6. Audit all six languages, keyboard navigation, contrast, screen readers, and narrow-screen overflow.

## Required verification before merge
- Existing assessments, certificates, rewards, crisis resources and integrations pass regression checks.
- All six language paths checked for untranslated controls and text overflow.
- 320px mobile, 390px mobile, tablet and desktop layouts checked.
- Keyboard-only, visible focus, screen reader labels, reduced-motion and WCAG AA contrast reviewed.
- No new unexpected network requests or sensitive-data transmission.
- Preview reviewed and PR approved before merge or deployment.

## Known limitations
This plan records implementation intent and does not claim that the UI redesign or regression tests have been completed.
