# Issue #011 — CV Templates with react-pdf

**Labels:** needs-triage  
**Type:** AFK

## What to build

Create the visual CV templates using `@react-pdf/renderer`. These templates define the PDF layout and accept a standardized data structure.

## Acceptance criteria

- [ ] `components/cv-templates/` directory created.
- [ ] `Modern.tsx`: Sidebar layout, bold headers, indigo accent.
- [ ] `Classic.tsx`: Traditional single-column, ATS-optimized, black/white.
- [ ] `Minimal.tsx`: Lightweight typography, lots of whitespace.
- [ ] All templates consume a unified `CVContent` interface (Header, Experience[], Education[], etc.).
- [ ] Templates are testable by passing dummy data to verify PDF generation doesn't crash.

## Blocked by

- #005 — User Profile: Multi-entry Sections
