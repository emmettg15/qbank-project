-- QBank Pro Phase 2: Supabase Schema
-- Run this in the Supabase SQL Editor to set up all tables.

-- ─── Updated_at trigger (reusable) ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Question Sets ────────────────────────────────────────────────────────
CREATE TABLE question_sets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  date        TIMESTAMPTZ NOT NULL DEFAULT now(),
  source      TEXT NOT NULL DEFAULT 'upload',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_question_sets_user ON question_sets(user_id);

CREATE TRIGGER question_sets_updated_at BEFORE UPDATE ON question_sets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Questions (normalized from question_sets) ────────────────────────────
CREATE TABLE questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_set_id UUID NOT NULL REFERENCES question_sets(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sort_order      INT NOT NULL DEFAULT 0,
  stem            TEXT NOT NULL DEFAULT '',
  lead            TEXT NOT NULL DEFAULT '',
  choices         JSONB NOT NULL DEFAULT '[]',
  answer          INT NOT NULL DEFAULT 0,
  explanation     TEXT NOT NULL DEFAULT '',
  keypoints       JSONB NOT NULL DEFAULT '[]',
  tag             TEXT,
  tags            JSONB NOT NULL DEFAULT '{}',
  image           TEXT,
  image_alt       TEXT,
  image_caption   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_questions_set ON questions(question_set_id);
CREATE INDEX idx_questions_user ON questions(user_id);

-- ─── Sessions ─────────────────────────────────────────────────────────────
CREATE TABLE sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  date            TIMESTAMPTZ NOT NULL DEFAULT now(),
  question_set_id UUID REFERENCES question_sets(id) ON DELETE SET NULL,
  question_ids    UUID[] NOT NULL DEFAULT '{}',
  config          JSONB NOT NULL DEFAULT '{}',
  results         JSONB NOT NULL DEFAULT '{}',
  score_correct   INT NOT NULL DEFAULT 0,
  score_answered  INT NOT NULL DEFAULT 0,
  score_total     INT NOT NULL DEFAULT 0,
  completed       BOOLEAN NOT NULL DEFAULT FALSE,
  status          TEXT NOT NULL DEFAULT 'active',
  session_notes   TEXT NOT NULL DEFAULT '',
  session_rating  INT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_user_status ON sessions(user_id, status);

CREATE TRIGGER sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Question Ratings ─────────────────────────────────────────────────────
CREATE TABLE question_ratings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id      UUID NOT NULL,
  needs_review     BOOLEAN NOT NULL DEFAULT FALSE,
  validity_concern BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_id)
);

CREATE INDEX idx_ratings_user ON question_ratings(user_id);
CREATE INDEX idx_ratings_question ON question_ratings(question_id);

CREATE TRIGGER question_ratings_updated_at BEFORE UPDATE ON question_ratings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Catalog Imports ──────────────────────────────────────────────────────
CREATE TABLE catalog_imports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  catalog_id      TEXT NOT NULL,
  question_set_id UUID REFERENCES question_sets(id) ON DELETE SET NULL,
  version         INT NOT NULL DEFAULT 1,
  imported_date   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, catalog_id)
);

CREATE INDEX idx_catalog_imports_user ON catalog_imports(user_id);

-- ─── Row Level Security ──────────────────────────────────────────────────
ALTER TABLE question_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own question_sets" ON question_sets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own questions"     ON questions      FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own sessions"      ON sessions       FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own ratings"       ON question_ratings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own imports"       ON catalog_imports FOR ALL USING (auth.uid() = user_id);
