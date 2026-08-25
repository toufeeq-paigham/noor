---
activation: always
description: Keep canonical rules synchronized with verified project contracts
---

# Rule maintenance

- `.agents/rules/` is the only canonical rule body. Do not add divergent Claude or Cursor copies.
- Update a rule when an approved change alters a durable architecture, product-flow, design-system,
  validation, or tool contract.
- Do not update rules from a one-off workaround, an unverified assumption, or a temporary local
  environment issue.
- Before changing a rule, inspect the current implementation, its callers, tests, and build wiring.
- Remove obsolete examples and duplicated version/count data instead of layering exceptions on top.
- Keep rules concise, testable, scoped by activation, and linked to source-of-truth files.
- If two rules conflict, resolve the conflict in the canonical set; do not rely on precedence to hide
  it.
- Claude/Cursor adapters may carry native activation metadata, but their bodies only route to the
  canonical rule index.
