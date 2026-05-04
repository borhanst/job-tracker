# Issue #008 — AI Extraction Module + Add Job Page

**Labels:** needs-triage  
**Type:** AFK

## What to build

The core "Add Job" workflow: Paste URL → Scrape → AI Extract → Review → Save. This involves the AI extraction logic using the user's configured provider and the 3-step UI flow.

## Acceptance criteria

- [ ] `lib/ai/extract.ts` implements `extractJobData(rawText, model)` using Vercel AI SDK's `generateObject`.
- [ ] Extraction schema (Zod) includes: Title, Company, Location, Salary, Skills, Responsibilities, etc.
- [ ] `computeMatchScore(jobData, profile, model)` compares the extracted JD to the user's `getFullProfile()` output.
- [ ] `/jobs/add` 3-step wizard:
    - Step 1: URL input + "Scrape" button (calls `/api/scrape`).
    - Step 2: Shows raw text; "Extract Info" button (calls `/api/extract`).
    - Step 3: Editable form pre-filled with AI data; "Save Application" button.
- [ ] Match Score is displayed in Step 3 before saving.
- [ ] Successful save redirects to the new Application Detail page.

## Blocked by

- #005 — User Profile: Multi-entry Sections
- #006 — JD Scraper Module
- #007 — AI Provider Settings Module
