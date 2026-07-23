import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';
import EditableText from './atoms/EditableText';
import SectionWrapper from './cms/SectionWrapper';
import { ApproachCard } from '@/design-system';
import type { ApproachPrincipleData } from '@/types';

interface ApproachProps {
  sectionId?: string;
}

const DEFAULT_PRINCIPLES: ApproachPrincipleData[] = [
  {
    icon: 'Users',
    title: 'User-Centered',
    description:
      'Every design decision is backed by user research and testing to ensure we create experiences that truly serve your audience.',
    stat: '100% User Tested',
  },
  {
    icon: 'Target',
    title: 'Conversion-Focused',
    description:
      'We design with clear goals in mind, optimizing every interaction to drive the actions that matter most to your business.',
    stat: '3x Avg. Conversion',
  },
  {
    icon: 'Grid',
    title: 'Modular & Scalable',
    description:
      'Our systematic approach ensures your design can grow with your business, maintaining consistency at every scale.',
    stat: '50+ Components',
  },
  {
    icon: 'Zap',
    title: 'Speed + Quality',
    description:
      'Rapid iteration combined with meticulous attention to detail means you get exceptional results, fast.',
    stat: '2-4 Week Delivery',
  },
];

const Approach: React.FC<ApproachProps> = ({ sectionId = 'approach' }) => {
  const { sections, updateSection, isEditMode } = useCMS();
  const section = sections.find(s => s.id === sectionId);

  if (!section) return null;

  const { content } = section;

  const principles =
    (content.principles as ApproachPrincipleData[] | undefined) && (content.principles as ApproachPrincipleData[]).length > 0
      ? (content.principles as ApproachPrincipleData[])
      : DEFAULT_PRINCIPLES;

  const updateContent = (field: string, value: unknown) => {
    updateSection(sectionId, { [field]: value });
  };

  const persist = (next: ApproachPrincipleData[]) => updateContent('principles', next);

  const updatePrinciple = (index: number, field: keyof ApproachPrincipleData, value: string) => {
    const next = principles.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    persist(next);
  };

  const addPrinciple = () => {
    persist([
      ...principles,
      { icon: 'Sparkles', title: 'New Principle', description: 'Describe this principle.', stat: 'Key metric' },
    ]);
  };

  const removePrinciple = (index: number) => {
    persist(principles.filter((_, i) => i !== index));
  };

  return (
    <SectionWrapper sectionId={sectionId}>
      <section className="brutalist-section bg-bg-secondary ">
        <div className="brutalist-container">
          <div className="text-center mb-16">
            <div className="util-label mb-4">005-APPROACH</div>
            <EditableText
              elementId={`${sectionId}-headline`}
              onUpdate={(value) => updateContent('headline', value)}
              className="text-3xl md:text-5xl font-bold text-text-primary mb-6"
              as="h2"
            >
              {(content.headline as string) || "Design That Works Because It's Built On Understanding"}
            </EditableText>

            <EditableText
              elementId={`${sectionId}-description`}
              onUpdate={(value) => updateContent('description', value)}
              className="text-xl text-text-secondary max-w-3xl mx-auto"
              as="p"
              multiline
            >
              {(content.description as string) ||
                'Our approach combines strategic thinking with creative execution, ensuring every project delivers measurable results.'}
            </EditableText>
          </div>

          {/* Full-width contained grid */}
          <div className="border-l border-r border-border-primary">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px brutalist-hatch">
              {principles.map((principle, index) => (
                <div key={index} className="relative">
                  {isEditMode && (
                    <button
                      onClick={() => removePrinciple(index)}
                      className="absolute top-2 right-2 z-10 p-1.5 bg-white border border-border-primary rounded text-red-600 hover:bg-red-50"
                      title="Remove principle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <ApproachCard
                    principle={principle}
                    index={index}
                    onUpdate={(field, value) => updatePrinciple(index, field, value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {isEditMode && (
            <button
              onClick={addPrinciple}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-border-primary rounded-interactive text-text-primary hover:bg-bg-primary transition-colors text-sm font-bold"
            >
              <Plus className="w-4 h-4" /> Add Principle
            </button>
          )}
        </div>
      </section>
    </SectionWrapper>
  );
};

export default Approach;
