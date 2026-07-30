#!/usr/bin/env python3
"""Fail when a page uses a CSS class nothing defines.

The Noor rule is "reference, don't rebuild": screens use the classes in
`_theme/components.css`, and anything missing gets ADDED to the kit. The failure this
catches is subtler than a rebuild — a screen borrowing a class that exists only in another
page's helmet. It renders unstyled and nothing complains.

For every `*.dc.html` page we collect:
  defined = kit CSS (+ tokens, + poc.css, + icons.css) + that page's own inline <style>
            + the utility classes support.js injects
  used    = classes in the page markup + in every .jsx module the page x-imports
            (resolved relative to the page, and one hop further for nested imports)

Usage:  python3 tools/check_classes.py            # from the repo root
Exit code 1 with a per-page report when anything is undefined.
"""

from __future__ import annotations

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src')

# Shared stylesheets every page loads.
KIT_FILES = [
    'src/_theme/components.css',
    'src/_theme/poc.css',
    'src/_theme/icons.css',
]
# support.js injects a small utility sheet (.fx .col .f1 …).
UTILITY_FILES = ['src/support.js']

CLASS_DEF = re.compile(r'\.(-?[_a-zA-Z][_a-zA-Z0-9-]*)')
IDENT = re.compile(r'^-?[_a-z][_a-z0-9-]*$')
X_IMPORT_FROM = re.compile(r'from="([^"]+\.jsx)"')
# A page may load its own stylesheet next to the shared kit.
LOCAL_SHEET = re.compile(r'<link[^>]+href="(?!https?:)([^"]+\.css)"')

# `class="…"`, `className="…"` and the static parts of `className={`… ${x ? 'a' : 'b'}`}`.
ATTR = re.compile(r'class(?:Name)?="([^"{}]*)"')
TEMPLATE = re.compile(r'class(?:Name)?=\{`([^`]*)`\}')
TEMPLATE_LITERAL = re.compile(r"'([^']*)'")
# Names that are legitimately produced by JS and styled by an ancestor selector only.
IGNORED = {'mi', 'fill'}


def read(path: str) -> str:
    try:
        with open(path, encoding='utf-8') as handle:
            return handle.read()
    except OSError:
        return ''


def globals_defined() -> set[str]:
    text = ''.join(read(os.path.join(ROOT, rel)) for rel in KIT_FILES + UTILITY_FILES)
    # Also treat the design-system token sheet as a source of class names.
    ds_dir = os.path.join(SRC, '_ds')
    for base, _dirs, files in os.walk(ds_dir):
        for name in files:
            if name.endswith('.css'):
                text += read(os.path.join(base, name))
    return set(CLASS_DEF.findall(text))


def classes_used(text: str) -> set[str]:
    found: set[str] = set()
    for value in ATTR.findall(text):
        found.update(value.split())
    for value in TEMPLATE.findall(text):
        # Static words outside ${…}. A word touching a placeholder is only half a name
        # (`count-${n}`), so mark the placeholder and drop those.
        static = re.sub(r'\$\{[^}]*\}', '\x00', value)
        found.update(word for word in static.split() if '\x00' not in word)
        # Class names chosen inside ${… ? 'a' : 'b'}. Comparison operands
        # (`tab === 'dua'`) are values, not classes, so drop those first.
        for expr in re.findall(r'\$\{([^}]*)\}', value):
            expr = re.sub(r"[!=]==?\s*'[^']*'", '', expr)
            expr = re.sub(r"'[^']*'\s*[!=]==?", '', expr)
            found.update(TEMPLATE_LITERAL.findall(expr))
    return {c for c in found if IDENT.match(c) and c not in IGNORED}


def modules_for(page_path: str) -> list[str]:
    """The .jsx modules a page pulls in, one hop deep."""
    page_dir = os.path.dirname(page_path)
    seen: list[str] = []
    pending = [
        os.path.normpath(os.path.join(page_dir, rel))
        for rel in X_IMPORT_FROM.findall(read(page_path))
    ]
    while pending:
        path = pending.pop()
        if path in seen or not os.path.isfile(path):
            continue
        seen.append(path)
        # a module may itself reference sibling modules by path in a comment/registry
        for rel in X_IMPORT_FROM.findall(read(path)):
            pending.append(os.path.normpath(os.path.join(os.path.dirname(path), rel)))
    return seen


def main() -> int:
    shared = globals_defined()
    pages = []
    for base, _dirs, files in os.walk(SRC):
        for name in files:
            if name.endswith('.dc.html'):
                pages.append(os.path.join(base, name))
    pages.sort()

    failures = 0
    for page in pages:
        page_text = read(page)
        defined = set(shared)
        # the page's own <style> blocks
        for block in re.findall(r'<style[^>]*>(.*?)</style>', page_text, re.S):
            defined.update(CLASS_DEF.findall(block))

        # the page's own stylesheet(s), e.g. hijri/hijri.css
        for href in LOCAL_SHEET.findall(page_text):
            sheet = os.path.normpath(os.path.join(os.path.dirname(page), href))
            defined.update(CLASS_DEF.findall(read(sheet)))

        used = classes_used(page_text)
        modules = modules_for(page)
        for module in modules:
            module_text = read(module)
            used.update(classes_used(module_text))
            # a module may ship its own <style> string (rare) — count it as defined
            defined.update(CLASS_DEF.findall(module_text)) if '<style' in module_text else None

        missing = sorted(c for c in used if c not in defined)
        if missing:
            failures += 1
            rel = os.path.relpath(page, ROOT)
            print(f'{rel}')
            for cls in missing:
                owners = [os.path.relpath(m, ROOT) for m in modules if f'{cls}' in read(m)]
                where = owners[0] if owners else 'page markup'
                print(f'  .{cls:<28} used by {where} — defined nowhere')

    if failures:
        print()
        print(f'{failures} page(s) use undefined classes.')
        print('Add the construction to src/_theme/components.css (plus its Atoms/Molecules/')
        print('Organisms reference entry), or define it in the page helmet if it is truly')
        print('page chrome. Never leave a class that only another page defines.')
        return 1

    print(f'{len(pages)} pages checked — every class used is defined.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
