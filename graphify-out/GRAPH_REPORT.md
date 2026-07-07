# Graph Report - noor  (2026-07-07)

## Corpus Check
- 14 files · ~2,662,647 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 328 nodes · 381 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `23d6f2e0`
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

## God Nodes (most connected - your core abstractions)
1. `tokenKinds` - 141 edges
2. `Visual foundations` - 13 edges
3. `useNoorDark()` - 8 edges
4. `Noor POC conversion spec` - 8 edges
5. `walkChildren()` - 7 edges
6. `walk()` - 7 edges
7. `createRuntime()` - 7 edges
8. `Noor Design System` - 7 edges
9. `apply()` - 6 edges
10. `compileAttr()` - 6 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (15 total, 3 thin omitted)

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

## Knowledge Gaps
- **190 isolated node(s):** `version`, `configurations`, `plugins`, `react/forbid-elements`, `no-restricted-imports` (+185 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `tokenKinds` connect `Community 0` to `Community 5`?**
  _High betweenness centrality (0.211) - this node is a cross-community bridge._
- **Why does `x-omelette` connect `Community 5` to `Community 0`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `version`, `configurations`, `plugins` to the rest of the system?**
  _190 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.014184397163120567 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06918238993710692 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._