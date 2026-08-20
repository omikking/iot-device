'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '../../lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Disabled base styles
      'disabled:ds-border-neutral-2 disabled:ds-cursor-default',

      // ✅ Compound variants override the state-based bg when disabled
      'disabled:data-[state=checked]:ds-bg-main-white',
      'disabled:data-[state=unchecked]:ds-bg-main-white',

      // Normal interactive styles
      'ds-peer ds-inline-flex ds-h-8 ds-w-16 ds-shrink-0 ds-cursor-pointer ds-items-center ds-rounded-full ds-border-2 ds-border-transparent ds-transition-colors focus-visible:ds-outline-none focus-visible:ds-ring-2 focus-visible:ds-ring-ring focus-visible:ds-ring-offset-2 focus-visible:ds-ring-offset-main-white data-[state=checked]:ds-bg-orange-primary data-[state=unchecked]:ds-bg-neutral-3',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'data-[disabled]:ds-bg-neutral-2 data-[disabled]:ds-border-main-white data-[disabled]:ds-shadow-none',
        'ds-pointer-events-none ds-block ds-h-[26px] ds-w-9 ds-rounded-[30px] ds-bg-main-white ds-shadow-md ds-ring-0 ds-transition-transform data-[state=checked]:ds-translate-x-[23px] data-[state=unchecked]:ds-translate-x-[1px]',
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
