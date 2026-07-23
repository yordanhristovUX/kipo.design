/**
 * @fileoverview Badge component for labels and status indicators
 * @module design-system/components/primitives/Badge
 * 
 * A small badge component for displaying labels, counts, or status.
 * 
 * @example
 * ```tsx
 * import { Badge } from '@/design-system/components/primitives/Badge';
 * 
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error">Error</Badge>
 * ```
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/design-system/utils/cn';

/**
 * Badge variant styles using CVA
 */
const badgeVariants = cva(
  // Mono utility chips, tinted single-hue (no solid-fill shouting).
  'inline-flex items-center justify-center font-mono font-medium tracking-wide transition-colors border',
  {
    variants: {
      variant: {
        default: 'bg-bg-secondary text-text-secondary border-border-primary',
        primary: 'bg-primary-soft text-primary border-transparent',
        secondary: 'bg-surface-elevated text-text-secondary border-border-primary',
        success: 'text-success border-success-border bg-success-bg',
        error: 'text-error border-error-border bg-error-bg',
        warning: 'text-warning border-warning-border bg-warning-bg',
        info: 'bg-primary-soft text-primary border-transparent',
        outline: 'border-border-strong text-text-secondary bg-transparent',
      },
      size: {
        sm: 'px-2 py-0.5 text-[11px] rounded-interactive',
        md: 'px-2.5 py-0.5 text-xs rounded-interactive',
        lg: 'px-3 py-1 text-sm rounded-interactive',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Badge component for labels and status indicators
 * 
 * @param variant - Badge color variant
 * @param size - Badge size
 * @param className - Additional CSS classes
 * @param children - Badge content
 * 
 * @example
 * ```tsx
 * <Badge variant="success" size="sm">New</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, size, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
