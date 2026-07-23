/**
 * @fileoverview DesignToCode — the "design → code" split panel.
 * @module components/sections/visuals/DesignToCode
 *
 * Left: a component-library preview (badges, a primary button, an input, token
 * chips). Right: a syntax-coloured code block generated "from the same tokens".
 * The code surface is intentionally dark in both themes (editor convention);
 * everything else is token-driven and adapts to light + dark.
 */

import React from 'react';

const DesignToCode: React.FC = () => {
  return (
    <div className="grid lg:grid-cols-2 border border-border-primary rounded-lg-panel overflow-hidden shadow-ds-lg bg-surface-elevated">
      {/* Left — component library */}
      <div className="p-7 border-b lg:border-b-0 lg:border-r border-border-primary">
        <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-tertiary mb-3.5">
          Design · component library
        </div>
        <div className="bg-bg-secondary border border-border-primary rounded-section p-4.5 flex flex-col gap-3">
          <div className="flex gap-1.5 flex-wrap">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-md text-primary bg-primary-soft border border-[color-mix(in_srgb,var(--accent)_30%,transparent)]">
              Button / Primary
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-md text-[var(--good)] border border-[color-mix(in_srgb,var(--good)_38%,transparent)] bg-[color-mix(in_srgb,var(--good)_10%,transparent)]">
              AA contrast
            </span>
          </div>
          <span className="self-start text-[13px] font-semibold px-4 py-2.5 rounded-interactive bg-primary text-white">
            Start a project →
          </span>
          <div className="bg-bg-primary border border-border-strong rounded-interactive px-3 py-2.5 text-xs text-text-tertiary">
            Email address
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {['Input', 'Badge', 'Token: --accent'].map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] px-2 py-0.5 rounded-md text-primary bg-primary-soft border border-[color-mix(in_srgb,var(--accent)_30%,transparent)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — code */}
      <div
        className="p-6 overflow-x-auto font-mono text-[12.5px] leading-[1.75]"
        style={{ background: 'var(--code-bg)', color: 'var(--code)' }}
        aria-label="Generated code sample"
      >
        <pre className="whitespace-pre">
<span style={{ color: 'var(--code-mut)' }}>{'// generated from the same tokens'}</span>{'\n'}
<span style={{ color: 'var(--code-kw)' }}>import</span>{' { Button } '}<span style={{ color: 'var(--code-kw)' }}>from</span>{' '}<span style={{ color: 'var(--code-str)' }}>'@kipo/ui'</span>{'\n\n'}
{'<'}<span style={{ color: 'var(--code-tag)' }}>Button</span>{'\n'}
{'  variant='}<span style={{ color: 'var(--code-str)' }}>"primary"</span>{'\n'}
{'  size='}<span style={{ color: 'var(--code-str)' }}>"lg"</span>{'\n'}
{'>'}{'\n'}
{'  Start a project →'}{'\n'}
{'</'}<span style={{ color: 'var(--code-tag)' }}>Button</span>{'>'}{'\n\n'}
<span style={{ color: 'var(--code-mut)' }}>{'// token → CSS variable, 1:1'}</span>{'\n'}
<span style={{ color: 'var(--code-tag)' }}>--accent</span>{': '}<span style={{ color: 'var(--code-str)' }}>#1F44E0</span>{';'}
        </pre>
      </div>
    </div>
  );
};

export default DesignToCode;
