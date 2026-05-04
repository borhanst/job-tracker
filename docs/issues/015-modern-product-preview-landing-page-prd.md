# PRD: Modern Product-Preview Landing Page

**Status:** needs-triage
**Created:** 2026-05-04
**Source:** Synthesized from landing page grill-with-docs session

---

## Problem Statement

Solo job seekers applying to many roles need a landing page that quickly explains why Applynexis is useful. The current page leans on broad career promises and generic SaaS phrasing, which makes the product feel less concrete than the actual workflow: capture a job listing, understand the fit, generate a Tailored CV, and track the application.

The landing page should communicate the Landing Page Promise: turn any job listing into a tracked application with an AI-tailored CV in minutes.

## Solution

Build a modern Product Preview Landing page for Applynexis using Professional Futurism: high-trust, dark-mode-ready, tech-forward, and grounded in realistic product UI.

The first viewport should show a Hero Workflow Scene: JD URL capture, AI Extraction, Match Score, Tailored CV preview, and Application Pipeline status together. Copy should use Grounded Landing Copy, avoiding exaggerated claims such as guaranteed results, inflated match-rate claims, or "dream job" promises.

The page should include a clear CTA section and a compact footer with product, account, legal, and social links. The Primary Landing CTA label is "Get Started". Footer social icons should be LinkedIn, X, and Instagram.

## User Stories

1. As a solo job seeker, I want to immediately understand that Applynexis turns a job listing into a tracked application, so that I can tell whether it fits my job search workflow.
2. As a solo job seeker, I want to see the JD URL capture flow in the hero, so that I understand the first action I can take.
3. As a solo job seeker, I want to see AI Extraction represented in the product preview, so that I know the app can structure job description details for me.
4. As a solo job seeker, I want to see a Match Score in context, so that I understand how the app helps me prioritize roles.
5. As a solo job seeker, I want to see a Tailored CV preview, so that I understand the app can adapt my Master Profile to a specific job description.
6. As a solo job seeker, I want to see Application Pipeline status in the landing page visual, so that I know tracking is part of the product and not a separate spreadsheet task.
7. As a solo job seeker, I want the landing page copy to be practical and specific, so that I trust the product more than a generic career promise.
8. As a solo job seeker, I want a clear "Get Started" CTA in the hero, so that I know how to begin.
9. As a solo job seeker, I want a secondary sign-in path, so that returning users can reach their account quickly.
10. As a solo job seeker, I want a workflow section that explains JD URL capture, AI Extraction, Tailored CV generation, and Application Pipeline tracking, so that I can understand the product sequence.
11. As a solo job seeker, I want a feature section that explains the JD Scraper, AI Extraction, Match Score, Tailored CV, Application Pipeline, and bring-your-own AI provider support, so that I can evaluate the product's scope.
12. As a privacy-conscious user, I want the page to mention user control over data and API keys, so that I understand the trust model.
13. As a mobile visitor, I want the hero, workflow scene, CTA section, and footer to render cleanly on a phone, so that I can evaluate the product without layout overlap.
14. As a desktop visitor, I want the first viewport to feel polished and product-rich, so that the app feels mature.
15. As a visitor, I want the CTA section to restate the first meaningful action, so that the page ends with a concrete next step.
16. As a visitor, I want footer product links, so that I can jump to key sections.
17. As a visitor, I want footer account links, so that I can log in or register from the bottom of the page.
18. As a visitor, I want legal links in the footer, so that privacy and terms are easy to find.
19. As a visitor, I want LinkedIn, X, and Instagram icons in the footer, so that I can find the product's social presence.
20. As a screen reader user, I want social icons and icon buttons to have accessible labels, so that the footer is navigable without visible text labels.
21. As a user sensitive to overclaiming, I want the page to avoid unsupported success metrics, so that the product feels credible.
22. As a user comparing job search tools, I want the page to show how tracking and CV tailoring work together, so that I understand the differentiator.

## Implementation Decisions

- Replace the current generic marketing emphasis with a Product Preview Landing structure.
- Preserve the Applynexis brand and existing auth routes for registration and login.
- Use the Landing Page Promise as the hero's core message.
- Use Grounded Landing Copy throughout the page.
- Build the hero around the Hero Workflow Scene rather than abstract decorative visuals.
- Include a workflow section that explains the sequence from JD URL capture through Application Pipeline tracking.
- Include a feature proof section covering JD Scraper, AI Extraction, Match Score, Tailored CV, Application Pipeline, and AI provider control.
- Include a privacy/control section emphasizing user data and API key ownership.
- Add a Landing CTA Section with the Primary Landing CTA label "Get Started".
- Add a Landing Footer with brand copy, product links, account links, legal links, and Landing Social Icons.
- Keep cards and rounded UI restrained enough to match a professional product interface.
- Use lucide icons where available for interface controls and feature markers.
- Treat the landing page as a frontend-only presentation change unless implementation discovers that shared brand components need small updates.

## Testing Decisions

Tests should focus on external behavior and user-visible outcomes rather than implementation details.

Recommended verification:

- Build verification to ensure the Next.js page compiles.
- Responsive visual verification for desktop and mobile layouts.
- Accessibility-oriented checks for CTA links and social icon labels.
- Manual browser verification that the hero, CTA section, and footer do not overlap or break at common viewport widths.

No deep backend modules are expected for this PRD. The highest-risk area is visual quality and responsive behavior, so screenshot-based/manual UI review is more valuable than unit tests for this slice.

## Out of Scope

- Pricing implementation or billing logic.
- Real social profile URL configuration beyond footer link placeholders or existing configured URLs.
- Backend changes to JD Scraper, AI Extraction, Match Score, Tailored CV generation, or Application Pipeline persistence.
- Authentication flow changes.
- Analytics/event tracking.
- New brand identity work beyond the landing page presentation.
- A full design system rewrite.

## Further Notes

Use the project glossary terms from `CONTEXT.md`, especially Landing Page Promise, Primary Landing Audience, Hero Workflow Scene, Grounded Landing Copy, Product Preview Landing, Landing CTA Section, Landing Footer, Primary Landing CTA, and Landing Social Icons.

The page should feel modern, but the trust posture matters more than visual spectacle. The product should look useful in the first viewport.
