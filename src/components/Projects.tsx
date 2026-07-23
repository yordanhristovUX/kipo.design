/**
 * @fileoverview Work — client-project gallery. Each card shows the real project
 * image when present, otherwise a device/browser mockup shot. Driven by
 * projectService with the Manage Projects editor.
 * @module components/Projects
 */

import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';
import EditableText from './atoms/EditableText';
import SectionWrapper from './cms/SectionWrapper';
import { Modal } from '@/design-system';
import { ProjectEditor } from './projects/index';
import { projectService } from '@/services';
import { Project } from '@/types';
import WorkShot, { type WorkShotVariant } from './sections/visuals/WorkShot';

interface ProjectsProps {
  sectionId?: string;
}

const CYCLE: WorkShotVariant[] = ['dashboard', 'phone', 'storefront'];

/** Pick a mockup style from the project's tags, falling back to a cycle. */
function variantFor(project: Project, index: number): WorkShotVariant {
  const tags = (project.tags || []).join(' ').toLowerCase();
  if (/phone|mobile|ios|android|app/.test(tags)) return 'phone';
  if (/commerce|shop|store|retail|storefront/.test(tags)) return 'storefront';
  if (/dashboard|web app|data|saas|fintech/.test(tags)) return 'dashboard';
  return CYCLE[index % CYCLE.length];
}

const Projects: React.FC<ProjectsProps> = ({ sectionId = 'projects' }) => {
  const { sections, updateSection, isEditMode } = useCMS();
  const section = sections.find(s => s.id === sectionId);
  const content = section?.content ?? {};
  const [projects, setProjects] = useState<Project[]>([]);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setProjects(await projectService.getAll());
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const updateContent = (field: string, value: string) => {
    updateSection(sectionId, { [field]: value });
  };

  return (
    <SectionWrapper sectionId={sectionId}>
      <section id="work" className="brutalist-section bg-bg-primary border-t border-border-primary">
        <div className="brutalist-container">
          <div className="mb-11 flex items-end justify-between gap-4 flex-wrap">
            <div className="max-w-[660px]">
              <div className="util-label mb-3.5">Selected work</div>
              <EditableText
                elementId={`${sectionId}-headline`}
                onUpdate={(value) => updateContent('headline', value)}
                className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-bold text-text-primary"
                as="h2"
              >
                {(content.headline as string) || 'Systems put to work — apps & websites'}
              </EditableText>
              <EditableText
                elementId={`${sectionId}-description`}
                onUpdate={(value) => updateContent('description', value)}
                className="mt-3 text-text-secondary"
                as="p"
                multiline
              >
                {(content.description as string) ||
                  'A few recent client products, each built on a design system your team can grow.'}
              </EditableText>
            </div>
            {isEditMode && (
              <button
                onClick={() => setShowEditor(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-interactive hover:bg-primary-hover transition-colors text-sm font-semibold"
              >
                <Settings className="w-4 h-4 shrink-0" />
                Manage Projects
              </button>
            )}
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, i) => (
                <article
                  key={project.id}
                  className="bg-surface-elevated border border-border-primary rounded-section overflow-hidden transition-[box-shadow,border-color] duration-200 hover:shadow-ds hover:border-border-strong"
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-[184px] w-full object-cover border-b border-border-primary"
                    />
                  ) : (
                    <WorkShot variant={variantFor(project, i)} />
                  )}
                  <div className="p-[18px]">
                    <div className="font-mono text-[10.5px] text-text-tertiary tracking-[0.04em]">
                      {[project.year, project.client].filter(Boolean).join(' · ')}
                    </div>
                    <h3 className="text-[1.1rem] font-semibold mt-1.5 text-text-primary">{project.title}</h3>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mt-3">
                        {project.tags.map((tag, ti) => (
                          <span
                            key={ti}
                            className="font-mono text-[10px] text-text-tertiary border border-border-primary rounded-md px-2 py-0.5 bg-bg-secondary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="border border-border-primary rounded-section p-12 text-center">
              <p className="text-text-tertiary mb-4">No projects yet.</p>
              {isEditMode && (
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-6 py-3 bg-primary text-white rounded-interactive hover:bg-primary-hover transition-colors font-semibold"
                >
                  Add Your First Project
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <Modal isOpen={showEditor} onClose={() => setShowEditor(false)} title="Project Management" size="xl">
        <ProjectEditor projects={projects} onProjectsChange={loadProjects} />
      </Modal>
    </SectionWrapper>
  );
};

export default Projects;
