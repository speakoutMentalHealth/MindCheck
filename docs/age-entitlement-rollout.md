# Adult entitlement rollout: implementation checklist

The guide worker now has an optional signed-token verification gate, controlled by `GUIDE_REQUIRE_ADULT_TOKEN`. It is **not** a complete login system. Never set `AGE_AUTH_SECRET` in client JavaScript, repository files, or public build variables.

## Provisioning prerequisites
- Choose and integrate a trusted identity/session provider; confirm ownership and revocation procedures.
- Establish server-side age-band determination and an appropriate consent workflow. Do not issue an adult entitlement solely because the client sends `adult:true` or a DOB string.
- Keep the token signing secret in the worker's secret store. Use a distinct high-entropy secret for each environment and rotate it under an approved process.
- Implement a server-side entitlement issuer that binds the signed adult claim to an authenticated subject and issues short-lived credentials only after approved verification.
- Define safe token transport and renewal. Bearer tokens in browser storage are vulnerable to script compromise; evaluate HttpOnly, Secure, SameSite session cookies and CSRF controls for the eventual deployment architecture.
- Extend protection to every restricted assessment, result, report and AI endpoint. A guide-only gate is insufficient.

## Rollout sequence
1. Test the token issuer and verification using non-production accounts and a separate staging secret.
2. Confirm invalid, expired, replayed-after-revocation, missing and forged credentials are denied. Current stateless tokens do not support immediate revocation: use short lifetimes or add server-side revocation.
3. Deploy the updated guide worker to staging with `GUIDE_REQUIRE_ADULT_TOKEN=true`; verify that unauthenticated calls fail closed and approved adult sessions work.
4. Complete youth consent, clinical content review, safety escalation, privacy notices and accessibility checks.
5. Perform penetration/security review, review logs for sensitive data, and confirm rollback before any production release.

**Do not enable the gate on the current public frontend without an issuer and updated client:** it would block all AI guide requests. **Do not leave the gate disabled and claim the service is age-secure.**
