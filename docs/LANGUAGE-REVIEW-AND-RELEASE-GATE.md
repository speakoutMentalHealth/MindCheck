# MindCheck language review and browser release gate

## Language reviewers
One competent reviewer per language: Hausa (ha), Igbo (ig), Yoruba (yo), Nigerian Pidgin (pcm), French (fr). English is the source.

Review `js/mindcheck-i18n.js` against the actual UI. Confirm natural wording, appropriate mental-health terminology, accents/diacritics, mobile-length text, and that **clinical screening questionnaires remain in English**. Record reviewer name, date, language, corrections and approval in the PR before release.

| Language | Reviewer | Review date | Approved |
|---|---|---|---|
| Hausa | Pending | — | No |
| Igbo | Pending | — | No |
| Yoruba | Pending | — | No |
| Nigerian Pidgin | Pending | — | No |
| French | Pending | — | No |

## Browser and responsive acceptance
Test on desktop Chrome and mobile Safari/Chrome at widths 320, 375, 390, 768 and 1280px. For each language:
1. Open a clean session, start MindCheck, select the language.
2. Confirm the selected language appears in the welcome and dashboard labels and the untranslated-content notice is visible for non-English languages.
3. Reload; verify `mc_lang` persists and that the chosen labels remain correct.
4. Change language back to English; confirm labels and `document.documentElement.lang` update.
5. Confirm all six buttons can be reached by keyboard, labels are visible, and no horizontal overflow or overlap occurs.
6. Open the existing screening link and certificate verification, ensuring their existing behavior is unchanged; do not submit clinical data in tests.
7. Repeat once with service-worker caching active and after refresh.

**Status:** Browser/mobile execution and human language approvals are NOT complete. No live release approval.
