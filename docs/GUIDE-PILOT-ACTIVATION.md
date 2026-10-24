# Guide pilot activation — 24 October 2026

The owner confirms GEMINI_API_KEY was stored directly in the Cloudflare mindcheck-guide Worker. The separate deployment workflow checks only the binding name, never reads its value, and overrides GUIDE_ENABLED=true for the pinned reviewed server. The default source config remains off for local/new deployments; the production override is explicit.

The public guide configuration enables the existing optional Explain with Gemini button. Opening the page or selecting topics does not call Gemini. The request remains a fixed selector, language and adult confirmation. Prepared answers remain available; quota, geography, timeout and provider failures fall back without sending private wellbeing data. Nigeria-only access remains enforced on Cloudflare metadata, without spoofing.

The adult-guide browser suite explicitly supplies a disabled config for its offline/no-AI scenarios and separately tests enabled requests and failures with mocked responses. Deployment/contract success and key-binding presence do not prove that the key is valid or that Gemini generated a response. A real Nigeria-origin browser must complete the final test: open Guide, confirm 18+, select a platform topic, press Explain with Gemini, and check for the AI explanation label. If unavailable, prepared content remains usable. Never share a key or personal wellbeing data in that test.

To roll back, set the public enabled flag false and deploy a new service-worker cache version, or set GUIDE_ENABLED=false on the Worker. A later server deployment must retain the intended explicit production setting.
