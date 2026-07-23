/**
 * @fileoverview Small spot illustrations + icon chip for the capabilities bento.
 * @module components/sections/visuals/CapabilityVisuals
 *
 * Token-driven, single-hue. Icons are passed as components and rendered as
 * flex children (never inside a text span).
 */

import React from 'react';

/** Accent-soft rounded tile holding a line icon. */
export const ChipIcon: React.FC<{ icon: React.ComponentType<{ className?: string }> }> = ({ icon: Icon }) => (
  <span className="w-[34px] h-[34px] shrink-0 grid place-items-center rounded-interactive bg-primary-soft text-primary border border-[color-mix(in_srgb,var(--accent)_18%,transparent)]">
    <Icon className="w-[18px] h-[18px]" />
  </span>
);

/** Stacked layers motif (design systems). */
export const LayersIllo: React.FC = () => (
  <div className="relative h-[68px] mt-3.5" aria-hidden="true">
    <span className="absolute left-[22px] right-[22px] top-0 h-[17px] rounded-[5px] bg-primary" />
    <span className="absolute left-[14px] right-[14px] top-[15px] h-[17px] rounded-[5px] bg-[color-mix(in_srgb,var(--accent)_34%,var(--surface))]" />
    <span className="absolute left-2 right-2 top-[30px] h-[17px] rounded-[5px] border border-border-strong bg-bg-secondary" />
    <span className="absolute left-2 right-2 top-[45px] h-[17px] rounded-[5px] border border-border-strong bg-bg-secondary" />
  </div>
);

/** Token swatch row (design-led development). */
export const TokensIllo: React.FC = () => (
  <div className="flex gap-2 mt-3.5" aria-hidden="true">
    {['bg-primary', 'bg-text-primary', 'bg-[var(--good)]', 'bg-[var(--amber)]', 'bg-primary-soft'].map((c, i) => (
      <span key={i} className={`h-7 flex-1 rounded-md border border-border-strong block ${c}`} />
    ))}
  </div>
);

/** Mini area/line chart with an accent endpoint. */
export const MiniAreaChart: React.FC = () => (
  <svg className="w-full h-[60px] block mt-3" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
    <path
      d="M0,48 C30,46 42,32 66,34 C96,36 110,15 140,17 C168,19 182,8 200,6"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="2.5"
    />
    <circle cx="200" cy="6" r="4" fill="var(--accent)" stroke="var(--color-surface-elevated)" strokeWidth="2.5" />
  </svg>
);
