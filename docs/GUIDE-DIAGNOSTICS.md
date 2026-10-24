# Guide diagnostics — 24 October 2026

The screenshot confirms prepared fallback, not successful AI generation. All previous failures were indistinguishable. Return only a finite safe reason code for disabled/configuration/region/busy/quota/provider-access/model/provider-request/timeout/output/provider failures; never return provider bodies, error messages, keys or IPs. The browser gives plain-language region/quota/busy/timeout explanations and a bounded support code for remaining failures.

The pilot now accepts Nigeria and the US, both in Google’s supported regions, while the EEA/UK/Switzerland and unknown regions remain blocked. This is a legitimate region rollout, not country spoofing. Sources checked: https://ai.google.dev/gemini-api/docs/available-regions and https://ai.google.dev/gemini-api/terms . The provider deadline is 12 seconds; the browser allows 15 seconds. No automatic provider retries or paid upgrade is introduced.

Use only fixed public platform facts for live verification. Actual generated text or a safe reason code must be checked after deployment; deployment success alone is insufficient. Personal wellbeing records remain excluded.
