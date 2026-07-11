-- blurit database schema
-- no user table, no account table, on purpose.

CREATE TABLE IF NOT EXISTS posts (
  id            SERIAL PRIMARY KEY,
  text          TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  report_count  INTEGER NOT NULL DEFAULT 0,
  hidden        BOOLEAN NOT NULL DEFAULT false
);

-- speeds up "give me latest visible posts" queries
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_hidden ON posts (hidden);
