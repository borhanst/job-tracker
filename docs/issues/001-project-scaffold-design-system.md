# Issue #001 — Project Scaffold, Design System & Layout Shell

**Labels:** needs-triage  
**Type:** AFK

## What to build

Set up the Next.js 15 project with all dependencies installed, a complete CSS design system (light/dark theme), global typography with Inter font, and the authenticated app layout shell (sidebar + main area with page transitions). Every subsequent issue builds on top of this foundation.

## Acceptance criteria

- [ ] Next.js 15 (App Router, TypeScript, src-dir) is initialized with all dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `ai`, `@ai-sdk/google`, `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/groq`, `zod`, `cheerio`, `@react-pdf/renderer`, `recharts`, `framer-motion`, `crypto-js`
- [ ] `globals.css` defines a complete set of CSS custom properties for both light and dark themes (colors, shadows, radii, spacing tokens)
- [ ] Inter font is loaded from Google Fonts and applied globally
- [ ] A `Sidebar` component renders nav links to all pages (Dashboard, Applications, Add Job, Profile, Settings) with active state highlighting
- [ ] A `AppShell` layout component wraps all authenticated pages with the sidebar and a main content area
- [ ] A light/dark mode toggle button is present in the sidebar and persists the preference to `localStorage`
- [ ] Page transitions use Framer Motion (fade/slide)
- [ ] The layout is fully responsive (sidebar collapses on mobile)
- [ ] A `.env.local.example` file documents all required environment variables

## Blocked by

None — can start immediately.
