# Details for Source — Project Management Tool Architecture

**Use this document as source context when migrating core features, functionality, and layout into another project management codebase.**

---

## 1. Stack overview

| Layer | Technology |
|-------|------------|
| **Frontend** | Single HTML page + vanilla JS (no framework). Parcel builds to static `dist/`. |
| **Backend** | Same Node.js server as the rest of the site: native `http`, no Express for PM routes. |
| **Database** | PostgreSQL via `pg`. Tables created in `initDatabase()` when `DATABASE_URL` is set. |
| **Local storage** | IndexedDB (one store `pm_workspace`, single key `"workspace"` holding full workspace JSON). |
| **Auth** | Single shared password (`PM_PASSWORD` env). Session token in memory (7-day TTL), sent as `X-PM-Token` or `Authorization: Bearer`. |

**Entry:** `/pm.html` (built from `src/pm.html`). Dev: when served on port 1234, `window.API_ORIGIN` is set to `http://localhost:3000` so API calls hit the Node server.

---

## 2. Data model

**Single workspace** (no multi-org). All entities use string UUIDs (e.g. `crypto.randomUUID()`).

### Workspace JSON shape (and API payload)

```json
{
  "version": 1,
  "lastModified": "ISO8601",
  "projects": [...],
  "taskStatuses": [...],
  "projectViews": [...],
  "tasks": [...],
  "tags": [...]
}
```

### Entities (camelCase in JSON; snake_case in DB)

- **Project**  
  `id`, `name`, `description`, `cover`, `icon`, `isArchived`, `createdAt`, `updatedAt`.

- **TaskStatus** (per project, e.g. To do / In progress / Done)  
  `id`, `projectId`, `name`, `color`, `order`, `type` (e.g. `"TODO"`, `"INPROCESS"`, `"DONE"`).

- **ProjectView** (optional; for future view config)  
  `id`, `projectId`, `type`, `name`, `data` (object), `order`.

- **Task**  
  `id`, `projectId`, `taskStatusId`, `title`, `description`, `dueDate`, `order`, `priority`, `assignee`, `type` (e.g. `"Task"`), `createdAt`, `updatedAt`.

- **Tag** (per project)  
  `id`, `projectId`, `name`, `color`.

**Default statuses** when a project is created: three rows with `name`/`color`/`type` = "To do" / #94a3b8 / TODO, "In progress" / #3b82f6 / INPROCESS, "Done" / #22c55e / DONE.

---

## 3. API (REST)

Base path: `/api/pm/`. All except login require auth via header `X-PM-Token` or `Authorization: Bearer <token>`.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/pm/login` | Body `{ "password": "..." }`. Returns `{ "token": "..." }` or `{ "error": "..." }`. |
| GET | `/api/pm/workspace` | Returns full workspace (projects, taskStatuses, projectViews, tasks, tags). 401 if no/invalid token; 500 if DB unavailable. |
| POST | `/api/pm/workspace` | Body = full workspace JSON. **Replace** all PM data in DB (delete then insert in order: tags → tasks → project_views → task_statuses → projects). Returns `{ "success": true, "lastModified": "..." }` or `{ "error": "..." }`. |

**Sync semantics:** Client is source of truth. POST replaces entire workspace; no per-entity PATCH. GET returns full snapshot.

---

## 4. Storage modes (frontend)

User chooses one of two modes (radio in header):

- **Store locally**  
  Read/write goes to IndexedDB only. No PM API calls. Sync status text: `"Stored locally"`.

- **Sync to server**  
  Load = GET `/api/pm/workspace`. Save = POST full workspace. Sync status: `"Synced to server"` or `"Synced to server · Last synced <time>"` (green) after a successful POST.

Export/Import use the same workspace JSON: Export downloads a file; Import reads a file and then either writes to IndexedDB (local) or POSTs to server (sync), then re-renders.

---

## 5. Frontend layout and structure

### 5.1 High-level DOM (after login)

- **Header**  
  Title "Projects"; Store locally / Sync to server radios; sync status text; Export JSON, Import JSON, New project, Sign out.

- **Main**
  - **List view** (project list): cards per project (`#pm-project-list`), or empty message. Click card → open project detail.
  - **Detail view** (single project): Back, project title; **List / Board** view toggle; then either board or list content.

### 5.2 Project list view

- Container: `#pm-list-view`, `#pm-project-list`, `#pm-no-projects`.
- Each project card: `data-id` = project id; title and short description. Click sets `currentProjectId` and ensures default statuses, then renders detail.

### 5.3 Project detail view

- Container: `#pm-detail-view`, `#pm-detail-title`.
- **View toggle:** List vs Board (buttons `#pm-view-list`, `#pm-view-board`). State: `detailViewMode` = `"list"` | `"board"`.

**Board view** (`#pm-board-wrap`, `#pm-status-columns`):

- One column per task status (`.pm-status`), each with `data-status-id`.
- Per column: heading (status name + color), task list (`.pm-task`, `data-task-id`, `draggable="true"`), then “+ Add task” input (submit on Enter).
- **Drag and drop:** Task cards draggable; columns are drop targets. On drop: set `task.taskStatusId` to target column, set `task.order` to max+1 in that column, set `task.updatedAt`, call `saveWorkspace(workspace)`.
- Add task: new task gets `assignee: ""`, `type: "Task"`, `priority: ""`.

**List view** (`#pm-list-wrap`):

- Table: columns **TODO** (checkbox + title), **ASSIGNEE**, **TYPE**, **PRIORITY**.
- Rows from `workspace.tasks` for current project, sorted by `order`.
- Checkbox: checked = task in “Done” status (status with `type === "DONE"`); toggling moves task to Done or to first non-Done status.
- Assignee, Type, Priority: `contenteditable` cells; on blur, update task and `saveWorkspace`.
- Priority styling: CSS classes by value (e.g. urgent, high, medium, low) for color.
- “+ Create new task” button: prompt for title, append task to first status with assignee/type/priority defaults.

### 5.4 Loading and errors

- Loading: show `#pm-loading`, hide list/detail sections (do not replace main content with a single node, so list/detail nodes remain in DOM).
- On load error: insert a “Failed to load: …” message node; remove it on next successful load or retry.

---

## 6. Key frontend state and functions

- **State:** `workspace` (object), `mode` (`"local"` | `"sync"`), `currentProjectId` (string | null), `detailViewMode` (`"board"` | `"list"`), `lastSyncedAt` (number | null).
- **IDB:** Store key `"workspace"`, value `{ id: "workspace", data: workspaceObject, updatedAt }`. Read/write via `localGet()` / `localSet(data)`.
- **Auth:** Token in `sessionStorage` key `pm_token`. `getToken()` / `setToken(t)`. On 401 from API, clear token and show login.
- **Render flow:** `render()` → if no `currentProjectId` then `renderList()`, else `renderDetail()`. `renderDetail()` branches on `detailViewMode` into board (status columns + drag/drop + add-task) or list (table + inline edit + add task).
- **Persistence:** `saveWorkspace(data)` builds payload with `lastModified`, then either `localSet(payload)` or `apiSyncWorkspace(payload)`; on success updates `workspace`, `lastSyncedAt` (if sync), `updateSyncStatus()`, and `render()`.

---

## 7. File and route summary

| File / route | Purpose |
|--------------|---------|
| `src/pm.html` | PM page: login form, app shell, header (mode + sync status + actions), main (list view + detail view with List/Board toggle, board wrap, list wrap with table). Inline script sets `API_ORIGIN` when port is 1234. |
| `src/pm.js` | All PM logic: auth, IDB, API, state, render (list, detail board, detail list), drag-drop, inline edit, export/import, view toggle, new project, list add task. |
| `server.js` | PM: `initDatabase()` creates `pm_*` tables; `handlePmLogin`, `handlePmGetWorkspace`, `handlePmSyncWorkspace`; route block for `pathname.startsWith("/api/pm/")` (OPTIONS, login, then auth, then GET/POST workspace). |
| `docs/pm-schema.sql` | Standalone SQL for `pm_projects`, `pm_task_statuses`, `pm_project_views`, `pm_tasks`, `pm_tags` and indexes; includes `ALTER TABLE pm_tasks ADD COLUMN IF NOT EXISTS assignee/text`. |

---

## 8. Behaviors to preserve when migrating

- **Single workspace**, single shared password, token-based session.
- **Dual mode:** local (IndexedDB) vs sync (full GET/POST workspace). Clear sync status in UI.
- **Project list → project detail** with List and Board views; Board draggable by status column; List with TODO (with done checkbox), Assignee, Type, Priority and inline edit.
- **Full replace on sync:** one workspace JSON in, full replace in DB; no conflict resolution.
- **Export/Import** as same JSON shape for backup and portability.
- **Default statuses** per project (To do, In progress, Done) and stable entity shapes (ids, camelCase in client, snake_case in DB).

Use this architecture as the source of truth when migrating core features, functionality, and layout into the target project management codebase.
