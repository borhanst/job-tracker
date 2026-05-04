# Issue #004 — User Profile: Personal Info + Professional Summary

**Labels:** needs-triage  
**Type:** AFK

## What to build

Implement the core of the User Profile page, specifically the personal information and professional summary sections. This includes the UI for editing these fields and the server actions to save them to Supabase.

## Acceptance criteria

- [ ] `/profile` page shows a "Personal Information" section with fields: Full Name, Email (read-only from auth), Phone, Location, LinkedIn URL, GitHub URL, Portfolio URL, and Avatar URL.
- [ ] A "Professional Summary" section with a multi-line text area for the user's bio.
- [ ] Profile server actions implemented in `lib/profile/actions.ts`: `upsertPersonalInfo` and `updateSummary`.
- [ ] UI shows a "Saving..." state during submission and a success toast/message after saving.
- [ ] Data is correctly persisted to the `profiles` table in Supabase.
- [ ] If no profile exists, a new one is created (though issue #002 should handle the trigger).

## Blocked by

- #003 — Auth
