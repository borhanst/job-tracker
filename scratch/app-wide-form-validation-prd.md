# PRD: App-wide explicit form validation

**Status:** needs-triage
**Created:** 2026-05-05
**Source:** Synthesized from validation policy session and ADR 0001

---

## Problem Statement

Job seekers use Applynexis forms to create accounts, manage their Master Profile, complete onboarding, save settings, add jobs, and generate job-search materials. Today many forms rely on native browser validation through required fields and input types. That makes validation behavior inconsistent across browsers, hard to test, hard to reuse between client and backend boundaries, and difficult to present with the product's designed inline error experience.

The app needs an explicit app-owned validation system so user-facing forms show predictable errors, backend handlers remain the final authority, and validation rules do not drift between auth, onboarding, profile editing, AI settings, job intake, and generation flows.

## Solution

Introduce app-wide explicit form validation using shared validation schemas. Forms that submit user data should disable native browser validation and validate through shared schema contracts. Client-side validation should provide immediate inline feedback, while backend API routes and server actions should validate again before accepting submitted data.

Validation schemas that protect submitted user data should live in shared validation modules. Client forms and backend handlers should share base schemas, with backend schemas allowed to add stricter trust-boundary checks such as ownership, identifiers, normalization, protected fields, and database-safe constraints.

## User Stories

1. As a job seeker, I want registration validation errors to appear inline, so that I know exactly what to fix before creating my account.
2. As a job seeker, I want login validation errors to appear inline, so that I can correct my email or password without relying on browser popups.
3. As a job seeker, I want password rules to be clear before submit, so that account creation does not fail after a vague backend response.
4. As a job seeker, I want invalid email addresses to be handled consistently across login, registration, settings, and profile forms, so that the app feels predictable.
5. As a job seeker, I want the password visibility control to work alongside validation, so that I can inspect what I typed without losing error state.
6. As a job seeker, I want onboarding personal information errors to appear in the onboarding interface, so that I can complete my Master Profile baseline smoothly.
7. As a job seeker, I want onboarding skill requirements to be validated by the app, so that I know when I have added enough skills for a useful Master Profile.
8. As a job seeker, I want onboarding background requirements to be validated by the app, so that I understand whether work experience or education satisfies setup.
9. As a job seeker, I want professional summary validation to explain what is missing, so that I can provide enough information for useful Tailored CV generation.
10. As a job seeker, I want profile personal information validation to be consistent with onboarding, so that the same field has the same rules in both places.
11. As a job seeker, I want profile experience validation to catch missing company, title, and dates before save, so that my Master Profile stays usable.
12. As a job seeker, I want profile education validation to catch missing institution, degree, field, and dates before save, so that my Master Profile stays complete.
13. As a job seeker, I want profile URL fields to validate consistently, so that LinkedIn, GitHub, portfolio, and avatar links are either usable URLs or clearly rejected.
14. As a job seeker, I want AI settings validation to explain missing or malformed provider configuration, so that generation failures are reduced.
15. As a job seeker, I want Add Job validation to catch missing or invalid job listing data, so that only useful jobs enter the Application Pipeline.
16. As a job seeker, I want JD Scraper inputs to validate URLs consistently, so that I get a clear error before scraping fails.
17. As a job seeker, I want AI Extraction inputs to validate raw JD text before processing, so that empty or unusable input is rejected clearly.
18. As a job seeker, I want cover letter generation requests to validate required application context, so that I receive a clear error when generation cannot start.
19. As a job seeker, I want CV generation requests to validate required application context, so that Tailored CV generation fails early and clearly when data is missing.
20. As a job seeker, I want error messages to stay visually integrated with the modern form design, so that validation does not feel bolted on.
21. As a keyboard user, I want validation errors to be reachable and announced predictably, so that I can recover from invalid submissions without a mouse.
22. As a mobile user, I want forms to keep helpful input keyboards and autofill behavior, so that app-owned validation does not make entry slower.
23. As a mobile user, I want validation messages to fit inside the form layout, so that errors do not overflow or obscure controls.
24. As a returning user, I want saved form values to remain in place after validation errors, so that I do not have to re-enter data.
25. As a user submitting a form with multiple invalid fields, I want all relevant field errors to be visible, so that I can fix them in one pass.
26. As a user submitting a form with server-only errors, I want a clear form-level error, so that I understand the submission was rejected after client validation.
27. As a product maintainer, I want user-submitted data validation centralized, so that onboarding, profile editing, auth, settings, and job intake do not drift apart.
28. As a product maintainer, I want client and backend validation to share base contracts, so that field rules are not duplicated by hand.
29. As a product maintainer, I want backend validation to be allowed to be stricter, so that trust-boundary rules remain secure.
30. As a product maintainer, I want validation schemas to be testable without rendering UI, so that the highest-risk rules have fast focused tests.
31. As a product maintainer, I want form components to render validation state consistently, so that new forms inherit the same behavior.
32. As a product maintainer, I want native browser validation disabled on submitted-data forms, so that browser-specific validation UI does not bypass the app design.
33. As a product maintainer, I want native input types retained where useful for keyboards and autofill, so that validation policy does not reduce UX.
34. As a product maintainer, I want server actions to reject invalid payloads even if client validation is bypassed, so that the database remains protected.
35. As a product maintainer, I want API routes to reject invalid payloads with consistent error shapes, so that client code can display errors predictably.
36. As a product maintainer, I want validation rules documented in one architectural decision, so that future contributors do not reintroduce native-only validation.
37. As a product maintainer, I want the auth forms migrated first, so that the recently redesigned login and registration pages match the new validation policy.
38. As a product maintainer, I want onboarding migrated early, so that Master Profile completion rules are validated consistently.
39. As a product maintainer, I want profile editing migrated after onboarding, so that shared Master Profile field schemas can be reused.
40. As a product maintainer, I want jobs and generation routes migrated after core profile flows, so that Application Pipeline and AI flows benefit from the same contracts.
41. As a developer, I want a simple validation module interface, so that adding a new form requires choosing a schema and rendering errors rather than inventing validation again.
42. As a developer, I want reusable helpers for mapping schema errors to field and form errors, so that components do not all parse validation results differently.
43. As a developer, I want date and URL normalization handled deliberately, so that browser input quirks do not leak into domain data.
44. As a developer, I want validation tests to cover edge cases like whitespace-only strings, invalid URLs, missing IDs, and empty arrays, so that malformed data is caught before integration.
45. As a developer, I want validation behavior to survive future UI redesigns, so that visual changes do not weaken data rules.

## Implementation Decisions

- Follow the accepted app-wide validation ADR.
- Disable native browser validation on forms that submit user data.
- Keep native input types and autocomplete hints where they improve keyboard, accessibility, and autofill behavior.
- Use Zod as the validation library because it is already installed and already used in the codebase for structured AI outputs.
- Add a shared validation module namespace for schemas that protect submitted user data.
- Treat shared validation schemas as the deep module for this work: they expose stable parse/validation contracts while hiding field-level rules and normalization details.
- Share base schemas between client forms and backend handlers.
- Allow backend-side schemas to extend base schemas with stricter trust-boundary requirements.
- Standardize validation result mapping into field errors and form-level errors.
- Migrate the redesigned auth forms to explicit validation first.
- Migrate onboarding forms next because they affect Master Profile setup and completion quality.
- Migrate profile editing forms after onboarding so shared Master Profile field schemas can be reused.
- Migrate settings, Add Job, JD Scraper, AI Extraction, CV generation, and cover letter generation validation after core account/profile flows.
- Server actions should validate submitted payloads before writing to Supabase.
- API routes should validate request bodies before invoking scraper, extraction, or generation behavior.
- Authentication submission should validate email, password, and registration full name before calling Supabase Auth.
- Validation should preserve existing Supabase Auth error handling for backend-auth errors such as invalid credentials, duplicate email, or confirmation requirements.
- The UI should present field-level errors near the relevant control and form-level errors for backend or cross-field failures.
- Existing modern auth visual design should be preserved while adding validation states.
- Existing profile completion and onboarding semantics should remain unchanged unless a schema exposes a contradiction that needs separate triage.
- No database schema changes are expected for this PRD.

## Testing Decisions

Good tests should verify external behavior, not implementation details. Schema tests should assert accepted and rejected data from a user or API caller perspective. UI tests should assert visible errors and submission behavior, not internal state names. Backend tests should assert invalid payloads are rejected before side effects.

Recommended modules to test:

- Shared validation schemas for auth registration and login.
- Shared validation schemas for onboarding personal info, summary, skills, experience, and education.
- Shared validation schemas for profile personal info, summary, experience, education, and section-list style fields.
- Shared validation schemas for settings provider configuration.
- Shared validation schemas for Add Job, scraping, extraction, and generation request payloads.
- Validation-result mapping helpers that turn schema failures into field and form errors.
- Auth form behavior for invalid email, missing password, missing full name, and backend Supabase errors.
- Onboarding behavior for required Master Profile baseline fields.
- Server action behavior when client validation is bypassed.
- API route behavior when required request payload fields are missing or malformed.

Prior art in the codebase includes Zod schemas used for AI Extraction and generation structured outputs, existing server actions for onboarding/profile/settings/jobs, and existing API route guard clauses for scrape, extract, CV generation, and cover letter generation. If the repo still lacks a test runner, start with pure validation schema tests because they are the smallest deep-module tests and do not require browser rendering.

## Out of Scope

- Changing Supabase Auth behavior or password policy beyond exposing explicit validation errors.
- Adding a new form library unless later implementation proves it is necessary.
- Redesigning every form's visual layout.
- Changing Master Profile completion requirements.
- Changing Tailored CV, cover letter, Match Score, or AI prompt logic.
- Adding database migrations.
- Adding analytics for validation failures.
- Replacing Supabase Auth backend validation.
- Implementing localization for validation messages.
- Creating a full design-system form component library beyond the helpers needed for this migration.

## Further Notes

The goal is to make validation app-owned, predictable, and testable while preserving useful browser affordances. Native validation should not be the source of truth. Backend handlers remain authoritative because client validation can always be bypassed. This PRD implements the policy recorded in ADR 0001 and should reduce drift across auth, onboarding, Master Profile, Application Pipeline, and AI generation flows.
