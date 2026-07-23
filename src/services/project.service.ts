/**
 * @fileoverview Project CRUD service — thin wrapper over the REST apiService.
 * @module services/project
 */

import { Project, CreateProjectDto, UpdateProjectDto } from '../types/project.types';
import { apiService } from './api.service';

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export class ProjectService {
  private static instance: ProjectService;

  private constructor() {}

  static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  /**
   * Get all projects
   */
  async getAll(): Promise<Project[]> {
    return apiService.getProjects();
  }

  /**
   * Get project by ID
   */
  async getById(id: string): Promise<Project | null> {
    const projects = await this.getAll();
    return projects.find(p => p.id === id) || null;
  }

  /**
   * Get project by slug
   */
  async getBySlug(slug: string): Promise<Project | null> {
    const projects = await this.getAll();
    return projects.find(p => p.slug === slug) || null;
  }

  /**
   * Create new project
   */
  async create(data: CreateProjectDto): Promise<Project> {
    return apiService.createProject({
      ...data,
      slug: data.slug || generateSlug(data.title),
    });
  }

  /**
   * Update existing project
   */
  async update(id: string, updates: Partial<UpdateProjectDto>): Promise<Project | null> {
    return apiService.updateProject(id, updates);
  }

  /**
   * Delete project
   */
  async delete(id: string): Promise<boolean> {
    await apiService.deleteProject(id);
    return true;
  }

  /**
   * Check if slug is unique
   */
  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    const projects = await this.getAll();
    return !projects.some(p => p.slug === slug && p.id !== excludeId);
  }
}

export const projectService = ProjectService.getInstance();
