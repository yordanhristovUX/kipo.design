/**
 * @fileoverview Generic, reusable CMS blocks (cta, stats, logos, gallery,
 * rich-text, faq). Each reads/writes its own `section.content` and supports
 * add/remove of its repeating items in edit mode.
 * @module components/sections/blocks/GenericBlocks
 */

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCMS } from '../../../contexts/CMSContext';
import EditableText from '../../atoms/EditableText';
import EditableImage from '../../atoms/EditableImage';
import SectionWrapper from '../../cms/SectionWrapper';
import { Stat } from '@/design-system';
import type { StatItem, FaqItem, MediaItem } from '@/types';

interface BlockProps {
  sectionId: string;
}

/** Shared hook: resolve the section + a scoped content updater. */
function useBlock(sectionId: string) {
  const { sections, updateSection, isEditMode } = useCMS();
  const section = sections.find(s => s.id === sectionId);
  const update = (field: string, value: unknown) => updateSection(sectionId, { [field]: value });
  return { section, update, isEditMode };
}

const addBtn =
  'mt-4 inline-flex items-center gap-2 px-4 py-2 border border-border-primary rounded-interactive text-text-primary hover:bg-bg-secondary transition-colors text-sm font-bold';
const removeBtn =
  'absolute top-2 right-2 z-10 p-1.5 bg-white border border-border-primary rounded text-red-600 hover:bg-red-50';

// ---- CTA ------------------------------------------------------------------

export const CtaBlock: React.FC<BlockProps> = ({ sectionId }) => {
  const { section, update } = useBlock(sectionId);
  if (!section) return null;
  const { content } = section;
  const button = (content.button as { text?: string; href?: string } | undefined) || {};

  return (
    <SectionWrapper sectionId={sectionId}>
      <section className="brutalist-section bg-bg-secondary">
        <div className="brutalist-container">
          <div className="border border-border-primary rounded-section p-12 text-center max-w-3xl mx-auto bg-bg-primary">
            <EditableText
              elementId={`${sectionId}-headline`}
              onUpdate={(v) => update('headline', v)}
              className="text-3xl md:text-4xl font-bold text-text-primary mb-4"
              as="h2"
            >
              {(content.headline as string) || 'Ready to get started?'}
            </EditableText>
            <EditableText
              elementId={`${sectionId}-description`}
              onUpdate={(v) => update('description', v)}
              className="text-lg text-text-secondary mb-8"
              as="p"
              multiline
            >
              {(content.description as string) || "Let's talk about your next project."}
            </EditableText>
            <a
              href={button.href || '#contact'}
              className="inline-flex items-center gap-2 bg-primary text-inverse px-6 py-3 font-bold rounded-interactive uppercase tracking-wide text-sm"
            >
              <EditableText
                elementId={`${sectionId}-button-text`}
                onUpdate={(v) => update('button', { ...button, text: v })}
                as="span"
              >
                {button.text || 'Get in touch'}
              </EditableText>
            </a>
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
};

// ---- Stats ----------------------------------------------------------------

export const StatsBlock: React.FC<BlockProps> = ({ sectionId }) => {
  const { section, update, isEditMode } = useBlock(sectionId);
  if (!section) return null;
  const { content } = section;
  const stats = (content.stats as StatItem[] | undefined) || [
    { value: '50+', label: 'Projects' },
    { value: '98%', label: 'Satisfaction' },
    { value: '3x', label: 'Conversion' },
  ];

  const setStats = (next: StatItem[]) => update('stats', next);
  const updateStat = (i: number, field: keyof StatItem, v: string) =>
    setStats(stats.map((s, idx) => (idx === i ? { ...s, [field]: v } : s)));

  return (
    <SectionWrapper sectionId={sectionId}>
      <section className="brutalist-section bg-bg-primary">
        <div className="brutalist-container">
          <div className="border-l border-r border-border-primary">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px brutalist-hatch">
              {stats.map((stat, i) => (
                <div key={i} className="relative bg-bg-primary p-8">
                  {isEditMode && (
                    <button onClick={() => setStats(stats.filter((_, idx) => idx !== i))} className={removeBtn} title="Remove stat">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {isEditMode ? (
                    <div className="text-center">
                      <EditableText
                        elementId={`${sectionId}-stat-${i}-value`}
                        onUpdate={(v) => updateStat(i, 'value', v)}
                        className="text-3xl md:text-4xl font-bold font-mono text-text-primary mb-2"
                        as="div"
                      >
                        {stat.value}
                      </EditableText>
                      <EditableText
                        elementId={`${sectionId}-stat-${i}-label`}
                        onUpdate={(v) => updateStat(i, 'label', v)}
                        className="util-label"
                        as="div"
                      >
                        {stat.label}
                      </EditableText>
                    </div>
                  ) : (
                    <Stat value={stat.value} label={stat.label} />
                  )}
                </div>
              ))}
            </div>
          </div>
          {isEditMode && (
            <button onClick={() => setStats([...stats, { value: '0', label: 'New Stat' }])} className={addBtn}>
              <Plus className="w-4 h-4" /> Add Stat
            </button>
          )}
        </div>
      </section>
    </SectionWrapper>
  );
};

// ---- Logos ----------------------------------------------------------------

export const LogosBlock: React.FC<BlockProps> = ({ sectionId }) => {
  const { section, update, isEditMode } = useBlock(sectionId);
  if (!section) return null;
  const { content } = section;
  const logos = (content.logos as string[] | undefined) || ['Acme', 'Globex', 'Umbrella', 'Initech'];

  const setLogos = (next: string[]) => update('logos', next);

  return (
    <SectionWrapper sectionId={sectionId}>
      <section className="brutalist-section bg-bg-secondary">
        <div className="brutalist-container text-center">
          <EditableText
            elementId={`${sectionId}-title`}
            onUpdate={(v) => update('title', v)}
            className="text-text-secondary mb-8 text-sm font-bold uppercase tracking-wider"
            as="p"
          >
            {(content.title as string) || 'Trusted by teams everywhere'}
          </EditableText>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {logos.map((logo, i) => (
              <div key={i} className="relative flex items-center">
                <EditableText
                  elementId={`${sectionId}-logo-${i}`}
                  onUpdate={(v) => setLogos(logos.map((l, idx) => (idx === i ? v : l)))}
                  className="text-text-primary font-bold text-lg"
                  as="div"
                >
                  {logo}
                </EditableText>
                {isEditMode && (
                  <button onClick={() => setLogos(logos.filter((_, idx) => idx !== i))} className="ml-1 text-red-600" title="Remove logo">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {isEditMode && (
              <button onClick={() => setLogos([...logos, 'New Logo'])} className="inline-flex items-center gap-1 text-sm font-bold text-text-secondary hover:text-primary">
                <Plus className="w-4 h-4" /> Add
              </button>
            )}
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
};

// ---- Gallery --------------------------------------------------------------

export const GalleryBlock: React.FC<BlockProps> = ({ sectionId }) => {
  const { section, update, isEditMode } = useBlock(sectionId);
  if (!section) return null;
  const { content } = section;
  const images = (content.images as MediaItem[] | undefined) || [];

  const setImages = (next: MediaItem[]) => update('images', next);

  return (
    <SectionWrapper sectionId={sectionId}>
      <section className="brutalist-section bg-bg-primary">
        <div className="brutalist-container">
          <EditableText
            elementId={`${sectionId}-headline`}
            onUpdate={(v) => update('headline', v)}
            className="text-3xl md:text-4xl font-bold text-text-primary mb-8"
            as="h2"
          >
            {(content.headline as string) || 'Gallery'}
          </EditableText>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden border border-border-primary">
                {isEditMode && (
                  <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className={removeBtn} title="Remove image">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <EditableImage
                  src={img.url}
                  alt={img.alt || ''}
                  elementId={`${sectionId}-image-${i}`}
                  onUpdate={(src, alt) => setImages(images.map((im, idx) => (idx === i ? { ...im, url: src, alt } : im)))}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {isEditMode && (
            <button
              onClick={() =>
                setImages([
                  ...images,
                  { type: 'image', url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', alt: '' },
                ])
              }
              className={addBtn}
            >
              <Plus className="w-4 h-4" /> Add Image
            </button>
          )}
        </div>
      </section>
    </SectionWrapper>
  );
};

// ---- Rich text ------------------------------------------------------------

export const RichTextBlock: React.FC<BlockProps> = ({ sectionId }) => {
  const { section, update } = useBlock(sectionId);
  if (!section) return null;
  const { content } = section;

  return (
    <SectionWrapper sectionId={sectionId}>
      <section className="brutalist-section bg-bg-primary">
        <div className="brutalist-container max-w-3xl">
          <EditableText
            elementId={`${sectionId}-heading`}
            onUpdate={(v) => update('heading', v)}
            className="text-3xl md:text-4xl font-bold text-text-primary mb-6"
            as="h2"
          >
            {(content.heading as string) || 'Section heading'}
          </EditableText>
          <EditableText
            elementId={`${sectionId}-body`}
            onUpdate={(v) => update('body', v)}
            className="text-lg text-text-secondary leading-relaxed"
            as="p"
            multiline
          >
            {(content.body as string) || 'Write your content here. This block is great for long-form prose.'}
          </EditableText>
        </div>
      </section>
    </SectionWrapper>
  );
};

// ---- FAQ ------------------------------------------------------------------

export const FaqBlock: React.FC<BlockProps> = ({ sectionId }) => {
  const { section, update, isEditMode } = useBlock(sectionId);
  if (!section) return null;
  const { content } = section;
  const items = (content.items as FaqItem[] | undefined) || [
    { question: 'What is your process?', answer: 'We start with discovery, then design, then delivery.' },
  ];

  const setItems = (next: FaqItem[]) => update('items', next);
  const updateItem = (i: number, field: keyof FaqItem, v: string) =>
    setItems(items.map((it, idx) => (idx === i ? { ...it, [field]: v } : it)));

  return (
    <SectionWrapper sectionId={sectionId}>
      <section className="brutalist-section bg-bg-secondary">
        <div className="brutalist-container max-w-3xl">
          <EditableText
            elementId={`${sectionId}-headline`}
            onUpdate={(v) => update('headline', v)}
            className="text-3xl md:text-4xl font-bold text-text-primary mb-8"
            as="h2"
          >
            {(content.headline as string) || 'Frequently asked questions'}
          </EditableText>
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="relative border border-border-primary rounded-section p-6 bg-bg-primary">
                {isEditMode && (
                  <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className={removeBtn} title="Remove question">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <EditableText
                  elementId={`${sectionId}-q-${i}`}
                  onUpdate={(v) => updateItem(i, 'question', v)}
                  className="text-lg font-bold text-text-primary mb-2"
                  as="h3"
                >
                  {item.question}
                </EditableText>
                <EditableText
                  elementId={`${sectionId}-a-${i}`}
                  onUpdate={(v) => updateItem(i, 'answer', v)}
                  className="text-text-secondary leading-relaxed"
                  as="p"
                  multiline
                >
                  {item.answer}
                </EditableText>
              </div>
            ))}
          </div>
          {isEditMode && (
            <button onClick={() => setItems([...items, { question: 'New question?', answer: 'Answer here.' }])} className={addBtn}>
              <Plus className="w-4 h-4" /> Add Question
            </button>
          )}
        </div>
      </section>
    </SectionWrapper>
  );
};
