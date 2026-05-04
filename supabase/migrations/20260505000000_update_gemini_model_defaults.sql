ALTER TABLE user_settings
  ALTER COLUMN model SET DEFAULT 'gemini-2.5-flash';

UPDATE user_settings
SET model = 'gemini-2.5-flash'
WHERE provider = 'gemini'
  AND model IN ('gemini-1.5-flash', 'gemini-1.5-pro');
