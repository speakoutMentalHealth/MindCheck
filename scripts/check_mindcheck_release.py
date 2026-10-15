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
                   "goMood", "goAssessmentCentre"):
    check("required element " + element_id, 'id="' + element_id + '"' in html)

for mood in range(5):
    check("mood choice " + str(mood), 'data-val="' + str(mood) + '"' in html)

check("no selected mood analytics property",
      "track('CheckIn', { mood:" not in html and 'track("CheckIn", { mood:' not in html)
check("cash reward UI removed", "₦" not in html and "AWARD_AMOUNT_NAIRA" not in html and "whatsAppClaimLink" not in html)
check("20-day badge unlock", "STREAK_BADGE_DAYS = 20" in html and "streak_20" in html)
check("no payment state in UI", "claimed_at" not in html and "award_issued" not in html)
check("no localized cash amounts", "₦" not in i18n)
check("privacy notice", 'href="privacy.html"' in html)
check("emergency support", 'id="crisisBanner"' in html and 'href="tel:112"' in html)
for asset in ("js/mindcheck-premium-nav.js","mindcheck-premium-nav.css","mindcheck-premium-layout.css","mindcheck-focused-app.css","mindcheck-compact-header.css","speakout-brand-unification.css","speakout-subsections.css","icons/logo.png","icons/apple-touch-icon.png"):
    check("offline UI asset " + asset, "'./"+asset+"'" in sw and (ROOT / asset).exists())
check("service worker caches current CSS", "'./mc-theme.css'" in sw)
check("service worker caches locale JS", "'./js/mindcheck-i18n.js'" in sw)
check("service worker cache version rotated", "mc-v10-assessment-centre-20261015" in sw)
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

# Leadership Summit certificate portal must remain disabled until server-side lookup is secured.
summit_portal = (ROOT / "certificate/index.html").read_text(encoding="utf-8")
summit_script = (ROOT / "certificate/script.js").read_text(encoding="utf-8")
check("Summit certificate portal paused", "Certificate portal temporarily unavailable" in summit_portal)
check("Summit portal has no active attendee form", 'id="fullname"' not in summit_portal and 'id="phone"' not in summit_portal)
check("Summit portal does not load certificate API scripts", "script.js" not in summit_portal and "jspdf" not in summit_portal.lower())
check("Summit browser attendee API disabled", "sheetdb.io" not in summit_script and "fetch(" not in summit_script)
# Unified Assessment Centre navigation and private screening release checks.
centre = (ROOT / "assessment-centre.html").read_text(encoding="utf-8")
nav = (ROOT / "js/mindcheck-premium-nav.js").read_text(encoding="utf-8")
audit = (ROOT / "audit-screening.html").read_text(encoding="utf-8")
pcl5 = (ROOT / "pcl5-screening.html").read_text(encoding="utf-8")
breathing = (ROOT / "mindcheck-smart-wellness.css").read_text(encoding="utf-8")
check("single homepage Assessment Centre entry", html.count('id="goAssessmentCentre"') == 1 and 'id="goScreenings"' not in html and 'id="goADHDAwareness"' not in html)
check("homepage quick Assessments link points to Centre", 'href="assessment-centre.html">Assessments' in html)
check("bottom Assessments tab opens Centre", "if(id==='formContainer'){window.location.assign('assessment-centre.html');return;}" in nav)
for destination in ("adhd.html", "pcl5-screening.html", "audit-screening.html", "sleep-awareness.html", "trauma-awareness.html", "suicide-support.html"):
    check("Assessment Centre links " + destination, 'href="' + destination + '"' in centre)
check("breathing mobile layout compact", "mc-breathing-stage{transform:scale(.76)!important}" in breathing and "height:209px!important" in breathing)
check("AUDIT provides WHO form and private total", "who.int/publications/i/item/WHO-MSD-MSB-01.6a" in audit and 'id="auditScore"' in audit and "localStorage" not in audit and "fetch(" not in audit)
check("PCL-5 accessible, private", 'name="q20"' in pcl5 and "localStorage" not in pcl5 and "fetch(" not in pcl5)
for destination in ("assessment-centre.html", "audit-screening.html", "pcl5-screening.html"):
    check("offline shell includes " + destination, "'./" + destination + "'" in sw)

# Assessment resource and AUDIT privacy regression guards.
centre = (ROOT / "assessment-centre.html").read_text(encoding="utf-8")
audit = (ROOT / "audit-screening.html").read_text(encoding="utf-8")
check("WHO ASSIST official guide linked", "www.who.int/publications/i/item/978924159938-2" in centre)
check("WHO AUDIT companion remains linked", 'href="audit-screening.html"' in centre)
check("AUDIT private score widget preserved", 'id="auditScore"' in audit and 'id="result"' in audit)
check("AUDIT no responses persisted or transmitted", "localStorage" not in audit and "fetch(" not in audit and "sendBeacon(" not in audit)
assessment_css=(ROOT/"assessment-interface.css").read_text(encoding="utf-8")
pcl=(ROOT/"pcl5-screening.html").read_text(encoding="utf-8")
check("shared assessment progress stylesheet", "mc-assessment-progress" in assessment_css)
check("PCL-5 progress meter linked", 'href="assessment-interface.css"' in pcl and 'id="pclProgressMeter"' in pcl)
check("PCL-5 progress meter updates on response", "document.getElementById('pclProgressMeter').value=values().length" in pcl)
# PCL-5 questionnaire progressive navigation safeguards.
pcl = (ROOT / "pcl5-screening.html").read_text(encoding="utf-8")
for nav_id in ("previousQuestion", "nextQuestion", "questionPosition", "showAllQuestions"):
    check("PCL-5 navigation control " + nav_id, 'id="' + nav_id + '"' in pcl)
check("PCL-5 keeps 20 items", len(re.findall(r'<fieldset class="q"', pcl)) == 20)
check("PCL-5 score formula retained", "answered.reduce((n,el)=>n+Number(el.value),0)" in pcl)
check("PCL-5 nav works without storage or network", "localStorage" not in pcl and "fetch(" not in pcl and "sendBeacon(" not in pcl)
check("PCL-5 missing responses surfaced", "if(missing>=0)jump(missing)" in pcl)
if failures:
    print("\n" + str(len(failures)) + " static release guard(s) failed.")
    sys.exit(1)
print("\nAll static guards passed. Complete browser and functional QA before release.")
