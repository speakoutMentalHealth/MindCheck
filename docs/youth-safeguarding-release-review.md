# Youth safeguarding and release acceptance review (2026-10-24)

## Current scope
MindCheck Youth offers age-banded (under 13 and 13–17) static emotional literacy, healthy habits, trusted-adult guidance and a 60-second optional pause. It must not collect names, birth dates, personal stories, assessments or mood entries. No AI chat, screening, certification, diagnosis or crisis response is enabled for youth.

## Safeguarding requirements
- Have a qualified child/adolescent mental-health professional review every youth-facing claim, the emergency advice, accessibility, cultural appropriateness and suitability for ages 6–12 and 13–17. **Not yet independently reviewed.**
- Have a child-safeguarding lead review escalation procedures, reporting obligations, privacy, and trusted-adult wording; avoid suggesting an unsafe caregiver as the only source of support. **Not yet reviewed.**
- No account, parental identity or consent service exists. Do not add personal data collection for minors without a documented legal/privacy review.
- The self-declared DOB gate is navigation only; browser session flags can be forged and direct links or API calls may bypass it. It is not reliable age verification.
- Adult AI guide endpoint accepts a client adult flag when `GUIDE_REQUIRE_ADULT_TOKEN` is off. Do not claim adult-only API enforcement. Enabling token enforcement requires an actual trusted issuer, incompatible with current login-free model.
- Treat all high-risk assessments and reporting endpoints as accessible independently of browser navigation; use server-side restrictions where available or avoid marketing them as age-restricted.
- Confirm no third-party tracking or advertising is presented on youth pages before launch.

## Current release limitations
- The under-13 route includes children younger than six. Child-directed wording must be appropriate for early childhood or explicitly recommend caregiver-assisted use; independent suitability review is outstanding.
- The new age-entry and youth pages do not yet offer the existing six-language selector. They are excluded from the adult language-switch regression suite and need dedicated localization testing before multilingual claims.
- Browser smoke coverage tests selected routes and storage behavior but is not a professional safeguarding, privacy, or penetration audit.

## Acceptance tests
1. New tab to `index.html` and each sensitive route redirects to `age-entry.html` without an adult session flag.
2. Both choices require full DOB; invalid dates, future dates, Feb 29, birthday boundaries and conflicting selection are handled.
3. DOB is not written to storage or sent in network requests; only coarse age category is session-scoped.
4. Youth 6–12 and 13–17 see their own language variants, can start/stop the calm timer, and have no personal-data forms.
5. Screen-reader labels, keyboard navigation, 320px mobile widths, reduced motion, iPhone Safari and Android Chrome checked.
6. Adult guide, assessments, certificates, reporting, and backend APIs assessed independently for direct-access bypasses.
7. Deployment staging smoke test and rollback verified.
8. Professional safeguarding and privacy review signed off.

**Status:** automated age-policy/entitlement tests previously passed, but the new navigation edits and end-to-end acceptance criteria are not yet fully tested. Do not merge to production until critical items are resolved.
