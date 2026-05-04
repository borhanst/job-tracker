# Issue #013 — Cover Letter Generation & Editor

**Labels:** needs-triage  
**Type:** AFK

## What to build

Implement AI cover letter generation, a rich text editor for refinement, and PDF export functionality.

## Acceptance criteria

- [ ] `lib/ai/generate.ts` implements `generateCoverLetter(profile, jobData, model)`.
- [ ] AI uses a persuasive, professional tone and references specific JD keywords.
- [ ] "Cover Letter" tab in Job Detail page.
- [ ] Inline text editor (e.g., simple `textarea` or basic contenteditable) to modify the generated text.
- [ ] "Regenerate" button.
- [ ] "Export as PDF" using a basic `@react-pdf` layout.
- [ ] "Copy to Clipboard" button for easy pasting into application forms.
- [ ] Persist the cover letter text to `generated_documents`.

## Blocked by

- #012 — AI CV Generation + Builder UI
