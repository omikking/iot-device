'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { LucideX } from 'lucide-react';

import { cn } from '../../lib/utils';

const Modal = DialogPrimitive.Root;

const ModalTrigger = DialogPrimitive.Trigger;

const ModalPortal = DialogPrimitive.Portal;

const ModalClose = DialogPrimitive.Close;

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'ui-banshee-fixed ui-banshee-inset-0 ui-banshee-z-50 ui-banshee-bg-main-black/50 ui-banshee- data-[state=open]:ui-banshee-animate-in data-[state=closed]:ui-banshee-animate-out data-[state=closed]:ui-banshee-fade-out-0 data-[state=open]:ui-banshee-fade-in-0',
      className,
    )}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay>
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          // 'ui-banshee-max-h-[86vh] ui-banshee-min-w-[900px] ui-banshee-fixed ui-banshee-left-[50%] ui-banshee-top-[50%] ui-banshee-z-50 ui-banshee-grid ui-banshee-translate-x-[-50%] ui-banshee-translate-y-[-50%] ui-banshee-bg-neutral-1 ui-banshee-shadow-sm ui-banshee-duration-200 data-[state=open]:ui-banshee-animate-in data-[state=closed]:ui-banshee-animate-out data-[state=closed]:ui-banshee-fade-out-0 data-[state=open]:ui-banshee-fade-in-0 data-[state=closed]:ui-banshee-zoom-out-90 data-[state=open]:ui-banshee-zoom-in-90 data-[state=closed]:ui-banshee-slide-out-to-left-1/2 data-[state=closed]:ui-banshee-slide-out-to-top-[48%] data-[state=open]:ui-banshee-slide-in-from-left-1/2 data-[state=open]:ui-banshee-slide-in-from-top-[48%] sm:ui-banshee-rounded',
          'ui-banshee-max-h-[86vh] ui-banshee-w-[550px] ui-banshee-p-12 ui-banshee-fixed ui-banshee-left-[50%] ui-banshee-top-[50%] ui-banshee-z-50 ui-banshee-grid ui-banshee-translate-x-[-50%] ui-banshee-translate-y-[-50%] ui-banshee-bg-main-white ui-banshee-shadow-sm ui-banshee-duration-200 data-[state=open]:ui-banshee-animate-in data-[state=closed]:ui-banshee-animate-out data-[state=closed]:ui-banshee-fade-out-0 data-[state=open]:ui-banshee-fade-in-0 data-[state=closed]:ui-banshee-zoom-out-90 data-[state=open]:ui-banshee-zoom-in-90 data-[state=closed]:ui-banshee-slide-out-to-left-1/2 data-[state=closed]:ui-banshee-slide-out-to-top-[48%] data-[state=open]:ui-banshee-slide-in-from-left-1/2 data-[state=open]:ui-banshee-slide-in-from-top-[48%] sm:ui-banshee-rounded',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="ui-banshee-absolute ui-banshee-right-6 ui-banshee-top-[24px] ui-banshee-rounded-sm ui-banshee-opacity-70 ui-banshee-transition-opacity hover:ui-banshee-opacity-100 focus:ui-banshee-outline-none disabled:ui-banshee-pointer-events-none data-[state=open]:ui-banshee-bg-accent data-[state=open]:ui-banshee-text-neutral-5">
          <LucideX size="28" />
          <span className="ui-banshee-sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </ModalOverlay>
  </ModalPortal>
));
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = ({
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
ModalHeader.displayName = 'ModalHeader';

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'ui-banshee-flex ui-banshee-flex-row sm:ui-banshee-flex-row sm:ui-banshee-justify-end sm:ui-banshee-space-x-2',
      className,
    )}
    {...props}
  />
);
ModalFooter.displayName = 'ModalFooter';

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'ui-banshee-font-sandvik-headline ui-banshee-text-2xl ui-banshee-leading-none ui-banshee-bg-main-white ui-banshee-rounded-s ui-banshee-rounded-e',
      className,
    )}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('ui-banshee-text-neutral-5', className)}
    {...props}
  />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalClose,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
};
