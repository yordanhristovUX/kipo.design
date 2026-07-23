/**
 * @fileoverview API service — talks to the Node + SQLite backend over REST.
 *
 * All requests send the session cookie (`credentials: 'include'`). Reads are
 * public; writes require an authenticated admin session (see auth.service).
 * The public method surface is stable so CMSContext, project.service,
 * ImageUploader, and EditableImage need no changes.
 *
 * @module services/api
 */

import { SectionConfig } from '../types/cms.types';
import { Project, CreateProjectDto } from '../types/project.types';

/** Base API URL, e.g. `http://localhost:3001/api` (dev) or `/api` (prod, same-origin). */
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

/** Origin that serves `/uploads` — API base without its trailing `/api`. */
const API_ORIGIN = API_BASE.replace(/\/api$/, '');

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
      ...init,
    });
  } catch (err) {
    throw new ApiError(0, `Network error: ${err instanceof Error ? err.message : 'unreachable'}`);
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      /* non-JSON error body — keep default message */
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export class ApiService {
  private static instance: ApiService;

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async getSections(): Promise<SectionConfig[]> {
    return request<SectionConfig[]>('/sections');
  }

  async saveSections(sections: SectionConfig[]): Promise<void> {
    await request<{ success: boolean }>('/sections', {
      method: 'POST',
      body: JSON.stringify(sections),
    });
  }

  async updateSection(id: string, updates: Partial<SectionConfig>): Promise<SectionConfig> {
    const res = await request<{ success: boolean; section: SectionConfig }>(
      `/sections/${encodeURIComponent(id)}`,
      { method: 'PATCH', body: JSON.stringify(updates) }
    );
    return res.section;
  }

  async getProjects(): Promise<Project[]> {
    return request<Project[]>('/projects');
  }

  async createProject(data: CreateProjectDto): Promise<Project> {
    const res = await request<{ success: boolean; project: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await request<{ success: boolean; project: Project }>(
      `/projects/${encodeURIComponent(id)}`,
      { method: 'PATCH', body: JSON.stringify(updates) }
    );
    return res.project;
  }

  async deleteProject(id: string): Promise<void> {
    await request<{ success: boolean }>(`/projects/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    let response: Response;
    try {
      response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData, // browser sets multipart boundary; do not set Content-Type
      });
    } catch (err) {
      throw new ApiError(0, `Network error: ${err instanceof Error ? err.message : 'unreachable'}`);
    }

    if (!response.ok) {
      let message = `Upload failed (${response.status})`;
      try {
        const body = await response.json();
        if (body?.error) message = body.error;
      } catch {
        /* keep default */
      }
      throw new ApiError(response.status, message);
    }

    const data = (await response.json()) as { url: string };
    // Return an absolute URL so <img> works regardless of the app's origin.
    return data.url.startsWith('http') ? data.url : `${API_ORIGIN}${data.url}`;
  }

  async healthCheck(): Promise<boolean> {
    try {
      await request<{ status: string }>('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export const apiService = ApiService.getInstance();
