# Issue #007 — AI Provider Settings Module + Settings Page

**Labels:** needs-triage  
**Type:** AFK

## What to build

Implement the infrastructure and UI for managing AI providers and API keys. Users should be able to choose their provider (Gemini, OpenAI, etc.) and save their own API keys securely.

## Acceptance criteria

- [ ] `/settings` page shows an AI Configuration section.
- [ ] Dropdown for Provider selection (Google Gemini, OpenAI, Anthropic, Groq).
- [ ] Dynamic model selector based on the chosen provider (e.g., if Gemini: `gemini-1.5-flash`, `gemini-1.5-pro`).
- [ ] API key input field with masking/toggle visibility.
- [ ] "Test Connection" button that makes a dummy AI call using the entered key to verify it.
- [ ] `lib/ai/provider.ts` implements `getModelInstance(userId)` which reads settings and returns a configured Vercel AI SDK model.
- [ ] API keys are encrypted using AES-256 (via `crypto-js`) with a server-side secret before being saved to the `user_settings` table.
- [ ] RLS policies ensure keys are only accessible by the owner.

## Blocked by

- #003 — Auth
