# Professional ATS Design Review

## Purpose

Human sign-off for the default **Professional ATS** CV template in **CV Builder Studio**.

This review confirms the template is:

1. Professional for recruiters
2. ATS-friendly in structure
3. Better default than legacy CV templates

## Scope

In scope:

- `/cv-builder` (general CV mode)
- `/applications/[id]/cv-builder` (application-targeted mode)
- `Professional ATS` PDF preview and download output
- Editing controls for section order, entry order, visibility, and bullet edits
- AI tailoring behavior and no-fabrication warnings
- ATS pre-download checklist behavior

Out of scope:

- Legacy template visual comparison automation
- Browser extension workflow
- Cover letter flow

## Review Preconditions

1. App builds and runs locally
2. Authenticated test user exists
3. Test user has profile data for at least one application

## Scenarios To Review

Run all three scenarios and sign off each.

### Scenario A: Sparse / Entry-Level Profile

Expected qualities:

- No layout break with limited data
- Empty sections are omitted from PDF
- Checklist downgrades missing Work Experience to advisory when Education exists
- Visual output remains clean and balanced

### Scenario B: Typical Mid-Level Profile

Expected qualities:

- Header/contact line is readable and compact
- Section hierarchy is clear (summary, skills, experience, projects, education, certifications, languages)
- Bullets are readable and not overly dense
- Reordering/hiding in editor is reflected in PDF preview

### Scenario C: Heavy / Multi-Page Profile

Expected qualities:

- Multi-page rendering remains stable
- No clipping or overlapping blocks across page boundaries
- ATS checklist warns about long CV but allows download
- Typography and spacing remain professional on later pages

## ATS Readability Checklist

Approve each item with Pass/Fail.

- [ ] Single-column document flow
- [ ] Standard section headings (no decorative labels)
- [ ] No icons/graphics in PDF body
- [ ] No multi-column sidebar layout
- [ ] Dark text on light background
- [ ] Professional spacing and bullet consistency
- [ ] Month-year date style used consistently
- [ ] Contact info appears as plain text line

## Trust And Safety Checklist

- [ ] AI tailoring does not auto-hide sections or entries
- [ ] No-fabrication policy note is visible in builder
- [ ] Suspicious numeric claims are flagged
- [ ] "Rewrite safely" action works on flagged lines
- [ ] Download flow allows continuation with warnings (no hard block)

## UX Checklist

- [ ] Save and Download are separate actions
- [ ] Unsaved-change warning appears before export
- [ ] Pre-download checklist modal shows critical + advisory issues
- [ ] Fix now / Download anyway actions behave correctly
- [ ] General and application routes both load and render

## Legacy Template Decision

After review, choose one:

- [ ] Keep legacy templates hidden and continue with Professional ATS only
- [ ] Temporarily re-enable legacy templates for transition period

Recommended default: keep legacy templates hidden.

## Sign-Off

- Reviewer:
- Date:
- Decision: Pass / Pass with follow-ups / Fail
- Notes:

## Follow-Up Actions (if needed)

- Typography adjustments:
- Spacing adjustments:
- Section labeling adjustments:
- Checklist rule tuning:
- AI tailoring prompt/guardrail tuning:
