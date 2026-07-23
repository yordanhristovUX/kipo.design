/**
 * @fileoverview Hero — two-column split: editable copy + CTAs on the left, a
 * design-system "workspace" board on the right, over a faint measure grid and a
 * single-hue accent glow.
 * @module components/sections/HeroSection
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useCMS } from '../../contexts/CMSContext';
import EditableText from '../atoms/EditableText';
import EditableButton from '../atoms/EditableButton';
import SectionWrapper from '../cms/SectionWrapper';
import DesignSystemBoard from './visuals/DesignSystemBoard';

interface StatItem {
  value: string;
  label: string;
}

interface HeroSectionProps {
  sectionId?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ sectionId = 'hero' }) => {
  const { sections, updateSection } = useCMS();
  const section = sections.find(s => s.id === sectionId);

  if (!section) return null;

  const { content } = section;
  const primaryButton = content.primaryButton as { text?: string; href?: string } | undefined;
  const secondaryButton = content.secondaryButton as { text?: string; href?: string } | undefined;
  const stats = (content.stats as StatItem[] | undefined) || [];

  const updateContent = (field: string, value: unknown) => {
    updateSection(sectionId, { [field]: value });
  };

  return (
    <SectionWrapper sectionId={sectionId}>
      <section id="top" className="relative overflow-hidden bg-bg-primary pt-28 md:pt-32 pb-16 md:pb-24">
        {/* Faint measure grid, masked toward the top. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 measure-grid opacity-50"
          style={{ WebkitMaskImage: 'radial-gradient(120% 90% at 58% 0%, #000, transparent 58%)', maskImage: 'radial-gradient(120% 90% at 58% 0%, #000, transparent 58%)' }}
        />
        {/* Single-hue accent glow. */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-[12%] -right-[12%] w-[820px] h-[640px] max-w-full" style={{ background: 'var(--glow)' }} />

        <div className="brutalist-container relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left — copy */}
            <div>
              <span className="rise rise-1 inline-flex items-center gap-2.5 font-mono text-xs tracking-wide text-text-secondary bg-surface-elevated border border-border-primary px-3 py-1.5 rounded-interactive">
                <span
                  className="w-[7px] h-[7px] rounded-full bg-[var(--good)] shrink-0"
                  style={{ boxShadow: '0 0 0 3px color-mix(in srgb, var(--good) 20%, transparent)' }}
                />
                <EditableText
                  elementId="hero-badge"
                  onUpdate={(value) => updateContent('badge', value)}
                  as="span"
                >
                  {(content.badge as string) || 'Available for new projects'}
                </EditableText>
              </span>

              <h1 className="rise rise-2 mt-6 text-[clamp(2.5rem,5.6vw,4rem)] leading-[1.03] font-bold tracking-[-0.038em]">
                <EditableText
                  elementId="hero-headline"
                  onUpdate={(value) => updateContent('headline', value)}
                  as="span"
                  className="block text-text-primary"
                >
                  {(content.headline as string) || 'Design That Moves.'}
                </EditableText>
                <EditableText
                  elementId="hero-subheadline"
                  onUpdate={(value) => updateContent('subheadline', value)}
                  as="span"
                  className="block text-primary"
                >
                  {(content.subheadline as string) || 'Ideas That Convert.'}
                </EditableText>
              </h1>

              <EditableText
                elementId="hero-description"
                onUpdate={(value) => updateContent('description', value)}
                className="rise rise-3 mt-5 text-lg text-text-secondary max-w-[46ch]"
                as="p"
                multiline
              >
                {(content.description as string) ||
                  'We build scalable, user-first digital products and design systems for teams that think ahead.'}
              </EditableText>

              <div className="rise rise-4 mt-7 flex flex-wrap gap-3">
                <EditableButton
                  variant="primary"
                  size="lg"
                  href={primaryButton?.href || '#work'}
                  icon={ArrowRight}
                  editableId="hero-primary-button"
                  onUpdate={(config) => updateContent('primaryButton', config)}
                >
                  {primaryButton?.text || 'See our work'}
                </EditableButton>
                <EditableButton
                  variant="secondary"
                  size="lg"
                  href={secondaryButton?.href || '#contact'}
                  editableId="hero-secondary-button"
                  onUpdate={(config) => updateContent('secondaryButton', config)}
                >
                  {secondaryButton?.text || 'Start a project'}
                </EditableButton>
              </div>

              {stats.length > 0 && (
                <p className="rise rise-5 mt-6 font-mono text-[11px] uppercase tracking-[0.05em] text-text-tertiary">
                  {stats.map((s) => `${s.value} ${s.label}`).join('  ·  ')}
                </p>
              )}
            </div>

            {/* Right — design system board */}
            <div className="rise rise-3">
              <DesignSystemBoard />
            </div>
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
};

export default HeroSection;
