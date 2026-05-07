-- CV versions for general and application-specific builder snapshots

CREATE TABLE cv_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  name TEXT,
  template TEXT NOT NULL DEFAULT 'professional-ats',
  content JSONB NOT NULL,
  section_order JSONB NOT NULL DEFAULT '[]'::jsonb,
  section_visibility JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cv_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cv versions" ON cv_versions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cv versions" ON cv_versions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cv versions" ON cv_versions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cv versions" ON cv_versions FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER on_cv_versions_updated
  BEFORE UPDATE ON cv_versions
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
