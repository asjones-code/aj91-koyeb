-- Rename live_visitors → visitors.
-- Run once against your Koyeb Postgres instance:
--   psql $DATABASE_URL -f cms/migrations/002_rename_live_visitors.sql
-- Safe to re-run: the DO block checks if the old table still exists before acting.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'live_visitors'
  ) THEN
    ALTER TABLE live_visitors RENAME TO visitors;
    RAISE NOTICE 'Renamed live_visitors → visitors';
  ELSE
    RAISE NOTICE 'live_visitors not found — skipping (already renamed or never existed)';
  END IF;
END
$$;
