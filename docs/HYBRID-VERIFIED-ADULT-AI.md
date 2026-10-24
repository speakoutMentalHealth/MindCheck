# Hybrid MindCheck AI — implementation and activation contract

**Status: development only. Not deployed.**

## Access model
- **Free, no login:** all approved, prepared platform guidance remains accessible in the appropriate age experience. No health data is required to read it.
- **Generated explanations:** server requires `GUIDE_REQUIRE_ADULT_TOKEN=true` and a valid, five-minute signed adult entitlement. Missing/invalid/expired tokens or missing/malformed configuration return prepared guidance. `GUIDE_REQUIRE_ADULT_TOKEN=false` does **not** authorize generation in the hybrid policy.
- **Children:** no generated AI access, even if they manipulate browser age flags. Server verifies a trusted entitlement independently.
- **Scope:** fixed platform-help topic and supported language only; no free-text symptoms, diagnosis, medication advice or personal history.

## Missing integration: trusted verification and token delivery
The existing `issueForVerifiedAdult` module is an internal boundary, **not a deployed verification provider**. It requires an authenticated principal whose age was independently verified and whose consent is approved. Do not make it callable from an unauthenticated public route or derive `ageVerified` from a DOB field.

Before enabling the generated-explanation button for verified adults:
1. Select and privacy-review a trusted adult eligibility provider and documented consent flow. Provide a separate non-AI path for people who do not verify.
2. Add a server-side identity/age-verification adapter and issuer endpoint with session authentication, CSRF and abuse controls, audited access decisions and no secret exposure.
3. Deliver the short-lived entitlement to the browser only in a protected, ephemeral authenticated context; never persist tokens in localStorage or URL parameters.
4. Update the guide UI to acquire a token on demand and attach `Authorization: Bearer <token>` for the fixed-topic request; if unavailable, keep the prepared answer and explain that verified access is required.
5. Test denial of minors, unverified and expired tokens, token forgery, issuer outage, and compromised browser flags; validate privacy and accessibility with human reviewers.
6. In Cloudflare, confirm `GUIDE_REQUIRE_ADULT_TOKEN=true`, `GUIDE_ENABLED=true`, `AGE_AUTH_SECRET` present (never copy its value), limiter and provider binding. Only an authorized operator may change production settings.

## Release safety
The server changes in this branch intentionally make Gemini unavailable to current anonymous browsers. **Do not merge or deploy this branch as a functional adult-AI launch** until the trusted issuer and browser flow are complete and approved. It may be reviewed as a server-side fail-closed implementation only.

Previous Cloudflare screenshots showed `GUIDE_ENABLED=true`, limiter 5/60, and operator reported `GUIDE_REQUIRE_ADULT_TOKEN` not listed. No production settings were changed by this branch.
