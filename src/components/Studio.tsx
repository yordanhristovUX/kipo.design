import React, { useState } from 'react';
import { Play, Target, Plus, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';
import EditableText from './atoms/EditableText';
import EditableImage from './atoms/EditableImage';
import { StudioContentEditPopup } from './cms/EditingPopups';
import SectionWrapper from './cms/SectionWrapper';
import type { StudioItemData } from '@/types';

interface StudioProps {
  sectionId?: string;
}

const DEFAULT_ITEMS: StudioItemData[] = [
  {
    title: 'Our Design Philosophy',
    description:
      'We believe great design starts with understanding. Every pixel, every interaction, every decision is rooted in user research and business strategy.',
    mediaUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    mediaType: 'video',
    icon: 'Target',
    stats: '100+ User Interviews',
  },
  {
    title: 'Collaborative Approach',
    description:
      'We work as an extension of your team, bringing fresh perspectives while respecting your vision and business goals.',
    mediaUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    mediaType: 'video',
    icon: 'Users',
    stats: '98% Client Retention',
  },
  {
    title: 'Rapid Prototyping',
    description:
      'We move fast without breaking things. Our iterative approach means you see progress quickly and can provide feedback early.',
    mediaUrl: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    mediaType: 'video',
    icon: 'Zap',
    stats: '2-4 Week Delivery',
  },
  {
    title: 'Award-Winning Results',
    description:
      'Our work has been recognized by industry leaders and has helped our clients achieve measurable business growth.',
    mediaUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    mediaType: 'video',
    icon: 'Award',
    stats: '15+ Design Awards',
  },
];

const resolveIcon = (name: string): React.ComponentType<{ className?: string }> =>
  (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] || Target;

const STATS: Array<{ valueKey: string; labelKey: string; value: string; label: string }> = [
  { valueKey: 'stat1Value', labelKey: 'stat1Label', value: '5+', label: 'Years Experience' },
  { valueKey: 'stat2Value', labelKey: 'stat2Label', value: '50+', label: 'Happy Clients' },
  { valueKey: 'stat3Value', labelKey: 'stat3Label', value: '200+', label: 'Projects Completed' },
  { valueKey: 'stat4Value', labelKey: 'stat4Label', value: '98%', label: 'Client Satisfaction' },
];

const Studio: React.FC<StudioProps> = ({ sectionId = 'studio' }) => {
  const [activeContent, setActiveContent] = useState(0);
  const [showContentEditPopup, setShowContentEditPopup] = useState(false);
  const [editingContentIndex, setEditingContentIndex] = useState(0);
  const { sections, updateSection, isEditMode } = useCMS();
  const section = sections.find(s => s.id === sectionId);

  if (!section) return null;

  const { content } = section;

  const items =
    (content.studioContent as StudioItemData[] | undefined) && (content.studioContent as StudioItemData[]).length > 0
      ? (content.studioContent as StudioItemData[])
      : DEFAULT_ITEMS;

  const active = Math.min(activeContent, items.length - 1);

  const updateContent = (field: string, value: unknown) => {
    updateSection(sectionId, { [field]: value });
  };

  const persistItems = (next: StudioItemData[]) => updateContent('studioContent', next);

  const updateStudioItem = (index: number, config: Record<string, unknown>) => {
    const next = items.map((item, i) =>
      i === index
        ? {
            title: config.title as string,
            description: config.description as string,
            mediaUrl: config.mediaUrl as string,
            mediaType: config.mediaType as 'image' | 'video',
            icon: config.icon as string,
            stats: config.stats as string,
          }
        : item
    );
    persistItems(next);
  };

  const addItem = () => {
    persistItems([
      ...items,
      {
        title: 'New Studio Highlight',
        description: 'Describe this part of how the studio works.',
        mediaUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
        mediaType: 'image',
        icon: 'Sparkles',
        stats: 'Key metric',
      },
    ]);
  };

  const removeItem = (index: number) => {
    persistItems(items.filter((_, i) => i !== index));
    setActiveContent(0);
  };

  const handleContentClick = (index: number) => {
    if (isEditMode) {
      setEditingContentIndex(index);
      setShowContentEditPopup(true);
    } else {
      setActiveContent(index);
    }
  };

  return (
    <SectionWrapper sectionId={sectionId}>
      <section id="studio" className="brutalist-section bg-bg-secondary ">
        <div className="brutalist-container">
          <div className="text-center mb-16">
            <div className="util-label mb-4">004-STUDIO</div>
            <EditableText
              elementId={`${sectionId}-headline`}
              onUpdate={(value) => updateContent('headline', value)}
              className="text-3xl md:text-5xl font-bold text-text-primary mb-6"
              as="h2"
            >
              {(content.headline as string) || 'Meet the Studio Behind kipo.design'}
            </EditableText>

            <EditableText
              elementId={`${sectionId}-description`}
              onUpdate={(value) => updateContent('description', value)}
              className="text-xl text-text-secondary max-w-3xl mx-auto"
              as="p"
              multiline
            >
              {(content.description as string) ||
                "Founded by Yordan Hristov, we're a boutique design studio that combines strategic thinking with creative execution to deliver exceptional results."}
            </EditableText>
          </div>

          <div className="border border-border-primary">
            <div className="grid lg:grid-cols-2">
              {/* Interactive Content List */}
              <div className="border-r border-border-primary">
                {items.map((item, index) => {
                  const ItemIcon = resolveIcon(item.icon);
                  return (
                    <div
                      key={index}
                      onClick={() => handleContentClick(index)}
                      className={`group cursor-pointer p-8 transition-all duration-300 relative border-b border-border-primary last:border-b-0 ${
                        active === index ? 'bg-bg-primary' : 'bg-bg-secondary hover:bg-bg-primary'
                      }`}
                    >
                      {isEditMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeItem(index);
                          }}
                          className="absolute top-4 right-4 z-10 p-1.5 bg-white border border-border-primary rounded text-red-600 hover:bg-red-50"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-brutalist flex items-center justify-center transition-colors border flex-shrink-0 ${
                            active === index
                              ? 'bg-primary text-white border-primary'
                              : 'bg-bg-primary text-text-primary border-border-primary'
                          }`}
                        >
                          <ItemIcon className="w-6 h-6" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <h3
                              className={`text-lg font-bold transition-colors ${
                                active === index ? 'text-primary' : 'text-text-primary'
                              }`}
                            >
                              {item.title}
                            </h3>
                            <span className="mono text-[11px] font-medium text-text-secondary bg-bg-secondary px-2 py-1 rounded-interactive border border-border-primary uppercase tracking-wide">
                              {item.stats}
                            </span>
                          </div>

                          <p
                            className={`text-sm text-text-secondary leading-relaxed transition-all duration-300 ${
                              active === index ? 'opacity-100' : 'opacity-70'
                            }`}
                          >
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {isEditMode && (
                  <button
                    onClick={addItem}
                    className="w-full p-4 inline-flex items-center justify-center gap-2 text-sm font-bold text-text-secondary hover:text-primary hover:bg-bg-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                )}
              </div>

              {/* Media Display */}
              <div className="bg-bg-secondary">
                <div className="aspect-square w-full overflow-hidden">
                  <div className="relative w-full h-full">
                    <EditableImage
                      src={items[active]?.mediaUrl}
                      alt={items[active]?.title}
                      elementId={`${sectionId}-media-${active}`}
                      onUpdate={(newSrc) => {
                        persistItems(items.map((it, i) => (i === active ? { ...it, mediaUrl: newSrc } : it)));
                      }}
                      className="w-full h-full object-cover transition-all duration-500"
                    />

                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-bg-primary border border-border-primary rounded-brutalist flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Studio Stats */}
          <div className="brutalist-grid-divided grid-cols-2 md:grid-cols-4 mt-16 pt-16 ">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center bg-bg-primary p-8">
                <EditableText
                  elementId={`${sectionId}-${stat.valueKey}`}
                  onUpdate={(value) => updateContent(stat.valueKey, value)}
                  className="text-3xl md:text-4xl font-bold text-text-primary"
                  as="div"
                >
                  {(content[stat.valueKey] as string) || stat.value}
                </EditableText>
                <EditableText
                  elementId={`${sectionId}-${stat.labelKey}`}
                  onUpdate={(value) => updateContent(stat.labelKey, value)}
                  className="text-text-secondary mt-2 text-sm font-bold uppercase tracking-wide"
                  as="div"
                >
                  {(content[stat.labelKey] as string) || stat.label}
                </EditableText>
              </div>
            ))}
          </div>
        </div>

        <StudioContentEditPopup
          isOpen={showContentEditPopup}
          onClose={() => setShowContentEditPopup(false)}
          onSave={(config) => updateStudioItem(editingContentIndex, config)}
          initialConfig={items[editingContentIndex] ? {
            title: items[editingContentIndex].title,
            description: items[editingContentIndex].description,
            mediaUrl: items[editingContentIndex].mediaUrl,
            mediaType: items[editingContentIndex].mediaType,
            icon: items[editingContentIndex].icon || 'Target',
            stats: items[editingContentIndex].stats,
          } : undefined}
        />
      </section>
    </SectionWrapper>
  );
};

export default Studio;
