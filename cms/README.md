# CMS

Lightweight admin + posts content management. Uses existing Postgres and Node server.

## Setup

1. **Env vars** (add to `.env` or Koyeb):
   - `CMS_JWT_SECRET` — JWT signing secret (e.g. `openssl rand -hex 32`)
   - `DATABASE_URL` — Postgres connection string (already used by app)

2. **Tables** — Created automatically on server start (`cms_admin_users`, `cms_posts`).

3. **First admin user**:
   ```bash
   CMS_ADMIN_EMAIL=admin@example.com CMS_ADMIN_PASSWORD=yourpassword npm run cms:create-admin
   ```
   Or with dotenv: ensure `.env` has `CMS_ADMIN_EMAIL` and `CMS_ADMIN_PASSWORD`, then:
   ```bash
   npm run cms:create-admin
   ```

## Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/admin/login` | — | Login, returns JWT |
| GET | `/api/admin/posts` | Bearer | List all posts |
| GET | `/api/admin/posts/:id` | Bearer | Get one post |
| POST | `/api/admin/posts` | Bearer | Create post |
| PUT | `/api/admin/posts/:id` | Bearer | Update post |
| DELETE | `/api/admin/posts/:id` | Bearer | Delete post |
| GET | `/api/posts/:slug` | — | Public: get published post by slug |

## Admin UI

- **URL**: `/admin` or `/admin.html`
- Login → list posts → create/edit/delete
- JWT stored in `sessionStorage`

## Projects (portfolio)

Projects use `cms_projects` table. Public API: `GET /api/projects`, `GET /api/projects/:slug`.

**Add a test project:**
```sql
INSERT INTO cms_projects (slug, title, excerpt, hero_image, about_text, gallery_images, gallery_caption, footer_cta, footer_email, tags, published)
VALUES (
  'my-project',
  'My Project',
  'Short description for the projects list.',
  'https://example.com/hero.jpg',
  'Longer about text for the hero section.',
  '["https://example.com/1.jpg", "https://example.com/2.jpg"]',
  'Gallery caption text.',
  'Get in touch',
  'you@example.com',
  '["Design", "Strategy"]',
  true
);
```

## Migrations

Standalone SQL in `cms/migrations/001_cms_init.sql` (optional; server auto-creates tables).
