# noor agent guidance

Before changing this repository, read `.agents/rules/noor.md` and every rule its index marks as
always-on. `.agents/rules/` is the canonical rule body for Codex, Claude, Antigravity, Cursor, and
other agents.

When `graphify-out/graph.json` exists, use the graph as the first index for codebase-wide questions,
then verify findings in the current boards, `components.css`, and the token set.

General execution contract:

- Read the board, its CSS, and the shared product rule before editing a journey.
- Make surgical changes and preserve unrelated user work.
- Report exactly what was validated, and what was not.
