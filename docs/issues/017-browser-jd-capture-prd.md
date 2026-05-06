# PRD: Browser JD Capture

**Status:** needs-triage  
**Created:** 2026-05-05  
**Author:** Synthesized from Chrome extension design session

---

## Problem Statement

Job seekers often find job listings on pages that block server-side scraping or render important job description content in a way the JD Scraper cannot reliably extract. When that happens, users must manually copy sections into the app, which slows down the Add Job workflow and increases the chance of missing relevant requirements, responsibilities, or company details.

The product needs a narrow browser-based capture path that helps users bring selected job description content into the existing Add Job review flow without promising fully automatic capture from any site.

## Solution

Add Browser JD Capture: a Chrome extension companion path that lets signed-in users select relevant job description sections on the current page, append each selection to Capture Review, review/remove/reorder the selected sections, and send the reviewed sections plus the current page URL into the web app.

The extension creates a short-lived JD Handoff tied to the user's Web App Session. The web app opens the existing Add Job review flow with the handoff loaded into the review text step. The extension does not create an Application directly; AI Extraction, field correction, Match Score, and Save Application remain inside the web app.

## User Stories

1. As a job seeker, I want to use Browser JD Capture from a job listing page, so that I can capture listings where server-side scraping fails.
2. As a job seeker, I want to select text on the current page, so that I control exactly which job description content is captured.
3. As a job seeker, I want an Add Selection action, so that I can append my current page selection to Capture Review.
4. As a job seeker, I want to add multiple selections from the same page, so that I can capture separated sections such as overview, responsibilities, requirements, benefits, and company details.
5. As a job seeker, I want each Add Selection action to append one selected section, so that I can build the captured job description incrementally.
6. As a job seeker, I want Capture Review to show the selected sections in order, so that I can verify what will be sent to the app.
7. As a job seeker, I want to remove a selected section from Capture Review, so that irrelevant page text does not reach the app.
8. As a job seeker, I want to reorder selected sections in Capture Review, so that the final text follows the natural structure of the job listing.
9. As a job seeker, I want Capture Review to preserve section order when sending to the app, so that the Add Job review text is understandable.
10. As a job seeker, I want the extension to include the current page URL, so that the saved application can reference the original listing.
11. As a job seeker, I want the extension to include the page title when available, so that the handoff has useful context before AI Extraction.
12. As a signed-in user, I want Browser JD Capture to rely on my Web App Session, so that I do not manage separate extension credentials.
13. As a signed-in user, I want the extension to avoid storing Supabase access tokens, so that app authentication remains owned by the web app.
14. As a signed-out user, I want the extension to open the app login flow, so that I can sign in before creating a JD Handoff.
15. As a job seeker, I want the extension to create a JD Handoff only after Capture Review, so that accidental selections are not sent prematurely.
16. As a job seeker, I want the app to open `/jobs/add?handoff=<id>` after sending, so that I land in the familiar Add Job workflow.
17. As a job seeker, I want the Add Job flow to load the JD Handoff into the review text step, so that I can edit the combined raw text before AI Extraction.
18. As a job seeker, I want the Add Job flow to consume the JD Handoff when loaded, so that the same handoff is not reused accidentally.
19. As a job seeker, I want a JD Handoff to expire after 30 minutes, so that raw job description text is not retained longer than needed.
20. As a job seeker, I want expired or already consumed handoffs to show a clear fallback message, so that I know to recapture or paste manually.
21. As a job seeker, I want AI Extraction to run only after I review the captured text in the app, so that the AI receives the right source material.
22. As a job seeker, I want field correction, Match Score, and Save Application to remain inside the web app, so that the extension cannot bypass review.
23. As a job seeker, I want Browser JD Capture to complement JD Scraper and manual paste, so that I can choose the best capture path for each listing.
24. As a privacy-conscious user, I want raw JD text excluded from query strings and fragment URLs, so that large or sensitive text is not exposed through browser history or logs.
25. As a maintainer, I want Browser JD Capture to use a small, explicit payload shape, so that the handoff API is easy to validate and test.
26. As a maintainer, I want fully automatic browser extension capture from any site to remain out of scope, so that v1 stays narrow and reliable.

## Implementation Decisions

- Build a Browser JD Capture module as a Chrome extension companion path for pages where the JD Scraper fails or is blocked.
- Add Selection is the canonical multi-section capture interaction: the user selects text on the page and triggers Add Selection, appending one selected section to Capture Review.
- Capture Review is an extension-side checklist where users review, remove, and reorder selected job description sections before sending.
- Browser JD Capture relies on the existing Web App Session. The extension must not store Supabase access tokens in v1.
- If no valid Web App Session is available, the extension opens the web app login flow before creating a JD Handoff.
- The extension posts `{ url, title, sections }` to a protected app endpoint as the signed-in user.
- `sections` contains one or more user-selected text blocks in the user's reviewed order.
- The app stores a JD Handoff record tied to the signed-in user.
- A JD Handoff expires after 30 minutes.
- A JD Handoff is marked consumed when the Add Job flow loads it.
- The app opens `/jobs/add?handoff=<id>` after a successful handoff creation.
- The Add Job flow loads the handoff into the review text step before AI Extraction.
- The Add Job review step combines selected sections into editable raw text while preserving section order.
- Raw JD text must not be placed in query strings or fragment URLs.
- The extension never creates an Application directly.
- AI Extraction, field correction, Match Score, and Save Application remain inside the web app.
- Browser JD Capture complements the JD Scraper and manual paste paths; it does not replace them.
- Fully automatic capture from any site without user-selected JD text remains out of scope.

### Major Modules

- Browser JD Capture extension module: owns Add Selection, Capture Review, remove/reorder interactions, session-aware send behavior, and opening the app handoff URL.
- JD Handoff module: owns handoff creation, validation, expiry, consumed state, and user ownership checks behind a small server-side interface.
- Add Job handoff loading: extends the existing Add Job flow to load a valid handoff into the review text step before AI Extraction.
- Auth/session boundary: uses the existing Web App Session and login flow rather than extension-owned app tokens.

## Testing Decisions

Tests should verify external behavior and user-visible contracts rather than implementation details. The most valuable tests are around the JD Handoff boundary because it protects raw job description text, user ownership, expiry, and one-time consumption.

Modules to test:

- JD Handoff creation: given a signed-in user and valid `{ url, title, sections }`, creates a handoff owned by that user.
- JD Handoff validation: rejects unauthenticated requests, empty sections, invalid URLs, and malformed payloads.
- JD Handoff loading: given a valid handoff, returns ordered sections and marks the handoff consumed.
- JD Handoff expiry: expired handoffs cannot be loaded.
- JD Handoff ownership: one user cannot load another user's handoff.
- Add Job handoff loading: given a valid handoff ID, the Add Job flow starts at the review text step with combined editable text.
- Add Job fallback: expired, missing, or consumed handoffs show a clear recovery path.
- Browser JD Capture behavior: Add Selection appends the current selection, Capture Review supports remove/reorder, and send uses the reviewed order.

Prior art:

- Existing API route tests should follow the same behavioral shape as scraper and extraction API tests.
- Existing Add Job behavior should remain covered around scraping/manual paste paths so Browser JD Capture does not regress them.

## Out of Scope

- Fully automatic browser extension capture from any site without user-selected JD text.
- Creating an Application directly from the extension.
- Running AI Extraction inside the extension.
- Computing Match Score inside the extension.
- Storing Supabase access tokens in extension storage.
- Capturing entire page DOM content automatically.
- Supporting non-Chrome browsers in v1.
- Replacing the JD Scraper or manual paste paths.
- Long-lived storage of JD Handoffs.

## Further Notes

Browser JD Capture is intentionally narrow. It exists to help the user move selected job description content into the same Add Job review flow used by scraping and manual paste. The review boundary matters: users should always see and edit the captured raw text before AI Extraction and before an Application is saved.

This PRD follows the domain decisions in `CONTEXT.md` and ADR 0002: Server-side JD Handoff for Browser Capture.
