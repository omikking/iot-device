import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { LucideX } from 'lucide-react';

import { cn } from '../../lib/utils';

const MenuWrapper = SheetPrimitive.Root;

const MenuTrigger = SheetPrimitive.Trigger;

const MenuClose = SheetPrimitive.Close;

const MenuPortal = SheetPrimitive.Portal;

const MenuOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'ui-bg-main-black/50 ui-top-16 ui-fixed ui-inset-0 ui-z-50 data-[state=open]:ui-animate-in data-[state=closed]:ui-animate-out data-[state=closed]:ui-fade-out-0 data-[state=open]:ui-fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
));
MenuOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'ui-fixed ui-overflow-y-auto ui-h-[calc(100vh-64px)] ui-z-50 ui-gap-4 ui-bg-main-white ui-p-14 ui-shadow-xl ui-transition ui-ease-in-out data-[state=open]:ui-animate-in data-[state=closed]:ui-animate-out data-[state=closed]:ui-duration-300 data-[state=open]:ui-duration-500',
  {
    variants: {
      side: {
        top: 'ui-inset-x-0 ui-top-0 ui-border-b data-[state=closed]:ui-slide-out-to-top data-[state=open]:ui-slide-in-from-top',
        bottom:
          'ui-inset-x-0 ui-bottom-0 ui-border-t data-[state=closed]:ui-slide-out-to-bottom data-[state=open]:ui-slide-in-from-bottom',
        left: 'ui-inset-y-0 ui-left-0 ui-h-full ui-w-3/4 ui-border-r data-[state=closed]:ui-slide-out-to-left data-[state=open]:ui-slide-in-from-left sm:ui-max-w-sm',
        right:
          'ui-top-16 ui-right-0 ui-h-full ui-w-[32rem] ui- ui-border-l-2 ui-border-gold-3 data-[state=closed]:ui-slide-out-to-right data-[state=open]:ui-slide-in-from-right',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

interface SheetContentProps
  extends
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const MenuContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <MenuPortal>
    <SheetPrimitive.Close className="ui-z-50 ui-absolute ui-right-4 sm:ui-right-6 lg:ui-right-10 ui-top-4 ui-transition-opacity focus:ui-outline-0 disabled:ui-pointer-events-none data-[state=open]:ui-bg-main-white">
      <LucideX
        size="30"
        className="data-[state=open]:opacity-1 data-[state=closed]:opacity-0 transition-all duration-200"
      />
    </SheetPrimitive.Close>

    <MenuOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </MenuPortal>
));
MenuContent.displayName = SheetPrimitive.Content.displayName;

const MenuTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn(
      'ui-text-3xl ui-font-sandvik-headline ui-text-main-black',
      className,
    )}
    {...props}
  />
));
MenuTitle.displayName = SheetPrimitive.Title.displayName;

export {
  MenuWrapper,
  MenuPortal,
  MenuOverlay,
  MenuTrigger,
  MenuClose,
  MenuContent,
  MenuTitle,
};
