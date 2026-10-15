# MindCheck PHC / Federal Medical Centre Referral Readiness

**Status:** Internal implementation checklist. No clinic is presented as an active referral destination until its contact and emergency procedure are confirmed. Do not publish patient, clinician or private phone details in this repository.

## Required partner information (verify offline with an authorized representative)

For each partner, record in a secure non-public operational register:

- Facility legal name, town/state and exact service location
- Mental-health focal person and approved backup contact
- Telephone/contact channel approved for public display, if any
- Service hours, appointment requirements and capacity
- Whether walk-in, child/adolescent and adult referrals are accepted
- Emergency/crisis service availability, after-hours escalation and ambulance/ED handoff
- Expected referral acknowledgment time and fallback if not acknowledged
- Consent procedure for transmitting any information
- Named SpeakOut staff member accountable for keeping details current
- Written date of confirmation, next review date and facility approval to publish details

## Go / no-go before a referral button becomes available

- [ ] At least one facility accepts the relevant type of referral
- [ ] Facility has explicitly agreed to receive referrals
- [ ] A tested emergency option exists independently of the digital form
- [ ] No unstaffed live-chat or real-time response claims appear anywhere
- [ ] Referral routing is limited to the user's selected region and facility capabilities
- [ ] Clinical responsibility for assessing and responding to concerning scores is agreed
- [ ] Escalation procedure for suicide/self-harm concerns is documented and rehearsed
- [ ] Privacy notice, informed consent, retention schedule, data access and incident response are approved
- [ ] Safeguarding policy covers users under 18 and vulnerable people
- [ ] A test referral is acknowledged and closed using synthetic staging data
- [ ] Partner contacts and operational status are reviewed periodically

## Proposed patient experience

1. Read what the assessment can and cannot indicate.
2. Optionally complete a clinically approved screening questionnaire, if applicable.
3. Receive plain-language, non-diagnostic next steps. A score must not be used to declare a person safe.
4. Choose whether to contact a verified facility independently or request a referral where the consent workflow is operational.
5. If safety is urgent, bypass the questionnaire and immediately contact emergency services or attend an emergency department.

## Data minimization

Until a consented, access-controlled clinical referral backend has passed security review, the public MindCheck pages should not accept names, telephone numbers, trauma narratives, self-harm disclosures or questionnaire responses. No sensitive answers may be sent to Plausible or other analytics.

## Clinical review requirements

- Review the precise instrument version, intended age group, scoring, limitations and use permissions.
- Establish a qualified clinician responsible for response protocols and interpretation.
- Test referral, escalation and fallback workflows before activating public risk scores.
- Avoid presenting screening tools as diagnostic tests.

## Outstanding operational input

The names, confirmed contacts, hours, response staff and emergency pathways of SpeakOut's PHC/FMC partners have **not yet been supplied or verified**. This document is not an activated referral service.
