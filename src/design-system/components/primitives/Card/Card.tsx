/**
 * @fileoverview Card component with Momentic.ai-inspired styling
 * @module design-system/components/primitives/Card
 * 
 * A flexible card component with multiple variants and hover effects.
 * Follows Momentic.ai dark theme design with subtle borders and shadows.
 * 
 * @example
 * ```tsx
 * import { Card } from '@/design-system/components/primitives/Card';
 * 
 * <Card variant="elevated" hover>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 * ```
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/design-system/utils/cn';

/**
 * Card variant styles using CVA
 * Inspired by Momentic.ai card design
 */
const cardVariants = cva(
  // Surface with hairline border + restrained soft elevation.
  'rounded-section transition-[box-shadow,border-color] duration-200 border bg-surface-elevated',
  {
    variants: {
      variant: {
        // Default - surface with hairline
        default: 'border-border-primary',

        // Elevated - soft shadow
        elevated: 'border-border-primary shadow-ds',

        // Outlined - border only
        outlined: 'border-border-primary bg-transparent',

        // Legacy aliases fall back to default
        gradient: 'border-border-primary',
        glass: 'border-border-primary',
      },

      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },

      hover: {
        true: 'hover:border-border-strong hover:shadow-ds cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: false,
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Card header content */
  header?: ReactNode;
  /** Card footer content */
  footer?: ReactNode;
}

/**
 * Card component with multiple variants and optional hover effects
 * 
 * @param variant - Card style variant
 * @param padding - Card padding size
 * @param hover - Enable hover effects
 * @param header - Optional header content
 * @param footer - Optional footer content
 * @param children - Card content
 * @param className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <Card variant="elevated" padding="lg" hover>
 *   <Card.Header>
 *     <h3>Feature Title</h3>
 *   </Card.Header>
 *   <p>Feature description</p>
 *   <Card.Footer>
 *     <Button>Learn More</Button>
 *   </Card.Footer>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant,
      padding,
      hover,
      header,
      footer,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, hover }), className)}
        {...props}
      >
        {header && (
          <div className="mb-4 pb-4 border-b border-border-primary">
            {header}
          </div>
        )}
        
        <div>{children}</div>
        
        {footer && (
          <div className="mt-4 pt-4 border-t border-border-primary">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header subcomponent
 */
export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mb-4 pb-4 border-b border-border-primary', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

/**
 * Card Content subcomponent
 */
export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));

CardContent.displayName = 'CardContent';

/**
 * Card Footer subcomponent
 */
export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mt-4 pt-4 border-t border-border-primary', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

/**
 * Card Title subcomponent
 */
export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-bold text-text-primary', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

/**
 * Card Description subcomponent
 */
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-text-secondary text-sm', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';
