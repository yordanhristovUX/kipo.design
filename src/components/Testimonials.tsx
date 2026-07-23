import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';
import EditableText from './atoms/EditableText';
import SectionWrapper from './cms/SectionWrapper';
import { TestimonialCard } from '@/design-system';
import type { TestimonialData } from '@/types';

interface TestimonialsProps {
  sectionId?: string;
}

const DEFAULT_TESTIMONIALS: TestimonialData[] = [
  {
    quote:
      "kipo.design transformed our entire digital presence. The team's attention to detail and user-centric approach resulted in a 300% increase in conversions.",
    author: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechFlow Solutions',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
  },
  {
    quote:
      "Working with kipo.design was a game-changer. They didn't just design a website; they created a complete digital ecosystem that perfectly represents our brand.",
    author: 'Michael Chen',
    role: 'Founder',
    company: 'InnovateNow',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 5,
  },
];

const DEFAULT_CLIENTS = ['TechFlow', 'InnovateNow', 'EcoShop', 'MedConnect', 'EduTech', 'PropTech'];

const Testimonials: React.FC<TestimonialsProps> = ({ sectionId = 'testimonials' }) => {
  const { sections, updateSection, isEditMode } = useCMS();
  const section = sections.find(s => s.id === sectionId);

  if (!section) return null;

  const { content } = section;

  const testimonials =
    (content.testimonials as TestimonialData[] | undefined) && (content.testimonials as TestimonialData[]).length > 0
      ? (content.testimonials as TestimonialData[])
      : DEFAULT_TESTIMONIALS;

  const clients =
    (content.clients as string[] | undefined) && (content.clients as string[]).length > 0
      ? (content.clients as string[])
      : DEFAULT_CLIENTS;

  const updateContent = (field: string, value: unknown) => {
    updateSection(sectionId, { [field]: value });
  };

  const updateTestimonial = (index: number, field: keyof TestimonialData, value: string) => {
    const next = testimonials.map((t, i) => (i === index ? { ...t, [field]: value } : t));
    updateContent('testimonials', next);
  };

  const addTestimonial = () => {
    updateContent('testimonials', [
      ...testimonials,
      {
        quote: 'Share what a happy client said about working with you.',
        author: 'New Client',
        role: 'Role',
        company: 'Company',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 5,
      },
    ]);
  };

  const removeTestimonial = (index: number) => {
    updateContent('testimonials', testimonials.filter((_, i) => i !== index));
  };

  const updateClient = (index: number, value: string) => {
    updateContent('clients', clients.map((c, i) => (i === index ? value : c)));
  };

  const addClient = () => updateContent('clients', [...clients, 'New Client']);
  const removeClient = (index: number) => updateContent('clients', clients.filter((_, i) => i !== index));

  return (
    <SectionWrapper sectionId={sectionId}>
      <section className="brutalist-section bg-bg-primary ">
        <div className="brutalist-container">
          <div className="text-center mb-16">
            <div className="util-label mb-4">007-TESTIMONIALS</div>
            <EditableText
              elementId={`${sectionId}-headline`}
              onUpdate={(value) => updateContent('headline', value)}
              className="text-3xl md:text-5xl font-bold text-text-primary mb-6"
              as="h2"
            >
              {(content.headline as string) || 'What Our Clients Say'}
            </EditableText>
            <EditableText
              elementId={`${sectionId}-description`}
              onUpdate={(value) => updateContent('description', value)}
              className="text-xl text-text-secondary max-w-3xl mx-auto"
              as="p"
              multiline
            >
              {(content.description as string) ||
                "Don't just take our word for it. Here's what our clients have to say about working with kipo.design."}
            </EditableText>
          </div>

          {/* Testimonials - Full-width contained grid */}
          <div className="border-l border-r border-border-primary">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px brutalist-hatch">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="relative">
                  {isEditMode && (
                    <button
                      onClick={() => removeTestimonial(index)}
                      className="absolute top-2 right-2 z-10 p-1.5 bg-white border border-border-primary rounded text-red-600 hover:bg-red-50"
                      title="Remove testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <TestimonialCard
                    testimonial={{
                      quote: testimonial.quote,
                      author: testimonial.author,
                      role: testimonial.role,
                      company: testimonial.company,
                      avatar: testimonial.avatar || '',
                      rating: testimonial.rating ?? 5,
                    }}
                    index={index}
                    onUpdate={(field, value) => updateTestimonial(index, field, value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {isEditMode && (
            <button
              onClick={addTestimonial}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 border border-border-primary rounded-interactive text-text-primary hover:bg-bg-secondary transition-colors text-sm font-bold"
            >
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
          )}

          {/* Client Logos */}
          <div className="text-center mt-16">
            <EditableText
              elementId={`${sectionId}-clients-title`}
              onUpdate={(value) => updateContent('clientsTitle', value)}
              className="text-text-secondary mb-8 text-sm font-bold uppercase tracking-wider"
              as="p"
            >
              {(content.clientsTitle as string) || 'Trusted by innovative companies'}
            </EditableText>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {clients.map((client, index) => (
                <div key={index} className="relative flex items-center">
                  <EditableText
                    elementId={`${sectionId}-client-${index}`}
                    onUpdate={(value) => updateClient(index, value)}
                    className="text-text-primary font-bold text-lg hover:text-primary transition-colors duration-200"
                    as="div"
                  >
                    {client}
                  </EditableText>
                  {isEditMode && (
                    <button
                      onClick={() => removeClient(index)}
                      className="ml-1 text-red-600 hover:text-red-700"
                      title="Remove client"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {isEditMode && (
                <button
                  onClick={addClient}
                  className="inline-flex items-center gap-1 text-sm font-bold text-text-secondary hover:text-primary"
                  title="Add client"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </SectionWrapper>
  );
};

export default Testimonials;
