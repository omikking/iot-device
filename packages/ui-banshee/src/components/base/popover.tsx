'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '../../lib/utils';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'ui-banshee-z-50 ui-banshee-w-72 ui-banshee-rounded-md ui-banshee-border ui-banshee-bg-popover ui-banshee-text-popover-foreground ui-banshee-shadow-lg ui-banshee-outline-none data-[state=open]:ui-banshee-animate-in data-[state=closed]:ui-banshee-animate-out data-[state=closed]:ui-banshee-fade-out-0 data-[state=open]:ui-banshee-fade-in-0 data-[state=closed]:ui-banshee-zoom-out-95 data-[state=open]:ui-banshee-zoom-in-95 data-[side=bottom]:ui-banshee-slide-in-from-top-2 data-[side=left]:ui-banshee-slide-in-from-right-2 data-[side=right]:ui-banshee-slide-in-from-left-2 data-[side=top]:ui-banshee-slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
