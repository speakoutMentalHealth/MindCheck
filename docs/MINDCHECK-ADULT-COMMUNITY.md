# MindCheck 18+ Community entry — integration and release gate

## Product placement

**SpeakOut Community belongs in the MindCheck adult (18+) experience**, not in the children's or teens' MindCheck area.

The integration adds:
- Adult home dashboard feature card **Community & Networking**.
- Adult header navigation **Community 18+**.
- `community.html`: a responsive, local MindCheck adult-community page showing six **conceptual** room areas, privacy and support limitations, and honest pre-launch status.
- `js/community-config.js`: launch-disabled handoff configuration to the SpeakOut portal's eventual real forum. `js/mc-community.js` refuses to expose the button unless enabled and linked to the exact approved destination.
- Shared MindCheck language selector, platform-quality skip navigation, age-navigation guard and adult guide eligibility prompt.
- Browser test for a minor's route, an adult's route, no disclosure of private room names or assessment data, app responsive viewport sizes and no forum POSTs.

## Important integration boundary

The adult DOB selection and sessionStorage in MindCheck are **navigation preferences only**, not legal age proof or secure authorization. The SpeakOut portal forum has a different system of adult account verification and administrator-scoped private-room grants. There is **no automatic federation**, health data export or MindCheck check-in transfer. The new MindCheck page does not query, display or store forum membership data.

The actual secure forum code remains in stacked, draft pull requests:
- [SpeakOut forum phase 1 PR #366](https://github.com/speakoutMentalHealth/speakout-landing-page/pull/366): administrator room creation/visibility/locking, all unpublished.
- [SpeakOut forum phase 2 PR #367](https://github.com/speakoutMentalHealth/speakout-landing-page/pull/367): eligible adult membership, private-room grants, moderated topics, replies and abuse reports, still unpublished.
- [Forum project #365](https://github.com/speakoutMentalHealth/speakout-landing-page/issues/365) for safeguarding and acceptance gates.

## MVP room concepts, not authorized private-room inventory

Welcome & Announcements; Learning & ICT; Career & Opportunities; Networking & Mentorship; Projects & Volunteering; Private Group Rooms. The last label is generic to avoid exposing protected room membership or names.

## Pre-release checklist

- [ ] Run `node scripts/adult-community-smoke.cjs` in Playwright setup.
- [ ] Run existing MindCheck age-entry smoke, all-pages locale, accessibility and platform-quality suites.
- [ ] Confirm under-18 MindCheck page contains **no links** or entry controls for the adult community; direct `community.html` navigates unconfirmed/youth sessions back through the adult-choice gate.
- [ ] Confirm no GET/POST request to SpeakOut forum while community handoff `enabled: false`.
- [ ] Confirm no sensitive MindCheck data is accessible to community page or transferred to the forum.
- [ ] Review descriptions and translated copy before broad public launch (the page is primarily English; existing language switch tells readers where page-specific translations are pending).
- [ ] Verify adult forum backend authorisation and private-room isolation through Firebase emulator and real staging, including no access from unverified/pending portal accounts.
- [ ] Appoint qualified moderation lead and backup and validate abuse/crisis escalation plan and cross-border/privacy notice.
- [ ] Confirm verified production forum destination and deployment with its own release review.
- [ ] Only then turn on the community handoff through a separate, reviewed configuration change. Do not treat this front-end switch as authorization.

Do not change age-entry gating, activate public posting or merge unfinished backend forum PRs merely to expose a link.

## Hands-on room testing before the real forum launches

1. Open the MindCheck 18+ Community page.
2. Select **Try room** beside any of the six planned spaces.
3. In the dedicated `community-preview.html?room=...` sandbox, browse example threads, filter discussions, submit an example topic or reply and inspect the simulated moderator queue.
4. Select **Show demo moderation queue**, then approve/remove the pending sample item. Test the report interaction.
5. Refresh the page and confirm example submissions have disappeared. The sandbox never imports Firebase, writes private MindCheck records, requests user identity or sends a forum POST.
6. If no rooms are visible on the **real** SpeakOut `forum.html`, this is currently expected: the Firestore rule `forumRoomValid()` requires `published == false` for all browser-created/updated room documents. Signing in or editing client-side feature flags cannot bypass it.

### Real forum pilot prerequisites

- Use a separate, explicitly selected **staging Firebase project**. Never connect a production browser session to emulator permissions or seed a live production database with examples.
- Create a few fictional staging room documents and synthetic approved-adult account grants; use scoped moderator assignments. The existing Firestore security emulator suite already seeds hypothetical published rooms for rule verification.
- Confirm a verifiable adult enrolment procedure, one lead moderator and backup, reporting escalation and safe data deletion/retention; keep assessment, check-in and school records entirely independent.
- Deploy required forum Firestore indexes, authorise **staging-only** room publication using audited administrative controls and verify forum topic/reply queries with real staging accounts.
- After end-to-end staged moderation succeeds, plan a separately reviewed, explicit production publish capability. Until then the production public forum remains closed.

A UX demo is useful for layout and interaction feedback; it **does not** certify real account security, moderation operations or the production data pipeline.
