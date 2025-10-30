'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '../../lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'ui-banshee-fixed ui-banshee-inset-0 ui-banshee-z-50 ui-banshee-bg-black/80 data-[state=open]:ui-banshee-animate-in data-[state=closed]:ui-banshee-animate-out data-[state=closed]:ui-banshee-fade-out-0 data-[state=open]:ui-banshee-fade-in-0',
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'ui-banshee-fixed ui-banshee-left-[50%] ui-banshee-top-[50%] ui-banshee-z-50 ui-banshee-grid ui-banshee-w-full ui-banshee-max-w-lg ui-banshee-translate-x-[-50%] ui-banshee-translate-y-[-50%] ui-banshee-gap-4 ui-banshee-border ui-banshee-bg-background ui-banshee-p-6 ui-banshee-shadow-lg ui-banshee-duration-200 data-[state=open]:ui-banshee-animate-in data-[state=closed]:ui-banshee-animate-out data-[state=closed]:ui-banshee-fade-out-0 data-[state=open]:ui-banshee-fade-in-0 data-[state=closed]:ui-banshee-zoom-out-95 data-[state=open]:ui-banshee-zoom-in-95 data-[state=closed]:ui-banshee-slide-out-to-left-1/2 data-[state=closed]:ui-banshee-slide-out-to-top-[48%] data-[state=open]:ui-banshee-slide-in-from-left-1/2 data-[state=open]:ui-banshee-slide-in-from-top-[48%] sm:ui-banshee-rounded-lg',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="ui-banshee-absolute ui-banshee-right-4 ui-banshee-top-4 ui-banshee-rounded-sm ui-banshee-opacity-70 ui-banshee-ring-offset-background ui-banshee-transition-opacity hover:ui-banshee-opacity-100 focus:ui-banshee-outline-none focus:ui-banshee-ring-2 focus:ui-banshee-ring-ring focus:ui-banshee-ring-offset-2 disabled:ui-banshee-pointer-events-none data-[state=open]:ui-banshee-bg-accent data-[state=open]:ui-banshee-text-muted-foreground">
        <X className="ui-banshee-h-4 ui-banshee-w-4" />
        <span className="ui-banshee-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'ui-banshee-flex ui-banshee-flex-col ui-banshee-space-y-1.5 ui-banshee-text-center sm:ui-banshee-text-left',
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
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
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'ui-banshee-text-lg ui-banshee-font-semibold ui-banshee-leading-none ui-banshee-tracking-tight',
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      'ui-banshee-text-sm ui-banshee-text-muted-foreground',
      className,
    )}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
