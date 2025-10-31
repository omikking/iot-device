import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'ui-banshee-font-sandvik-text ui-banshee-inline-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-whitespace-nowrap ui-banshee-rounded-sm ui-banshee-transition ui-banshee-duration-200 disabled:ui-banshee-bg-neutral-2 disabled:ui-banshee-text-neutral-5 disabled:ui-banshee-cursor-not-allowed disabled:ui-banshee-pointer-events-none ui-banshee-border-neutral-3 disabled:ui-banshee-border-neutral-2',
  {
    variants: {
      variant: {
        primary:
          'ui-banshee-bg-blue-primary ui-banshee-text-main-white hover:ui-banshee-bg-blue-2 focus:ui-banshee-bg-blue-1',
        destructive:
          'ui-banshee-bg-destructive ui-banshee-text-destructive-foreground hover:ui-banshee-bg-destructive/90',
        // outline:
        //   'ui-banshee-border ui-banshee-border-input ui-banshee-bg-background hover:ui-banshee-bg-accent hover:ui-banshee-text-accent-foreground',
        // secondary:
        //   'ui-banshee-bg-secondary ui-banshee-text-secondary-foreground hover:ui-banshee-bg-secondary/80',
        // ghost:
        //   'hover:ui-banshee-bg-accent hover:ui-banshee-text-accent-foreground',
        // link: 'ui-banshee-text-primary ui-banshee-underline-offset-4 hover:ui-banshee-underline',
      },
      size: {
        small:
          'ui-banshee-h-10 ui-banshee-px-5 ui-banshee-text-sm ui-banshee-tracking-wide ui-banshee-gap-2 [&>svg]:ui-banshee-w-[18px] [&>svg]:ui-banshee-h-[18px]',
        large:
          'ui-banshee-h-12 ui-banshee-px-7 ui-banshee-text-sm ui-banshee-gap-3 ui-banshee-pt-[1px] [&>svg]:ui-banshee-mb-0.5 [&>svg]:ui-banshee-w-5 [&>svg]:ui-banshee-h-5',
      },
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
