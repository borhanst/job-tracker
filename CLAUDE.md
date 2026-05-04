@AGENTS.md

## Agent skills

### Issue tracker

Issues and PRDs are tracked in GitHub Issues for `borhanst/job-tracker`. See `docs/agents/issue-tracker.md`.

### Triage labels

This repo uses the default five-label triage vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

This repo uses a single-context domain docs layout. See `docs/agents/domain.md`.

### Feature planning workflow

When the user wants to plan or update product/design work, follow this sequence by default:

1. Use `grill-with-docs` to challenge the idea against `CONTEXT.md`, sharpen terms, and capture resolved domain language or ADRs as needed.
2. Use `to-prd` to synthesize the approved direction into a PRD and publish it to the issue tracker.
3. Use `to-issues` to break the PRD into independently grabbable vertical-slice issues.

Do not skip from a vague request directly to implementation unless the user explicitly asks to bypass this workflow.

### Database changes

Any change that modifies the database schema, RLS policies, seed data, triggers, functions, or other persistent database behavior must be captured in a new migration file for that change. Do not modify prior migrations unless the user explicitly asks to rewrite migration history.
