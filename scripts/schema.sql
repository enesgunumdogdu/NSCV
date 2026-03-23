CREATE TABLE IF NOT EXISTS cvs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  data TEXT NOT NULL, -- JSON blob
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  raw_text TEXT NOT NULL,
  is_outsource INTEGER NOT NULL DEFAULT 0,
  agency_name TEXT NOT NULL DEFAULT '',
  analysis TEXT, -- JSON blob
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cv_versions (
  id TEXT PRIMARY KEY,
  cv_id TEXT NOT NULL,
  job_id TEXT,
  label TEXT NOT NULL,
  data TEXT NOT NULL, -- JSON blob (full CV snapshot)
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (cv_id) REFERENCES cvs(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
);
