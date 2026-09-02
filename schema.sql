-- Bootstrap script: wrangler d1 execute zyvibe_leads --file=./schema.sql
CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  source_page TEXT    NOT NULL DEFAULT 'hero',
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
