/**
 * @fileoverview How we build — design-led development shown as a "design → code"
 * split panel (component/tokens preview → generated code, 1:1). Section heading
 * and CTA remain inline-editable.
 * @module components/Process
 */

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';
import EditableText from './atoms/EditableText';
import EditableButton from './atoms/EditableButton';
import SectionWrapper from './cms/SectionWrapper';
import DesignToCode from './sections/visuals/DesignToCode';

interface ProcessProps {
  sectionId?: string;
}

const Process: React.FC<ProcessProps> = ({ sectionId = 'process' }) => {
  const { sections, updateSection } = useCMS();
  const section = sections.find(s => s.id === sectionId);

  if (!section) return null;

  const { content } = section;
  const ctaButton = content.ctaButton as { text?: string; href?: string } | undefined;

  const updateContent = (field: string, value: unknown) => {
    updateSection(sectionId, { [field]: value });
  };

  return (
    <SectionWrapper sectionId={sectionId}>
      <section id="process" className="brutalist-section bg-bg-primary border-t border-border-primary">
        <div className="brutalist-container">
          <div className="mb-11 max-w-[660px]">
            <div className="util-label mb-3.5">How we build</div>
            <EditableText
              elementId={`${sectionId}-headline`}
              onUpdate={(value) => updateContent('headline', value)}
              className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-bold text-text-primary"
              as="h2"
            >
              {(content.headline as string) || 'Design-led development: from token to shipped code'}
            </EditableText>
            <EditableText
              elementId={`${sectionId}-description`}
              onUpdate={(value) => updateContent('description', value)}
              className="mt-3 text-text-secondary"
              as="p"
              multiline
            >
              {(content.description as string) ||
                'The design system is the source of truth. What you approve in design is exactly what ships — same tokens, same components, no drift.'}
            </EditableText>
          </div>

          <DesignToCode />

          {/* CTA */}
          <div className="mt-14 border border-border-primary rounded-lg-panel p-8 bg-bg-secondary">
            <div className="max-w-2xl">
              <EditableText
                elementId={`${sectionId}-cta-headline`}
                onUpdate={(value) => updateContent('ctaHeadline', value)}
                className="text-2xl font-bold text-text-primary mb-3"
                as="h3"
              >
                {(content.ctaHeadline as string) || 'Ready to get started?'}
              </EditableText>
              <EditableText
                elementId={`${sectionId}-cta-description`}
                onUpdate={(value) => updateContent('ctaDescription', value)}
                className="text-text-secondary mb-6"
                as="p"
                multiline
              >
                {(content.ctaDescription as string) ||
                  "Let's discuss your project and see how our proven process can help you achieve your goals."}
              </EditableText>
              <EditableButton
                variant="primary"
                size="lg"
                href={ctaButton?.href || '#contact'}
                icon={ArrowRight}
                editableId={`${sectionId}-cta-button`}
                onUpdate={(config) => updateContent('ctaButton', config)}
              >
                {ctaButton?.text || 'Start your project'}
              </EditableButton>
            </div>
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
};

export default Process;
