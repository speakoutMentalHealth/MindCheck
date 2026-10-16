# MindCheck native-app experience — release acceptance

**Platform:** Installable Progressive Web App (PWA), not a compiled iOS/Android native binary.

## Verification levels
- **Automated:** Chromium responsive navigation, core Mood/Wellness, assessment page layout, JavaScript errors, basic install metadata.
- **Physical device pending:** iPhone Safari Add to Home Screen and standalone launch; Chrome on iOS; Android Chrome installation and launch; orientation, keyboard, scroll, notch/home-indicator spacing, tap responses; offline/reconnect and post-update behavior.
- **Functional/clinical pending:** End-to-end manual assessment completeness, privacy checks, referral consent and approved facility intake. Do **not** enable referrals until facilities approve.
- **Accessibility pending:** VoiceOver and TalkBack, dynamic text enlargement, keyboard, WCAG review.
- **Performance pending:** Repeatable real-device cold/warm launch metrics, slow network, crash/error reporting.

## Acceptance threshold
Do not label as *fully verified* until all applicable device and feature cases pass, any critical defects are fixed, screenshots/results are recorded, and an explicit release decision is documented.

## Real-device sign-off matrix
| Target | Install/launch | Six tabs | Assessments | Offline/reconnect | Accessibility | Result |
|---|---|---|---|---|---|---|
| iPhone Safari (current iOS) | Pending | Pending | Pending | Pending | Pending | NOT VERIFIED |
| iPhone Chrome (current iOS) | Pending | Pending | Pending | Pending | Pending | NOT VERIFIED |
| Android Chrome (current Android) | Pending | Pending | Pending | Pending | Pending | NOT VERIFIED |
| Windows/macOS desktop | N/A | Pending | Pending | Pending | Pending | NOT VERIFIED |

Automated browser emulation is **not** a substitute for physical-device sign-off. Do not store patient responses or identifiable health information in QA evidence.
