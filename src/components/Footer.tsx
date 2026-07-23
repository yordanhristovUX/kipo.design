import React from 'react';
import { Twitter, Linkedin, Github, Plus, Trash2 } from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';
import EditableText from './atoms/EditableText';
import SectionWrapper from './cms/SectionWrapper';
import type { FooterLinkGroup } from '@/types';

interface FooterProps {
  sectionId?: string;
}

const DEFAULT_GROUPS: FooterLinkGroup[] = [
  {
    category: 'Services',
    links: [
      { name: 'UX/UI Design', href: '#services' },
      { name: 'Web Development', href: '#services' },
      { name: 'Design Systems', href: '#services' },
      { name: 'Product Design', href: '#services' },
    ],
  },
  {
    category: 'Company',
    links: [
      { name: 'Studio', href: '#studio' },
      { name: 'Work', href: '#work' },
      { name: 'Process', href: '#process' },
      { name: 'Contact', href: '#contact' },
    ],
  },
  {
    category: 'Resources',
    links: [
      { name: 'Blog', href: '#' },
      { name: 'Case Studies', href: '#work' },
      { name: 'Design System', href: '#' },
      { name: 'Style Guide', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
];

const Footer: React.FC<FooterProps> = ({ sectionId = 'footer' }) => {
  const currentYear = new Date().getFullYear();
  const { sections, updateSection, isEditMode } = useCMS();
  const section = sections.find(s => s.id === sectionId);

  if (!section) return null;

  const { content } = section;

  const groups =
    (content.linkGroups as FooterLinkGroup[] | undefined) && (content.linkGroups as FooterLinkGroup[]).length > 0
      ? (content.linkGroups as FooterLinkGroup[])
      : DEFAULT_GROUPS;

  const updateContent = (field: string, value: unknown) => {
    updateSection(sectionId, { [field]: value });
  };

  const persistGroups = (next: FooterLinkGroup[]) => updateContent('linkGroups', next);

  const updateLinkName = (groupIndex: number, linkIndex: number, value: string) => {
    persistGroups(
      groups.map((g, gi) =>
        gi === groupIndex
          ? { ...g, links: g.links.map((l, li) => (li === linkIndex ? { ...l, name: value } : l)) }
          : g
      )
    );
  };

  const updateCategory = (groupIndex: number, value: string) => {
    persistGroups(groups.map((g, gi) => (gi === groupIndex ? { ...g, category: value } : g)));
  };

  const addLink = (groupIndex: number) => {
    persistGroups(
      groups.map((g, gi) =>
        gi === groupIndex ? { ...g, links: [...g.links, { name: 'New Link', href: '#' }] } : g
      )
    );
  };

  const removeLink = (groupIndex: number, linkIndex: number) => {
    persistGroups(
      groups.map((g, gi) =>
        gi === groupIndex ? { ...g, links: g.links.filter((_, li) => li !== linkIndex) } : g
      )
    );
  };

  return (
    <SectionWrapper sectionId={sectionId}>
      <footer className="bg-bg-secondary text-text-primary border-t border-border-primary">
        <div className="brutalist-container py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <EditableText
                elementId={`${sectionId}-brand`}
                onUpdate={(value) => updateContent('brand', value)}
                className="text-xl font-mono font-bold mb-4"
                as="h3"
              >
                {(content.brand as string) || 'kipo.design'}
              </EditableText>
              <EditableText
                elementId={`${sectionId}-description`}
                onUpdate={(value) => updateContent('description', value)}
                className="text-text-secondary mb-6 leading-relaxed text-sm"
                as="p"
                multiline
              >
                {(content.description as string) ||
                  'Creating exceptional digital experiences that drive real business results.'}
              </EditableText>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-9 h-9 border border-border-primary rounded-interactive flex items-center justify-center hover:border-primary hover:bg-primary hover:text-inverse transition-all duration-200"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link groups */}
            {groups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <EditableText
                  elementId={`${sectionId}-category-${groupIndex}`}
                  onUpdate={(value) => updateCategory(groupIndex, value)}
                  className="font-bold mb-4 text-sm font-mono uppercase text-text-secondary tracking-wider"
                  as="h4"
                >
                  {group.category}
                </EditableText>
                <ul className="space-y-2">
                  {group.links.map((link, linkIndex) => (
                    <li key={linkIndex} className="flex items-center gap-1">
                      <EditableText
                        elementId={`${sectionId}-link-${groupIndex}-${linkIndex}`}
                        onUpdate={(value) => updateLinkName(groupIndex, linkIndex, value)}
                        className="text-text-secondary hover:text-text-primary transition-colors duration-200 text-sm"
                        as="span"
                      >
                        {link.name}
                      </EditableText>
                      {isEditMode && (
                        <button
                          onClick={() => removeLink(groupIndex, linkIndex)}
                          className="text-red-600 hover:text-red-700"
                          title="Remove link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </li>
                  ))}
                  {isEditMode && (
                    <li>
                      <button
                        onClick={() => addLink(groupIndex)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-text-secondary hover:text-primary"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add link
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-border-secondary">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <EditableText
                elementId={`${sectionId}-copyright`}
                onUpdate={(value) => updateContent('copyright', value)}
                className="text-text-tertiary text-xs font-mono font-bold"
                as="p"
              >
                {(content.copyright as string) || `© ${currentYear} kipo.design. All rights reserved.`}
              </EditableText>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <EditableText
                  elementId={`${sectionId}-privacy`}
                  onUpdate={(value) => updateContent('privacy', value)}
                  className="text-text-tertiary hover:text-text-primary text-xs font-mono font-bold transition-colors duration-200"
                  as="span"
                >
                  {(content.privacy as string) || 'Privacy Policy'}
                </EditableText>
                <EditableText
                  elementId={`${sectionId}-terms`}
                  onUpdate={(value) => updateContent('terms', value)}
                  className="text-text-tertiary hover:text-text-primary text-xs font-mono font-bold transition-colors duration-200"
                  as="span"
                >
                  {(content.terms as string) || 'Terms of Service'}
                </EditableText>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </SectionWrapper>
  );
};

export default Footer;
