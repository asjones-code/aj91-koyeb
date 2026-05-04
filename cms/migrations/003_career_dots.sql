-- Career/life globe dots — managed via CMS admin.
-- Run once: psql $DATABASE_URL -f cms/migrations/003_career_dots.sql

CREATE TABLE IF NOT EXISTS career_dots (
  id         SERIAL PRIMARY KEY,
  lat        DOUBLE PRECISION NOT NULL,
  lng        DOUBLE PRECISION NOT NULL,
  label      TEXT NOT NULL,
  year       TEXT,
  text       TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed defaults only if the table is empty
INSERT INTO career_dots (lat, lng, label, year, text, sort_order)
SELECT lat, lng, label, year, text, sort_order FROM (VALUES
  (40.7128,  -74.0060,  'New York, NY',    '2017–present', 'Home base. Built products at Meta, Barrel, and Gotham Greens.', 1),
  (37.4847,  -122.1471, 'Menlo Park, CA',  '2021–2022',    'Meta — Implementation Manager, global ads infrastructure.',     2),
  (37.3382,  -121.8863, 'San José, CA',    '2022–2023',    'Assembled — Implementation Manager, workforce management.',     3),
  (42.3601,  -71.0589,  'Boston, MA',      '2019–2021',    'Sendwave — Director of Growth, global fintech remittance.',     4)
) AS v(lat, lng, label, year, text, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM career_dots LIMIT 1);
