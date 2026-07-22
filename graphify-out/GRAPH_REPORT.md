# Graph Report - noor  (2026-07-22)

## Corpus Check
- 103 files · ~376,488 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1144 nodes · 1614 edges · 88 communities (55 shown, 33 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 118 edges (avg confidence: 0.72)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c77b0ff0`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- tokenKinds
- support.js
- react
- Visual foundations
- _ds_manifest.json
- x-omelette
- chrome.js
- useNoorDark
- dependencies
- intro-row.jsx
- start.sh
- NoCacheHandler
- launch.json
- otp-row.jsx
- phone-row.jsx
- Agent Behavior
- toolbar.tsx
- Section board — annotated skeletons
- main
- .claude/skills/add-screen/evals/evals.json
- types.ts
- onboarding/storyboards/screens.jsx
- Agent Behavior
- Add a section board to the Noor POC
- Add a section board to the Noor POC
- Section board — annotated skeletons
- slide-canvas.tsx
- eval-0-dua-dikhr-section/eval_metadata.json
- eval-1-zakaat-section/eval_metadata.json
- .agents/skills/add-screen/evals/evals.json
- main
- compilerOptions
- screenshot-editor.tsx
- home/storyboards/screens.jsx
- tabs-row.jsx
- nav-bar.jsx
- hijri/storyboards/screens.jsx
- calendar-row.jsx
- dua-dikhr/storyboards/screens.jsx
- asma-ul-husna/storyboards/screens.jsx
- dua-row.jsx
- names-row.jsx
- masjid-explore/storyboards/screens.jsx
- sehri/storyboards/screens.jsx
- zakaat/storyboards/screens.jsx
- states-row.jsx
- quran-reader.jsx
- zakaat-row.jsx
- list-row.jsx
- map-row.jsx
- pincode-row.jsx
- qr-row.jsx
- sehri-row.jsx
- personal-details/storyboards/screens.jsx
- details-row.jsx
- masjid-register/storyboards/screens.jsx
- qibla/storyboards/screens.jsx
- sheet-row.jsx
- constants.ts
- wizard-row.jsx
- outcome-row.jsx
- ar-row.jsx
- setup-row.jsx
- build.mjs
- package.json
- hosting
- Handler
- UX-06: Islamic content and tools
- masjid-operations/storyboards/screens.jsx
- Noor UI/UX Upgrade Decisions
- devDependencies
- UX-03: Home landing and shared five-tab shell
- UX-04: Quran index and reader
- UX-03 five-tab visual parity pass — 2026-07-21
- UX-05: Masjid discovery, registration, and claim
- Sehri supplied-capture repair pass — 2026-07-21
- inspector.tsx
- components.json
- storage.ts
- App Store Screenshots — Editor Template
- defaults.ts
- upload/route.ts
- project/route.ts
- layout.tsx
- next.config.mjs
- tailwind.config.ts

## God Nodes (most connected - your core abstractions)
1. `tokenKinds` - 187 edges
2. `react` - 54 edges
3. `Noor UI/UX Upgrade Decisions` - 17 edges
4. `compilerOptions` - 16 edges
5. `ScreenshotEditor()` - 15 edges
6. `cn()` - 14 edges
7. `HomeScreen()` - 13 edges
8. `Agent Behavior` - 13 edges
9. `Agent Behavior` - 13 edges
10. `Visual foundations` - 13 edges

## Surprising Connections (you probably didn't know these)
- `QaumScreen()` --references--> `react`  [EXTRACTED]
  src/home/storyboards/screens.jsx → app-store-screenshots/package.json
- `SalaahScreen()` --references--> `react`  [EXTRACTED]
  src/home/storyboards/screens.jsx → app-store-screenshots/package.json
- `ZakaatStepScreen()` --references--> `react`  [EXTRACTED]
  src/zakaat/storyboards/screens.jsx → app-store-screenshots/package.json
- `IOSList()` --references--> `react`  [EXTRACTED]
  src/_ds/noor-design-system-46f42e91-1858-412f-bdb6-560a6cc3df9f/_ds_bundle.js → app-store-screenshots/package.json
- `IOSListRow()` --references--> `react`  [EXTRACTED]
  src/_ds/noor-design-system-46f42e91-1858-412f-bdb6-560a6cc3df9f/_ds_bundle.js → app-store-screenshots/package.json

## Import Cycles
- None detected.

## Communities (88 total, 33 thin omitted)

### Community 0 - "tokenKinds"
Cohesion: 0.01
Nodes (187): --body-h1-lh, --body-h1-size, --body-h1-tracking, --body-h2-lh, --body-h2-size, --body-h2-tracking, --body-h3-lh, --body-h3-size (+179 more)

### Community 1 - "support.js"
Cohesion: 0.08
Nodes (42): boot(), collectProps(), compileAttr(), compileTemplate(), createComponentFactory(), createExternalModules(), createHelmetManager(), createPseudoSheet() (+34 more)

### Community 2 - "react"
Cohesion: 0.15
Nodes (41): react, react, Badge(), BodyM(), BodyS(), BodyXS(), Checkbox(), ExploreScreen() (+33 more)

### Community 3 - "Visual foundations"
Cohesion: 0.09
Nodes (22): Animation, Backgrounds, Blur / transparency, Cards, Content fundamentals, Corner radii, Don't, Iconography (+14 more)

### Community 4 - "_ds_manifest.json"
Cohesion: 0.15
Nodes (12): brandFonts, cards, components, fonts, globalCssPaths, hasThumbnailHtml, namespace, source (+4 more)

### Community 5 - "x-omelette"
Cohesion: 0.18
Nodes (10): overrides, plugins, rules, no-restricted-imports, no-restricted-syntax, react/forbid-elements, x-omelette, components (+2 more)

### Community 6 - "chrome.js"
Cohesion: 0.15
Nodes (18): ENTRY_FRAMES, EntryRow(), frame(), NAV, apply(), buildChrome(), buildDrawer(), closeDrawer() (+10 more)

### Community 7 - "useNoorDark"
Cohesion: 0.42
Nodes (8): IOSDevice(), IOSGlassPill(), IOSKeyboard(), IOSList(), IOSListRow(), IOSNavBar(), IOSStatusBar(), useNoorDark()

### Community 8 - "dependencies"
Cohesion: 0.04
Nodes (45): dependencies, class-variance-authority, clsx, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, html-to-image, jszip (+37 more)

### Community 15 - "Agent Behavior"
Cohesion: 0.11
Nodes (19): Agent Behavior, Commit Messages, Design System Rules, graphify, Layer Architecture — HARD RULES (do not violate), Project Structure, Rule 10 — Checkpoint after every significant step, Rule 11 — Match the codebase's conventions, even if you disagree (+11 more)

### Community 16 - "toolbar.tsx"
Cohesion: 0.08
Nodes (31): Props, SaveStatus(), Toolbar(), Card, CardContent, CardHeader, CardTitle, DialogContent (+23 more)

### Community 17 - "Section board — annotated skeletons"
Cohesion: 0.29
Nodes (6): 1. The board page — `<section>/<Section>.dc.html`, 2. A storyboard row — `<section>/storyboards/<flow>-row.jsx`, 3. Shared screen components — `<section>/storyboards/screens.jsx`, Index registration, Pre-loading cross-section components, Section board — annotated skeletons

### Community 20 - "types.ts"
Cohesion: 0.12
Nodes (26): PreviewStage(), Props, Props, Sidebar(), DeckCanvas(), getCanvas(), SlideCanvas(), Props (+18 more)

### Community 22 - "Agent Behavior"
Cohesion: 0.10
Nodes (20): Agent Behavior, Canonical Product Flows — Read Before Journey Design, Commit Messages, Design System Rules, graphify, Layer Architecture — HARD RULES (do not violate), Project Structure, Rule 10 — Checkpoint after every significant step (+12 more)

### Community 23 - "Add a section board to the Noor POC"
Cohesion: 0.15
Nodes (12): Add a section board to the Noor POC, Anatomy, App bar — use the DS `.app-bar` (progressive blur), like Home, Audio player — use the DS `.aplayer` molecule, don't build a container, Pre-loading cross-section components (React Error #130 prevention), Step 1 — Inventory the source screens, Step 2 — Scaffold the board page, Step 3 — Storyboard rows (+4 more)

### Community 24 - "Add a section board to the Noor POC"
Cohesion: 0.15
Nodes (12): Add a section board to the Noor POC, Anatomy, App bar — use the DS `.app-bar` (progressive blur), like Home, Audio player — use the DS `.aplayer` molecule, don't build a container, Pre-loading cross-section components (React Error #130 prevention), Step 1 — Inventory the source screens, Step 2 — Scaffold the board page, Step 3 — Storyboard rows (+4 more)

### Community 25 - "Section board — annotated skeletons"
Cohesion: 0.29
Nodes (6): 1. The board page — `<section>/<Section>.dc.html`, 2. A storyboard row — `<section>/storyboards/<flow>-row.jsx`, 3. Shared screen components — `<section>/storyboards/screens.jsx`, Index registration, Pre-loading cross-section components, Section board — annotated skeletons

### Community 26 - "slide-canvas.tsx"
Cohesion: 0.10
Nodes (23): backgroundFor(), clampRect(), DeckCanvasProps, DeckEditHandlers, defaultElementZ(), EditableText(), EditHandlers, FeatureGraphicCanvas() (+15 more)

### Community 27 - "eval-0-dua-dikhr-section/eval_metadata.json"
Cohesion: 0.40
Nodes (4): assertions, eval_id, eval_name, prompt

### Community 28 - "eval-1-zakaat-section/eval_metadata.json"
Cohesion: 0.40
Nodes (4): assertions, eval_id, eval_name, prompt

### Community 31 - "compilerOptions"
Cohesion: 0.07
Nodes (26): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+18 more)

### Community 32 - "screenshot-editor.tsx"
Cohesion: 0.13
Nodes (14): ScreenshotEditor(), ACCEPTED, Props, ScreenshotPicker(), hasTheme(), themeById(), cache, didFail() (+6 more)

### Community 33 - "home/storyboards/screens.jsx"
Cohesion: 0.12
Nodes (6): QAUM_AMP, QaumAudioPlayer(), qaumBars(), QaumScreen(), qaumTime(), SalaahScreen()

### Community 34 - "tabs-row.jsx"
Cohesion: 0.14
Nodes (17): HOME_DATA_FRAMES, HomePrayerRow(), HomeRow(), PRAYER_FRAMES, PROFILE_EXTRA_FRAMES, ProfileRow(), QAUM_DATA_FRAMES, QAUM_EXTRA_FRAMES (+9 more)

### Community 39 - "dua-dikhr/storyboards/screens.jsx"
Cohesion: 0.15
Nodes (8): AUDIO_AMP, audioBars(), DUA_CATEGORIES, DUA_DETAIL, DUA_LIST, DuaDetailScreen(), FAVOURITE_ITEMS, fmtTime()

### Community 40 - "asma-ul-husna/storyboards/screens.jsx"
Cohesion: 0.24
Nodes (6): DetailOverlay(), GridScreen(), NAMES, SCHEMES, schemeStyle(), screenStyle

### Community 43 - "masjid-explore/storyboards/screens.jsx"
Cohesion: 0.16
Nodes (5): ExploreListScreen(), ExploreMapScreen(), masjidCardTransitionName(), MASJIDS, PIN_KEYS

### Community 46 - "states-row.jsx"
Cohesion: 0.20
Nodes (10): GUEST_STATES, GuestRow, makeRow(), NO_MASJID_STATES, NO_TRACK, NoMasjidRow, NOTIF_STATES, NotifRow (+2 more)

### Community 56 - "masjid-register/storyboards/screens.jsx"
Cohesion: 0.12
Nodes (7): CLAIM_DATA, FOLLOW_DATA, MANAGE_DATA, MASLAK_LIST, ROLE_LIST, WIZARD_SUB, WIZARD_TITLE

### Community 57 - "qibla/storyboards/screens.jsx"
Cohesion: 0.25
Nodes (3): bpt(), CompassDial(), QIBLA_AR_METRICS

### Community 58 - "sheet-row.jsx"
Cohesion: 0.52
Nodes (6): buildFollowRows(), buildManageTiles(), frame(), noop(), sheetFrames(), SheetRow()

### Community 59 - "constants.ts"
Cohesion: 0.14
Nodes (21): AndroidPhone(), AndroidTabletL(), AndroidTabletP(), FrameProps, IPad(), Phone(), getFrameForDevice(), CANVAS (+13 more)

### Community 60 - "wizard-row.jsx"
Cohesion: 0.70
Nodes (4): buildClaimResults(), frame(), wizardFrames(), WizardRow()

### Community 61 - "outcome-row.jsx"
Cohesion: 0.67
Nodes (3): frame(), OUTCOME_FRAMES, OutcomeRow()

### Community 64 - "build.mjs"
Cohesion: 0.13
Nodes (11): dirCount, DIST, IMAGES, pages, patchChrome(), resolveWeb(), rewrite(), ROOT (+3 more)

### Community 65 - "package.json"
Cohesion: 0.18
Nodes (10): description, name, private, scripts, build, deploy, preview, serve (+2 more)

### Community 66 - "hosting"
Cohesion: 0.29
Nodes (6): hosting, headers, ignore, public, site, trailingSlash

### Community 68 - "UX-06: Islamic content and tools"
Cohesion: 0.20
Nodes (10): Asma ul Husna design read and state specification — 2026-07-21, Before / After / Why, Before | After | Why, Dua & Dikhr design read and state specification — 2026-07-21, Motion and interaction specification, Motion specification, Motion specification, UX-06: Islamic content and tools (+2 more)

### Community 69 - "masjid-operations/storyboards/screens.jsx"
Cohesion: 0.22
Nodes (5): OP_GROUPS, OP_STATES, OperationScreen(), StatusState(), titleFor()

### Community 70 - "Noor UI/UX Upgrade Decisions"
Cohesion: 0.15
Nodes (12): Before / After / Why, Motion and interaction specification, Motion and interaction specification, Noor specification, Noor UI/UX Upgrade Decisions, Program design read, UX-01 / UX-03 token and metrics reduction — 2026-07-21, UX-02 / UX-03 supplied-capture repair pass — 2026-07-21 (+4 more)

### Community 71 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, autoprefixer, postcss, tailwindcss, @types/node, @types/react, @types/react-dom, typescript (+14 more)

### Community 72 - "UX-03: Home landing and shared five-tab shell"
Cohesion: 0.18
Nodes (14): Approval status, Before / After / Why, Before / After / Why, Certification notes, Design-system impact, Motion and interaction specification, Motion and interaction specification, Qibla recovery completion - 2026-07-21 (+6 more)

### Community 73 - "UX-04: Quran index and reader"
Cohesion: 0.33
Nodes (6): Before / After / Why, Certification notes, Design read, Design-system and UX checklist, Motion specification, UX-04: Quran index and reader

### Community 74 - "UX-03 five-tab visual parity pass — 2026-07-21"
Cohesion: 0.40
Nodes (5): Before / After / Why, Design read and dials, Motion and interaction specification, UX-03 five-tab visual parity pass — 2026-07-21, UX Pro Max result

### Community 75 - "UX-05: Masjid discovery, registration, and claim"
Cohesion: 0.50
Nodes (4): Before / After / Why, Supplied-capture keyboard and registration-alignment repair — 2026-07-21, UX-05: Masjid discovery, registration, and claim, UX and motion specification

### Community 76 - "Sehri supplied-capture repair pass — 2026-07-21"
Cohesion: 0.33
Nodes (6): Before | After | Why, Icon ownership, Motion and interaction specification, Screen-state and UX checklist, Sehri supplied-capture repair pass — 2026-07-21, UX-01: Design-system reconciliation

### Community 77 - "inspector.tsx"
Cohesion: 0.17
Nodes (17): ActiveElementPanel(), defaultZ(), ELEMENT_LABEL, elementLabel(), ElementTransformControls(), Inspector(), Props, TextElementPanel() (+9 more)

### Community 78 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 79 - "storage.ts"
Cohesion: 0.29
Nodes (13): DEFAULT_PROJECT, coerceLocalized(), applyUpdater(), cleanTextElement(), cleanTransform(), loadFromFile(), loadFromLocalStorage(), mergeWithDefaults() (+5 more)

### Community 80 - "App Store Screenshots — Editor Template"
Cohesion: 0.25
Nodes (7): Adding screenshots, App Store Screenshots — Editor Template, Customizing, Exporting, Notes, Quick start, What's inside

### Community 81 - "defaults.ts"
Cohesion: 0.61
Nodes (7): en(), fgStarter(), ipadStarter(), makeStarterSlides(), newSlide(), nid(), tabletStarter()

### Community 82 - "upload/route.ts"
Cohesion: 0.50
Nodes (4): MIME_EXT, parseDataUrl(), POST(), UPLOAD_DIR_REL

### Community 83 - "project/route.ts"
Cohesion: 0.83
Nodes (3): filePath(), GET(), POST()

## Knowledge Gaps
- **547 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+542 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `screenshot-editor.tsx`, `home/storyboards/screens.jsx`, `support.js`, `useNoorDark`, `dependencies`, `inspector.tsx`, `zakaat/storyboards/screens.jsx`, `toolbar.tsx`, `types.ts`, `slide-canvas.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `react`, `devDependencies`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `tokenKinds` connect `tokenKinds` to `x-omelette`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _547 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `tokenKinds` be split into smaller, more focused modules?**
  _Cohesion score 0.0106951871657754 - nodes in this community are weakly interconnected._
- **Should `support.js` be split into smaller, more focused modules?**
  _Cohesion score 0.07966457023060797 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.14587737843551796 - nodes in this community are weakly interconnected._