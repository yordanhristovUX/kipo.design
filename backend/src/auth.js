/**
 * Single-admin authentication: bcrypt-checked login, signed JWT delivered in an
 * httpOnly + SameSite=Lax (+ Secure in production) cookie. Public reads stay
 * open; `requireAuth` guards every mutating route and uploads.
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

const COOKIE_NAME = 'kipo_session';
const TOKEN_TTL = '7d';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';
const SESSION_SECRET = process.env.SESSION_SECRET || '';

const isProd = process.env.NODE_ENV === 'production';

if (!SESSION_SECRET) {
  console.warn(
    '[auth] SESSION_SECRET is not set — login is disabled until it is configured.'
  );
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
  console.warn(
    '[auth] ADMIN_EMAIL / ADMIN_PASSWORD_HASH not set — no admin can log in until configured.'
  );
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  };
}

/**
 * Express middleware: rejects the request with 401 unless a valid session
 * cookie is present. Attaches `req.user` on success.
 */
export function requireAuth(req, res, next) {
  if (!SESSION_SECRET) {
    return res.status(500).json({ error: 'Server auth is not configured' });
  }
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const payload = jwt.verify(token, SESSION_SECRET);
    req.user = { email: payload.sub };
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

export function createAuthRouter() {
  const router = express.Router();

  router.post('/login', loginLimiter, async (req, res) => {
    if (!SESSION_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
      return res.status(500).json({ error: 'Server auth is not configured' });
    }

    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailMatches =
      email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
    const passwordMatches = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    // Constant-ish response regardless of which factor failed.
    if (!emailMatches || !passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ sub: ADMIN_EMAIL }, SESSION_SECRET, {
      expiresIn: TOKEN_TTL,
    });
    res.cookie(COOKIE_NAME, token, cookieOptions());
    return res.json({ user: { email: ADMIN_EMAIL } });
  });

  router.post('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
    return res.json({ success: true });
  });

  router.get('/me', (req, res) => {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token || !SESSION_SECRET) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
      const payload = jwt.verify(token, SESSION_SECRET);
      return res.json({ user: { email: payload.sub } });
    } catch {
      return res.status(401).json({ error: 'Not authenticated' });
    }
  });

  return router;
}
