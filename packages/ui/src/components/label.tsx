'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

// This Label component should only be used for Radio, Checkbox.
// Should not be used in places such as Inputfields, Dropdown, TextArea, or replace paragraph, link, span.

const labelVariants = cva(
  'ui-text-sm ui-tracking-wide ui-text-main-black ui-font-sandvik-text ui-font-medium ui-leading-none peer-disabled:ui-cursor-not-allowed peer-disabled:ui-opacity-70',
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
