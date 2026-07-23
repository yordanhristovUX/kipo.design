/**
 * @fileoverview CMS type definitions
 * @module types/cms
 */

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  alt?: string;
}

export interface ButtonConfig {
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
  icon?: IconConfig;
  iconPosition?: 'left' | 'right';
}

export interface IconConfig {
  type: 'lucide' | 'svg';
  value: string; // Icon name for lucide, SVG text for svg
}

/**
 * The catalog of block types the CMS can render. A section's `id` is a unique
 * instance id; its `type` selects the renderer + default content from the
 * section registry, so a type can appear more than once (duplicated instances).
 */
export type SectionType =
  | 'hero'
  | 'services'
  | 'process'
  | 'studio'
  | 'approach'
  | 'projects'
  | 'testimonials'
  | 'contact'
  | 'footer'
  // Generic reusable blocks
  | 'cta'
  | 'stats'
  | 'logos'
  | 'gallery'
  | 'richtext'
  | 'faq';

export interface SectionConfig {
  id: string;
  type: SectionType;
  name: string;
  enabled: boolean;
  order: number;
  /**
   * Block content. Kept intentionally open (`Record<string, unknown>`) so each
   * renderer can own its shape; the per-block interfaces below document and
   * narrow those shapes where a component reads them.
   */
  content: Record<string, unknown>;
}

// ---- Per-block content shapes ---------------------------------------------

export interface StatItem {
  value: string;
  label: string;
}

export interface ServiceCardConfig {
  icon: IconConfig;
  title: string;
  description: string;
  features: string[];
}

export interface ProcessStepConfig {
  number: string;
  icon: IconConfig;
  title: string;
  description: string;
  duration: string;
  deliverables: string[];
  image: MediaItem;
  details: string;
}

/** Repeating process step as stored in section content (icon = lucide name). */
export interface ProcessStepData {
  number: string;
  icon: string;
  title: string;
  description: string;
  duration: string;
  deliverables: string[];
  image: string;
  details: string;
}

export interface StudioContentConfig {
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  icon: IconConfig;
  stats: string;
}

/** Repeating studio item as stored in section content. */
export interface StudioItemData {
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  icon: string;
  stats: string;
}

/** Repeating approach principle as stored in section content. */
export interface ApproachPrincipleData {
  icon: string;
  title: string;
  description: string;
  stat: string;
}

/** Repeating testimonial as stored in section content. */
export interface TestimonialData {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  rating?: number;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface FooterLinkGroup {
  category: string;
  links: FooterLink[];
}

/** A single question/answer for the FAQ block. */
export interface FaqItem {
  question: string;
  answer: string;
}

export interface CMSContextType {
  isEditMode: boolean;
  setEditMode: (enabled: boolean) => void;
  showSectionManager: boolean;
  setShowSectionManager: (show: boolean) => void;
  sections: SectionConfig[];
  updateSection: (sectionId: string, content: Record<string, unknown>) => void;
  reorderSections: (sections: SectionConfig[]) => void;
  duplicateSection: (sectionId: string) => void;
  toggleSection: (sectionId: string) => void;
  deleteSection?: (sectionId: string) => void;
  /** Append a new block instance of `type` with the supplied default content. */
  addSection: (type: SectionType, name: string, defaultContent: Record<string, unknown>) => void;
  selectedElement: string | null;
  setSelectedElement: (elementId: string | null) => void;
}
