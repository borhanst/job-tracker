# Issue #002 — Supabase Schema: All Tables + RLS Policies

**Labels:** needs-triage  
**Type:** AFK

## What to build

Create the complete Supabase database schema across all tables required by the app, with Row Level Security (RLS) enabled so each user can only access their own data. This issue is purely infrastructure — no UI.

## Acceptance criteria

- [ ] `profiles` table: `id`, `user_id` (FK → auth.users), `full_name`, `email`, `phone`, `location`, `linkedin_url`, `github_url`, `portfolio_url`, `avatar_url`, `summary`, `created_at`, `updated_at`
- [ ] `work_experiences` table: `id`, `user_id`, `company`, `title`, `start_date`, `end_date`, `is_current`, `description`, `achievements` (text[]), `created_at`
- [ ] `educations` table: `id`, `user_id`, `institution`, `degree`, `field`, `start_date`, `end_date`, `gpa`, `created_at`
- [ ] `skills` table: `id`, `user_id`, `name`, `proficiency` (enum: beginner/intermediate/expert), `created_at`
- [ ] `projects` table: `id`, `user_id`, `name`, `description`, `tech_stack` (text[]), `url`, `created_at`
- [ ] `certifications` table: `id`, `user_id`, `name`, `issuer`, `issued_date`, `url`, `created_at`
- [ ] `languages` table: `id`, `user_id`, `name`, `proficiency` (enum: basic/conversational/fluent/native), `created_at`
- [ ] `applications` table: `id`, `user_id`, `url`, `raw_text`, `job_data` (jsonb), `status` (enum: saved/applied/phone_screen/interview/offer/accepted/rejected/withdrawn), `match_score` (int), `follow_up_date`, `applied_date`, `notes` (jsonb[]), `created_at`, `updated_at`
- [ ] `generated_documents` table: `id`, `application_id`, `user_id`, `type` (enum: cv/cover_letter), `template` (text, nullable), `content` (jsonb), `created_at`
- [ ] `user_settings` table: `user_id` (PK, FK → auth.users), `provider` (enum: gemini/openai/anthropic/groq), `model`, `gemini_key_enc`, `openai_key_enc`, `anthropic_key_enc`, `groq_key_enc`, `updated_at`
- [ ] RLS enabled on every table; policies restrict SELECT/INSERT/UPDATE/DELETE to rows where `user_id = auth.uid()`
- [ ] A `trigger` auto-creates a `profiles` row on new user sign-up
- [ ] Migration SQL file is committed to `supabase/migrations/`

## Blocked by

None — can start immediately.
