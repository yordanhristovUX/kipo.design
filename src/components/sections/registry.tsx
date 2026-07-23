/**
 * @fileoverview Section (block) catalog registry.
 *
 * Maps each {@link SectionType} to its label, catalog icon, default content,
 * and Renderer. `HomePage` renders sections by looking up `type` here; the
 * Section Manager's "Add" modal lists these entries.
 *
 * @module components/sections/registry
 */

import React from 'react';
import {
  Layout,
  Briefcase,
  ListChecks,
  Building2,
  Compass,
  FolderKanban,
  Quote,
  Mail,
  PanelBottom,
  Megaphone,
  BarChart3,
  Images,
  GalleryHorizontal,
  FileText,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import type { SectionType } from '@/types';

import HeroSection from './HeroSection';
import Services from '../Services';
import Process from '../Process';
import Studio from '../Studio';
import Approach from '../Approach';
import Projects from '../Projects';
import Testimonials from '../Testimonials';
import Contact from '../Contact';
import Footer from '../Footer';
import {
  CtaBlock,
  StatsBlock,
  LogosBlock,
  GalleryBlock,
  RichTextBlock,
  FaqBlock,
} from './blocks/GenericBlocks';

export interface SectionRegistryEntry {
  type: SectionType;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Seed content for a freshly-added instance. Renderers also self-default. */
  defaultContent: Record<string, unknown>;
  Renderer: React.FC<{ sectionId: string }>;
}

export const sectionRegistry: Record<SectionType, SectionRegistryEntry> = {
  hero: {
    type: 'hero',
    label: 'Hero',
    description: 'Headline, subheadline, primary call to action and stats.',
    icon: Layout,
    defaultContent: {
      badge: 'Available for new projects',
      headline: 'Design That Moves.',
      subheadline: 'Ideas That Convert.',
      description: 'We build scalable, user-first digital products for teams that think ahead.',
      primaryButton: { text: "Let's Build Something", href: '#contact', variant: 'primary' },
      stats: [
        { value: '50+', label: 'Projects Delivered' },
        { value: '98%', label: 'Client Satisfaction' },
        { value: '3x', label: 'Conversion Increase' },
      ],
    },
    Renderer: HeroSection,
  },
  services: {
    type: 'services',
    label: 'Services',
    description: 'Grid of service cards with features.',
    icon: Briefcase,
    defaultContent: {
      headline: 'What We Do',
      description: 'Digital experiences that look great and drive results.',
    },
    Renderer: Services,
  },
  process: {
    type: 'process',
    label: 'Process',
    description: 'Step-by-step process with deliverables.',
    icon: ListChecks,
    defaultContent: {
      headline: 'Our Simple Process',
      description: 'How we transform your ideas into reality.',
    },
    Renderer: Process,
  },
  studio: {
    type: 'studio',
    label: 'Studio',
    description: 'Studio story with interactive highlights and stats.',
    icon: Building2,
    defaultContent: {
      headline: 'Meet the Studio',
      description: 'A boutique studio combining strategy with creative execution.',
    },
    Renderer: Studio,
  },
  approach: {
    type: 'approach',
    label: 'Approach',
    description: 'Guiding principles as cards.',
    icon: Compass,
    defaultContent: {
      headline: 'Design That Works',
      description: 'Strategic thinking with creative execution.',
    },
    Renderer: Approach,
  },
  projects: {
    type: 'projects',
    label: 'Projects',
    description: 'Featured project cards from the projects store.',
    icon: FolderKanban,
    defaultContent: {
      headline: 'Featured Projects',
      description: 'A look at some of our recent work.',
    },
    Renderer: Projects,
  },
  testimonials: {
    type: 'testimonials',
    label: 'Testimonials',
    description: 'Client quotes plus a logo strip.',
    icon: Quote,
    defaultContent: {
      headline: 'What Our Clients Say',
      description: "Here's what clients say about working with us.",
    },
    Renderer: Testimonials,
  },
  contact: {
    type: 'contact',
    label: 'Contact',
    description: 'Contact form with info and CTA card.',
    icon: Mail,
    defaultContent: {
      headline: 'Ready to Start Your Project?',
      description: "Let's discuss how we can help.",
    },
    Renderer: Contact,
  },
  footer: {
    type: 'footer',
    label: 'Footer',
    description: 'Footer with brand, link groups and legal links.',
    icon: PanelBottom,
    defaultContent: {
      brand: 'kipo.design',
      description: 'Creating exceptional digital experiences.',
    },
    Renderer: Footer,
  },

  // ---- Generic reusable blocks --------------------------------------------
  cta: {
    type: 'cta',
    label: 'Call to Action',
    description: 'A focused headline + button banner.',
    icon: Megaphone,
    defaultContent: {
      headline: 'Ready to get started?',
      description: "Let's talk about your next project.",
      button: { text: 'Get in touch', href: '#contact' },
    },
    Renderer: CtaBlock,
  },
  stats: {
    type: 'stats',
    label: 'Stats',
    description: 'A row of key metrics.',
    icon: BarChart3,
    defaultContent: {
      stats: [
        { value: '50+', label: 'Projects' },
        { value: '98%', label: 'Satisfaction' },
        { value: '3x', label: 'Conversion' },
      ],
    },
    Renderer: StatsBlock,
  },
  logos: {
    type: 'logos',
    label: 'Logos',
    description: 'A logo / client strip.',
    icon: Images,
    defaultContent: {
      title: 'Trusted by teams everywhere',
      logos: ['Acme', 'Globex', 'Umbrella', 'Initech'],
    },
    Renderer: LogosBlock,
  },
  gallery: {
    type: 'gallery',
    label: 'Gallery',
    description: 'A responsive image grid.',
    icon: GalleryHorizontal,
    defaultContent: {
      headline: 'Gallery',
      images: [],
    },
    Renderer: GalleryBlock,
  },
  richtext: {
    type: 'richtext',
    label: 'Rich Text',
    description: 'A heading with long-form prose.',
    icon: FileText,
    defaultContent: {
      heading: 'Section heading',
      body: 'Write your content here.',
    },
    Renderer: RichTextBlock,
  },
  faq: {
    type: 'faq',
    label: 'FAQ',
    description: 'Question and answer list.',
    icon: HelpCircle,
    defaultContent: {
      headline: 'Frequently asked questions',
      items: [{ question: 'What is your process?', answer: 'Discovery, design, delivery.' }],
    },
    Renderer: FaqBlock,
  },
};

/** Ordered list of catalog entries for pickers. */
export const sectionCatalog: SectionRegistryEntry[] = Object.values(sectionRegistry);
