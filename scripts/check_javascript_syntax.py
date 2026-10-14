#!/usr/bin/env python3
"""Fail release checks on invalid inline or external JavaScript."""
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]

class ScriptParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.inline = []
        self.collect = False
        self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag == "script":
            props = dict(attrs)
            self.collect = "src" not in props and props.get("type", "").lower() in ("", "text/javascript", "module")
            self.parts = []
    def handle_data(self, data):
        if self.collect:
            self.parts.append(data)
    def handle_endtag(self, tag):
        if tag == "script" and self.collect:
            value = "".join(self.parts)
            if value.strip():
                self.inline.append(value)
            self.collect = False

def check(path, label):
    result = subprocess.run(["node", "--check", str(path)], capture_output=True, text=True)
    if result.returncode:
        print("FAIL:", label, result.stderr, sep="\n")
        return False
    print("PASS:", label)
    return True

ok = True
for html_file in sorted(ROOT.glob("*.html")):
    parser = ScriptParser()
    parser.feed(html_file.read_text(encoding="utf-8"))
    for n, source in enumerate(parser.inline, 1):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "inline.js"
            path.write_text(source, encoding="utf-8")
            ok = check(path, f"{html_file.name}: inline script {n}") and ok
for js_file in sorted((ROOT / "js").rglob("*.js")):
    ok = check(js_file, str(js_file.relative_to(ROOT))) and ok
if not ok:
    sys.exit(1)
print("All JavaScript syntax checks passed.")
