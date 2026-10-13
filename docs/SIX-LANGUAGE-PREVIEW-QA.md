# Six-language preview acceptance

**Scope:** Non-clinical MindCheck interface only. This PR is not approval of clinical translations.

## Static review
- [x] Six language choices appear in `index.html`: en, ha, ig, yo, pcm, fr.
- [x] Five dashboard navigation headings and accessible labels update for each selected language.
- [x] The selection calls `MindCheckLocale.apply` and persists `mc_lang`.
- [x] Dashboard includes a way to change language.
- [x] A prominent notice identifies untranslated clinical and certificate content.
- [x] `sw.js` includes the localization module in its cache and uses a new cache name.
- [x] Existing Tally form URL and certificate verification service are not modified.

## Browser tests required before merge
- [ ] First visit: English works and language options are keyboard accessible.
- [ ] For each of six languages: choose it, verify welcome/notice, reload, revisit selector, switch back to English.
- [ ] Mobile: all six options fit without overlap or clipped controls.
- [ ] Test offline reload after a fresh online visit, and upgrade from a previously installed service worker.
- [ ] Confirm the external screening form remains explicitly in its source language and its original functionality is unchanged.
- [ ] Confirm no change to certificate issuance, verification, privacy or referrals.
- [ ] Native-speaker reviewers approve all public Hausa, Igbo, Yoruba, Pidgin and French text.

**Known limitation:** The language chooser, welcome heading, five navigation headings, and untranslated-content notice are localized. Most dashboard descriptions, assessments, referrals and certificates remain English. All translations require native-speaker review. Do not present this preview as a fully translated app or merge as a completed multilingual release.
