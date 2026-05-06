# App-wide form validation

All user-facing forms use an explicit validation contract instead of relying on native HTML validation. Client-side validation should use a validation library such as Zod for consistent inline errors and predictable behavior, while backend API routes and server actions remain the final authority for accepting or rejecting submitted data. Native input attributes may still be used for keyboard, autofill, and accessibility hints, but forms should disable browser validation with `noValidate` so validation behavior is owned by the app.

Validation schemas that protect submitted user data live in shared modules under `src/lib/validation/**` so client forms and backend handlers can use the same contract. Component-local schemas are reserved for UI-only state that never crosses an auth, API, database, or server-action boundary.
