-- PM POC schema for PostgreSQL (optional: server also creates these if DATABASE_URL is set)
-- Run this if you want to create tables manually before starting the app.

CREATE TABLE IF NOT EXISTS pm_projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover TEXT,
  icon TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pm_task_statuses (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  type TEXT
);

CREATE TABLE IF NOT EXISTS pm_project_views (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT,
  data JSONB,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pm_tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
  task_status_id TEXT REFERENCES pm_task_statuses(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  "order" INTEGER NOT NULL DEFAULT 0,
  priority TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pm_tags (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT
);

CREATE INDEX IF NOT EXISTS idx_pm_task_statuses_project ON pm_task_statuses(project_id);
CREATE INDEX IF NOT EXISTS idx_pm_project_views_project ON pm_project_views(project_id);
CREATE INDEX IF NOT EXISTS idx_pm_tasks_project ON pm_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_pm_tags_project ON pm_tags(project_id);
