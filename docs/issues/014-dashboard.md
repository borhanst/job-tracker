# Issue #014 — Dashboard: Analytics & Overview

**Labels:** needs-triage  
**Type:** AFK

## What to build

Build the main dashboard landing page with data visualizations and a summary of the user's job search progress.

## Acceptance criteria

- [ ] `/dashboard` page shows stat cards: Total Applications, Applied This Week, Interviews Scheduled, Offers Received.
- [ ] `Pipeline Funnel` bar chart showing application counts per status using `recharts`.
- [ ] `Search Activity` line chart showing applications added per day/week.
- [ ] "Needs Attention" section listing applications with upcoming follow-up dates.
- [ ] "Recent Activity" feed showing recent status changes or new additions.
- [ ] Analytics are computed server-side in `lib/dashboard/analytics.ts`.
- [ ] Responsive grid layout for dashboard widgets.

## Blocked by

- #009 — Application Tracker: List & Kanban Views
