# Issue #009 — Application Tracker: List & Kanban Views

**Labels:** needs-triage  
**Type:** AFK

## What to build

Build the main applications overview page, supporting both a structured list/table view and a visual Kanban board for tracking status.

## Acceptance criteria

- [ ] `/applications` page fetches all user applications.
- [ ] "List View" shows a table with columns: Company, Title, Status (badge), Match Score, Date Added.
- [ ] "Kanban View" shows columns for each pipeline stage (Saved, Applied, Interview, etc.).
- [ ] Cards in Kanban view can be dragged between columns (updating status in DB).
- [ ] Filters for Status, Company (search), and Date Range.
- [ ] Sorting functionality for List view.
- [ ] Empty state with "Add your first job" CTA.

## Blocked by

- #008 — AI Extraction Module + Add Job Page
