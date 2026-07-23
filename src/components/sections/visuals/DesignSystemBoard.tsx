/**
 * @fileoverview DesignSystemBoard — the hero "workspace" mockup.
 * @module components/sections/visuals/DesignSystemBoard
 *
 * Pure presentational, built in CSS/SVG (no images). All colours come from
 * semantic tokens / token CSS vars, so it adapts to light and dark. Monochrome
 * window chrome (no traffic lights).
 */

import React from 'react';
import { Check } from 'lucide-react';

const swatches = ['bg-primary', 'bg-text-primary', 'bg-text-secondary', 'bg-[var(--good)]', 'bg-[var(--amber)]', 'bg-primary-soft'];

const DesignSystemBoard: React.FC = () => {
  return (
    <div
      className="relative bg-surface-elevated border border-border-primary rounded-lg-panel shadow-ds-lg overflow-hidden"
      role="img"
      aria-label="Design system workspace preview: colour tokens, type scale and button component variants"
    >
      {/* Window chrome — monochrome */}
      <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-border-primary bg-bg-secondary">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-border-strong block" />
          <span className="w-2.5 h-2.5 rounded-full bg-border-strong block" />
          <span className="w-2.5 h-2.5 rounded-full bg-border-strong block" />
        </div>
        <div className="flex-1 mx-1.5 text-center font-mono text-[11px] text-text-tertiary bg-surface-elevated border border-border-primary rounded-md px-2.5 py-1">
          kipo · design system
        </div>
        <span className="font-mono text-[10px] tracking-wide text-primary bg-primary-soft px-2 py-0.5 rounded-md">
          v2.4
        </span>
      </div>

      <div className="p-5">
        {/* Color tokens */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-tertiary mb-2.5">Color tokens</p>
          <div className="flex gap-2">
            {swatches.map((s, i) => (
              <span key={i} className={`flex-1 h-8 rounded-md border border-border-strong block ${s}`} />
            ))}
          </div>
        </div>

        {/* Type scale */}
        <div className="mt-4 pt-4 border-t border-border-primary">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-tertiary mb-2.5">Type scale</p>
          <div className="flex items-baseline gap-3.5">
            <span className="text-text-primary font-bold tracking-tight text-[1.7rem] leading-none">Aa</span>
            <span className="text-text-primary font-bold tracking-tight text-xl leading-none">Aa</span>
            <span className="text-text-primary font-bold tracking-tight text-base leading-none">Aa</span>
            <span className="font-mono text-[11px] text-text-tertiary">Display / Body / Label</span>
          </div>
        </div>

        {/* Button component */}
        <div className="mt-4 pt-4 border-t border-border-primary">
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-tertiary mb-2.5">Button · component</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium px-3 py-2 rounded-interactive bg-primary text-white">Primary</span>
            <span className="text-xs font-medium px-3 py-2 rounded-interactive border border-border-strong text-text-primary">Secondary</span>
            <span className="text-xs font-medium px-3 py-2 rounded-interactive bg-bg-secondary text-text-secondary">Ghost</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {['Default', 'Hover', 'Focus', 'Disabled'].map((v, i) => (
              <span
                key={v}
                className={`font-mono text-[10px] rounded-md px-2 py-1 border ${
                  i === 0
                    ? 'text-primary border-[color-mix(in_srgb,var(--accent)_38%,transparent)] bg-primary-soft'
                    : 'text-text-tertiary border-border-primary bg-bg-secondary'
                }`}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating "synced" chip */}
      <div className="absolute right-3.5 bottom-4 flex items-center gap-1.5 bg-text-primary text-bg-primary font-mono text-[10px] px-2.5 py-2 rounded-interactive shadow-ds">
        <Check className="w-3 h-3 shrink-0" strokeWidth={2.4} />
        <span>Tokens synced → <b className="text-[var(--good)] font-semibold">code</b></span>
      </div>
    </div>
  );
};

export default DesignSystemBoard;
