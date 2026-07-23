/**
 * SQLite data layer for the kipo.design CMS.
 *
 * Driver-agnostic: prefers `better-sqlite3` when present (Linux container /
 * production — prebuilt binaries, fastest), and falls back to Node's built-in
 * `node:sqlite` (`DatabaseSync`) otherwise (e.g. local dev on Windows where the
 * native module can't compile). Both expose the same synchronous
 * prepare/run/get/all + exec API, so the rest of this file is identical for
 * either. `better-sqlite3` is an OPTIONAL dependency for exactly this reason.
 *
 * Schema + seed run on boot (idempotent). JSON-shaped columns (content, tags,
 * icon) are stored as TEXT and parsed at the boundary. Note `sort_order` — not
 * the SQL reserved word `order`.
 */

import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

const DB_PATH = process.env.DB_PATH
  ? resolve(process.env.DB_PATH)
  : join(ROOT_DIR, 'data', 'kipo.db');

// Ensure the parent directory for the DB file exists.
fs.mkdirSync(dirname(DB_PATH), { recursive: true });

/**
 * Open the database with the best available driver.
 * @returns {Promise<{ db: object, driver: string }>}
 */
async function openDatabase() {
  try {
    const mod = await import('better-sqlite3');
    const BetterSqlite3 = mod.default;
    return { db: new BetterSqlite3(DB_PATH), driver: 'better-sqlite3' };
  } catch {
    const { DatabaseSync } = await import('node:sqlite');
    return { db: new DatabaseSync(DB_PATH), driver: 'node:sqlite' };
  }
}

const { db: dbInstance, driver } = await openDatabase();
export const db = dbInstance;
export const dbDriver = driver;
console.log(`[db] using ${driver} at ${DB_PATH}`);

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS sections (
    id         TEXT PRIMARY KEY,
    type       TEXT NOT NULL,
    name       TEXT NOT NULL,
    enabled    INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    content    TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS projects (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    slug        TEXT NOT NULL DEFAULT '',
    image       TEXT,
    icon        TEXT,
    tags        TEXT NOT NULL DEFAULT '[]',
    year        TEXT NOT NULL DEFAULT '',
    client      TEXT NOT NULL DEFAULT '',
    content     TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

/**
 * Run `fn` inside a transaction. Rolls back on throw.
 * @template T
 * @param {() => T} fn
 * @returns {T}
 */
export function transaction(fn) {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

function safeParse(value, fallback) {
  if (value === null || value === undefined) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

// ---- Section mapping ------------------------------------------------------

function rowToSection(row) {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    enabled: row.enabled === 1,
    order: row.sort_order,
    content: safeParse(row.content, {}),
  };
}

export function getSections() {
  const rows = db
    .prepare('SELECT * FROM sections ORDER BY sort_order ASC')
    .all();
  return rows.map(rowToSection);
}

export function getSection(id) {
  const row = db.prepare('SELECT * FROM sections WHERE id = ?').get(id);
  return row ? rowToSection(row) : null;
}

const upsertSectionStmt = () =>
  db.prepare(`
    INSERT INTO sections (id, type, name, enabled, sort_order, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      type       = excluded.type,
      name       = excluded.name,
      enabled    = excluded.enabled,
      sort_order = excluded.sort_order,
      content    = excluded.content,
      updated_at = datetime('now')
  `);

/**
 * Replace the full set of sections via per-row upsert inside one transaction.
 * Rows absent from the incoming array are deleted, so this stays a faithful
 * "save the whole ordered list" operation without last-write-wins clobbering
 * of unrelated columns.
 * @param {Array<object>} sections
 */
export function replaceSections(sections) {
  return transaction(() => {
    const upsert = upsertSectionStmt();
    const keepIds = [];
    sections.forEach((s, index) => {
      const id = s.id;
      keepIds.push(id);
      upsert.run(
        id,
        s.type ?? s.id,
        s.name ?? id,
        s.enabled === false ? 0 : 1,
        Number.isFinite(s.order) ? s.order : index + 1,
        JSON.stringify(s.content ?? {})
      );
    });
    // Delete any rows no longer present.
    const existing = db.prepare('SELECT id FROM sections').all();
    const remove = db.prepare('DELETE FROM sections WHERE id = ?');
    for (const { id } of existing) {
      if (!keepIds.includes(id)) remove.run(id);
    }
    return getSections();
  });
}

/**
 * Partially update one section. Only provided fields are touched.
 * @param {string} id
 * @param {object} updates
 * @returns {object|null} updated section, or null if not found
 */
export function updateSection(id, updates) {
  const existing = getSection(id);
  if (!existing) return null;

  const merged = {
    type: updates.type ?? existing.type,
    name: updates.name ?? existing.name,
    enabled:
      updates.enabled === undefined ? existing.enabled : updates.enabled,
    order: updates.order === undefined ? existing.order : updates.order,
    content:
      updates.content === undefined ? existing.content : updates.content,
  };

  db.prepare(
    `UPDATE sections
       SET type = ?, name = ?, enabled = ?, sort_order = ?, content = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    merged.type,
    merged.name,
    merged.enabled ? 1 : 0,
    merged.order,
    JSON.stringify(merged.content ?? {}),
    id
  );

  return getSection(id);
}

// ---- Project mapping ------------------------------------------------------

function rowToProject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    slug: row.slug,
    image: row.image ?? undefined,
    icon: safeParse(row.icon, undefined),
    tags: safeParse(row.tags, []),
    year: row.year,
    client: row.client,
    content: safeParse(row.content, undefined),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getProjects() {
  const rows = db
    .prepare('SELECT * FROM projects ORDER BY created_at DESC')
    .all();
  return rows.map(rowToProject);
}

export function getProject(id) {
  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  return row ? rowToProject(row) : null;
}

export function createProject(data) {
  const id =
    data.id ||
    `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  db.prepare(
    `INSERT INTO projects (id, title, description, slug, image, icon, tags, year, client, content, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
  ).run(
    id,
    data.title ?? '',
    data.description ?? '',
    data.slug ?? '',
    data.image ?? null,
    data.icon === undefined ? null : JSON.stringify(data.icon),
    JSON.stringify(data.tags ?? []),
    data.year ?? '',
    data.client ?? '',
    data.content === undefined ? null : JSON.stringify(data.content)
  );

  return getProject(id);
}

export function updateProject(id, updates) {
  const existing = getProject(id);
  if (!existing) return null;

  const merged = { ...existing, ...updates };

  db.prepare(
    `UPDATE projects
       SET title = ?, description = ?, slug = ?, image = ?, icon = ?, tags = ?, year = ?, client = ?, content = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    merged.title ?? '',
    merged.description ?? '',
    merged.slug ?? '',
    merged.image ?? null,
    merged.icon === undefined || merged.icon === null
      ? null
      : JSON.stringify(merged.icon),
    JSON.stringify(merged.tags ?? []),
    merged.year ?? '',
    merged.client ?? '',
    merged.content === undefined || merged.content === null
      ? null
      : JSON.stringify(merged.content),
    id
  );

  return getProject(id);
}

export function deleteProject(id) {
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  return result.changes > 0;
}

// ---- Seed -----------------------------------------------------------------

/**
 * Default sections, mirrored from `src/contexts/CMSContext.tsx` (`defaultSections`).
 * Each entry's `id` doubles as its `type`. Kept in sync manually because the
 * backend cannot import the frontend TSX module.
 */
const defaultSections = [
  {
    id: 'hero',
    name: 'Hero Section',
    content: {
      badge: 'Available for new projects',
      headline: 'Design That Moves.',
      subheadline: 'Ideas That Convert.',
      description:
        'We build scalable, user-first digital products and design systems for teams that think ahead.',
      primaryButton: { text: "Let's Build Something Brilliant", href: '#contact', variant: 'primary' },
      secondaryButton: { text: 'See Our Work', href: '#work', variant: 'secondary' },
      stats: [
        { value: '50+', label: 'Projects Delivered' },
        { value: '98%', label: 'Client Satisfaction' },
        { value: '3x', label: 'Conversion Increase' },
      ],
    },
  },
  {
    id: 'services',
    name: 'Services Section',
    content: {
      headline: 'What We Do',
      description:
        'We specialize in creating digital experiences that not only look great but drive real business results.',
      services: [
        {
          icon: { name: 'Palette' },
          title: 'UX/UI Design',
          description:
            'User-centered design that combines beautiful aesthetics with intuitive functionality.',
          features: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design'],
        },
        {
          icon: { name: 'Code' },
          title: 'Web Design & Development',
          description:
            'Modern, responsive websites built with the latest technologies and best practices.',
          features: ['Responsive Design', 'Performance Optimization', 'SEO Integration', 'CMS Development'],
        },
        {
          icon: { name: 'Layers' },
          title: 'Design Systems',
          description:
            'Scalable design systems that maintain consistency across all your digital products.',
          features: ['Component Libraries', 'Style Guides', 'Documentation', 'Token Management'],
        },
        {
          icon: { name: 'Smartphone' },
          title: 'Product Design',
          description:
            'End-to-end product design from concept to launch, focused on user needs and business goals.',
          features: ['Product Strategy', 'User Testing', 'Conversion Optimization', 'Launch Support'],
        },
      ],
    },
  },
  {
    id: 'process',
    name: 'Process Section',
    content: {
      headline: 'Our Simple Process',
      description:
        "We've streamlined our workflow to deliver exceptional results efficiently. Here's how we transform your ideas into reality.",
      ctaHeadline: 'Ready to Get Started?',
      ctaDescription:
        "Let's discuss your project and see how our proven process can help you achieve your goals.",
      ctaButton: { text: 'Start Your Project', href: '#contact', variant: 'primary' },
      steps: [
        {
          number: '01',
          icon: { name: 'MessageCircle' },
          title: 'Discovery & Strategy',
          description:
            'We start with a deep dive into your business goals, target audience, and project requirements through collaborative workshops.',
          duration: '1-2 weeks',
          deliverables: ['Project roadmap', 'User personas', 'Technical requirements'],
          image: {
            type: 'image',
            url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
          details:
            'Our discovery phase involves stakeholder interviews, competitive analysis, and user research to establish a solid foundation for your project.',
        },
      ],
    },
  },
  {
    id: 'studio',
    name: 'Studio Section',
    content: {
      headline: 'Meet the Studio Behind kipo.design',
      description:
        "Founded by Yordan Hristov, we're a boutique design studio that combines strategic thinking with creative execution to deliver exceptional results.",
      stat1Value: '5+',
      stat1Label: 'Years Experience',
      stat2Value: '50+',
      stat2Label: 'Happy Clients',
      stat3Value: '200+',
      stat3Label: 'Projects Completed',
      stat4Value: '98%',
      stat4Label: 'Client Satisfaction',
    },
  },
  {
    id: 'approach',
    name: 'Approach Section',
    content: {
      headline: "Design That Works Because It's Built On Understanding",
      description:
        'Our approach combines strategic thinking with creative execution, ensuring every project delivers measurable results.',
    },
  },
  {
    id: 'projects',
    name: 'Projects Section',
    content: {
      headline: 'Featured Projects',
      description:
        "Explore our latest work and see how we've helped businesses transform their digital presence.",
    },
  },
  {
    id: 'testimonials',
    name: 'Testimonials Section',
    content: {
      headline: 'What Our Clients Say',
      description:
        "Don't just take our word for it. Here's what our clients have to say about working with kipo.design.",
      clientsTitle: 'Trusted by innovative companies',
    },
  },
  {
    id: 'contact',
    name: 'Contact Section',
    content: {
      headline: 'Ready to Start Your Project?',
      description:
        "Let's discuss how we can help you create exceptional digital experiences that drive real business results.",
      formTitle: 'Tell us about your project',
      infoTitle: 'Get in Touch',
      ctaTitle: 'Free Consultation',
      ctaDescription:
        'Schedule a 30-minute call to discuss your project and explore how we can help.',
    },
  },
  {
    id: 'footer',
    name: 'Footer Section',
    content: {
      brand: 'kipo.design',
      description: 'Creating exceptional digital experiences that drive real business results.',
      copyright: '© 2024 kipo.design. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
  },
];

/**
 * Seed the sections table from defaultSections on first run only (no-op if any
 * sections already exist).
 */
export function seed() {
  const { count } = db.prepare('SELECT COUNT(*) AS count FROM sections').get();
  if (count > 0) return { seeded: false, count };

  transaction(() => {
    const upsert = upsertSectionStmt();
    defaultSections.forEach((s, index) => {
      upsert.run(
        s.id,
        s.id, // type === id for defaults
        s.name,
        1,
        index + 1,
        JSON.stringify(s.content)
      );
    });
  });

  return { seeded: true, count: defaultSections.length };
}

seed();
