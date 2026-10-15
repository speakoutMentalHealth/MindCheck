# Retire the legacy cash-claim backend

**Decision (October 2026):** MindCheck offers digital badges for 20-day check-in streaks. It does **not** offer cash payments or a cash-claim process. The main website removed payout controls in PR #92.

**Scope:** This is a controlled change to the Google Apps Script project. The Apps Script source is **not** hosted in this GitHub repository; changes to this document do not modify the live backend.

## Recommended Apps Script change

In the Apps Script editor project that owns the current backend, replace the `award_claim` case in `doPost`:

```javascript
case 'award_claim': return _handleAwardClaim_(b);
```

with the following explicit, safe response:

```javascript
case 'award_claim':
  return _json_({ok:false, error:'cash_claims_retired'});
```

Then **remove the obsolete `_handleAwardClaim_(b)` function** after confirming there are no legitimate administrative callers using it. Do not erase existing `awards` spreadsheet records until the organization's retention, audit and any outstanding obligations have been reviewed. The obsolete claim endpoint should never mark a payment status, even if a caller knows an old API secret.

Do **not** replace `award_claim` with a badge-writing endpoint. Badges unlock locally in `index.html` and cannot be redeemed for cash.

Leave these routes untouched: `checkin`, `certificate_issue`, `training_pass`, `monitoring_week`, `certificate_view`, and the public GET routes `assessment`, `certificate`, `verify_cert`. Existing check-in authentication remains a separate security issue (#79), not solved by this patch.

## Safe release checklist

1. Identify which Apps Script deployment is used for mood check-ins and any administrative callers; don't assume a deployment is in use based solely on its name.
2. Save a copy of the working version for rollback.
3. Apply this change to a **test deployment**, not the live one.
4. Test an authorized **synthetic** `award_claim` POST. It must return `{"ok":false,"error":"cash_claims_retired"}`; the `awards` sheet must remain unchanged.
5. Test that normal check-in logging still works and prevents duplicate submissions. Avoid any real patient mood records in test calls.
6. Confirm official assessment, issuance and verification still behave normally; do not create real certificates for testing.
7. Deploy a new version to the **correct** live deployment only after the above tests pass, and record deployment/version details privately.
8. Reconfirm no cash-claim controls or amounts appear in the public website and that the 20-day badge still unlocks. Check the site offline/PWA cache refresh.

## Note on confidentiality and old claims

The existing spreadsheet may contain historic `awards` rows including a `claimed` flag. Those records do **not** establish payment, authorization, or eligibility. Preserve them pending a records review; do not silently relabel historical payments or delete records. If any monetary promise was previously made to real users, the organization should assess any outstanding commitments before changing policy retrospectively.

## Sign-off

- [ ] Backend owner confirms no external workflows still use `award_claim`
- [ ] Test deployment returns `cash_claims_retired` for synthetic claim
- [ ] Awards rows are not modified by retired claim requests
- [ ] Normal mood check-ins and official certificates still work
- [ ] Correct live deployment updated and smoke-tested
- [ ] Issue #81 updated to reflect badge-only policy and separate certificate verification
