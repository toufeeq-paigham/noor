# Graph Report - noor  (2026-07-07)

## Corpus Check
- 21 files · ~2,666,199 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 380 nodes · 426 edges · 22 communities (14 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6807326c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 21|Community 21]]

## God Nodes (most connected - your core abstractions)
1. `tokenKinds` - 141 edges
2. `Agent Behavior` - 13 edges
3. `Visual foundations` - 13 edges
4. `Add a section board to the Noor POC` - 9 edges
5. `useNoorDark()` - 8 edges
6. `Noor POC conversion spec` - 8 edges
7. `walkChildren()` - 7 edges
8. `walk()` - 7 edges
9. `createRuntime()` - 7 edges
10. `Noor Design System` - 7 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (22 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.01
Nodes (141): --body-h1-lh, --body-h1-size, --body-h1-tracking, --body-h2-lh, --body-h2-size, --body-h2-tracking, --body-h3-lh, --body-h3-size (+133 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (40): boot(), collectProps(), compileAttr(), compileTemplate(), createComponentFactory(), createExternalModules(), createHelmetManager(), createPseudoSheet() (+32 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (22): Animation, Backgrounds, Blur / transparency, Cards, Content fundamentals, Corner radii, Don't, Iconography (+14 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (12): brandFonts, cards, components, fonts, globalCssPaths, hasThumbnailHtml, namespace, source (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (10): overrides, plugins, rules, no-restricted-imports, no-restricted-syntax, react/forbid-elements, x-omelette, components (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.42
Nodes (10): apply(), buildChrome(), getMode(), initCanvas(), initPan(), initScrollPan(), isInteractive(), resolved() (+2 more)

### Community 7 - "Community 7"
Cohesion: 0.42
Nodes (8): IOSDevice(), IOSGlassPill(), IOSKeyboard(), IOSList(), IOSListRow(), IOSNavBar(), IOSStatusBar(), useNoorDark()

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (8): 1. Framework cheatsheet (`.dc.html` pages), 2. Required page wiring, 3. Color token mapping (hex → var), 4. Interactivity requirements, 5. Navigation, 6. Do not touch, 7. Self-verification (before you finish), Noor POC conversion spec

### Community 9 - "Community 9"
Cohesion: 0.50
Nodes (3): INTRO_SLIDES, introDots(), introFrame()

### Community 15 - "Community 15"
Cohesion: 0.10
Nodes (18): Agent Behavior, Commit Messages, Design System Rules, graphify, Project Structure, Rule 10 — Checkpoint after every significant step, Rule 11 — Match the codebase's conventions, even if you disagree, Rule 12 — Fail loud (+10 more)

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (9): Add a section board to the Noor POC, Anatomy, Step 1 — Inventory the source screens, Step 2 — Scaffold the board page, Step 3 — Storyboard rows, Step 4 — The live device: one stage machine, Step 5 — Theming and DS fidelity, Step 6 — Rewire the rest of the repo (+1 more)

### Community 17 - "Community 17"
Cohesion: 0.40
Nodes (4): 1. The board page — `<section>/<Section>.dc.html`, 2. A storyboard row — `<section>/storyboards/<flow>-row.jsx`, Index registration, Section board — annotated skeletons

## Knowledge Gaps
- **224 isolated node(s):** `skill_name`, `evals`, `int`, `version`, `configurations` (+219 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `tokenKinds` connect `Community 0` to `Community 5`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Why does `x-omelette` connect `Community 5` to `Community 0`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `skill_name`, `evals`, `int` to the rest of the system?**
  _224 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.014184397163120567 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06918238993710692 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._