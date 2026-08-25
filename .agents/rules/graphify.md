---
activation: always
description: Use the local graph as a starting index for codebase-wide questions
---

# Graphify

- When `graphify-out/graph.json` exists, start codebase/architecture questions with
  `graphify query`, `graphify path`, or `graphify explain`.
- Treat graph results as an index, not authority. Verify drift-prone facts in current source,
  Gradle files, callers, and tests.
- Use the wiki/report only for broad orientation or when scoped queries are insufficient.
- If the CLI reports an older node-ID scheme or stale paths, do not rely on ambiguous nodes; inspect
  source directly and rebuild only when the task needs an updated graph.
- Run `graphify update .` after code changes when the installed CLI and current graph support it.
  Documentation-only edits do not require an AST graph update.
