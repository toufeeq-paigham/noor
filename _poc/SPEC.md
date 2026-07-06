# Noor POC conversion spec

You are converting one page of the Paigham/Noor design POC (directory: `/Users/toufeeqahamed/Paigham/noor`).
Every page must end up: (1) **theme-aware** (light/dark/system via CSS tokens), (2) **interactive**, (3) carrying the **shared canvas chrome**, (4) **cross-linked** to related pages. Light-mode appearance must stay visually identical to the current design unless the page is currently dark-hardcoded (then dark mode must look like today's design and light mode becomes its token-derived counterpart).

## 1. Framework cheatsheet (`.dc.html` pages)

- Page skeleton: real `<head>` loads `./support.js`; content lives inside `<x-dc>…</x-dc>`; a `<helmet>` block inside `x-dc` carries stylesheet links and page `<style>`.
- Templating: `{{ expr }}` bindings (work inside attribute values and text), `<sc-if value="{{ cond }}">…</sc-if>`, `<sc-for list="{{ items }}" as="it" hint-placeholder-count="N">` (single root child per iteration), `onClick="{{ handler }}"`.
- Logic: one `<script type="text/x-dc" data-dc-script>` with `class Component extends DCLogic { state = {...}; handler = () => this.setState(...); renderVals() { return { ...bindings } } }`. Bindings referenced in markup MUST be returned from `renderVals()`.
- Device frame: `<x-import component="IOSDevice" from="./ios-frame.jsx" hint-size="402px,874px">…</x-import>`. **Remove any `dark=""` prop and any hardcoded `data-theme="dark"` attributes in the page** — the frame and tokens now follow the global theme automatically.
- DS React components can be embedded: `<x-import component-from-global-scope="FilledButton" hint-size="100%,48px">Label</x-import>` (from `_ds_bundle.js`).
- Reference implementation of a fully interactive page: `Masjid Onboarding.dc.html` (sheet with tabs, single-select state, cross-tab radio behavior).

## 2. Required page wiring

In the real `<head>`, directly after `support.js`:
```html
<script src="./_theme/chrome.js"></script>
```
In `<helmet>`, after the design-system stylesheet:
```html
<link rel="stylesheet" href="_theme/poc.css">
```
Body/canvas style in the helmet `<style>` must use:
```css
body{background:var(--canvas-bg);...}
```
Canvas caption color: `var(--canvas-label)`. Do NOT build your own theme toggle — `chrome.js` injects the floating Index-link + Light/System/Dark switcher on every page automatically.

## 3. Color token mapping (hex → var)

Bulk-replace these, then review contextual cases by hand (a Python pass over the file + grep is the fastest route for big files):

| Current hex | Replace with | Notes |
|---|---|---|
| `#FFFFFF` / `#fff` as screen/sheet background | `var(--color-surface-primary)` | on-photo/glass whites stay literal |
| `#F0FDF4` as a background/tint | `var(--color-surface-secondary)` | |
| `#F0FDF4` as text/icon ON a green (`#00C950`) fill | `var(--color-action-primary-inverse)` | CRITICAL distinction |
| `#FAFAFA` | `var(--color-surface-card)` | |
| `#F4F4F5` | `var(--color-input-background)` (inputs/search) or `var(--color-status-disabled)` (chips, avatars, neutral pills) | |
| `#E4E4E7` | `var(--color-neutral-border)`; segmented-tab track → `var(--color-action-background)` | |
| `#09090B` | `var(--color-info-primary)` | |
| `#71717B` | `var(--color-info-secondary)` | |
| `#C4C4C9` | `var(--color-info-faint)` | |
| `#00C950` | `var(--color-action-primary)` | |
| `#009689` | `var(--color-action-secondary)` | |
| `#C9AD7B` / `#8a6f3f` | `var(--color-neutral-brand)` | |
| `#E7000B` | `var(--color-status-error)` | |
| `#FE9A00` | `var(--color-status-warning)`; `#FFB900` → `var(--color-status-warning-alt)` | |
| `rgba(9,9,11,.4)` scrim | `var(--color-surface-scrim)` | |
| `rgba(240,253,244,.8)` on green | `color-mix(in oklab, var(--color-action-primary-inverse) 80%, transparent)` | |
| green glow shadows `rgba(0,201,80,…)` | `var(--shadow-button)` | |
| big sheet/card shadows `rgba(0,0,0,.16)`-ish | `var(--sheet-shadow)` or `var(--shadow-elevated)` | |
| body canvas `#EDEBE6` / `#E8E4DE` | `var(--canvas-bg)` | |

**Leave literal:** colors composited over photos/imagery (hero overlays, gradients on images), the iOS frame internals (`ios-frame.jsx` — already handled), status-bar glass whites, and chart accent colors used as data colors.

**Dark-hardcoded pages** (they set `dark=""` on IOSDevice and/or `data-theme="dark"`, and use literal whites like `#fff`, `rgba(255,255,255,.5)` for text): map those literals to the semantic tokens per the table's *roles* (text → `--color-info-primary`/`-secondary`, cards → `--color-surface-card`, etc.) so the page works in BOTH themes. Verify against the current look in dark mode.

## 4. Interactivity requirements

Make the page feel real, like `Masjid Onboarding.dc.html`. Minimum bar per page: 3+ meaningful stateful interactions relevant to the screen (tab switches, list selection, toggles, sheet/modal open+scrim close, input state, expand/collapse, favorite/star, counters, stepper flows). Preserve any existing interactions. Everything the design shows as tappable should at least respond (state change or navigation). No `Date.now()`/`Math.random()` restrictions here (this is page JS, not workflow JS) — but keep behavior deterministic and demo-friendly.

## 5. Navigation

Cross-page navigation is a plain anchor or `window.location.href = 'Page Name.dc.html'` from a handler (`go = (p) => () => { window.location.href = p; };`). Wire AT LEAST the links listed for your page in the nav map below. Bottom-nav tabs (Home, Qaum, Quran, Salaah, Profile) must navigate to their screens on every page that shows the bottom nav, with the current tab highlighted (active = `var(--color-action-primary)` + FILL 1 icon).

Nav map (page → outgoing links):
- Intro Screen → Login Flow (Get started)
- Login Flow (phone step → OTP step in one screen) → Home Screen (Verify)
- Home Screen → bottom nav (Qaum, Quran, Salaah, Profile) + feature cards: Qibla Screen, Islamic Calendar, Dua List, Zakaat Screen, Asma ul Husna, Hisnul Muslim, Explore Masjids, Scan QR (map what exists on the design; don't invent new cards)
- Qaum / Quran / Salaah / Profile Screens → bottom nav to each other + Home
- Profile Screen → Masjid Onboarding (My Masjids / register rows), Following Masjids
- Masjid Onboarding → Profile Screen (back), Explore Masjids (explore links)
- Explore Masjids ↔ Search Masjids; both → Following Masjids
- Following Masjids → Explore Masjids (find more)
- Scan QR → Explore Masjids (fallback action)
- Quran Screen → Quran Reader (surah tap); Quran Reader → Quran Screen (back)
- Dua List → Dua Detail (dua tap); Dua Detail → Dua List (back)
- Hisnul Muslim → Dua Detail (chapter tap)
- Asma ul Husna → (internal interactions only)
- Zakaat Screen → Calculate Zakaat; Calculate Zakaat → Zakaat Summary (result); Zakaat Summary → Zakaat Screen (done)
- Qibla / Islamic Calendar → (internal interactions; back arrow → Home Screen)
Back arrows in app bars → the page's natural parent (per map above).
File names contain spaces — plain `href="OTP Screen.dc.html"` is fine.

## 6. Do not touch

`support.js`, `_ds/**`, `ios-frame.jsx`, `_theme/**`, `screenshots/**`, `uploads/**`, other pages than the one assigned to you.

## 7. Self-verification (before you finish)

1. Extract the `data-dc-script` body, prepend `class DCLogic { setState(){} }`, run `node --check` on it — must pass.
2. `grep -c` your file for leftover palette hex (`#09090B|#71717B|#00C950|#F0FDF4|#FAFAFA|#F4F4F5|#E4E4E7|#C4C4C9|#009689|#C9AD7B|#E7000B`) — remaining hits must ONLY be inside photo-overlay/gradient contexts you deliberately kept (list them in your report).
3. Confirm `<script src="./_theme/chrome.js">` in head and `_theme/poc.css` in helmet.
4. Confirm no `dark=""` / `data-theme=` remnants in the page markup.
5. Confirm every binding used in markup exists in `renderVals()`.
6. Confirm each nav-map link for your page exists and points at an existing file.
