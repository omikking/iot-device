import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const buttonVariants = cva(
  'ui-inline-flex ui-items-center ui-justify-center ui-whitespace-nowrap ui-rounded-sm ui-text-sm ui-font-medium ui-ring-offset-background ui-transition-colors focus-visible:ui-outline-none focus-visible:ui-ring-2 focus-visible:ui-ring-ring focus-visible:ui-ring-offset-2 disabled:ui-pointer-events-none disabled:ui-opacity-50',
  {
    variants: {
      variant: {
        default:
          'ui-bg-blue-primary ui-text-primary-foreground hover:ui-bg-blue-2 focus:ui-bg-blue-1',
        golden:
          'ui-bg-gold-primary ui-text-primary-foreground hover:ui-bg-gold-2 focus:ui-bg-gold-1',
        destructive:
          'ui-bg-destructive ui-text-destructive-foreground hover:ui-bg-destructive/90',
        outline:
          'ui-border ui-border-input ui-bg-background hover:ui-bg-accent hover:ui-text-accent-foreground',
        secondary:
          'ui-bg-neutral-2 ui-text-secondary-foreground hover:ui-bg-neutral-3 focus:ui-bg-neutral-4',
        ghost: 'hover:ui-bg-accent hover:ui-text-accent-foreground',
        link: 'ui-text-primary ui-underline-offset-4 hover:ui-underline',
        disabled: 'ui-bg-neutral-3 ui-text-neutral-4 ui-cursor-not-allowed',
      },
      size: {
        default: 'ui-h-10 ui-w-20 ui-px-6 ui-py-3',
        sm: 'ui-h-9 ui-rounded-md ui-px-3',
        lg: 'ui-h-11 ui-rounded-md ui-px-8',
        icon: 'ui-h-10 ui-w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
