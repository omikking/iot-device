'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const labelVariants = cva(
  'ui-banshee-tracking-wide ui-banshee-text-main-black ui-banshee-font-sandvik-text ui-banshee-leading-none peer-disabled:ui-banshee-cursor-default peer-disabled:ui-banshee-text-neutral-5',
  {
    variants: {
      variant: {
        medium: 'ui-banshee-text-md',
        small: 'ui-banshee-text-sm ui-banshee-tracking-wide',
        xs: 'ui-banshee-text-xs ui-banshee-tracking-wide',
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
      disabled && 'ui-banshee-text-neutral-5',
      className,
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
