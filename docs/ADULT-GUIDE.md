# Adult access and the MindCheck Guide

## Shipped behaviour

MindCheck is intended for adults aged 18+. `js/adult-entry.js` requests a self-declaration before interactive content on all root HTML routes. Confirmation lasts for the browser tab session, not a persistent identity or exact birthday. With blocked storage it lasts only for the current page. There is no ID upload, date of birth, age analytics event or backend age record. This is not identity verification and does not prove that minors cannot access the site.

The gate offers six draft UI languages, keyboard navigation, under-18 handoff to the separate main SpeakOut website, privacy and urgent support. Policy, privacy, urgent support, under-18 handoff, offline help and certificate verification pages remain public. Deep-linked Calm space stays behind the adult confirmation. Javascript-disabled access cannot be enforced by a static client gate. Review actual audience and distribution before enabling Gemini; an age label alone does not establish compliance with its terms. SpeakOut’s separate school programmes are not changed.

Eligibility terms, privacy copy, report age options and the assessment library now reflect adult use. The report service’s existing `safeAdult` wire field is retained to avoid breaking its receiver, with an adult-facing “trusted support person” label. No receiving Apps Script changes or report delivery claims are made here.

`guide.html` provides six prepared platform topics, links and English/French answers. Other selected languages explicitly say guide translations await review. No free-text chat, profile, history, report, attachment, diagnosis, treatment or screening interpretation is accepted. Prepared answers work offline after caching. The compact home footer links to the Guide. This is not advertised as live generative AI while disconnected.

## Gemini adapter, prepared but inactive

Both `js/guide-config.js` and `server/guide/wrangler.jsonc` default **off**. The frontend does not call a server until explicitly enabled and the user presses “Explain with Gemini”. The prepared answer remains available through any failure. No paid service or billing account is activated by this release; no real Gemini API request has been made.

The separate Cloudflare Worker uses pinned AI SDK 7.0.152 and Google provider 4.0.104, with version-matched bundled docs/source checked during implementation. It receives exactly `{question, language, adult:true}` (maximum 256 bytes). It rejects additional fields, unsupported languages, unknown selectors and unconfirmed adulthood. Only a fixed public platform fact and language are sent to Google. It has no tools, retrieval, session history or access to user storage. API keys stay in server secrets; never place one in HTML, browser JavaScript, Git or chat.

The free pilot fails closed outside Cloudflare's `NG` country metadata. This deliberately restricts it to Nigeria rather than silently offering unpaid Gemini to EEA/UK/Switzerland users. Prepared answers remain available everywhere. Origin checks, MIME/method checks, no credentials, no-store responses, a mandatory limiter, zero retries, 240 output tokens and a six-second provider deadline constrain requests. The limiter permits five generation attempts per minute **per Cloudflare location**, shared by all visitors there; it is not authentication, a global daily cap or a guaranteed budget limit. The browser permits one pending explanation at a time. An unpaid project without billing is required for the free pilot. Provider quotas are the final free-use limit; use static fallback on exhaustion.

Only bounded plain text is returned, with simple markup/URL/medical-term rejection and provider-error redaction. The browser renders it with `textContent`. These checks reduce obvious unwanted output but do not prove factual or clinical safety. Test actual outputs before enabling; keep the scope to platform facts. No telemetry is enabled in the SDK or worker config; infrastructure and Google may still keep their own service/abuse metadata. Do not claim zero third-party logging.

## Activation steps (owner environment required)

1. Review adult audience/distribution, Google’s current terms, supported region and the prepared facts. The unpaid terms prohibit sensitive/personal/confidential inputs and medical advice. Retain clinical scoring outside AI.
2. Create a Gemini API key in a project **without active billing**. Use an authenticated provider console; never paste the key into chat. Confirm the free model available to that project. Current checked model: `gemini-3.5-flash-lite` (23 October 2026). Recheck availability/pricing at activation.
3. From `server/guide`, run `npm ci`, `npm test` and `npm run build`. Authenticate Wrangler through the owner’s approved local/CI environment. Set `wrangler secret put GEMINI_API_KEY`; do not print secret values. Deploy this **separate** worker, not the existing portal API. Leave `GUIDE_ENABLED=false` until controlled acceptance passes.
4. Confirm the actual workers.dev hostname. The browser currently allowlists only `mindcheck-guide.speakout-platform-api.workers.dev`; update the exact allowlist/config together if deployment uses another account hostname. Configure the mandatory limiter as in wrangler.jsonc. Do not bypass the geographic check for public traffic.
5. In a controlled Nigeria-origin browser, enable the worker and test only fixed public platform topics, all supported languages, limits, provider refusal/failure and adult entry. No real mood, report, contact or screening data. Review generated answers for fabricated claims. In test configuration, deliberately exercise blocked regions and exhausted quotas.
6. Enable `js/guide-config.js` with the verified HTTPS endpoint only after that acceptance. Update privacy wording if provider/data handling changes. Roll back by disabling the public config and/or worker flag; prepared answers require neither.

Paid migration is a separate deliberate decision: preserve the request contract and approved scope, introduce a global cost budget and operational monitoring, and review data terms. Paid access does not permit medical advice or relax the adult audience requirement.

## Evidence and remaining work

Automated local tests cover fresh/under-18/confirmed/blocked-storage entry; privacy and urgent support exemptions; deep links; 320/390/430px layouts; accessibility; English/French guide content; no network calls with AI off; exact permitted request fields; output rendered as text; failures retaining prepared answers; server origin/size/type/region/limiter guards; mocked SDK request shape and provider failure. Worker packaging is checked using Wrangler dry-run. No live provider, production worker, verified age, physical phone install, report destination or human support hours is implied by those tests.

Existing browser suites use an explicit adult-confirmed fixture. `adult-guide-smoke.cjs` uses unmodified Playwright and independently tests the gate itself.

References checked 23 October 2026:
- https://ai.google.dev/gemini-api/terms
- https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite
- https://ai.google.dev/gemini-api/docs/pricing
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
