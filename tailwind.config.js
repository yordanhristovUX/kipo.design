/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary - Electric blue
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
        },
        
        // Background colors
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-tertiary': 'var(--color-bg-tertiary)',
        'bg-hover': 'var(--color-bg-hover)',
        'bg-active': 'var(--color-bg-active)',
        
        // Text colors
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-inverse': 'var(--color-text-inverse)',
        'text-muted': 'var(--color-text-muted)',
        
        // Border colors
        'border-primary': 'var(--color-border-primary)',
        'border-secondary': 'var(--color-border-secondary)',
        'border-subtle': 'var(--color-border-subtle)',
        'border-strong': 'var(--color-border-strong)',
        
        // Interactive states
        'interactive': {
          DEFAULT: 'var(--color-interactive-default)',
          hover: 'var(--color-interactive-hover)',
          active: 'var(--color-interactive-active)',
          disabled: 'var(--color-interactive-disabled)',
        },
        
        // Feedback colors
        'success': {
          DEFAULT: 'var(--color-success)',
          bg: 'var(--color-success-bg)',
          border: 'var(--color-success-border)',
        },
        'error': {
          DEFAULT: 'var(--color-error)',
          bg: 'var(--color-error-bg)',
          border: 'var(--color-error-border)',
        },
        'warning': {
          DEFAULT: 'var(--color-warning)',
          bg: 'var(--color-warning-bg)',
          border: 'var(--color-warning-border)',
        },
        'info': {
          DEFAULT: 'var(--color-info)',
          bg: 'var(--color-info-bg)',
          border: 'var(--color-info-border)',
        },
        
        // Accent tints
        'primary-soft': 'var(--color-primary-soft)',

        // Surface colors
        'surface': {
          DEFAULT: 'var(--color-surface-default)',
          elevated: 'var(--color-surface-elevated)',
          sunken: 'var(--color-surface-sunken)',
        },
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        // Tight, considered radii — 7px controls, 9px cards, 14px large panels.
        'brutalist-sm': '7px',
        'brutalist': '7px',
        'section': 'var(--radius-section)',      // 9px
        'interactive': 'var(--radius-interactive)', // 7px
        'lg-panel': 'var(--radius-lg)',          // 14px
      },
      boxShadow: {
        'ds-sm': 'var(--shadow-sm)',
        'ds': 'var(--shadow)',
        'ds-lg': 'var(--shadow-lg)',
      },
      borderWidth: {
        '1': '1px',
        '2': '2px',
      },
      spacing: {
        'section': '6rem', // 96px - consistent section spacing
      },
    },
  },
  plugins: [],
};
