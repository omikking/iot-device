'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '../../lib/utils';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'ui-banshee-fixed ui-banshee-inset-0 ui-banshee-z-50 ui-banshee-bg-black/80 ui-banshee- data-[state=open]:ui-banshee-animate-in data-[state=closed]:ui-banshee-animate-out data-[state=closed]:ui-banshee-fade-out-0 data-[state=open]:ui-banshee-fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'ui-banshee-fixed ui-banshee-z-50 ui-banshee-gap-4 ui-banshee-bg-background ui-banshee-p-6 ui-banshee-shadow-lg ui-banshee-transition ui-banshee-ease-in-out data-[state=open]:ui-banshee-animate-in data-[state=closed]:ui-banshee-animate-out data-[state=closed]:ui-banshee-duration-300 data-[state=open]:ui-banshee-duration-500',
  {
    variants: {
      side: {
        top: 'ui-banshee-inset-x-0 ui-banshee-top-0 ui-banshee-border-b data-[state=closed]:ui-banshee-slide-out-to-top data-[state=open]:ui-banshee-slide-in-from-top',
        bottom:
          'ui-banshee-inset-x-0 ui-banshee-bottom-0 ui-banshee-border-t data-[state=closed]:ui-banshee-slide-out-to-bottom data-[state=open]:ui-banshee-slide-in-from-bottom',
        left: 'ui-banshee-inset-y-0 ui-banshee-left-0 ui-banshee-h-full ui-banshee-w-3/4 ui-banshee-border-r data-[state=closed]:ui-banshee-slide-out-to-left data-[state=open]:ui-banshee-slide-in-from-left sm:ui-banshee-max-w-sm',
        right:
          'ui-banshee-inset-y-0 ui-banshee-right-0 ui-banshee-h-full ui-banshee-w-3/4 ui-banshee- ui-banshee-border-l data-[state=closed]:ui-banshee-slide-out-to-right data-[state=open]:ui-banshee-slide-in-from-right sm:ui-banshee-max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="ui-banshee-absolute ui-banshee-right-4 ui-banshee-top-4 ui-banshee-rounded-sm ui-banshee-opacity-70 ui-banshee-ring-offset-background ui-banshee-transition-opacity hover:ui-banshee-opacity-100 focus:ui-banshee-outline-none focus:ui-banshee-ring-2 focus:ui-banshee-ring-ring focus:ui-banshee-ring-offset-2 disabled:ui-banshee-pointer-events-none data-[state=open]:ui-banshee-bg-secondary">
        <X className="ui-banshee-h-4 ui-banshee-w-4" />
        <span className="ui-banshee-sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'ui-banshee-flex ui-banshee-flex-col ui-banshee-space-y-2 ui-banshee-text-center sm:ui-banshee-text-left',
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'ui-banshee-flex ui-banshee-flex-col-reverse sm:ui-banshee-flex-row sm:ui-banshee-justify-end sm:ui-banshee-space-x-2',
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      'ui-banshee-text-lg ui-banshee-font-semibold ui-banshee-text-foreground',
      className,
    )}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn(
      'ui-banshee-text-sm ui-banshee-text-muted-foreground',
      className,
    )}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
