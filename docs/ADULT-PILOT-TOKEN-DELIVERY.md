# Adult pilot access rollout

The portal implements Firebase-authenticated status and token endpoints at `/v1/mindcheck/status` and `/v1/mindcheck/token`, plus Super Admin access review at `/v1/admin/mindcheck/access`. Eligibility lives in server-owned `mindcheckAdultAccess/{uid}` records, separate from volunteer/forum approval. Approval lasts 30 days, requires documented adult evidence, and does not imply AI consent. The adult confirms consent in the portal window. No IDs or health information are collected by this flow.

The MindCheck guide opens `https://speakoutmentalhealth.org/mindcheck-access.html` with a random correlation ID. Only messages from that exact origin, popup source and request ID are accepted. Tokens stay in memory and are issued on demand. Already signed-in users with recorded consent return automatically. A new token rechecks current approval and consent. Popup blocking, denial and expiry fall back to prepared guidance. Issued tokens remain valid at most five minutes after revocation.

Super Admin review page: `https://speakoutmentalhealth.org/admin-mindcheck-access.html`. Actual verified adults must be reviewed by the operator; this release does not grant real accounts access automatically.

Production requires matching AGE_AUTH_SECRET bindings on the platform and guide Workers, deployed authenticated routes, and hosting the portal pages. The coordinated portal workflow provisions a matching random signing key without exposing it and deploys pinned guide source with adult-token enforcement. Never deploy the old guide workflow without its revised source pin.

Tests use synthetic identities, tokens and intercepted network. A real signed-in eligible adult and actual provider answer still require operator validation; deployment success alone does not establish successful real-user AI use.
