/**
 * @fileoverview Auth service — admin login/logout/session against the Node API.
 *
 * The backend issues an httpOnly session cookie, so there is no token to store
 * client-side; every call uses `credentials: 'include'`. `me()` lets the app
 * restore the session after a refresh.
 *
 * @module services/auth
 */

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

export interface AuthUser {
  email: string;
}

export class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

async function authRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
      ...init,
    });
  } catch (err) {
    throw new AuthError(0, `Network error: ${err instanceof Error ? err.message : 'unreachable'}`);
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      /* keep default */
    }
    throw new AuthError(response.status, message);
  }

  return (await response.json()) as T;
}

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /** Authenticate the admin. Throws AuthError on invalid credentials. */
  async login(email: string, password: string): Promise<AuthUser> {
    const res = await authRequest<{ user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return res.user;
  }

  /** Clear the session cookie. Never throws for the caller's flow. */
  async logout(): Promise<void> {
    try {
      await authRequest<{ success: boolean }>('/auth/logout', { method: 'POST' });
    } catch {
      /* logout should always succeed client-side */
    }
  }

  /** Return the current admin, or null when not authenticated / unreachable. */
  async me(): Promise<AuthUser | null> {
    try {
      const res = await authRequest<{ user: AuthUser }>('/auth/me');
      return res.user;
    } catch {
      return null;
    }
  }
}

export const authService = AuthService.getInstance();
