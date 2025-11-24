'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '../../lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipArrow = TooltipPrimitive.Arrow;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      // 'ui-banshee-text-main-white ui-banshee-bg-main-black ui-banshee-z-50 ui-banshee-overflow-hidden ui-banshee-rounded-sm ui-banshee-bg-popover ui-banshee-px-3 ui-banshee-py-1.5 ui-banshee-text-sm ui-banshee-animate-in ui-banshee-fade-in-0 ui-banshee-zoom-in-95 data-[state=closed]:ui-banshee-animate-out data-[state=closed]:ui-banshee-fade-out-0 data-[state=closed]:ui-banshee-zoom-out-95 data-[side=bottom]:ui-banshee-slide-in-from-top-2 data-[side=left]:ui-banshee-slide-in-from-right-2 data-[side=right]:ui-banshee-slide-in-from-left-2 data-[side=top]:ui-banshee-slide-in-from-bottom-2 ui-banshee-origin-[--radix-tooltip-content-transform-origin]',
      'ui-banshee-text-main-white ui-banshee-bg-main-black ui-banshee-z-50 ui-banshee-overflow-hidden ui-banshee-rounded-sm ui-banshee-px-3 ui-banshee-py-1.5 ui-banshee-text-sm ui-banshee-animate-in ui-banshee-fade-in-0 ui-banshee-zoom-in-95 data-[state=closed]:ui-banshee-animate-out data-[state=closed]:ui-banshee-fade-out-0 data-[state=closed]:ui-banshee-zoom-out-95 data-[side=bottom]:ui-banshee-slide-in-from-top-2 data-[side=left]:ui-banshee-slide-in-from-right-2 data-[side=right]:ui-banshee-slide-in-from-left-2 data-[side=top]:ui-banshee-slide-in-from-bottom-2 ui-banshee-origin-[--radix-tooltip-content-transform-origin]',
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
};
