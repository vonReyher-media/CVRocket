import { cva } from 'class-variance-authority';
import { Loader2Icon } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

import { VariantProps } from '../../types.ts';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed ring-offset-background',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-primary/50',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:bg-destructive/50',
        outline:
          'border border-input hover:bg-accent hover:text-accent-foreground disabled:border-gray-300 disabled:text-gray-400',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:bg-secondary/50',
        ghost:
          'hover:bg-accent hover:text-accent-foreground disabled:text-gray-400',
        link: 'underline-offset-4 hover:underline text-primary disabled:text-gray-400',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
