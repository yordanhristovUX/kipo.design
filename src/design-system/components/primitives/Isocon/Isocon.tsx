/**
 * @fileoverview Isocon — geometric line-icon tile.
 * @module design-system/components/primitives/Isocon
 *
 * Renders a clean line icon (Lucide) inside a soft-accent rounded tile. Keeps
 * the original `<Isocon name size />` API. No perpetual animation.
 */

import React from 'react';
import * as LucideIcons from 'lucide-react';

export interface IsoconProps {
  /** Icon name (lucide name, any case — punctuation ignored). */
  name: string;
  /** Overall square size in pixels. */
  size?: number;
  /** Additional CSS classes. */
  className?: string;
}

type IconComp = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

// Build a case-insensitive lookup of Lucide icon components once.
const iconByKey: Record<string, IconComp> = (() => {
  const map: Record<string, IconComp> = {};
  for (const key of Object.keys(LucideIcons)) {
    if (/^[A-Z]/.test(key)) {
      map[key.toLowerCase()] = (LucideIcons as unknown as Record<string, IconComp>)[key];
    }
  }
  return map;
})();

export const Isocon: React.FC<IsoconProps> = ({ name, size = 128, className = '' }) => {
  const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const Icon: IconComp = iconByKey[key] || LucideIcons.Layers;
  const tile = Math.round(size * 0.74);
  const glyph = Math.round(size * 0.36);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="flex items-center justify-center rounded-[14px] bg-primary-soft text-primary"
        style={{
          width: tile,
          height: tile,
          border: '1px solid color-mix(in srgb, var(--accent) 18%, transparent)',
        }}
      >
        <Icon size={glyph} strokeWidth={1.6} />
      </div>
    </div>
  );
};

export default Isocon;
