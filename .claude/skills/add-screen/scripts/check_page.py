#!/usr/bin/env python3
"""Verify a Noor POC .dc.html page: script syntax, bindings, links, theming.

Usage: python3 check_page.py "<section>/<Section>.dc.html"

Checks:
  1. The data-dc-script body parses (node --check).
  2. Every {{ binding }} used in markup is returned from renderVals()
     (best-effort: loop variables and property paths are skipped).
  3. Every relative href/src/from target exists on disk.
  4. No hardcoded theme remnants: dark="" props, data-theme="dark",
     banned palette hex outside photo/gradient contexts.
  5. Icons: no authored material-symbols-rounded ligatures; every static
     data-i="NAME" resolves to src/_ds/icons/NAME.svg.
Exit code 0 = clean, 1 = findings (printed).
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

BANNED_HEX = re.compile(
    r"#(?:09090B|71717B|00C950|F0FDF4|FAFAFA|F4F4F5|E4E4E7|C4C4C9|009689|E7000B)", re.I
)


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 1
    page = Path(sys.argv[1])
    if not page.exists():
        print(f"FAIL: {page} not found")
        return 1
    src = page.read_text()
    findings: list[str] = []

    # 1. script syntax ------------------------------------------------------
    m = re.search(r'<script type="text/x-dc" data-dc-script>(.*?)</script>', src, re.S)
    if not m:
        findings.append("no data-dc-script block found")
        script = ""
    else:
        script = m.group(1)
        stub = "class DCLogic { setState(){} }\n" + script
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
            f.write(stub)
        r = subprocess.run(["node", "--check", f.name], capture_output=True, text=True)
        if r.returncode != 0:
            findings.append(f"script syntax error:\n{r.stderr.strip()[:500]}")

    # 2. bindings vs renderVals --------------------------------------------
    markup = src[: m.start()] if m else src
    used = set()
    for b in re.findall(r"\{\{\s*([A-Za-z_][A-Za-z0-9_]*)", markup):
        used.add(b)
    loop_vars = set(re.findall(r'<sc-for[^>]*\bas="([A-Za-z_][A-Za-z0-9_]*)"', markup))
    rv = re.search(r"renderVals\(\)\s*\{(.*)\}", script, re.S)
    returned = set()
    if rv:
        body = rv.group(1)
        ret = re.search(r"return\s*\{(.*)\};", body, re.S)
        if ret:
            rbody = ret.group(1)
            returned.update(re.findall(r"([A-Za-z_][A-Za-z0-9_]*)\s*:", rbody))
            # shorthand keys: bare name alone on its line, ending with , or }
            returned.update(re.findall(r"^\s*([A-Za-z_][A-Za-z0-9_]*)\s*,?\s*$", rbody, re.M))
            has_spread = "..." in rbody
        else:
            has_spread = True
    else:
        has_spread = True
    if not has_spread:
        missing = sorted(used - returned - loop_vars)
        if missing:
            findings.append(f"bindings used in markup but not returned from renderVals(): {missing}")

    # 3. link targets --------------------------------------------------------
    base = page.parent
    for attr, target in re.findall(r'(href|src|from)="([^"#{]+?)(?:#[^"]*)?"', src):
        if target.startswith(("http", "data:", "mailto:", "//")):
            continue
        if not (base / target).exists():
            findings.append(f'broken {attr}: "{target}"')

    # 4. theming remnants ----------------------------------------------------
    if re.search(r'\bdark=""', src):
        findings.append('hardcoded dark="" prop on a component (theme must follow chrome.js)')
    if re.search(r'(?<!\[)data-theme="dark"', src):
        findings.append('hardcoded data-theme="dark" in page markup')
    hits = []
    for line_no, line in enumerate(src.splitlines(), 1):
        if BANNED_HEX.search(line) and not re.search(r"gradient|photo|img|image|overlay", line, re.I):
            hits.append(line_no)
    if hits:
        findings.append(
            f"palette hex on lines {hits[:10]} — replace with var(--color-*) tokens "
            "(OK only inside photo-overlay/gradient contexts)"
        )

    # 5. icons ---------------------------------------------------------------
    if re.search(r'class(?:Name)?="[^"]*material-symbols-rounded', src):
        findings.append(
            'authored material-symbols-rounded icon — use <span class="mi" data-i="NAME"></span> '
            '(the font is retained only for the vendored _ds_bundle.js)'
        )
    icons_dir = None
    for parent in page.resolve().parents:
        cand = parent / "_ds" / "icons"
        if cand.is_dir():
            icons_dir = cand
            break
    if icons_dir:
        missing_icons = sorted(
            n for n in set(re.findall(r'data-i="([a-z0-9_]+)"', src))
            if not (icons_dir / f"{n}.svg").exists()
        )
        if missing_icons:
            findings.append(
                f"data-i names with no SVG in {icons_dir}: {missing_icons} "
                "(add NAME.svg + an [data-i=\"NAME\"] rule to _theme/icons.css)"
            )

    # report -----------------------------------------------------------------
    if findings:
        print(f"{page}: {len(findings)} finding(s)")
        for x in findings:
            print(f"  - {x}")
        return 1
    print(f"{page}: clean")
    return 0


if __name__ == "__main__":
    sys.exit(main())
