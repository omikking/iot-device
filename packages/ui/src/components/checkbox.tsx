'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { LucideCheck } from 'lucide-react';
import { cn } from '../lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'ui-peer ui-mt-[1px] ui-h-6 ui-w-6 ui-shrink-0 ui-rounded-sm ui-border ui-border-main-black ui-text-orange-primary hover:ui-border-orange-primary data-[state=checked]:ui-border-orange-primary data-[state=checked]:ui-text-orange-primary disabled:ui-bg-main-white disabled:ui-text-neutral-5 disabled:ui-border-neutral-3 disabled:ui-pointer-events-none ui-transition ease-in-out ui-duration-200',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('ui-flex ui-items-center ui-justify-center')}
    >
      <LucideCheck size="20" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
