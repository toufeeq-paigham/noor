---
name: add-screen
description: "Add a new section board to the Noor design POC by combining existing flat *.dc.html screens into a subdirectory flow, exactly like onboarding/. Use this whenever the user asks to add screens, add a section, combine/merge screens into a flow, build a board for a feature (Dua, Zakaat, Quran, Masjid, Profile…), or says 'like how we have onboarding' — even if they don't say 'board' or 'section' explicitly."
---

# Add a section board to the Noor POC

A **section board** is how this repo presents a feature flow: one subdirectory holding a single
`.dc.html` page that shows a Figma-style storyboard of every screen state (static, scaled-down
frames) alongside ONE live interactive device that runs the entire flow. The board follows the
device: whichever state the live prototype is in, the matching storyboard frame gets a green ring.

`onboarding/` is the reference implementation. Read these three files before writing anything —
they are the pattern, and everything below is just a map of them:

- `onboarding/Onboarding.dc.html` — the board page (header, storyboard rows, live device, stage machine)
- `onboarding/storyboards/screens.jsx` — the unified screen components library (IntroScreen, PhoneScreen, OtpScreen)
- `onboarding/storyboards/intro-row.jsx` — a storyboard row (imports and renders IntroScreen from screens.jsx)
- `_theme/poc.css` — the board CSS (`.poc-stage`, `.poc-board`, `.noor-frame`, `.noor-screen`, …); do not redefine these

## Anatomy

```
<section>/                      e.g. dua-dikhr/  (kebab-case directory)
├── <Section>.dc.html           e.g. Dua & Dikhr.dc.html — the one page users open
└── storyboards/
    ├── screens.jsx             holds the shared, unified screen React components
    ├── <flow-a>-row.jsx        one row per flow, rendering screens from screens.jsx
    └── <flow-b>-row.jsx
```

The old flat pages at the repo root are **replaced** by the section — after the board works,
delete them, update their Index cards, and repoint every inbound link (see Step 5).

## Step 1 — Inventory the source screens

Read each flat page being combined. For every page list: the distinct UI states it shows
(each state = one storyboard frame), the interactions it implements (all must survive), the
data arrays it carries (dua text, categories, amounts — copy them, don't invent), and any
hardcoded theming to fix during the move (`dark=""` props, `data-theme="dark"`, literal palette
hex). Then grep for inbound links so nothing 404s later:

```bash
grep -rn "Dua List\|Dua Detail\|Hisnul" --include="*.dc.html" --include="*.jsx" .
```

## Step 2 — Scaffold the board page

The page lives one level deep, so every shared asset needs a `../` prefix. Head + helmet wiring
(this exact order matters — chrome.js must follow support.js, poc.css must follow the DS css):

```html
<head>
  <script src="../support.js"></script>
  <script src="../_theme/chrome.js"></script>
</head>
<!-- in <helmet>: -->
  <link rel="stylesheet" href="../_ds/noor-design-system-46f42e91-1858-412f-bdb6-560a6cc3df9f/colors_and_type.css">
  <link rel="stylesheet" href="../_theme/poc.css">
  <link rel="stylesheet" href="../_theme/components.css">
  <script src="../_ds/noor-design-system-46f42e91-1858-412f-bdb6-560a6cc3df9f/_ds_bundle.js"></script>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0&amp;display=block">
```

Body layout, in order:

1. **Page header** — breadcrumb (`<a href="../Index.dc.html">Noor</a> · Section board`), a
   `var(--font-title)` title naming the flow, and a one-line subtitle. Copy the block from
   Onboarding and reword.
2. **`.poc-stage`** containing:
   - **`.poc-frames`** — one `<x-import>` per storyboard row:
     `<x-import component="DuaListRow" from="./storyboards/dua-list-row.jsx" active="{{ duaListActive }}" hint-size="760px,560px">`
    - **Live Device Prototype**: Wrapped in `BoardLive` to establish the floating layout:
      `<x-import component="BoardLive" from="../_theme/board.jsx" restart="{{ restart }}" hint-size="400px,900px">`
      which nests `<x-import component="IOSDevice" from="../ios-frame.jsx" hint-size="402px,874px">` holding the `<sc-if>` stages.

The full annotated skeleton (board page AND row jsx) is in `references/board-anatomy.md` —
read it when writing the files rather than improvising structure.

## Step 3 — Storyboard rows

Each row is a small JSX file that renders every state of one flow as static frames. The contract
(see `intro-row.jsx`):

- A data array at the top holding per-frame content (reuse the source page's real data).
- The row renders `.poc-row-label` (numbered: `01 · Dua list — categories · 4 states`) above a `.poc-board`.
- It maps over the state array to render a list of `.poc-board-item` blocks containing the static frame container:
  `.noor-frame` (`--s:0.46`) → `.noor-frame-inner` → `.noor-screen` (with `.noor-island` and `.noor-home` decorators).
- It retrieves the shared React screen components from the `window` scope (e.g. `const { CategoriesScreen } = window;`) and renders them as standard React child nodes inside the `.noor-screen` container.
- Highlighting follows the live device: the active frame index gets the `is-active` class on `.noor-frame`.
- Caption every frame (`.poc-frame-caption`, `1 · Category grid`).

## Step 4 — The live device: one stage machine

One `DCLogic` component drives the whole flow:

- `state.stage` selects which `<sc-if>` stage renders; initial stage comes from the URL hash so
  Index cards can deep-link: `stage: (location.hash === '#detail' ? 'detail' : 'list')`.
- Forward/back transitions set `stepDir` and reuse the `.step-fwd` / `.step-back` animation
  classes from Onboarding's helmet style.
- Every interaction from the source pages must survive the move (tabs, favorites, counters,
  audio bars, list → detail taps…). Copy the source handlers and state; adapt navigation
  between pages into stage changes.
- Clear timers in `componentWillUnmount`; every binding used in markup must be returned from
  `renderVals()` — the runtime fails silently otherwise.
- Per-row `active` bindings map the live state to a frame index (`-1` when that row isn't
  current) so the ring follows the device.
- Links out of the section (Home, bottom nav) use `../Page Name.dc.html`.

## Step 5 — Theming and DS fidelity

- Tokens only: `var(--color-*)`. When the source page is dark-hardcoded, map literals by role —
  `#fff` text → `--color-info-primary`, `rgba(255,255,255,.5)` → `--color-info-secondary`,
  near-black tinted cards → `color-mix(in oklab, var(--color-action-primary) 5%, var(--color-surface-primary))`,
  `rgba(0,201,80,.22)` borders → `color-mix(in oklab, var(--color-action-primary) 22%, transparent)`.
  Leave literal only: colors composited over photos/imagery and data colors (chart accents).
- Remove every `dark=""` prop and hardcoded `data-theme` — the frame and tokens follow the
  global theme via chrome.js.
- Use `_theme/components.css` classes (`.btn`, `.ib`, `.tbar`, `.input`, `.sw`, `.cb`, …) instead
  of re-implementing components inline; `Components.dc.html` is the visual reference.
- Arabic text uses `var(--font-arabic)` (or the AlQuranIndoPak @font-face like Dua Detail).

## Step 6 — Rewire the rest of the repo

1. **Index.dc.html** — in the `data` array, replace the old flat-page cards with one card per
   flow row pointing at anchors: `{ name: 'Dua List', file: 'dua-dikhr/Dua & Dikhr.dc.html#list', … }`.
   Keep or add the section's chip if it warrants its own filter.
2. **Inbound links** — every page found in Step 1's grep gets repointed to the new file
   (root-level pages link WITHOUT `../`: `dua-dikhr/Dua & Dikhr.dc.html`).
3. **Delete the replaced flat pages** — the board supersedes them (Onboarding replaced the
   Intro/Phone Login/OTP pages the same way).

## Step 7 — Verify before you're done

Run the bundled checker on the new page (script syntax, bindings vs `renderVals()`, link
targets, theming leftovers):

```bash
python3 .claude/skills/add-screen/scripts/check_page.py "<section>/<Section>.dc.html"
```

Then prove it in the browser (serve with `python3 _theme/devserver.py 8474` — the plain
http.server serves stale files): walk every stage of the live flow, click at least one
storyboard deep-link anchor from Index, and flip light/dark with the chrome switcher. Fix and
re-check until clean. The graphify pre-commit hook updates the knowledge graph on commit —
nothing to do manually.
