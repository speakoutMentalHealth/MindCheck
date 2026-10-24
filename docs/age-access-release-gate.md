# MindCheck age-based access: security release gate

Status: DEVELOPMENT ONLY. Do not deploy the youth experience until the controls below are implemented and reviewed.

## Findings from the existing implementation

- The public site is static HTML. `index.html` currently uses a sessionStorage entry to navigate to adult content. This is not authorization; direct links bypass it.
- `assessment-centre.html` and individual assessment pages are separately addressable. Hiding links cannot protect these routes.
- The guide worker currently accepts `{adult:true}` from the browser. A caller can forge this value. The guide's fixed-topic content and region/limiter restrictions are valuable, but the boolean is **not proof of age**.
- Date of birth is self-declared, and the prototype deliberately does not persist it. It must not be treated as identity verification.
- There is no demonstrated account-backed age entitlement or child consent record in this reviewed code path.

## Required server-side implementation before production

1. Define an authenticated user/session service and verify its signature and expiry on every protected API request.
2. Collect date of birth with appropriate privacy notice and consent; calculate age band server-side, storing the minimum necessary age-related attributes.
3. Prevent untrusted clients from writing age band, adult entitlement, or consent state directly. Support a controlled correction process.
4. Enforce adult entitlement at the API and content-delivery layers for restricted assessments, results, certificates, and AI. Do not rely on sessionStorage, hidden links, JavaScript redirects, or a request-body `adult` flag.
5. Make youth endpoints deny-by-default until consent, safety escalation, and clinical review are signed off. Provide age-appropriate privacy notices and data retention/deletion procedures.
6. Review Nigeria Child Rights Act, Nigeria Data Protection Act and other applicable jurisdictions with qualified counsel; obtain clinical/safeguarding approval for youth screening and referral workflows.
7. Test direct URLs, forged DOB/adult flags, expired sessions, cross-account access, youth-to-adult transitions, and data deletion. Include accessibility and mobile testing.

## Release decision

**BLOCKED** for youth personal-data collection and youth AI/assessments. Existing public adult features cannot be claimed age-secure. Do not merge or deploy this branch until backend enforcement exists and the above checks pass.
