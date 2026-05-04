# Issue #012 — AI CV Generation + Builder UI

**Labels:** needs-triage  
**Type:** AFK

## What to build

Integrate AI to generate tailored CV content and build the UI for previewing and downloading the PDF.

## Acceptance criteria

- [ ] `lib/ai/generate.ts` implements `generateCVContent(profile, jobData, template, model)`.
- [ ] AI prompt specifically instructs to tailor summaries and highlight relevant skills/experience based on the JD.
- [ ] `/applications/[id]/cv-builder` page:
    - Template selection cards (Modern, Classic, Minimal).
    - "Generate" button with loading state.
    - Side-by-side view: Job Requirements vs PDF Preview (using `<PDFViewer>`).
- [ ] "Download PDF" button generates and saves the PDF blob.
- [ ] Generated content is saved to the `generated_documents` table to avoid redundant AI costs.

## Blocked by

- #010 — Job Detail Page: Management & Notes
- #011 — CV Templates with react-pdf
- #007 — AI Provider Settings Module
