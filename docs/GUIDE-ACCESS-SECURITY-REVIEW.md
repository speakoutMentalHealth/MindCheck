# Guide AI authorization boundary — Phase 1

Status: **engineering security improvement proposed; not production authorization sign-off**.

## Findings
- The client sends `adult: true`, but a user or script can forge it.
- The Origin restriction is browser CORS hygiene, **not** proof of identity or adulthood.
- The backend accepts signed adult entitlements only when `GUIDE_REQUIRE_ADULT_TOKEN=true`; the repository has an issuer boundary but no deployed trusted login-free age verifier.
- The education-only prepared answers remain a safer fallback; they do not require a generative request.

## Fail-closed provider policy
The proposed Worker changes require the adult-token *mode* to be explicitly configured. If `GUIDE_REQUIRE_ADULT_TOKEN` is absent or misspelled, return a prepared educational answer with reason `authorization` instead of calling the AI provider.
- `true`: signed, short-lived server-verifiable token required; missing/invalid tokens return HTTP 403.
- `false`: **explicit pilot exception** permitting only existing fixed-topic educational AI requests. This is not secure adult-only API access and is not approved for unreviewed youth exposure.
- unset/other: no generated AI; prepared answers remain usable.

This is a configuration safeguard, **not age verification**. Any production setting of `false` requires explicit owner acceptance of the risk and separate clinical/security review.

## Verification required
1. CI confirms malformed/unset token mode never calls the provider, and `true` rejects missing/invalid tokens.
2. Inspect Cloudflare production variables with authorized owner access; repository configuration alone does not reveal live settings.
3. Confirm fallback and the optional AI button's status wording are accurate in an ordinary browser.
4. Never enable child chat, diagnosis or unvalidated triage; maintain fixed educational topics.
5. Verify rate limits and abuse protections against a controlled staging environment before expanded use.

No deployment, secret rotation, or live configuration changes are included in this PR.

## Production configuration evidence — 24 October 2026

The operator supplied Cloudflare dashboard screenshots showing `GUIDE_ENABLED=true` and `GUIDE_LIMITER` configured to 5 requests per 60 seconds, and separately confirmed `GUIDE_REQUIRE_ADULT_TOKEN` was **not listed**. This does not establish the exact live deployed code version or any trusted age-issuer. Do not assume the candidate's fail-closed guard is already running in production.

**Safe deployment sequencing:**
1. Keep the PR draft while verifying existing production deployment and its actual behavior. Do not submit health or child data as a test.
2. After an authorized, reviewed release of the fail-closed Worker, missing `GUIDE_REQUIRE_ADULT_TOKEN` must result in prepared educational fallback rather than a Gemini call; confirm with a fixed platform topic only.
3. Do **not** set `GUIDE_REQUIRE_ADULT_TOKEN=true` as a shortcut: the current browser does not request or attach signed tokens and the issuer module is not a deployed identity/age verification service. This would block Gemini for ordinary users.
4. Do **not** set `GUIDE_REQUIRE_ADULT_TOKEN=false` merely to restore generation; that is an explicit unauthenticated pilot exception requiring owner acceptance, education-only scope and safeguarding review.
5. A functional adult-only AI launch requires a trusted eligibility/consent verifier, server-only token issuer, browser delivery and renewal, verified-denial tests for youth/expired/forged tokens, and privacy review. Do not use self-entered DOB or browser flags as independent age proof.

**No Cloudflare settings were modified by this PR.**
