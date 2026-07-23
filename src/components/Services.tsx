/**
 * @fileoverview Capabilities — a bento grid of services with spot illustrations.
 * Content-driven (section.content.services) and inline-editable.
 * @module components/Services
 */

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';
import EditableText from './atoms/EditableText';
import SectionWrapper from './cms/SectionWrapper';
import { ChipIcon, LayersIllo, TokensIllo, MiniAreaChart } from './sections/visuals/CapabilityVisuals';

interface ServiceItem {
  icon?: { name?: string };
  title: string;
  description: string;
  features?: string[];
}

interface ServicesProps {
  sectionId?: string;
}

const defaultServices: ServiceItem[] = [
  { icon: { name: 'Boxes' }, title: 'Design Systems', description: 'Component libraries, tokens and documentation that keep every screen consistent as you scale.' },
  { icon: { name: 'Code2' }, title: 'Design-led Development', description: 'Design and engineering in one loop. Decisions land as tokens and components — not handoff PDFs.' },
  { icon: { name: 'PenTool' }, title: 'UX/UI Design', description: 'Research-backed interface design, prototyped and tested.' },
  { icon: { name: 'LayoutDashboard' }, title: 'Web & App Development', description: 'Modern, responsive products built with maintainable code.' },
];

const resolveIcon = (name?: string): React.ComponentType<{ className?: string }> =>
  (name && (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]) || LucideIcons.Boxes;

// Column spans per cell (mobile is full width); repeats after the first four.
const spanFor = (i: number): string => {
  const pattern = ['md:col-span-3', 'md:col-span-3', 'md:col-span-2', 'md:col-span-4'];
  return pattern[i] || 'md:col-span-3';
};
const IlloFor = (i: number): React.FC | null =>
  i === 0 ? LayersIllo : i === 1 ? TokensIllo : i === 3 ? MiniAreaChart : null;

const Services: React.FC<ServicesProps> = ({ sectionId = 'services' }) => {
  const { sections, updateSection } = useCMS();
  const section = sections.find(s => s.id === sectionId);

  if (!section) return null;

  const { content } = section;
  const rawServices = content.services as ServiceItem[] | undefined;
  const services = Array.isArray(rawServices) && rawServices.length > 0 ? rawServices : defaultServices;

  const updateContent = (field: string, value: unknown) => {
    updateSection(sectionId, { [field]: value });
  };

  const updateService = (index: number, field: keyof ServiceItem, value: string) => {
    const next = services.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    updateContent('services', next);
  };

  return (
    <SectionWrapper sectionId={sectionId}>
      <section id="services" className="brutalist-section bg-bg-primary border-t border-border-primary">
        <div className="brutalist-container">
          <div className="mb-11 max-w-[660px]">
            <div className="util-label mb-3.5">What we do</div>
            <EditableText
              elementId={`${sectionId}-headline`}
              onUpdate={(value) => updateContent('headline', value)}
              className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-bold text-text-primary"
              as="h2"
            >
              {(content.headline as string) || 'Design systems, and the products they power'}
            </EditableText>
            <EditableText
              elementId={`${sectionId}-description`}
              onUpdate={(value) => updateContent('description', value)}
              className="mt-3 text-text-secondary"
              as="p"
              multiline
            >
              {(content.description as string) ||
                'We specialize in the systems layer — tokens, components, documentation — then lead the design-led development that turns it into shipped products.'}
            </EditableText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 auto-rows-[minmax(148px,auto)]">
            {services.map((service, i) => {
              const Illo = IlloFor(i);
              return (
                <div
                  key={i}
                  className={`${spanFor(i)} relative overflow-hidden bg-surface-elevated border border-border-primary rounded-section p-[22px] transition-[box-shadow,border-color] duration-200 hover:shadow-ds hover:border-border-strong`}
                >
                  <div className="font-mono text-[11px] tracking-[0.05em] text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <ChipIcon icon={resolveIcon(service.icon?.name)} />
                    <EditableText
                      elementId={`${sectionId}-service-${i}-title`}
                      onUpdate={(value) => updateService(i, 'title', value)}
                      className="text-[1.14rem] font-semibold text-text-primary"
                      as="h3"
                    >
                      {service.title}
                    </EditableText>
                  </div>
                  <EditableText
                    elementId={`${sectionId}-service-${i}-desc`}
                    onUpdate={(value) => updateService(i, 'description', value)}
                    className="mt-2 text-[13.5px] text-text-secondary max-w-[36ch]"
                    as="p"
                    multiline
                  >
                    {service.description}
                  </EditableText>
                  {Illo && <Illo />}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
};

export default Services;
