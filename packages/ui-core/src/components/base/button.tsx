import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'ds-font-sandvik-text ds-inline-flex ds-items-center ds-justify-center ds-whitespace-nowrap ds-rounded-sm ds-transition ds-duration-200 disabled:ds-bg-neutral-2 disabled:ds-text-neutral-5 disabled:ds-cursor-not-allowed disabled:ds-pointer-events-none ds-border-neutral-3 disabled:ds-border-neutral-2 hover:-ds-translate-y-px active:ds-translate-y-px',
  {
    variants: {
      variant: {
        primary: 'ds-bg-blue-primary ds-text-main-white',
        destructive:
          'ds-bg-destructive ds-text-destructive-foreground hover:ds-bg-destructive/90',
        // outline:
        //   'ds-border ds-border-input ds-bg-background hover:ds-bg-accent hover:ds-text-accent-foreground',
        secondary:
          'ds-bg-secondary ds-text-secondary-foreground hover:ds-bg-secondary/80',
        outline:
          'hover:ds-bg-accent hover:ds-text-accent-foreground',
        // link: 'ds-text-primary ds-underline-offset-4 hover:ds-underline',
      },
      size: {
        small:
          'ds-h-10 ds-px-5 ds-text-sm ds-tracking-wide ds-gap-2 [&>svg]:ds-w-[18px] [&>svg]:ds-h-[18px]',
        large:
          'ds-h-12 ds-px-7 ds-text-sm ds-gap-3 ds-pt-[1px] [&>svg]:ds-mb-0.5 [&>svg]:ds-w-5 [&>svg]:ds-h-5',
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
  (
    {
      className,
      variant = 'primary',
      size = 'small',
      asChild = false,
      ...props
    },
    ref,
  ) => {
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
