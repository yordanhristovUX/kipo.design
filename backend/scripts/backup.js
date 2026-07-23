/**
 * Snapshot the SQLite database + uploaded images.
 *
 * Uses SQLite `VACUUM INTO` for a consistent, WAL-safe copy of the database
 * (works with either better-sqlite3 or node:sqlite), then copies the uploads
 * directory alongside it. Intended to be run on a schedule against the volume.
 *
 * Usage:
 *   node scripts/backup.js
 * Honors DB_PATH, UPLOAD_DIR, and optional BACKUP_DIR (default: <db>/backups).
 */

import { resolve, join, dirname } from 'path';
import fs from 'fs';

const DB_PATH = resolve(process.env.DB_PATH || './data/kipo.db');
const UPLOAD_DIR = resolve(process.env.UPLOAD_DIR || './uploads');
const BACKUP_DIR = resolve(process.env.BACKUP_DIR || join(dirname(DB_PATH), 'backups'));

async function openDatabase(path) {
  try {
    const mod = await import('better-sqlite3');
    return new mod.default(path, { readonly: true });
  } catch {
    const { DatabaseSync } = await import('node:sqlite');
    return new DatabaseSync(path);
  }
}

async function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`No database at ${DB_PATH} — nothing to back up.`);
    process.exit(1);
  }
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const dbOut = join(BACKUP_DIR, `kipo-${ts}.db`);

  const db = await openDatabase(DB_PATH);
  db.exec(`VACUUM INTO '${dbOut.replace(/'/g, "''")}'`);
  console.log(`Database snapshot -> ${dbOut}`);

  if (fs.existsSync(UPLOAD_DIR)) {
    const upOut = join(BACKUP_DIR, `uploads-${ts}`);
    fs.cpSync(UPLOAD_DIR, upOut, { recursive: true });
    console.log(`Uploads copied     -> ${upOut}`);
  }

  console.log('Backup complete.');
}

main().catch((err) => {
  console.error('Backup failed:', err);
  process.exit(1);
});
