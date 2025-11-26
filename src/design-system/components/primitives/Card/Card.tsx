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
  // Base styles - brutalist design
  'rounded-brutalist-sm transition-all duration-200 border-2 border-zinc-900 bg-white',
  {
    variants: {
      variant: {
        // Default - White with border
        default: 'bg-white border-zinc-900',
        
        // Elevated - Same as default (no shadows in brutalism)
        elevated: 'bg-white border-zinc-900',
        
        // Outlined - Border only
        outlined: 'border-zinc-900 bg-transparent',
        
        // Gradient - Not used in brutalism, fallback to default
        gradient: 'bg-white border-zinc-900',
        
        // Glass - Not used in brutalism, fallback to default
        glass: 'bg-white border-zinc-900',
      },
      
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      
      hover: {
        true: 'hover:border-gray-600 hover:shadow-2xl cursor-pointer hover:-translate-y-1',
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
          <div className="mb-4 pb-4 border-b-2 border-zinc-900">
            {header}
          </div>
        )}
        
        <div>{children}</div>
        
        {footer && (
          <div className="mt-4 pt-4 border-t-2 border-zinc-900">
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
    className={cn('mb-4 pb-4 border-b-2 border-zinc-900', className)}
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
    className={cn('mt-4 pt-4 border-t-2 border-zinc-900', className)}
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
    className={cn('text-xl font-bold text-zinc-900', className)}
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
    className={cn('text-zinc-600 text-sm', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';
