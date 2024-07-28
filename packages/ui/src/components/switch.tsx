'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '../lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'ui-peer ui-inline-flex ui-h-6 ui-w-14 ui-shrink-0 ui-cursor-pointer ui-items-center ui-rounded-full ui-border-2 ui-border-transparent ui-transition-colors focus-visible:ui-outline-none focus-visible:ui-ring-2 focus-visible:ui-ring-ring focus-visible:ui-ring-offset-2 focus-visible:ui-ring-offset-main-white disabled:ui-cursor-not-allowed disabled:ui-opacity-50 data-[state=checked]:ui-bg-orange-primary data-[state=unchecked]:ui-bg-neutral-3',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'ui-pointer-events-none ui-block ui-h-[18px] ui-w-7 ui-rounded-[30px] ui-bg-main-white ui-shadow-md ui-ring-0 ui-transition-transform data-[state=checked]:ui-translate-x-[23px] data-[state=unchecked]:ui-translate-x-[1px]',
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
