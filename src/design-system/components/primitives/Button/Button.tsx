/**
 * @fileoverview Button component with Momentic.ai-inspired variants
 * @module design-system/components/primitives/Button
 * 
 * A flexible button component with multiple variants, sizes, and states.
 * Uses class-variance-authority for variant management.
 * 
 * @example
 * ```tsx
 * import { Button } from '@/design-system/components/primitives/Button';
 * 
 * <Button variant="primary" size="md">
 *   Click me
 * </Button>
 * 
 * <Button variant="secondary" size="lg" icon={ArrowRight}>
 *   Learn More
 * </Button>
 * ```
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/design-system/utils/cn';

/**
 * Button variant styles using CVA
 * Brutalist design system - geometric, bold, no shadows
 */
const buttonVariants = cva(
  // Flat, precise buttons — tight radius, hover = colour/border change only
  // (no gloss, no translate bounce).
  'inline-flex items-center justify-center font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50 border rounded-interactive',
  {
    variants: {
      variant: {
        // Primary - solid accent
        primary: 'bg-primary text-white border-primary hover:bg-primary-hover hover:border-primary-hover',

        // Secondary - quiet neutral, border/color shift on hover
        secondary: 'border-border-strong text-text-primary bg-surface-elevated hover:bg-bg-secondary hover:border-text-tertiary',

        // Ghost - no border
        ghost: 'border-transparent text-text-primary hover:bg-bg-secondary',

        // Outline - neutral border, accent border on hover
        outline: 'border-border-strong text-text-primary bg-transparent hover:border-primary hover:text-primary',
      },

      size: {
        sm: 'h-9 px-4 text-sm gap-2',
        md: 'h-11 px-5 text-[15px] gap-2',
        lg: 'h-12 px-6 text-base gap-2.5',
        xl: 'h-14 px-8 text-lg gap-3',
      },
      
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Button content */
  children: ReactNode;
  /** Optional icon component (from lucide-react) */
  icon?: React.ComponentType<{ className?: string }>;
  /** Left icon component */
  leftIcon?: React.ComponentType<{ className?: string }>;
  /** Right icon component */
  rightIcon?: React.ComponentType<{ className?: string }>;
  /** Icon position (deprecated, use leftIcon/rightIcon) */
  iconPosition?: 'left' | 'right';
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Button component with multiple variants and sizes
 * 
 * @param variant - Button style variant
 * @param size - Button size
 * @param fullWidth - Whether button should take full width
 * @param icon - Optional icon component
 * @param iconPosition - Position of icon (left or right)
 * @param isLoading - Show loading state
 * @param className - Additional CSS classes
 * @param children - Button content
 * @param props - Additional button HTML attributes
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" icon={ArrowRight}>
 *   Get Started
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      fullWidth,
      icon: Icon,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      iconPosition = 'right',
      isLoading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Support both old icon prop and new leftIcon/rightIcon props
    const FinalLeftIcon = LeftIcon || (Icon && iconPosition === 'left' ? Icon : undefined);
    const FinalRightIcon = RightIcon || (Icon && iconPosition === 'right' ? Icon : undefined);

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {FinalLeftIcon && <FinalLeftIcon className="w-5 h-5 shrink-0" />}
            <span>{children}</span>
            {FinalRightIcon && <FinalRightIcon className="w-5 h-5 shrink-0" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export type { VariantProps };
