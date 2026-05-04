ALTER TABLE user_settings
  ADD COLUMN IF NOT EXISTS provider_models JSONB NOT NULL DEFAULT '{}'::jsonb;

UPDATE user_settings
SET provider_models = jsonb_set(
  provider_models,
  ARRAY[provider::text],
  to_jsonb(model),
  true
)
WHERE model IS NOT NULL;
