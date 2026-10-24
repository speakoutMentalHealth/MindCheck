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
