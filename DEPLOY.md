# Deploying kipo.design

One container runs the Node process, which serves **both** the REST API and the
built SPA (`dist/`). A **persistent volume** mounted at `/data` holds the SQLite
database (`kipo.db`) and uploaded images (`uploads/`).

> The host **must** have a real, persistent filesystem — SQLite-on-disk rules
> out serverless/ephemeral platforms (Vercel/Netlify functions, etc.).

The DB driver is chosen automatically: the container image installs
**better-sqlite3** (fast, prebuilt Linux binary); local dev without it falls
back to Node's built-in **node:sqlite**. Same code either way (`backend/src/db.js`).

---

## 1. Prerequisites (once)

- An account on **Fly.io** (config included as `fly.toml`) — or any host that
  runs a Docker image with a mounted volume (Railway works too).
- The Fly CLI: `flyctl` (`fly`).

## 2. Generate the admin credentials

The single admin logs in with an email + a **bcrypt hash** of the password
(the plaintext password is never stored).

```bash
cd backend
npm install
npm run hash -- "your-strong-password"   # prints the bcrypt hash
```

Also generate a session signing secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## 3. Create the app + volume (Fly)

```bash
fly launch --no-deploy          # or: fly apps create kipo-design
fly volumes create kipo_data --size 1 --region ams
```

## 4. Set secrets (never commit these)

```bash
fly secrets set \
  ADMIN_EMAIL="you@kipo.design" \
  ADMIN_PASSWORD_HASH='<hash from step 2>' \
  SESSION_SECRET='<secret from step 2>' \
  ALLOWED_ORIGINS="https://kipo.design,https://www.kipo.design"
```

`PORT`, `NODE_ENV`, `DB_PATH=/data/kipo.db`, and `UPLOAD_DIR=/data/uploads` are
already set in `fly.toml`. `ALLOWED_ORIGINS` is comma-separated with **no
trailing slashes**.

## 5. Deploy

```bash
fly deploy
```

Fly builds the `Dockerfile` (web → `dist`, backend deps incl. better-sqlite3)
and boots one machine with the volume mounted at `/data`. The database schema is
created and seeded on first boot.

## 6. Smoke-test

```bash
curl https://<your-app>.fly.dev/api/health          # -> {"status":"ok",...}
# Log in at https://<your-app>.fly.dev/admin and make an edit; hard-refresh to
# confirm it persisted (it's now in kipo.db on the volume).
```

## 7. Backups

Snapshot the volume's database + uploads (WAL-safe via `VACUUM INTO`):

```bash
# On the machine / a scheduled job:
DB_PATH=/data/kipo.db UPLOAD_DIR=/data/uploads BACKUP_DIR=/data/backups \
  node backend/scripts/backup.js
```

Schedule it (e.g. a Fly scheduled machine or cron) and copy `/data/backups`
off-box periodically. To restore, stop the app, replace `/data/kipo.db` with a
snapshot, and redeploy.

---

## Local production dry-run (optional)

```bash
npm run build                                  # web -> dist/
cd backend
DB_PATH=./data/kipo.db UPLOAD_DIR=./uploads NODE_ENV=production \
  ADMIN_EMAIL=... ADMIN_PASSWORD_HASH=... SESSION_SECRET=... \
  ALLOWED_ORIGINS=http://localhost:3001 npm start
# Visit http://localhost:3001 — the backend serves the built site + API.
```

## Notes

- Building the Docker image requires Docker; it was **not** built in this prep
  pass (no Docker daemon in the authoring environment). Review `Dockerfile` /
  `.dockerignore` before the first `fly deploy`.
- Point your domain at the app and add both apex + `www` to `ALLOWED_ORIGINS`.
