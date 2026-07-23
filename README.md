# kipo.design

Portfolio site and in-browser CMS for the kipo.design studio. React 18 + TypeScript + Vite
frontend with an editable, block-based CMS, backed by a lightweight self-hosted
**Node + SQLite** API (single admin, real image uploads, full persistence).

> **Status:** mid-rebuild. Phases 0–1 (backend consolidation + SQLite API) are in place.
> The frontend data layer, block-catalog CMS, and SaaS redesign land in later phases — see
> the build plan for the full roadmap.

## Architecture

```
React SPA (Vite)  ──REST (fetch, cookie auth)──▶  Node/Express API
 - public site (read)                              - /api/sections   CRUD
 - /admin editor (write)                           - /api/projects   CRUD
 - apiService + authService                        - /api/upload     (multer → disk)
                                                    - /api/auth/*     (JWT cookie)
                                                    - serves dist/ + /uploads
                                                    - better-sqlite3 → SQLite file
        one process, one persistent volume (kipo.db + uploads/)
```

- **Frontend:** `src/` — React + TypeScript, Tailwind, a semantic-token design system.
- **Backend:** `backend/` — Express + `better-sqlite3`. Public reads, authenticated writes
  (single admin), image uploads to disk, and (in production) serving the built SPA.
- **Persistence requires a real filesystem** (SQLite on disk), so the deploy target must be a
  persistent host — not a serverless/ephemeral-FS platform.

## Local development

Prerequisites: Node 20+ (Node 24 supported), npm 11.

### Frontend

```bash
npm install
npm run dev        # Vite dev server (http://localhost:5173)
```

Quality gates:

```bash
npm run lint
npm run type-check   # tsc --noEmit
npm run build
```

### Backend (Node + SQLite)

```bash
cd backend
cp .env.example .env   # then edit: ADMIN_EMAIL, ADMIN_PASSWORD_HASH, SESSION_SECRET, ...
npm install
npm start              # API on http://localhost:3001
```

Generate the admin password hash (bcrypt) — see `backend/.env.example` and
`backend/scripts/hash-password.js`. Env vars: `PORT`, `NODE_ENV`, `ALLOWED_ORIGINS`
(comma-separated, no trailing slashes), `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`,
`SESSION_SECRET`, `DB_PATH`, `UPLOAD_DIR`.

The database schema is created and seeded automatically on first boot (default sections come
from `src/contexts/CMSContext.tsx`).

## Deployment

Single deployable: the Node process serves both the API and the built `dist/`, with one
persistent volume holding `kipo.db` and `uploads/`. Host details and container/volume config
are finalized in a later phase — **see the build plan** for the current deploy target.

## Documentation

Active engineering docs live in `docs/`. Historical planning/status notes are archived under
`documentation-archive/` and are kept for reference only.
