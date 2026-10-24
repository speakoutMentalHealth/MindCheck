# Legacy integration inventory and incident recovery — Stage 5

Status: **frontend regression checks implemented; external backend risk not independently resolved**.

## Security boundaries
GitHub Pages is public/static. Any access token embedded in HTML or JavaScript is exposed to site visitors and cannot authorize a private operation. Referrer or Origin validation alone is not authorization. The frontend no longer advertises legacy cash claims or attendee-list access, but the **backend endpoints can remain reachable** until disabled by their owners.

## Inventory and acceptance
| Legacy service | Frontend state | Required owner-side verification |
| --- | --- | --- |
| Old mood/check-in Google Apps Script | Current wellbeing progress is primarily device-local | Review old browser-exposed credential; rotate/revoke in the actual Apps Script editor, validate no active legitimate clients, and test unauthorized writes are rejected |
| Retired cash claim/award operation | No cash payout option in current public UI | Confirm `award_claim` explicitly denies payout attempts on the deployed receiver; preserve history |
| Paused Leadership Summit SheetDB | Public certificate portal paused | Confirm from an unauthenticated session that private attendee lists are not returned, without dumping records |
| Certificate issuance and verification Apps Script | Public verification UI exists | Confirm trusted issuance, revocation, minimum public response, and authorization with synthetic records |
| Safety report Apps Script | Frontend receipt validation under review | Verify one nonidentifying synthetic report was stored, notified and assigned to a trained responder |
| Weekly monitoring receiver | Local backup and unconfirmed remote send | Verify owner, access restrictions, receiver rows and retry procedure |

## Private operator-only inventory
Record service owner, deployment/version, last active client, credential location, access roles, alert owner, recovery contact, last tested rollback, and retention/legal obligations **outside the public repository**. Never commit deployment secrets, spreadsheet IDs, private endpoint keys or beneficiary records.

## Incident response
1. **Detect:** gather only minimal error category, service name, time and deployment version; avoid health data or report bodies.
2. **Triage:** separate frontend UI breakage, receiver outage, authorization failure, confidentiality incident and clinical/safeguarding event.
3. **Contain:** only authorized operators can restrict access or revoke a backend credential; preserve audit logs and historical records.
4. **Recover:** use a reviewed previous version or revert with a documented owner; verify clean reload, real-device navigation and a controlled synthetic acceptance test.
5. **Communicate:** give users accurate service-availability wording; do not claim responses were received or cases are monitored when uncertain.
6. **Close:** document detection time, affected service, mitigation, verification evidence, reviewer and preventive regression test.

## Release gate
- New CI guard prevents selected deprecated public frontend integrations from reappearing.
- A passing CI run **does not** scan every file, test private APIs, audit external access or prove operational recovery.
- Complete external console review and human sign-off before marking legacy credentials or private data exposure remediated.
