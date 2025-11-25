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
 * Inspired by Momentic.ai design system
 */
const buttonVariants = cva(
  // Base styles - applied to all buttons
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary - Blue gradient (Momentic.ai CTA style)
        primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-lg hover:shadow-glow',
        
        // Secondary - Outlined
        secondary: 'border-2 border-gray-700 text-gray-100 hover:bg-gray-800 hover:border-gray-600 bg-transparent',
        
        // Ghost - Transparent
        ghost: 'text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent',
        
        // Danger - Red
        danger: 'bg-error text-white hover:bg-error-dark active:bg-red-800 shadow-lg',
        
        // Link - Text only
        link: 'text-primary-500 hover:text-primary-400 underline-offset-4 hover:underline bg-transparent',
      },
      
      size: {
        sm: 'h-9 px-3 text-sm rounded-lg gap-1.5',
        md: 'h-11 px-5 text-base rounded-xl gap-2',
        lg: 'h-13 px-7 text-lg rounded-xl gap-2',
        xl: 'h-16 px-10 text-xl rounded-2xl gap-3',
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
  /** Icon position */
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
      iconPosition = 'right',
      isLoading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
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
              className="animate-spin h-5 w-5"
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
            {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
            <span>{children}</span>
            {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export type { VariantProps };
