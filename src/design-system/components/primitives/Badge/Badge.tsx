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
  // Base styles
  'inline-flex items-center justify-center font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-700 text-gray-100',
        primary: 'bg-primary-600 text-white',
        success: 'bg-success text-white',
        error: 'bg-error text-white',
        warning: 'bg-warning text-white',
        info: 'bg-info text-white',
        outline: 'border-2 border-gray-600 text-gray-200 bg-transparent',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs rounded-md',
        md: 'px-2.5 py-1 text-sm rounded-lg',
        lg: 'px-3 py-1.5 text-base rounded-lg',
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
