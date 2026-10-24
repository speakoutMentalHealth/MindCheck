# Phase 1 limited engineering release — owner preflight

**Decision:** engineering candidate passes automated tests, but **production release is on hold pending configuration and operator review**. This checklist is not a claim of safeguarding or clinical readiness.

## 1. Cloudflare AI Worker: production gate
A source `wrangler.jsonc` default of `GUIDE_ENABLED=false` is **not evidence of the deployed setting**. Previous activation notes describe a separate production override. A missing or misspelled `GUIDE_REQUIRE_ADULT_TOKEN` now falls back to prepared content, but the explicitly configured value `false` permits the unauthenticated educational AI pilot. The browser's `adult:true` is not reliable age proof.

An authorized Cloudflare Worker operator must inspect the **deployed** `mindcheck-guide` configuration and record only the flag values, deployment/version and reviewer/date (never secrets):
- `GUIDE_ENABLED`: `true` or `false`.
- `GUIDE_REQUIRE_ADULT_TOKEN`: `true`, `false`, missing or invalid.
- Trusted issuer available and independently verifies adult eligibility? **Yes/No**. Do not infer this from signed token verification alone.
- Provider key binding exists? **Yes/No only**. Do not copy the key.

**Release rule:** do not describe the AI endpoint as adult-restricted unless a trusted issuer is deployed and verified. If AI must be disabled pending review, authorized operator sets `GUIDE_ENABLED=false` in the actual deployment and confirms prepared fallback behavior. If explicitly operating a reviewed unauthenticated education-only pilot, document that exception and its limitations; do not enable sensitive free-text prompts, clinical triage, personal health records or child access.

## 2. Public site release scope
Confirm the candidate changes only youth safety tests, adult guide configuration fallback, reporting receipt interpretation, legacy regression checks and accompanying documentation. No backend API deployment, credential rotation or clinical workflow changes are included. Retain visible reporting non-continuous-monitoring and urgent-help language.

## 3. Operational release conditions
- [x] Six combined CI checks passed on commit `2466522f19263a1874177c3814f67509a648c3a4`.
- [ ] Repeat six checks on the final head after documentation updates.
- [ ] Cloudflare operator records actual AI flag values and trusted issuer status.
- [ ] Product owner approves a limited engineering-only release and its public messaging.
- [ ] Safeguarding owner confirms no new clinical or youth capability is activated.
- [ ] Operator records current good production SHA and rollback contact.
- [ ] Following approved merge, check published pages and rerun smoke tests on deployed version.

**Separate operational blockers:** report destination/notification ownership, legacy credential revocation, independent youth/clinical review, translations and physical-device accessibility still require dedicated acceptance. Do not mark those complete based on this release.

## 4. Rollback
Keep the pre-release `main` commit SHA. If new frontend behavior regresses, revert the authorized merge and verify the published service worker cache and critical pages. Worker configuration rollback is separate and must be performed in Cloudflare by an authorized operator. Never put production secrets into GitHub.
