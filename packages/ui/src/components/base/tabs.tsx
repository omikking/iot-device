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
      'ui-inline-flex ui-h-14 ui-gap-1 ui-items-center ui-justify-center ui-rounded-full ui-border ui-border-neutral-3 ui-p-2 ui-text-neutral-5',
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
      'ui-font-sandvik-text ui-text-md ui-inline-flex ui-items-center ui-justify-center ui-whitespace-nowrap ui-rounded-full ui-px-7 ui-py-1.5 ui-ring-offset-main-white ui-transition-all focus-visible:ui-outline-none focus-visible:ui-ring-2 focus-visible:ui-ring-ring focus-visible:ui-ring-offset-2 disabled:ui-pointer-events-none disabled:ui-opacity-50 data-[state=active]:ui-bg-main-white data-[state=active]:ui-text-orange-primary data-[state=active]:ui-shadow-md ui-border data-[state=inactive]:ui-border-transparent data-[state=active]:ui-border-orange-primary data-[state=inactive]:hover:ui-text-main-black transition-all ease-in-out duration-100',
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
      'ui-mt-2 ui-ring-offset-background focus-visible:ui-outline-none focus-visible:ui-ring-2 focus-visible:ui-ring-ring focus-visible:ui-ring-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
