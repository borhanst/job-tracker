# Issue #005 — User Profile: Multi-entry Sections

**Labels:** needs-triage  
**Type:** AFK

## What to build

Expand the User Profile page to include all multi-entry sections: Work Experience, Education, Skills, Projects, Certifications, and Languages. This requires building a dynamic form interface where users can add, edit, and delete multiple items in each section.

## Acceptance criteria

- [ ] "Work Experience" section: List of entries with Add/Edit/Delete. Fields: Company, Title, Dates, Description, Achievements (multi-line).
- [ ] "Education" section: List of entries with Add/Edit/Delete. Fields: Institution, Degree, Field, Dates, GPA.
- [ ] "Skills" section: List of tags with Proficiency selector (Beginner/Intermediate/Expert).
- [ ] "Projects" section: Name, Description, Tech Stack (tags), URL.
- [ ] "Certifications" section: Name, Issuer, Date, URL.
- [ ] "Languages" section: Language name + Proficiency selector.
- [ ] `getFullProfile(userId)` server action in `lib/profile/actions.ts` fetches all related table data into a unified object.
- [ ] Each section has dedicated server actions for Add/Update/Delete operations.
- [ ] UI handles empty states gracefully for each section.

## Blocked by

- #004 — User Profile: Personal Info + Professional Summary
