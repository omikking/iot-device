'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const labelVariants = cva(
  'ui-tracking-wide ui-text-main-black ui-font-sandvik-text ui-leading-none peer-disabled:ui-cursor-not-allowed peer-disabled:ui-opacity-70',
  {
    variants: {
      variant: {
        medium: 'ui-text-md',
        small: 'ui-text-sm ui-tracking-wide',
        xs: 'ui-text-xs ui-tracking-wide',
      },
    },
    defaultVariants: {
      variant: 'xs',
    },
  },
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, variant, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant }), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
