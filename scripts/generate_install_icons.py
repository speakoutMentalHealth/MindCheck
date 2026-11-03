#!/usr/bin/env python3
"""Regenerate MindCheck install icons from the user-approved circular SpeakOut logo."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "icons" / "speakout-install-logo-source.jpg"
TARGET = ROOT / "icons"
with Image.open(SOURCE) as raw:
    logo = raw.convert("RGB")
    for size, filename in (
        (192, "mindcheck-192.png"),
        (512, "mindcheck-512.png"),
        (180, "apple-touch-icon.png"),
    ):
        logo.resize((size, size), Image.Resampling.LANCZOS).save(
            TARGET / filename, format="PNG", optimize=True
        )
    mask = Image.new("RGB", (512, 512), "#ffffff")
    safe = logo.resize((410, 410), Image.Resampling.LANCZOS)
    mask.paste(safe, ((512 - 410) // 2, (512 - 410) // 2))
    mask.save(TARGET / "mindcheck-512-maskable.png", format="PNG", optimize=True)
print("Generated SpeakOut MindCheck install icons: 192, 512, maskable and iOS 180.")
