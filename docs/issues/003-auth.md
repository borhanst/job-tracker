# Issue #003 — Auth: Register, Login, Google OAuth & Session Middleware

**Labels:** needs-triage  
**Type:** AFK

## What to build

Implement full authentication using Supabase Auth: email/password register and login, Google OAuth, password reset, protected route middleware, and a first-login redirect to the profile setup page.

## Acceptance criteria

- [ ] `/register` page: email + password form, submits to Supabase Auth, shows validation errors inline
- [ ] `/login` page: email + password form + "Sign in with Google" button
- [ ] `/forgot-password` page: email input, sends Supabase password reset email
- [ ] Google OAuth provider is configured in Supabase and working end-to-end
- [ ] Next.js middleware refreshes the Supabase session on every request and redirects unauthenticated users trying to access `/dashboard` (or any `/(app)/*` route) to `/login`
- [ ] After successful registration, user is redirected to `/profile/setup` if their profile has no `full_name` set
- [ ] After successful login, user is redirected to `/dashboard`
- [ ] A "Sign out" button in the sidebar calls `supabase.auth.signOut()` and redirects to `/login`
- [ ] Auth pages use the same design system but without the sidebar (full-screen centered card layout)
- [ ] Supabase browser client and server client helpers are set up correctly using `@supabase/ssr`

## Blocked by

- #001 — Project scaffold & design system
- #002 — Supabase schema & RLS
