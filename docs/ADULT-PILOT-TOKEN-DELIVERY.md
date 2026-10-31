# Adult pilot token delivery

Development service only. Not connected to a public endpoint or live identity system.

Use `createPilotTokenService` only with trusted server adapters: authenticate the existing signed-in session; read a separately protected eligibility grant by authenticated subject; enforce issuance limits. Never accept an eligibility grant from the browser or infer it from volunteer approval. Record reviewer, verification method, verification time, expiry, adult eligibility and consent separately. No identity documents or mental-health content belong in the token.

Renewal calls the service again and rechecks current eligibility. Revocation prevents renewal; an already issued token can remain valid for up to five minutes. Immediate revocation would require an online check in the AI Worker.

Still required before activation:
- Confirm the portal's actual session verifier and server-only approval store.
- Implement restricted reviewer permissions and documented adult-verification criteria.
- Expose a no-store authenticated issuer endpoint with exact-origin/CSRF checks, throttling and operational logging without tokens.
- Connect a memory-only browser adapter to that issuer; acquire on demand, refresh before expiry, clear on logout, and fall back to prepared guidance on denial.
- Provision secrets and test signed-in eligible, unverified, underage, expired and revoked accounts end to end.

This module deliberately does not invent an authentication service or grant real people eligibility.
