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
      'disabled:ui-banshee-border-neutral-2 disabled:!ui-banshee-bg-main-white disabled:ui-banshee-cursor-default',
      'ui-banshee-peer ui-banshee-inline-flex ui-banshee-h-6 ui-banshee-w-14 ui-banshee-shrink-0 ui-banshee-cursor-pointer ui-banshee-items-center ui-banshee-rounded-full ui-banshee-border-2 ui-banshee-border-transparent ui-banshee-transition-colors focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-ring focus-visible:ui-banshee-ring-offset-2 focus-visible:ui-banshee-ring-offset-main-white data-[state=checked]:ui-banshee-bg-orange-primary data-[state=unchecked]:ui-banshee-bg-neutral-3',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'data-[disabled]:ui-banshee-bg-neutral-2 data-[disabled]:ui-banshee-border-main-white data-[disabled]:ui-banshee-shadow-none',
        'ui-banshee-pointer-events-none ui-banshee-block ui-banshee-h-[18px] ui-banshee-w-7 ui-banshee-rounded-[30px] ui-banshee-bg-main-white ui-banshee-shadow-md ui-banshee-ring-0 ui-banshee-transition-transform data-[state=checked]:ui-banshee-translate-x-[23px] data-[state=unchecked]:ui-banshee-translate-x-[1px]',
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
