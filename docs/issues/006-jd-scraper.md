# Issue #006 — JD Scraper Module + /api/scrape Route

**Labels:** needs-triage  
**Type:** AFK

## What to build

Build a server-side scraping module that takes a job listing URL and returns the raw text of the job description. This includes specific logic for major job boards and a robust generic fallback.

## Acceptance criteria

- [ ] `lib/scraper/index.ts` implements `scrapeJobDescription(url: string)` returning `{ success, rawText, error }`.
- [ ] Tailored selectors for Greenhouse, Lever, and Workday DOM structures.
- [ ] Generic scraping logic using `cheerio` to extract the main content area (e.g., `<article>`, `<main>`, or high-density text containers).
- [ ] `/api/scrape` POST endpoint receives a URL and returns the scraper output.
- [ ] Errors (404, rate limits, blocks) are caught and return a descriptive `error` string instead of throwing.
- [ ] Unit tests for `lib/scraper/index.ts` using mocked HTML responses for known platforms.

## Blocked by

- #001 — Project scaffold & design system
