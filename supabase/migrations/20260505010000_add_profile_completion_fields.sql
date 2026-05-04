ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS profile_completion_percentage INTEGER NOT NULL DEFAULT 0
    CHECK (profile_completion_percentage >= 0 AND profile_completion_percentage <= 100),
  ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_skipped BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

UPDATE profiles
SET
  profile_completion_percentage = 0,
  profile_completed = FALSE
WHERE profile_completion_percentage IS NULL;
