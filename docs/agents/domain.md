# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

This is a single-context repo.

- Read `CONTEXT.md` at the repo root before domain-sensitive work.
- Read relevant ADRs in `docs/adr/` when they exist and touch the area being changed.
- If `CONTEXT-MAP.md` appears later, treat the repo as multi-context and follow the map to the relevant context docs.

If any of these files do not exist, proceed silently. Do not flag their absence or suggest creating them upfront; producer skills create them lazily when terms or decisions get resolved.

## Use the glossary's vocabulary

When output names a domain concept in an issue title, refactor proposal, hypothesis, or test name, use the term as defined in `CONTEXT.md`. Do not drift to synonyms the glossary explicitly avoids.

If the concept you need is not in the glossary yet, either reconsider whether the repo already has better language or note the gap for `grill-with-docs`.

## Flag ADR conflicts

If output contradicts an existing ADR, surface it explicitly rather than silently overriding it.
