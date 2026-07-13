---
name: add-screen
description: "Add a new section board to the Noor design POC by combining existing flat *.dc.html screens into a subdirectory flow, exactly like onboarding/. Use this whenever the user asks to add screens, add a section, combine/merge screens into a flow, build a board for a feature (Dua, Zakaat, Quran, Masjid, Profile…), or says 'like how we have onboarding' — even if they don't say 'board' or 'section' explicitly."
---

# Add a section board to the Noor POC

A **section board** is how this repo presents a feature flow: one subdirectory holding a single
`.dc.html` page that shows a Figma-style storyboard of every screen state (static, scaled-down
frames) alongside ONE live interactive device that runs the entire flow. The board follows the
device: whichever state the live prototype is in, the matching storyboard frame gets a green ring.

**CRITICAL — every board MUST have BOTH of these on the first build:**

1. **Static storyboard frames** (left side) — scaled-down device mockups showing every UI state
   in the flow. These are rendered by storyboard row JSX files (`*-row.jsx`). Each row maps over
   a frames array and renders the shared screen components from `screens.jsx` inside
   `.noor-frame` containers.
2. **Interactive live device pane** (right side) — a single `BoardLive` → `IOSDevice` container
   running the full interactive prototype. Users click through the flow here, and the matching
   storyboard frame highlights with a green ring.

Do NOT ship only one of these. A board with only static frames or only a live device is
incomplete.

`src/onboarding/` is the reference implementation. Read these three files before writing anything —
they are the pattern, and everything below is just a map of them:

- `src/onboarding/Onboarding.dc.html` — the board page (header, storyboard rows, live device, stage machine)
- `src/onboarding/storyboards/screens.jsx` — the unified screen components library (IntroScreen, PhoneScreen, OtpScreen)
- `src/onboarding/storyboards/intro-row.jsx` — a storyboard row (imports and renders IntroScreen from screens.jsx)
- `src/_theme/poc.css` — the board CSS (`.poc-stage`, `.poc-board`, `.noor-frame`, `.noor-screen`, …); do not redefine these

## Anatomy

```
src/<section>/                  e.g. src/dua-dikhr/  (kebab-case directory)
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
- **Icons in row labels** must use the `data-i` attribute, NOT ligature text:
  `<span className="mi" data-i="grid_view"></span>` — NEVER `<span className="mi">grid_view</span>`
  (the latter renders the text visibly, overlapping the label).
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

### Pre-loading cross-section components (React Error #130 prevention)

When a board embeds components from another section (e.g. importing `HomeScreen` from
`../home/storyboards/screens.jsx` for a flow that starts on the Home tab), those components
and ALL their transitive dependencies must be pre-loaded BEFORE any JSX that references them.

**Load order matters.** If `HomeScreen` internally uses `PromptCard` and `BottomNav`, then
`PromptCard` and `BottomNav` must load first. Otherwise React throws Error #130 ("Element
type is invalid — got undefined") because the component resolves to `undefined` at render time.

Pre-load with hidden zero-size imports at the top of the board page, dependencies first:

```html
<div style="display: none">
  <x-import component="PromptCard" from="../_theme/components.jsx" hint-size="0,0"></x-import>
  <x-import component="BottomNav" from="../home/storyboards/nav-bar.jsx" hint-size="0,0"></x-import>
  <x-import component="HomeScreen" from="../home/storyboards/screens.jsx" hint-size="0,0"></x-import>
</div>
```

The `display: none` wrapper prevents these from rendering visibly on the canvas while still
registering the components on `window` scope for the storyboard rows and live device.

## Step 5 — Theming and DS fidelity

- Tokens only: `var(--color-*)`. When the source page is dark-hardcoded, map literals by role —
  `#fff` text → `--color-info-primary`, `rgba(255,255,255,.5)` → `--color-info-secondary`,
  near-black tinted cards → `color-mix(in oklab, var(--color-action-primary) 5%, var(--color-surface-primary))`,
  `rgba(0,201,80,.22)` borders → `color-mix(in oklab, var(--color-action-primary) 22%, transparent)`.
  Leave literal only: colors composited over photos/imagery and data colors (chart accents).
- Remove every `dark=""` prop and hardcoded `data-theme` — the frame and tokens follow the
  global theme via chrome.js.
- Use `_theme/components.css` classes (`.btn`, `.ib`, `.tbar`, `.input`, `.sw`, `.cb`, …) instead
  of re-implementing components inline; `Components.dc.html` is the visual reference. **Reference,
  don't rebuild** — never inline a style that duplicates a component class (e.g. copying
  `.ab-title`'s font/size instead of using the class).
- Arabic text uses the `AlQuranIndoPak` @font-face — declare it in the board helmet with the `../`
  prefix: `@font-face{font-family:'AlQuranIndoPak';src:url('../_ds/noor-design-system-…/fonts/AlQuran-IndoPak.ttf') format('truetype')}`.

### App bar — use the DS `.app-bar` (progressive blur), like Home

Every screen's top bar is the shared `.app-bar` component: transparent, `position:absolute`, with a
`::before` layer that applies `backdrop-filter:blur(20px)` masked by a top→bottom gradient so the
blur fades out toward the content (the "progressive blur"). **Content scrolls UNDER it**, exactly
like `home/`.

Build one shared `AppBar` helper in `screens.jsx` and structure every screen as
`root(position:relative;overflow:hidden)` → `scroll layer(position:absolute;inset:0;overflowY:auto;paddingTop:APPBAR_H)`
→ `<AppBar/>` floating on top. The bar carries a `.ib.ib-tonal.md` back button and an `.ab-title`
(never a hand-rolled title). Do **not** put a hard `border-bottom` on it — the blur is the divider.

```jsx
const APPBAR_H = 96;         // title-only bar
const APPBAR_H_TABS = 150;   // title bar + pinned tab row
function AppBar({ title, onBack, tabs }) {
  return (
    <div className="app-bar" style={{ flexDirection:'column', alignItems:'stretch', gap:0,
         height: tabs ? APPBAR_H_TABS : APPBAR_H, padding:'52px 16px 10px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <button className="ib ib-tonal md" onClick={onBack} aria-label="Back"><span className="mi" data-i="arrow_back"></span></button>
        <div className="ab-title">{title}</div>
      </div>
      {tabs ? <div style={{ marginTop:12 }}>{tabs}</div> : null}
    </div>
  );
}
```

**A tab bar belongs INSIDE the app bar, pinned — it must NOT scroll.** Pass the `.tbar` as the
`tabs` prop (it stays crisp; the mask only fades the `::before` blur, not the bar's children) and set
the scroll layer's `paddingTop` to `APPBAR_H_TABS`. Don't render the tabs as the first scrolling item.

### Audio player — use the DS `.aplayer` molecule, don't build a container

For play/pause + waveform, use the `.aplayer` molecule (`.ap-toggle` · `.ap-time` · `.ap-wave`
`i`/`i.on` + `.ap-head` · `.ap-close`), and add `.dock-bottom` to pin it to the device's bottom edge.
Never hand-roll a bespoke audio bar/container. Give it **real progressing state** (mirror the
Organisms page): a 1s timer on the board's `DCLogic` increments `apProgress`; `renderVals` derives
`apTime`, the played-bar count, and the `ap-head` left %. Clear the timer in `componentWillUnmount`
and on every navigation away. Docking is `position:absolute` — the screen root must be
`position:relative`, and pad the scroll area's bottom so the last line clears the player.

## Step 6 — Rewire the rest of the repo

1. **src/Index.dc.html** — in the `data` array, replace the old flat-page cards with **one single
   card for the section** (not one per flow row), pointing at the board's entry anchor:
   `{ name: 'Dua & Dikhr', file: 'dua-dikhr/Dua & Dikhr.dc.html#categories', icon: 'volunteer_activism', meta: 'Section board · … · N states' }`.
   Keep or add the section's chip if it warrants its own filter.
2. **Home Screen entry point** — if the flow is reachable from a Home card/tool, wire the REAL
   `home/Home Screen.dc.html` (not just the board's embedded Home) to navigate there, exactly like
   `goHijri`: add a `goX = () => { window.location.href = '../dua-dikhr/Dua & Dikhr.dc.html#categories'; }`
   handler, bind it on the `HomeScreen` x-import (`go-dua="{{ goX }}"`), and register it in
   `renderVals()`. Note the two Homes differ: the board's own embedded Home wires that same prop to
   an in-board **stage** handler (`goCategoriesStage`); the standalone Home page wires it to a
   cross-page **navigation**.
3. **Inbound links** — every page found in Step 1's grep gets repointed to the new file
   (root-level pages link WITHOUT `../`: `src/dua-dikhr/Dua & Dikhr.dc.html`).
4. **Delete the replaced flat pages** — the board supersedes them (Onboarding replaced the
   Intro/Phone Login/OTP pages the same way).

## Step 7 — Verify before you're done

Run the bundled checker on the new page (script syntax, bindings vs `renderVals()`, link
targets, theming leftovers):

```bash
python3 .claude/skills/add-screen/scripts/check_page.py "src/<section>/<Section>.dc.html"
```

Then prove it in the browser (serve with `python3 src/_theme/devserver.py 8474` — the plain
http.server serves stale files; if you must use one, a revalidating `location.reload()` — NOT a
hash navigation — is needed to pick up edited `.jsx`). Walk every stage of the live flow, confirm
the ring follows the device, and specifically exercise: the Home card → board entry, a pinned tab
bar staying fixed while content scrolls under the app bar, and the audio player progressing +
play/pause/close. Click at least one storyboard deep-link anchor from Index, and flip light/dark
with the chrome switcher. Fix and re-check until clean. The graphify pre-commit hook updates the
knowledge graph on commit — nothing to do manually.
