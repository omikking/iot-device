'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '../../lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'ui-banshee-grid ui-banshee-place-content-center ui-banshee-peer ui-banshee-h-4 ui-banshee-w-4 ui-banshee-shrink-0 ui-banshee-border ui-banshee-border-main-black ui-banshee-ring-offset-background focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-ring focus-visible:ui-banshee-ring-offset-2 disabled:ui-banshee-cursor-not-allowed disabled:ui-banshee-opacity-50 data-[state=checked]:ui-banshee-bg-primary data-[state=checked]:ui-banshee-text-primary-foreground',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        'ui-banshee-grid ui-banshee-place-content-center ui-banshee-text-current ui-banshee-bg-main-white ui-banshee-border ui-banshee-border-main-black',
      )}
    >
      <Check className="ui-banshee-h-3 ui-banshee-w-3 ui-banshee-text-main-black" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
