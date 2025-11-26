/**
 * @fileoverview Design System Showcase Page
 * @module components/DesignSystemShowcase
 * 
 * Displays all design system components: atoms, molecules, organisms, and sections.
 */

import React from 'react';
import { ArrowRight, Mail, User, Search, Check, X } from 'lucide-react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
  Badge,
  Avatar,
  AvatarGroup,
} from '@/design-system';

const DesignSystemShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="brutalist-container">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-zinc-900 mb-4">
            Design System
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Brutalist design components following geometric principles, bold typography, and strict grid alignment.
          </p>
        </div>

        {/* Atoms Section */}
        <section className="mb-24">
          <div className="mb-8 pb-4 border-b-2 border-zinc-900">
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Atoms</h2>
            <p className="text-zinc-600">Basic building blocks - buttons, inputs, badges, avatars</p>
          </div>

          {/* Buttons */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 uppercase tracking-wide">Buttons</h3>
            
            <div className="space-y-8">
              {/* Variants */}
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Variants</p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="outline">Outline Button</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Sizes</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">With Icons</p>
                <div className="flex flex-wrap gap-4">
                  <Button icon={ArrowRight}>Next Step</Button>
                  <Button icon={Mail} iconPosition="left" variant="secondary">Send Email</Button>
                  <Button icon={Check} variant="outline">Confirm</Button>
                </div>
              </div>

              {/* States */}
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">States</p>
                <div className="flex flex-wrap gap-4">
                  <Button>Normal</Button>
                  <Button isLoading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 uppercase tracking-wide">Inputs</h3>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                leftIcon={Mail}
              />
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                leftIcon={User}
              />
              <Input
                label="Search"
                type="text"
                placeholder="Search..."
                leftIcon={Search}
                size="lg"
              />
              <Input
                label="With Error"
                type="text"
                error="This field is required"
              />
              <Input
                label="With Success"
                type="text"
                success="Looks good!"
                defaultValue="Valid input"
              />
              <Input
                label="With Helper Text"
                type="text"
                helperText="We'll never share your information"
              />
            </div>
          </div>

          {/* Badges */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 uppercase tracking-wide">Badges</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Variants</p>
                <div className="flex flex-wrap gap-3">
                  <Badge>Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Sizes</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Avatars */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 uppercase tracking-wide">Avatars</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Sizes</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar size="sm" fallback="SM" />
                  <Avatar size="md" fallback="MD" />
                  <Avatar size="lg" fallback="LG" />
                  <Avatar size="xl" fallback="XL" />
                  <Avatar size="2xl" fallback="2XL" />
                </div>
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Shapes</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar shape="circle" fallback="C" />
                  <Avatar shape="square" fallback="S" />
                </div>
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Avatar Group</p>
                <AvatarGroup
                  avatars={[
                    { fallback: 'JD' },
                    { fallback: 'AB' },
                    { fallback: 'CD' },
                    { fallback: 'EF' },
                    { fallback: 'GH' },
                  ]}
                  max={3}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Molecules Section */}
        <section className="mb-24">
          <div className="mb-8 pb-4 border-b-2 border-zinc-900">
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Molecules</h2>
            <p className="text-zinc-600">Combinations of atoms - cards, forms, navigation</p>
          </div>

          {/* Cards */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 uppercase tracking-wide">Cards</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Default Card */}
              <Card>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Basic card with default styling</CardDescription>
                <CardContent>
                  <p className="text-zinc-600 mt-4">
                    This is a default card with standard padding and borders.
                  </p>
                </CardContent>
              </Card>

              {/* Elevated Card */}
              <Card variant="elevated">
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>Card with shadow elevation</CardDescription>
                <CardContent>
                  <p className="text-zinc-600 mt-4">
                    This card has a subtle shadow for elevation.
                  </p>
                </CardContent>
              </Card>

              {/* Outlined Card */}
              <Card variant="outlined">
                <CardTitle>Outlined Card</CardTitle>
                <CardDescription>Card with border only</CardDescription>
                <CardContent>
                  <p className="text-zinc-600 mt-4">
                    This card uses only borders, no background.
                  </p>
                </CardContent>
              </Card>

              {/* Card with Header and Footer */}
              <Card variant="default" className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Card with Header & Footer</CardTitle>
                  <CardDescription>Complete card structure</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600">
                    This card demonstrates the full structure with header, content, and footer sections.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">Action</Button>
                  <Button size="sm" variant="ghost">Cancel</Button>
                </CardFooter>
              </Card>

              {/* Hover Card */}
              <Card hover variant="gradient">
                <CardTitle>Hover Card</CardTitle>
                <CardDescription>Interactive card with hover effect</CardDescription>
                <CardContent>
                  <p className="text-zinc-600 mt-4">
                    Hover over this card to see the effect.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Organisms Section */}
        <section className="mb-24">
          <div className="mb-8 pb-4 border-b-2 border-zinc-900">
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Organisms</h2>
            <p className="text-zinc-600">Complex components - forms, grids, layouts</p>
          </div>

          {/* Form Example */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 uppercase tracking-wide">Form Example</h3>
            
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>Send us a message</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Name"
                    placeholder="Your name"
                    leftIcon={User}
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    leftIcon={Mail}
                  />
                  <div>
                    <label className="block text-sm font-medium text-zinc-900 mb-2">
                      Message
                    </label>
                    <textarea
                      className="w-full rounded-brutalist border-2 border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent p-4"
                      rows={4}
                      placeholder="Your message..."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button icon={ArrowRight}>Send Message</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Grid Example */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-zinc-900 mb-6 uppercase tracking-wide">Brutalist Grid</h3>
            
            <div className="grid grid-cols-3 gap-px bg-zinc-900">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white p-8 flex items-center justify-center">
                  <span className="text-2xl font-bold font-mono text-zinc-900">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="mb-24">
          <div className="mb-8 pb-4 border-b-2 border-zinc-900">
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Typography</h2>
            <p className="text-zinc-600">Brutalist typographic hierarchy</p>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-7xl font-bold text-zinc-900">Heading 1</h1>
              <p className="text-sm text-zinc-500 mt-2">7xl - 72px - Bold</p>
            </div>
            <div>
              <h2 className="text-6xl font-bold text-zinc-900">Heading 2</h2>
              <p className="text-sm text-zinc-500 mt-2">6xl - 60px - Bold</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-zinc-900">Heading 3</h3>
              <p className="text-sm text-zinc-500 mt-2">4xl - 36px - Bold</p>
            </div>
            <div>
              <p className="text-lg text-zinc-600">
                Body text - 18px - Regular. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Label - 12px - Bold Uppercase
              </p>
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section>
          <div className="mb-8 pb-4 border-b-2 border-zinc-900">
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Colors</h2>
            <p className="text-zinc-600">Zinc neutral palette + blue accent</p>
          </div>

          <div className="space-y-8">
            {/* Primary */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Primary (Blue Accent)</p>
              <div className="flex gap-2">
                <div className="flex-1 h-20 bg-primary rounded-brutalist-sm flex items-center justify-center">
                  <span className="text-white font-mono text-sm">#3b82f6</span>
                </div>
                <div className="flex-1 h-20 bg-primary-hover rounded-brutalist-sm flex items-center justify-center">
                  <span className="text-white font-mono text-sm">#2563eb</span>
                </div>
              </div>
            </div>

            {/* Zinc */}
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">Zinc (Neutral Palette)</p>
              <div className="grid grid-cols-5 gap-2">
                <div className="h-20 bg-zinc-50 rounded-brutalist-sm border-2 border-zinc-200 flex items-center justify-center">
                  <span className="text-zinc-900 font-mono text-xs">50</span>
                </div>
                <div className="h-20 bg-zinc-200 rounded-brutalist-sm flex items-center justify-center">
                  <span className="text-zinc-900 font-mono text-xs">200</span>
                </div>
                <div className="h-20 bg-zinc-500 rounded-brutalist-sm flex items-center justify-center">
                  <span className="text-white font-mono text-xs">500</span>
                </div>
                <div className="h-20 bg-zinc-700 rounded-brutalist-sm flex items-center justify-center">
                  <span className="text-white font-mono text-xs">700</span>
                </div>
                <div className="h-20 bg-zinc-900 rounded-brutalist-sm flex items-center justify-center">
                  <span className="text-white font-mono text-xs">900</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemShowcase;