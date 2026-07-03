// Single source of truth for the database shape. Idempotent on purpose:
// scripts/db-migrate.mjs runs it against Postgres (prod), and the PGlite dev
// fallback runs it at startup. Additive changes append below with a comment.
export const DDL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_renews_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);

CREATE TABLE IF NOT EXISTS evidence_records (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  site_host TEXT NOT NULL,
  site_url TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  scan_date TIMESTAMPTZ NOT NULL,
  record JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS evidence_user_site_idx
  ON evidence_records(user_id, site_host, created_at DESC);

-- 2026-07-03: white-label name shown as "Prepared by" on Agency evidence PDFs
ALTER TABLE users ADD COLUMN IF NOT EXISTS brand_name TEXT;
`;
