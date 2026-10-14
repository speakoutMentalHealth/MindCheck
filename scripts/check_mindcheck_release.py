#!/usr/bin/env python3
"""Dependency-free static release guard. Run: python3 scripts/check_mindcheck_release.py

This is NOT a substitute for browser, accessibility, localization or integration QA.
"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "index.html").read_text(encoding="utf-8")
i18n = (ROOT / "js/mindcheck-i18n.js").read_text(encoding="utf-8")
sw = (ROOT / "sw.js").read_text(encoding="utf-8")
css = (ROOT / "mc-theme.css").read_text(encoding="utf-8")
failures = []

def check(name, condition):
    print(("PASS" if condition else "FAIL") + ": " + name)
    if not condition:
        failures.append(name)

for locale in ("en", "ha", "ig", "yo", "pcm", "fr"):
    check("language button " + locale, 'data-lang="' + locale + '"' in html)
    check("locale dictionary " + locale, bool(re.search(r"\b" + locale + r"\s*:\s*\{", i18n)))

for element_id in ("langSection", "homeSection", "moodSection", "formContainer",
                   "tipsSection", "helpSection", "badgesSection", "crisisBanner",
                   "formFrame", "pointsPill", "streakPill", "mcChangeLanguage",
                   "goMood", "goScreenings"):
    check("required element " + element_id, 'id="' + element_id + '"' in html)

for mood in range(5):
    check("mood choice " + str(mood), 'data-val="' + str(mood) + '"' in html)

check("no selected mood analytics property",
      "track('CheckIn', { mood:" not in html and 'track("CheckIn", { mood:' not in html)
check("privacy notice", 'href="privacy.html"' in html)
check("emergency support", 'id="crisisBanner"' in html and 'href="tel:112"' in html)
for asset in ("js/mindcheck-premium-nav.js","mindcheck-premium-nav.css","mindcheck-premium-layout.css","mindcheck-focused-app.css","mindcheck-compact-header.css","speakout-brand-unification.css","speakout-subsections.css","icons/logo.png","icons/apple-touch-icon.png"):
    check("offline UI asset " + asset, "'./"+asset+"'" in sw and (ROOT / asset).exists())
check("service worker caches current CSS", "'./mc-theme.css'" in sw)
check("service worker caches locale JS", "'./js/mindcheck-i18n.js'" in sw)
check("service worker cache version rotated", "mc-v9-visual-polish-20261014" in sw)
journey = (ROOT / "js/mindcheck-journey.js").read_text(encoding="utf-8")
check("mood history labels in six languages", all(f"{code}:{{previous:" in journey for code in ("en", "ha", "ig", "yo", "pcm", "fr")))
check("mood history uses translated labels", "translatedMood.moods[Number(item.mood_value)]" in journey)
check("mood history localizes dates", "date.toLocaleDateString(translatedMood.date)" in journey)
check("saved-tip actions localized in six languages", all(f"{code}:{{remove:" in html for code in ("en", "ha", "ig", "yo", "pcm", "fr")))
check("saved-tip removal uses translated text", "tipAction('remove')" in html and "tipAction('removed')" in html)
check("smart wellness script linked", 'src="js/mindcheck-smart-wellness.js"' in html)
check("smart wellness stylesheet linked", 'href="mindcheck-smart-wellness.css"' in html)
check("breathing phase timer present", all('id="' + x + '"' in html for x in ("mcBreathingRingProgress","mcBreathingSeconds","mcBreathingPhase")))
check("redundant suggestions removed", 'id="mcSmartWellness"' not in html and 'id="mcSmartActions"' not in html and 'data-mc-accordion="suggestions"' not in html)
check("breathing initialization independent", "getElementById('mcSmartWellness')" not in (ROOT / "js/mindcheck-smart-wellness.js").read_text(encoding="utf-8"))
check("uplifting translations loaded before locale", html.index('js/mindcheck-uplift-translations.js')>=0 and html.index('js/mindcheck-uplift-translations.js')<html.index('js/mindcheck-i18n.js'))
check("uplifting tips available offline", "'./js/mindcheck-uplift-translations.js'" in sw)
uplift_data = (ROOT / "js/mindcheck-uplift-translations.js").read_text(encoding="utf-8")
check("all uplifting locales present", all('"' + loc + '":[' in uplift_data for loc in ("ha","ig","yo","pcm","fr")))
check("uplifting localization lookup", "MindCheckUpliftTranslations" in i18n)
check("breathing controls present", all('id="' + x + '"' in html for x in ("mcBreathingStart","mcBreathingReset","mcBreathingCue")))
check("smart wellness cached", "'./js/mindcheck-smart-wellness.js'" in sw and "'./mindcheck-smart-wellness.css'" in sw)
check("wellness journey cached", "'./js/mindcheck-journey.js'" in sw and "'./mindcheck-journey.css'" in sw)
check("premium polish linked", 'href="mc-polish.css?v=20261014"' in html)
check("premium polish cached", "'./mc-polish.css'" in sw)
check("premium polish exists", (ROOT / "mc-polish.css").is_file())
check("reduced motion supported", "prefers-reduced-motion" in css)

if failures:
    print("\n" + str(len(failures)) + " static release guard(s) failed.")
    sys.exit(1)
print("\nAll static guards passed. Complete browser and functional QA before release.")
