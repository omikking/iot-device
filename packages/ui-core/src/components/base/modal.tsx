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
      'ds-fixed ds-inset-0 ds-z-50 ds-bg-main-black/50 ds- data-[state=open]:ds-animate-in data-[state=closed]:ds-animate-out data-[state=closed]:ds-fade-out-0 data-[state=open]:ds-fade-in-0',
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
          // 'ds-max-h-[86vh] ds-min-w-[900px] ds-fixed ds-left-[50%] ds-top-[50%] ds-z-50 ds-grid ds-translate-x-[-50%] ds-translate-y-[-50%] ds-bg-neutral-1 ds-shadow-sm ds-duration-200 data-[state=open]:ds-animate-in data-[state=closed]:ds-animate-out data-[state=closed]:ds-fade-out-0 data-[state=open]:ds-fade-in-0 data-[state=closed]:ds-zoom-out-90 data-[state=open]:ds-zoom-in-90 data-[state=closed]:ds-slide-out-to-left-1/2 data-[state=closed]:ds-slide-out-to-top-[48%] data-[state=open]:ds-slide-in-from-left-1/2 data-[state=open]:ds-slide-in-from-top-[48%] sm:ds-rounded',
          'ds-max-h-[86vh] ds-w-[550px] ds-p-12 ds-fixed ds-left-[50%] ds-top-[50%] ds-z-50 ds-grid ds-translate-x-[-50%] ds-translate-y-[-50%] ds-bg-main-white ds-shadow-sm ds-duration-200 data-[state=open]:ds-animate-in data-[state=closed]:ds-animate-out data-[state=closed]:ds-fade-out-0 data-[state=open]:ds-fade-in-0 data-[state=closed]:ds-zoom-out-90 data-[state=open]:ds-zoom-in-90 data-[state=closed]:ds-slide-out-to-left-1/2 data-[state=closed]:ds-slide-out-to-top-[48%] data-[state=open]:ds-slide-in-from-left-1/2 data-[state=open]:ds-slide-in-from-top-[48%] sm:ds-rounded',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="ds-absolute ds-right-6 ds-top-[24px] ds-rounded-sm ds-opacity-70 ds-transition-opacity hover:ds-opacity-100 focus:ds-outline-none disabled:ds-pointer-events-none data-[state=open]:ds-bg-accent data-[state=open]:ds-text-neutral-5">
          <LucideX size="28" />
          <span className="ds-sr-only">Close</span>
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
      'ds-flex ds-flex-col ds-space-y-1.5 ds-text-center sm:ds-text-left',
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
      'ds-flex ds-flex-row sm:ds-flex-row sm:ds-justify-end sm:ds-space-x-2',
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
      'ds-font-sandvik-headline ds-text-2xl ds-leading-none ds-bg-main-white ds-rounded-s ds-rounded-e',
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
    className={cn('ds-text-neutral-5', className)}
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
