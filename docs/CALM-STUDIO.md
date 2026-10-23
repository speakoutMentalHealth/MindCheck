# Calm space

MindCheck's existing Breathe home action now opens three activities in the same dialog: Breathe, Ground and Focus. SpeakOut TV is unchanged.

- Breathe retains the existing 4/6, 5/5 and 3/3 rhythms and 30/60/120-second sessions. The timer owns heart/orb expansion, ring progress, countdown and total-session progress. Pause, tab visibility and closing the dialog freeze the session. Settings remain expandable; the main console fits the tested mobile viewports. Expanded settings/guidance and enlarged text can scroll.
- Ground guides the existing optional five-senses exercise, with a large count, step indicators, back, skip and restart. Any sense can be skipped.
- Focus offers three general wellbeing prompts, then lets the user choose one small next step. It makes no diagnosis or treatment claim.

The three completion indicators apply only to the current page visit. Choices are kept only in memory, with no free-text fields, persistence or activity submission. Existing mood storage is unchanged. Completion is optional and carries no score or health interpretation.

Sound is off by default. The optional synthesized chime uses Web Audio only after a user enables it. It plays at breathing phase boundaries; switching activity, pausing, resetting, closing or hiding the page stops active notes. If sound is unavailable, visual guidance remains usable. No audio files are downloaded. Sound preferences are not saved across reloads.

`calm-studio.js` builds the shared activity shell around the original breathing markup. `mindcheck-smart-wellness.js` owns the breathing and grounding state and emits `mindcheck:breathphase`, `mindcheck:breathcomplete` and `mindcheck:groundstep`; payloads contain only the phase or step index. The new module must not start another breathing clock.

Non-clinical UI copy is provided in English, Hausa, Igbo, Yoruba, Pidgin and French; translations remain drafts requiring native-speaker review. The existing NHS breathing and NHS inform grounding links remain visible. This release does not add breath-hold challenges or heart/lung health scoring.

Validation: syntax/static release guards, breathing-studio smoke, compact-home smoke (including legacy locale regression), phone-experience smoke, full app browser smoke and calm-studio smoke. The latter tests activity state, completion, translations, layout, accessibility, no POSTs and opt-in audio routing using an AudioContext fixture. Listening to actual chimes on iPhone/Android remains a device check; these tests do not claim a physical phone installation.
