// Load environment variables before any other module is evaluated — db.js and
// auth.js read process.env at import time, so this side-effect import must be
// first (ESM evaluates imports in order).
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import fs from 'fs';
import multer from 'multer';

import {
  getSections,
  replaceSections,
  updateSection,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from './db.js';
import { createAuthRouter, requireAuth } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');
const REPO_ROOT = join(ROOT_DIR, '..');

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? resolve(process.env.UPLOAD_DIR)
  : join(ROOT_DIR, 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Security headers. Disable the cross-origin resource policy so the SPA on a
// different dev origin can load served /uploads images.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

// CORS — credentialed, explicit allow-list (no trailing slashes in the env).
const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean) ||
  ['http://localhost:5173'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve uploaded images with a long cache (filenames are unique per upload).
app.use(
  '/uploads',
  express.static(UPLOAD_DIR, {
    maxAge: '30d',
    immutable: true,
  })
);

// ---- Uploads (multer → disk) ----------------------------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    cb(null, `image-${uniqueSuffix}.${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  },
});

// ---- Health ---------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---- Auth -----------------------------------------------------------------

app.use('/api/auth', createAuthRouter());

// ---- Sections (public read, authenticated write) --------------------------

app.get('/api/sections', (req, res) => {
  try {
    res.json(getSections());
  } catch (error) {
    console.error('Error reading sections:', error);
    res.status(500).json({ error: 'Failed to read sections' });
  }
});

app.post('/api/sections', requireAuth, (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: 'Expected an array of sections' });
    }
    const sections = replaceSections(req.body);
    res.json({ success: true, sections });
  } catch (error) {
    console.error('Error saving sections:', error);
    res.status(500).json({ error: 'Failed to save sections' });
  }
});

app.patch('/api/sections/:id', requireAuth, (req, res) => {
  try {
    const section = updateSection(req.params.id, req.body || {});
    if (!section) {
      return res.status(404).json({ error: 'Section not found' });
    }
    res.json({ success: true, section });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ error: 'Failed to update section' });
  }
});

// ---- Projects (public read, authenticated write) --------------------------

app.get('/api/projects', (req, res) => {
  try {
    res.json(getProjects());
  } catch (error) {
    console.error('Error reading projects:', error);
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

app.post('/api/projects', requireAuth, (req, res) => {
  try {
    const project = createProject(req.body || {});
    res.json({ success: true, project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

app.patch('/api/projects/:id', requireAuth, (req, res) => {
  try {
    const project = updateProject(req.params.id, req.body || {});
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', requireAuth, (req, res) => {
  try {
    const removed = deleteProject(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ---- Image upload (authenticated) -----------------------------------------

app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
      success: true,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// ---- Static SPA (production) ----------------------------------------------

if (isProd) {
  const distDir = join(REPO_ROOT, 'dist');
  app.use(express.static(distDir));
  // SPA fallback for any non-API, non-uploads route.
  app.get(/^\/(?!api\/|uploads\/).*/, (req, res) => {
    res.sendFile(join(distDir, 'index.html'));
  });
}

// ---- Error handler --------------------------------------------------------

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Upload directory: ${UPLOAD_DIR}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
  console.log(`Environment: ${isProd ? 'production' : 'development'}`);
});
