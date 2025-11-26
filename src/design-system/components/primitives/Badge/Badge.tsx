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
  // Base styles - brutalist design
  'inline-flex items-center justify-center font-bold transition-colors border-2 uppercase tracking-wide',
  {
    variants: {
      variant: {
        default: 'bg-zinc-100 text-zinc-900 border-zinc-900',
        primary: 'bg-primary text-white border-primary',
        secondary: 'bg-white text-zinc-900 border-zinc-900',
        success: 'bg-green-500 text-white border-green-600',
        error: 'bg-red-500 text-white border-red-600',
        warning: 'bg-yellow-500 text-zinc-900 border-yellow-600',
        info: 'bg-blue-500 text-white border-blue-600',
        outline: 'border-zinc-900 text-zinc-900 bg-transparent',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded-brutalist',
        md: 'px-2.5 py-1 text-sm rounded-brutalist',
        lg: 'px-3 py-1.5 text-base rounded-brutalist',
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
