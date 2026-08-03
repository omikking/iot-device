'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const labelVariants = cva(
  'ds-tracking-wide ds-text-main-black ds-font-sandvik-text ds-leading-none peer-disabled:ds-cursor-default peer-disabled:ds-text-neutral-5',
  {
    variants: {
      variant: {
        medium: 'ds-text-md',
        small: 'ds-text-sm ds-tracking-wide',
        xs: 'ds-text-xs ds-tracking-wide',
      },
    },
    defaultVariants: {
      variant: 'small',
    },
  },
);

interface LabelProps {
  disabled?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> &
    LabelProps
>(({ className, variant, disabled, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      labelVariants({ variant }),
      disabled && 'ds-text-neutral-5',
      className,
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
