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
check("service worker caches current CSS", "'./mc-theme.css'" in sw)
check("service worker caches locale JS", "'./js/mindcheck-i18n.js'" in sw)
check("service worker cache version rotated", "mc-v9-visual-polish-20261014" in sw)
check("smart wellness script linked", 'src="js/mindcheck-smart-wellness.js"' in html)
check("smart wellness stylesheet linked", 'href="mindcheck-smart-wellness.css"' in html)
check("breathing phase timer present", all('id="' + x + '"' in html for x in ("mcBreathingRingProgress","mcBreathingSeconds","mcBreathingPhase")))
check("breathing controls present", all('id="' + x + '"' in html for x in ("mcBreathingStart","mcBreathingReset","mcBreathingCue")))
check("smart wellness cached", "'./js/mindcheck-smart-wellness.js'" in sw and "'./mindcheck-smart-wellness.css'" in sw)
check("wellness journey cached", "'./js/mindcheck-journey.js'" in sw and "'./mindcheck-journey.css'" in sw)
check("premium polish linked", 'href="mc-polish.css?v=20261014"' in html)
check("premium polish cached", "'./mc-polish.css'" in sw)
check("premium polish exists", (ROOT / "mc-polish.css").is_file())
check("reduced motion supported", "prefers-reduced-motion" in css)

# Cross-device regression guards for the shared breathing layout.
breath_css = (ROOT / "mindcheck-smart-wellness.css").read_text(encoding="utf-8")
breath_js = (ROOT / "js/mindcheck-smart-wellness.js").read_text(encoding="utf-8")
check("breathing stage centered with flex", bool(re.search(r"\\.mc-breathing-visual\\s*\\{[^}]*justify-content\\s*:\\s*center", breath_css, re.S)))
check("breathing stage has bounded width", bool(re.search(r"\\.mc-breathing-stage\\s*\\{[^}]*width\\s*:\\s*260px", breath_css, re.S)))
check("orb uses center-based absolute placement", bool(re.search(r"\\.mc-breathing-circle\\s*\\{[^}]*left\\s*:\\s*50%", breath_css, re.S)))
check("breathing timer anchored to stage", "mc-breathing-countdown" in breath_css and "mcBreathingSeconds" in breath_js)
check("phone breakpoint exists", "@media(max-width:480px)" in breath_css)
check("reduced motion for breathing", "prefers-reduced-motion:reduce" in breath_css)
check("breathing animation uses requestAnimationFrame", "requestAnimationFrame(tick)" in breath_js)
check("breathing pause and reset preserved", "function pause()" in breath_js and "mcBreathingReset" in breath_js)
check("accessible native disclosure", '<details class="mc-calm-accordion">' in html and '<summary>' in html)

if failures:
    print("\n" + str(len(failures)) + " static release guard(s) failed.")
    sys.exit(1)
print("\nAll static guards passed. Complete browser and functional QA before release.")
