/**
 * @fileoverview WorkShot — device / browser mockups for project cards.
 * @module components/sections/visuals/WorkShot
 *
 * Pure CSS/SVG placeholder "shots" (dashboard web-app, phone, storefront) shown
 * when a project has no image. Token-driven, adapts to light + dark.
 */

import React from 'react';

export type WorkShotVariant = 'dashboard' | 'phone' | 'storefront';

const Dashboard: React.FC = () => (
  <div className="grid grid-cols-[32px_1fr] gap-2.5 h-full">
    <div className="bg-surface-sunken rounded-md py-2 flex flex-col items-center gap-1.5">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={`w-3 h-3 rounded-[4px] block ${i === 0 ? 'bg-primary' : 'bg-border-strong'}`} />
      ))}
    </div>
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-1.5">
        {[
          ['$1.2M', 'MRR'],
          ['+18%', 'Growth'],
          ['3.4k', 'Users'],
        ].map(([v, l]) => (
          <div key={l} className="bg-surface-elevated border border-border-primary rounded-md p-1.5">
            <b className="block font-mono text-[12px] text-text-primary tabular-nums leading-tight">{v}</b>
            <span className="text-[8px] text-text-tertiary font-mono">{l}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 bg-surface-elevated border border-border-primary rounded-md p-2">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
          <path
            d="M0,46 C34,44 46,28 70,30 C100,32 118,14 146,18 C170,21 186,10 200,8"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
          />
        </svg>
      </div>
    </div>
  </div>
);

const Phone: React.FC = () => (
  <div className="mx-auto h-full w-[116px] bg-surface-elevated border border-border-strong rounded-2xl shadow-ds overflow-hidden">
    <div className="h-4 bg-bg-secondary border-b border-border-primary flex justify-center items-center">
      <span className="w-8 h-1 rounded-[3px] bg-border-strong block" />
    </div>
    <div className="p-2.5">
      <div className="h-10 rounded-md bg-primary mb-2" />
      <div className="h-2.5 rounded-[4px] bg-bg-secondary border border-border-primary mb-1.5" />
      <div className="h-2.5 w-3/5 rounded-[4px] bg-bg-secondary border border-border-primary mb-1.5" />
      <div className="h-2.5 rounded-[4px] bg-bg-secondary border border-border-primary mb-1.5" />
      <div className="flex justify-around pt-1.5 border-t border-border-primary mt-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`w-2.5 h-2.5 rounded-[3px] block ${i === 0 ? 'bg-primary' : 'bg-border-strong'}`} />
        ))}
      </div>
    </div>
  </div>
);

const Storefront: React.FC = () => (
  <div className="flex flex-col gap-2 h-full">
    <div className="flex gap-1.5 items-center">
      <span className="w-6 h-2 rounded-[3px] bg-primary block" />
      <span className="w-4 h-2 rounded-[3px] bg-border-strong block" />
      <span className="w-4 h-2 rounded-[3px] bg-border-strong block" />
      <span className="w-4 h-2 rounded-[3px] bg-border-strong block ml-auto" />
    </div>
    <div className="flex-1 rounded-md border border-border-primary bg-primary-soft" />
    <div className="grid grid-cols-3 gap-1.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-7 rounded-md bg-surface-elevated border border-border-primary block" />
      ))}
    </div>
  </div>
);

const VARIANTS: Record<WorkShotVariant, React.FC> = {
  dashboard: Dashboard,
  phone: Phone,
  storefront: Storefront,
};

interface WorkShotProps {
  variant?: WorkShotVariant;
}

const WorkShot: React.FC<WorkShotProps> = ({ variant = 'dashboard' }) => {
  const Inner = VARIANTS[variant] || Dashboard;
  return (
    <div className="h-[184px] bg-bg-secondary border-b border-border-primary p-3.5" aria-hidden="true">
      <Inner />
    </div>
  );
};

export default WorkShot;
