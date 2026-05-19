'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '../../lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'ui-banshee-inline-flex ui-banshee-h-16 ui-banshee-gap-1 ui-banshee-items-center ui-banshee-justify-center  ui-banshee-border-neutral-3 ui-banshee-p-2 ui-banshee-text-neutral-5',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'ui-banshee-font-sandvik-text ui-banshee-text-md ui-banshee-inline-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-whitespace-nowrap  ui-banshee-px-14 ui-banshee-py-5 ui-banshee-ring-offset-main-white ui-banshee-transition-all focus-visible:ui-banshee-outline-none  disabled:ui-banshee-pointer-events-none disabled:ui-banshee-opacity-50 data-[state=active]:ui-banshee-bg-neutral-1 data-[state=inactive]:hover:ui-banshee-text-main-black transition-all ease-in-out duration-100',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'ui-banshee-mt-2 ui-banshee-ring-offset-background focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-ring focus-visible:ui-banshee-ring-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
