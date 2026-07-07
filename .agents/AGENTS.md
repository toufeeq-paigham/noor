## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and
cross-file relationships.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json
  exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for
  focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw
  grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do
  not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

# AGENTS.md

This file provides guidance to Antigravity Agent when working with code in this
repository.

## Agent Behavior

These rules apply to every task in this project unless explicitly overridden.
Bias: caution over speed on non-trivial work.

### Rule 1 — Think Before Coding

State assumptions explicitly. Ask rather than guess.
Push back when a simpler approach exists. Stop when confused.

### Rule 2 — Simplicity First

Minimum code that solves the problem. Nothing speculative.
No abstractions for single-use code.

### Rule 3 — Surgical Changes

Touch only what you must. Don't improve adjacent code.
Match existing style. Don't refactor what isn't broken.

### Rule 4 — Goal-Driven Execution

Define success criteria. Loop until verified.
Strong success criteria let Claude loop independently.

### Rule 5 — Use the model only for judgment calls

Use for: classification, drafting, summarization, extraction.
Do NOT use for: routing, retries, deterministic transforms.
If code can answer, code answers.

### Rule 6 — Token budgets are not advisory

Per-task: 4,000 tokens. Per-session: 30,000 tokens.
If approaching budget, summarize and start fresh.
Surface the breach. Do not silently overrun.

### Rule 7 — Surface conflicts, don't average them

If two patterns contradict, pick one (more recent / more tested).
Explain why. Flag the other for cleanup.

### Rule 8 — Read before you write

Before adding code, read exports, immediate callers, shared utilities.
If unsure why existing code is structured a certain way, ask.

### Rule 9 — Tests verify intent, not just behavior

Tests must encode WHY behavior matters, not just WHAT it does.
A test that can't fail when business logic changes is wrong.

### Rule 10 — Checkpoint after every significant step

Summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back.

### Rule 11 — Match the codebase's conventions, even if you disagree

Conformance > taste inside the codebase.
If you think a convention is harmful, surface it. Don't fork silently.

### Rule 12 — Fail loud

"Completed" is wrong if anything was skipped silently.
"Tests pass" is wrong if any were skipped.
Default to surfacing uncertainty, not hiding it.

## Run Commands

Static site — no build step. Serve the repo root and open pages in a browser:

```bash
# Dev server with caching disabled (preferred — stock http.server serves stale files)
python3 _theme/devserver.py 8474

# Plain static server (ports 8471–8473 configured in .claude/launch.json)
python3 -m http.server 8471
```

Entry point: `Index.dc.html` (Figma-style cover linking every page).

## Project Structure

Interactive design POC for the Paigham "Noor" app. Every screen is a self-contained `*.dc.html`
page at the repo root (plus `onboarding/Onboarding.dc.html`), rendered by a custom runtime:

- `support.js` — the "dc" framework: `<x-dc>` root, `<helmet>` for page styles, `{{ }}` bindings,
  `<sc-if>` / `<sc-for list as>` (single root child per iteration), and one
  `<script type="text/x-dc" data-dc-script>` holding `class Component extends DCLogic` with
  `state`, handlers, and `renderVals()` (every binding used in markup must be returned from it).
- `_ds/noor-design-system-*/` — runtime copy of the design system: `colors_and_type.css`
  (semantic light+dark tokens, mirrors the Kotlin tokens in paigham-app) and `_ds_bundle.js`
  (React components; its `NOOR` object resolves to CSS vars so embeds are theme-aware).
- `_theme/` — shared canvas layer: `chrome.js` (light/dark/system switcher persisted in
  localStorage, sets `data-theme` on `<html>`, injects the Index link + theme chrome on every
  page), `poc.css` (canvas tokens), `components.css` (the DS component CSS kit — see below).
- `ios-frame.jsx` — the iOS device frame; follows the global theme automatically.
- `Tokens.dc.html` / `Components.dc.html` — living previews of the token set and component kit.

## Design System Rules

- **Canonical source:** the exported DS in `~/Downloads/Noor Design System (1)/preview/*.html`
  (also mirrored beside older copies) is ground truth for component construction. When a local
  style drifts from it, sync FROM canonical — do not fork.
- **Tokens only:** style with `var(--color-*)` semantic tokens. No hardcoded palette hex except
  data colors (chart accents, badge accent hues) and text composited over photos/gradients.
- **Reference, don't rebuild:** shared component constructions live in `_theme/components.css`
  (`.btn`, `.ib`, `.badge`, `.input`/`.phone`/`.otp`, `.sw`, `.cb`, `.tbar`, `.dd-menu`, `.surf`,
  `.nb-bar`, …). Screens must use these classes instead of re-implementing components inline.
  `Components.dc.html` is the visual reference for all of them.
- **Theme-aware always:** every page loads `chrome.js` in `<head>` (after `support.js`) and
  `poc.css` + `components.css` in the helmet; body background is `var(--canvas-bg)`. Never set a
  hardcoded `data-theme` or a `dark` prop on the device frame.
- Dynamic Material icon names inside `{{ }}` bindings need `font-family:inherit` on the
  `.sc-interp` span (handled in `poc.css`) or ligatures break.

## Commit Messages

Never include `Co-Authored-By: Claude` or any Anthropic/Claude trailer. Omit it entirely.
