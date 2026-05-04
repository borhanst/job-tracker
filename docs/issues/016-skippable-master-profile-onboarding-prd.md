# PRD: Skippable Master Profile Onboarding and Completion Tracking

**Status:** needs-triage
**Created:** 2026-05-05
**Source:** Synthesized from grill-me onboarding session

---

## Problem Statement

New job seekers need a strong Master Profile before Applynexis can generate useful Tailored CVs, cover letters, and Match Scores. Today the app has profile editing, but after signup users can enter the app without a focused setup path and without a clear signal that incomplete profile data reduces AI output quality.

The user wants onboarding to appear immediately after signup, but not as a hard gate. Users should be able to skip and explore the product, while the authenticated app continues to remind them until the Master Profile reaches the required completion threshold.

## Solution

Add a skippable `/onboarding` flow for new or incomplete users. The flow collects only the required fields needed for a useful Master Profile baseline: full name, phone, location, professional summary, at least three skills, and either one work experience or one education entry.

Store profile completion state in the database so authenticated app pages can cheaply show progress. Recalculate and persist completion after every relevant profile change. Public and auth pages should never show completion reminders; authenticated app pages should show a persistent incomplete-profile message until the stored profile state is complete.

## User Stories

1. As a new job seeker, I want to be sent to onboarding after signup, so that I understand which profile details Applynexis needs first.
2. As a new job seeker, I want onboarding to be skippable, so that I can explore the app before finishing my Master Profile.
3. As a new job seeker, I want skipping onboarding to take me to the dashboard, so that I can continue into the product immediately.
4. As a new job seeker, I want skipped onboarding to remain visibly incomplete, so that I know setup is still unfinished.
5. As a returning incomplete-profile user, I want authenticated app pages to remind me that my Master Profile is incomplete, so that I can improve Tailored CV and Match Score quality.
6. As a visitor on public pages, I do not want to see profile completion messages, so that marketing and auth pages stay clean.
7. As a logged-in user on the dashboard, I want to see my Master Profile completion percentage, so that I know how much setup remains.
8. As a logged-in user on jobs pages, I want the incomplete-profile reminder to persist, so that I do not forget to complete setup while using the app.
9. As a logged-in user on applications pages, I want the incomplete-profile reminder to persist, so that I understand missing profile data may affect generated documents.
10. As a logged-in user on settings pages, I want the incomplete-profile reminder to persist, so that completion messaging is consistent across private pages.
11. As a logged-in user, I want the reminder to link back to onboarding or profile setup, so that I can continue from where I left off.
12. As a logged-in user, I want to dismiss or skip the setup prompt temporarily, so that it does not block my current task.
13. As a logged-in user, I want the reminder to return until completion reaches 100%, so that temporary dismissal does not permanently hide an important setup task.
14. As a new user, I want to save my personal information step independently, so that progress is preserved if I leave onboarding early.
15. As a new user, I want to save my professional summary step independently, so that progress is preserved if I leave onboarding early.
16. As a new user, I want to save my skills step independently, so that profile completion updates as soon as I add enough skills.
17. As a new user, I want to save my background step independently, so that work experience or education can complete the required profile baseline.
18. As a new user, I want onboarding progress to reflect saved data, so that I can see progress move after each step.
19. As a new user, I want onboarding to collect only required setup fields, so that the flow stays short and focused.
20. As a new user, I want optional profile fields to remain available later, so that I can add LinkedIn, GitHub, portfolio, projects, certifications, and languages when ready.
21. As a user who signs up with email/password and immediately receives a session, I want to be redirected to onboarding, so that I can start setup right away.
22. As a user who signs up with email confirmation required, I want to see the existing check-email state, so that I know how to complete authentication.
23. As a user returning from email confirmation, I want the auth callback to send me to onboarding if my profile is incomplete, so that setup continues naturally.
24. As a user signing in with Google OAuth for the first time, I want the auth callback to send me to onboarding if my profile is incomplete, so that social signup gets the same setup path.
25. As a returning user with a complete profile, I want auth callback to send me to the dashboard, so that I am not forced back through onboarding.
26. As a user who edits personal info after onboarding, I want completion state to recalculate, so that the stored percentage stays accurate.
27. As a user who edits my professional summary, I want completion state to recalculate, so that the stored percentage stays accurate.
28. As a user who adds or removes skills, I want completion state to recalculate, so that dropping below three skills makes the profile incomplete again.
29. As a user who adds or removes work experience, I want completion state to recalculate, so that background requirements stay accurate.
30. As a user who adds or removes education, I want completion state to recalculate, so that education can satisfy the background requirement.
31. As a user with a complete Master Profile, I want the app to stop showing incomplete-profile messages, so that the interface respects completed setup.
32. As a user with a complete Master Profile, I want `profile_completed` to be stored as true, so that private pages can check completion without recomputing all related tables.
33. As a user with an incomplete Master Profile, I want `profile_completion_percentage` to show a truthful value, so that progress feels concrete.
34. As a job seeker, I want email to count toward completion from my auth-created profile, so that I do not have to re-enter it during onboarding.
35. As a product maintainer, I want profile completion rules centralized, so that onboarding, profile editing, and app-shell reminders do not drift apart.
36. As a product maintainer, I want completion persistence isolated behind a simple interface, so that future changes to profile requirements are low-risk.
37. As a product maintainer, I want schema changes captured in a new migration, so that database state is reproducible across environments.
38. As a product maintainer, I want completion updates to run after profile-related server actions, so that stored state does not become stale.
39. As a product maintainer, I want onboarding skip state stored, so that we can distinguish skipped onboarding from completed onboarding.
40. As a product maintainer, I want onboarding completion timestamp stored, so that future analytics or lifecycle messaging can use it.

## Implementation Decisions

- Add a dedicated skippable `/onboarding` flow for required Master Profile setup.
- Redirect incomplete or new users to onboarding after signup or auth callback.
- Do not make onboarding mandatory; users can skip and continue to the dashboard.
- Show incomplete-profile messaging only within authenticated app pages.
- Keep public, landing, login, and register pages free of profile completion prompts.
- Treat 100% completion as: full name, email, phone, location, professional summary, at least three skills, and at least one work experience or one education entry.
- Keep LinkedIn, GitHub, portfolio, projects, certifications, and languages out of the required completion calculation.
- Store completion state on the profile record: completion percentage, completed boolean, onboarding skipped boolean, and onboarding completed timestamp.
- Recalculate and persist completion after every relevant profile mutation: personal info, summary, skills, work experience, and education.
- Keep completion calculation centralized in a deep profile-completion module with a stable interface such as "calculate completion from full profile data" and "persist completion for current user".
- Keep onboarding persistence step-based: each step saves independently before moving forward.
- Reuse existing profile tables and server actions where practical rather than creating a parallel onboarding data model.
- Add a new database migration for schema changes; do not edit previous migrations.
- Respect existing Supabase RLS patterns so each user can only update their own profile state.
- Auth callback should choose the next destination based on stored/inferred profile completion: onboarding for incomplete users, dashboard for complete users.
- Email/password signup should redirect to onboarding when a session exists immediately; when email confirmation is required, keep the check-email flow and rely on callback routing after confirmation.
- Google OAuth should follow the same callback routing rules.

## Testing Decisions

Tests should verify external behavior, not implementation details. Good tests should remain valid if the internal calculation implementation changes but the user-visible rules stay the same.

Recommended modules to test:

- Profile completion calculation: given profile data and related records, returns the expected percentage and completed boolean.
- Completion persistence: after relevant profile mutations, stored completion fields are updated accurately.
- Onboarding skip behavior: skipping sets skip state, does not mark the profile complete, and routes to the dashboard.
- Auth callback routing: incomplete users route to onboarding; complete users route to dashboard.
- Authenticated app reminder behavior: incomplete profiles show the reminder on private pages; complete profiles do not.
- Public/auth page behavior: landing, login, and register pages do not show profile completion reminders.

Prior art in the codebase includes existing profile server actions, Supabase-authenticated page loading, and private app layout components. If the repo does not already have a test runner configured, add the smallest appropriate testing setup for the pure completion calculation first, then cover routing/UI behavior through build/manual verification or the project's chosen integration test approach.

## Out of Scope

- Making onboarding mandatory.
- Requiring projects, certifications, languages, LinkedIn, GitHub, or portfolio for 100% completion.
- Rewriting the full profile editor.
- Changing Tailored CV, cover letter, JD Scraper, AI Extraction, or Match Score prompt logic.
- Adding analytics dashboards for onboarding completion.
- Email or push reminders for incomplete profiles.
- Role-based or admin-visible profile completion reporting.
- Importing profile data from LinkedIn, PDFs, resumes, or external services.

## Further Notes

This feature strengthens the Master Profile as the source of truth for Tailored CV generation and Match Score quality while preserving user autonomy. The product should nudge without trapping: onboarding starts immediately after signup, but skipping remains available. The persistent reminder should be clear, compact, and practical, explaining that completing the Master Profile improves AI-generated outputs.
