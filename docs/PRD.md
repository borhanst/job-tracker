# PRD: AI-Powered Job Application Tracker

**Status:** needs-triage  
**Created:** 2026-05-04  
**Author:** Synthesized from design session

---

## Problem Statement

Job seekers manage dozens of applications across multiple platforms simultaneously. They face three compounding problems:

1. **Fragmented tracking** — Applications are tracked in spreadsheets or not at all, making it easy to miss follow-up dates, lose track of statuses, and forget where they applied.
2. **Generic CVs** — Sending the same CV to every job reduces match rates. Tailoring a CV manually for each job description is time-consuming.
3. **Manual data entry** — Copying job details from listings into a tracker is tedious and error-prone.

There is no single tool that automates JD capture, structures the data with AI, tracks the full application pipeline, and generates tailored CVs and cover letters — all in one place.

---

## Solution

An AI-powered Job Application Tracker web application where users can:

- **Capture job descriptions** by pasting a URL (auto-scraped) or manually entering text.
- **Capture selected job descriptions from the browser** through a narrow Chrome extension path that hands the current URL and one or more selected JD sections into the Add Job review flow.
- **AI-extract structured data** from JDs — company, title, skills, responsibilities, salary, and a match score against the user's profile.
- **Track applications** through a visual pipeline: Saved → Applied → Phone Screen → Interview → Offer → Accepted / Rejected / Withdrawn.
- **Generate personalized CVs** — the AI tailors the user's master profile to each specific JD, rendered as a preview with PDF export.
- **Generate personalized cover letters** — AI-written, editable inline, and exportable.
- **Manage a rich user profile** — personal info, work experience, education, skills, projects, certifications, and languages as a single master source of truth.
- **Choose their own AI provider** — bring their own API key for Gemini, OpenAI, Anthropic, or Groq.

---

## User Stories

### Authentication & Onboarding
1. As a job seeker, I want to create an account with email and password, so that my data is private and persists across devices.
2. As a job seeker, I want to sign in with Google OAuth, so that I can onboard quickly without creating a new password.
3. As a job seeker, I want to reset my password via email, so that I can recover access if I forget it.
4. As a new user, I want to be guided to set up my profile after registration, so that the AI has data to generate tailored CVs.
5. As a returning user, I want to be redirected to the dashboard after login, so that I can immediately see my application overview.

### User Profile
6. As a job seeker, I want to enter my personal information (name, email, phone, location, LinkedIn, GitHub, portfolio), so that it appears correctly on my generated CV.
7. As a job seeker, I want to write a professional summary, so that the AI can use it as a baseline when generating tailored summaries per job.
8. As a job seeker, I want to add multiple work experience entries with company, title, dates, description, and achievements, so that the AI can select the most relevant ones per JD.
9. As a job seeker, I want to add multiple education entries with institution, degree, field, dates, and GPA, so that they appear on my generated CV.
10. As a job seeker, I want to add skills with a proficiency level (beginner / intermediate / expert), so that the AI can highlight the most relevant skills for each job.
11. As a job seeker, I want to add projects with name, description, tech stack, and URL, so that they can be included in my CV when relevant.
12. As a job seeker, I want to add certifications with name, issuer, date, and URL, so that they are available for inclusion in tailored CVs.
13. As a job seeker, I want to add languages with proficiency levels, so that they appear on my CV when relevant to the role.
14. As a job seeker, I want to edit or delete any profile section entry, so that I can keep my profile accurate over time.
15. As a job seeker, I want my profile to be saved automatically as I edit it, so that I never lose my progress.

### Job Description Capture
16. As a job seeker, I want to paste a job listing URL and have the app auto-scrape the job description, so that I don't have to copy-paste text manually.
17. As a job seeker, I want to see a clear message when auto-scraping fails, so that I know to paste the description manually.
18. As a job seeker, I want a text area to paste a job description manually when scraping is unavailable, so that I can still capture any job regardless of the platform.
19. As a job seeker, I want an Add Selection action that appends my current page selection to the extension review list, so that I can collect the relevant JD sections one at a time.
20. As a job seeker, I want a Chrome extension to collect one or more selected job description sections, so that I can capture listings that block server-side scraping.
21. As a job seeker, I want to review, remove, and reorder selected sections in the extension before sending them, so that only the relevant JD content reaches the app.
22. As a job seeker, I want the extension to send the reviewed sections and current page URL into the Add Job review flow, so that I can continue with AI Extraction in the app.
23. As a job seeker, I want the original scraped, pasted, or browser-captured raw text to be stored alongside the structured data, so that I can reference the full JD later.
24. As a job seeker, I want to see a loading state while the app is scraping, accepting a browser handoff, and extracting data, so that I know the process is in progress.

### AI-Powered JD Extraction
25. As a job seeker, I want the AI to automatically extract the job title from the JD, so that I don't have to type it manually.
26. As a job seeker, I want the AI to extract the company name from the JD, so that it is saved accurately.
27. As a job seeker, I want the AI to extract the job location and job type (remote, hybrid, on-site), so that I can filter applications by location.
28. As a job seeker, I want the AI to extract the salary range when mentioned in the JD, so that I can compare compensation across applications.
29. As a job seeker, I want the AI to extract required skills as a structured list, so that I can see exactly what the role demands.
30. As a job seeker, I want the AI to extract nice-to-have skills separately from required skills, so that I can prioritize learning gaps.
31. As a job seeker, I want the AI to extract years of experience required, so that I can assess my fit at a glance.
32. As a job seeker, I want the AI to extract key responsibilities as a bullet list, so that I understand the day-to-day of the role.
33. As a job seeker, I want the AI to extract a short "About the Company" section when present, so that I have context for interviews.
34. As a job seeker, I want the AI to calculate a Match Score (0–100%) comparing the JD requirements to my profile, so that I can prioritize the best-fit applications.
35. As a job seeker, I want to review and correct any AI-extracted fields before saving, so that errors from extraction don't persist in my data.

### Application Pipeline Tracking
36. As a job seeker, I want every saved job to start at "Saved" status, so that there is a clear starting point for each application.
37. As a job seeker, I want to move a job application to "Applied" with the application date, so that I track when I submitted.
38. As a job seeker, I want to progress an application through Phone Screen, Interview, and Offer stages, so that the pipeline reflects reality.
39. As a job seeker, I want to mark an application as Accepted, Rejected, or Withdrawn, so that the pipeline reaches a final state.
40. As a job seeker, I want to add timestamped notes to each application, so that I can log interview feedback, recruiter conversations, and next steps.
41. As a job seeker, I want to set a follow-up date on each application, so that I receive a visual reminder on the dashboard when one is due.
42. As a job seeker, I want to view my applications as a sortable and filterable list/table, so that I can quickly find a specific application.
43. As a job seeker, I want to toggle between a list view and a Kanban board view for my applications, so that I can visualize the pipeline.
44. As a job seeker, I want to filter applications by status, company, location, or date added, so that I can focus on a subset of applications.

### Dashboard
45. As a job seeker, I want to see a total count of my applications on the dashboard, so that I have a high-level overview.
46. As a job seeker, I want to see a breakdown of applications by pipeline stage on the dashboard, so that I can spot bottlenecks.
47. As a job seeker, I want to see a chart of applications added over time, so that I can measure the pace of my job search.
48. As a job seeker, I want to see a list of applications with upcoming follow-up dates on the dashboard, so that I never miss a deadline.
49. As a job seeker, I want to see my recent activity on the dashboard, so that I can resume where I left off.
50. As a job seeker, I want to see my average Match Score across all applications, so that I can gauge overall fit quality.

### CV Generation
51. As a job seeker, I want to trigger AI-powered CV generation for a specific job application, so that I get a version tailored to that JD.
52. As a job seeker, I want to choose from 3 CV templates (Modern, Classic, Minimal) before generating, so that the output matches my preferred style.
53. As a job seeker, I want to see a live preview of the generated CV in the browser, so that I can review it before downloading.
54. As a job seeker, I want the AI to rewrite my professional summary to match the specific JD, so that the CV feels targeted rather than generic.
55. As a job seeker, I want the AI to reorder and highlight the most relevant skills based on the JD's required skills, so that the recruiter sees the best match immediately.
56. As a job seeker, I want the AI to select and reframe my most relevant work experience entries for each JD, so that the CV is concise and compelling.
57. As a job seeker, I want the AI to include relevant projects from my profile when they strengthen the application, so that my portfolio is leveraged.
58. As a job seeker, I want to download the generated CV as a PDF, so that I can attach it to job applications.
59. As a job seeker, I want previously generated CVs for a job to be stored in the job detail view, so that I can re-download them without regenerating.
60. As a job seeker, I want to regenerate a CV with a different template without losing the previous version, so that I have options.

### Cover Letter Generation
61. As a job seeker, I want the AI to generate a personalized cover letter for each job application, so that I have a strong written accompaniment to my CV.
62. As a job seeker, I want the cover letter to reference specific details from the JD (company name, role, key requirements), so that it feels genuinely tailored.
63. As a job seeker, I want to edit the AI-generated cover letter inline before exporting, so that I can add my personal voice.
64. As a job seeker, I want to export the cover letter as a PDF, so that I can attach it alongside my CV.
65. As a job seeker, I want to copy the cover letter as plain text to the clipboard, so that I can paste it into online application forms.
66. As a job seeker, I want previously generated cover letters to be stored per job application, so that I can revisit them.

### AI Provider & Settings
67. As a job seeker, I want to choose my preferred AI provider from a list (Gemini, OpenAI, Anthropic, Groq), so that I can use the model I have access to.
68. As a job seeker, I want to enter and save my own API key for each provider, so that my usage costs are under my own account.
69. As a job seeker, I want my API keys to be stored securely (encrypted at rest in Supabase), so that they are not exposed.
70. As a job seeker, I want to select which specific model to use within a provider (e.g., gpt-4o vs gpt-4o-mini), so that I can balance speed and quality.
71. As a job seeker, I want to test my API key connection before saving, so that I know it works before attempting generation.
72. As a job seeker, I want to switch AI providers at any time, so that I am not locked into one service.

### Design & UX
73. As a job seeker, I want to toggle between light and dark mode, so that I can use the app comfortably in any environment.
74. As a job seeker, I want the app to be fully responsive on mobile, so that I can manage applications from my phone.
75. As a job seeker, I want smooth transitions and micro-animations throughout the UI, so that the experience feels polished and premium.
76. As a job seeker, I want status badges to be color-coded by pipeline stage, so that I can identify application statuses at a glance.

---

## Implementation Decisions

### Major Modules

#### 1. Auth Module
- Supabase Auth handles user registration, login, Google OAuth, and session management.
- Protected routes redirect unauthenticated users to the login page.
- Next.js middleware handles session verification on the server.

#### 2. User Profile Module (Deep Module)
- Stores all user profile data in Supabase across normalized tables: `profiles`, `work_experiences`, `educations`, `skills`, `projects`, `certifications`, `languages`.
- Exposes a single server action / API route to fetch the complete profile as a unified object.
- This unified profile object is the sole input to all AI generation prompts, ensuring a clean interface that never changes even as the schema evolves.

#### 3. JD Scraper Module (Deep Module)
- A server-side scraper using `cheerio` + native `fetch`.
- Accepts a URL, attempts to extract the job description text, and returns `{ success: boolean, rawText: string | null, error: string | null }`.
- Contains tailored extraction selectors for known job board DOM structures (Greenhouse, Lever, Workday).
- Falls back gracefully on all errors, returning a descriptive user-facing message.
- Completely stateless — no side effects; just input URL → output text.

#### 4. Browser JD Capture Module
- A Chrome extension companion path for pages where server-side scraping fails or is blocked.
- Authentication relies on the existing web app session; the extension does not store Supabase access tokens in v1.
- If no valid web app session is available, the extension opens the app login flow before creating a handoff.
- Users add content by selecting text on the page and using an Add Selection action; each action appends one selected section to Capture Review.
- The extension presents a Capture Review list where users can review, remove, and reorder selected sections before sending.
- The extension posts `{ url, title, sections }` to a protected app endpoint as the signed-in user, where `sections` contains one or more user-selected text blocks.
- The app stores a short-lived `JD Handoff` record and opens `/jobs/add?handoff=<id>`.
- A `JD Handoff` expires after 30 minutes and is marked consumed when the Add Job flow loads it.
- The Add Job flow loads the handoff into the review text step before AI Extraction, preserving section order while allowing the user to edit the combined raw text.
- The extension never creates an application directly; AI Extraction, field correction, Match Score, and Save Application remain inside the web app.
- Raw JD text must not be placed in query strings or fragment URLs.

#### 5. AI Extraction Module (Deep Module)
- Accepts raw JD text and returns a structured `JobData` object (title, company, location, type, salary, requiredSkills, niceToHaveSkills, experience, responsibilities, aboutCompany, deadline).
- Uses Vercel AI SDK with a structured output schema (Zod schema passed to `generateObject`).
- Completely provider-agnostic — caller passes in the model instance.
- Also computes the Match Score by receiving both the `JobData` and the user's `Profile` as inputs.

#### 6. AI Generation Module (Deep Module)
- Two functions: `generateCV(profile, jobData, template)` and `generateCoverLetter(profile, jobData)`.
- Returns structured content objects (sections of text) ready to be consumed by the rendering layer.
- Provider-agnostic via Vercel AI SDK.
- Prompts are version-controlled and isolated from the rendering logic.

#### 7. CV Rendering Module
- Three React components, one per template (Modern, Classic, Minimal), each built with `react-pdf`.
- Each template accepts a uniform `CVContent` object — same interface, different visual layout.
- Produces a browser-renderable PDF preview and a downloadable PDF blob.

#### 8. Application Tracker Module
- CRUD operations for `applications` table in Supabase.
- Stores: job metadata (from AI extraction), status, notes, follow-up date, applied date, generated CV references, generated cover letter text.
- Status transitions are validated (cannot skip stages illogically).

#### 9. AI Provider Settings Module
- Stores user's chosen provider, selected model, and encrypted API keys in Supabase `user_settings` table.
- Provides a factory function `getModelInstance(userId)` that reads settings and returns a Vercel AI SDK model instance.
- All AI modules call `getModelInstance` — they never hard-code a provider.

#### 10. Dashboard Analytics Module
- Reads application data and computes: total count, status distribution, applications over time, average match score, upcoming follow-ups.
- Data is fetched server-side and passed to Recharts components for rendering.

### Technical Stack
- **Framework:** Next.js 15 (App Router)
- **Database & Auth:** Supabase (Postgres + Row Level Security + Auth)
- **AI Framework:** Vercel AI SDK
- **AI Providers:** Google Gemini, OpenAI, Anthropic, Groq
- **PDF Generation:** `react-pdf`
- **Web Scraping:** `cheerio` + native fetch (server-side only)
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Fonts:** Inter (Google Fonts)
- **Schema Validation:** Zod
- **Styling:** Vanilla CSS with CSS variables for light/dark theming

### Database Schema Overview
- `profiles` — one-to-one with auth user; personal info and summary
- `work_experiences` — many-to-one with profiles
- `educations` — many-to-one with profiles
- `skills` — many-to-one with profiles; includes proficiency level
- `projects` — many-to-one with profiles
- `certifications` — many-to-one with profiles
- `languages` — many-to-one with profiles
- `applications` — many-to-one with auth user; JD URL, raw text, structured job data (JSON), status, notes, follow-up date, match score
- `generated_documents` — many-to-one with applications; type (cv/cover_letter), template, content (JSON), created_at
- `user_settings` — one-to-one with auth user; AI provider, model, encrypted API keys

### API Contracts
- `POST /api/scrape` — accepts `{ url }`, returns `{ success, rawText, error }`
- `POST /api/extract` — accepts `{ rawText, userId }`, returns structured `JobData` + `matchScore`
- `POST /api/generate/cv` — accepts `{ applicationId, template, userId }`, returns `CVContent`
- `POST /api/generate/cover-letter` — accepts `{ applicationId, userId }`, returns `CoverLetterContent`

---

## Testing Decisions

### Philosophy
- Tests should only verify **external behavior**, never implementation details.
- A test should remain valid even if the internal implementation is completely rewritten.
- Focus testing effort on the **Deep Modules** — they encapsulate the most complex logic behind simple interfaces.

### Modules to Test

| Module | What to Test |
|---|---|
| **JD Scraper** | Given a known job board URL, returns non-empty raw text. Given an invalid URL, returns `success: false` with user-facing error. |
| **AI Extraction** | Given sample raw JD text, returns `JobData` with all required fields. Given a JD with no salary, `salary` is null not an error. |
| **Match Score** | Given a profile matching all JD skills, returns a score near 100. Given a mismatched profile, returns a low score. |
| **Status Transitions** | Valid transitions succeed; invalid transitions (e.g., Saved → Offer) are rejected. |
| **AI Provider Settings** | Given saved settings, `getModelInstance` returns a valid model object. |
| **CV Generation** | Given profile and job data, `generateCV` returns a `CVContent` with all required sections. |

### Test Types
- **Unit tests** for the JD Scraper, AI Extraction, Match Score, and Status Transition modules using `vitest`.
- **Integration tests** for API routes using Next.js test utilities, with mocked AI SDK calls.

---

## Out of Scope

- Email reminders / push notifications for follow-up dates (dashboard visual only)
- Fully automatic browser extension capture from any site without user-selected JD text
- Team / collaborative features (sharing applications with recruiters or mentors)
- Mobile native app (iOS / Android)
- DOCX export for CVs (PDF only in this version)
- ATS score analysis beyond the Match Score
- Integration with job board APIs (LinkedIn, Indeed) — scraping only
- Interview prep AI (AI-generated interview questions per JD)

---

## Further Notes

- Row Level Security (RLS) must be enabled on all Supabase tables so users can only access their own data.
- API keys must be encrypted before storage — never stored in plaintext.
- The JD Scraper runs server-side only — never expose scraping logic to the client.
- The Match Score should be clearly labeled as an AI estimate, not a definitive ranking.
- The Classic CV template should be ATS-friendly (no complex graphics).
- The profile setup flow should be completable incrementally — the app should work with a minimal profile, improving CV quality as more data is added.
