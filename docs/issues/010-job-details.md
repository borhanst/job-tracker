# Issue #010 — Job Detail Page: Management & Notes

**Labels:** needs-triage  
**Type:** AFK

## What to build

The detailed view for a single job application where users can manage the application status, add notes, and see the full JD info.

## Acceptance criteria

- [ ] `/applications/[id]` page layout with header (Title, Company, Match Score).
- [ ] Status dropdown to update application stage.
- [ ] "Overview" tab shows structured job details (extracted by AI) and a toggle to see the raw JD text.
- [ ] "Timeline/Notes" section allows adding timestamped notes (saved as JSONB array in DB).
- [ ] Follow-up date picker with "Clear" option.
- [ ] Server actions for `updateStatus`, `addNote`, and `setFollowUpDate`.
- [ ] Visual indicator if a follow-up is overdue.

## Blocked by

- #009 — Application Tracker: List & Kanban Views
