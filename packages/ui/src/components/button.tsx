import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

// -- Usage examples --
// <Button type="submit">
//   Text
// </Button>

// <Button variant="secondary" size={'small'} type="submit">
//   <LucideChevronDown size={'16'} />
//   Small button with small chevron 16px always
// </Button>

// <Button variant="destructive" type="submit">
//   <LucideChevronDown size={'20'} />
//   Large button with large chevron 20px always
// </Button>

const buttonVariants = cva(
  'ui-font-sandvik-text ui-inline-flex ui-items-center ui-justify-center ui-whitespace-nowrap ui-rounded-sm ui-transition ui-duration-200',
  {
    variants: {
      variant: {
        primary:
          'ui-bg-blue-primary ui-text-main-white hover:ui-bg-blue-1 focus:ui-bg-blue-1',
        secondary:
          'ui-bg-gold-primary ui-text-main-white hover:ui-bg-gold-1 focus:ui-bg-gold-1',
        outline:
          'ui-bg-main-white ui-border ui-border-neutral-3 ui-text-main-black hover:ui-border-blue-1 focus:ui-bg-blue-1',
        disabled:
          'ui-bg-neutral-2 ui-text-neutral-5 ui-cursor-not-allowed ui-pointer-events-none',
        destructive:
          'ui-bg-background ui-text-destructive ui-border ui-border-destructive hover:ui-bg-destructive hover:ui-text-background',
      },
      size: {
        small: 'ui-h-9 ui-px-5 ui-text-xs ui-tracking-wide ui-gap-2',
        large: 'ui-h-[2.875rem] ui-px-7 ui-text-md ui-gap-3',
      },
      isWide: {
        true: 'ui-size-auto',
        false: 'ui-size-fit',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'large',
      isWide: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isWide, asChild = false, children }, ref) => {
    const Component = asChild ? Slot : 'button';
    return (
      <Component
        className={cn(buttonVariants({ variant, size, isWide }), className)}
        ref={ref}
      >
        {children}
      </Component>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
