-- Add short-lived JD Handoff records for Browser JD Capture.

CREATE TABLE jd_handoffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  sections TEXT[] NOT NULL CHECK (array_length(sections, 1) >= 1),
  consumed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX jd_handoffs_user_id_idx ON jd_handoffs(user_id);
CREATE INDEX jd_handoffs_expires_at_idx ON jd_handoffs(expires_at);

ALTER TABLE jd_handoffs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own JD handoffs"
  ON jd_handoffs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own JD handoffs"
  ON jd_handoffs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own JD handoffs"
  ON jd_handoffs
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own JD handoffs"
  ON jd_handoffs
  FOR DELETE
  USING (auth.uid() = user_id);
