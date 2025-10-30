'use client';

import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
// import { Search } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Dialog, DialogContent } from './dialog';

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'ui-banshee-flex ui-banshee-h-full ui-banshee-w-full ui-banshee-flex-col ui-banshee-overflow-hidden ui-banshee-rounded-md ui-banshee-bg-popover ui-banshee-text-popover-foreground',
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="ui-banshee-overflow-hidden ui-banshee-p-0 ui-banshee-shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:ui-banshee-px-2 [&_[cmdk-group-heading]]:ui-banshee-font-medium [&_[cmdk-group-heading]]:ui-banshee-text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:ui-banshee-pt-0 [&_[cmdk-group]]:ui-banshee-px-2 [&_[cmdk-input-wrapper]_svg]:ui-banshee-h-5 [&_[cmdk-input-wrapper]_svg]:ui-banshee-w-5 [&_[cmdk-input]]:ui-banshee-h-12 [&_[cmdk-item]]:ui-banshee-px-2 [&_[cmdk-item]]:ui-banshee-py-3 [&_[cmdk-item]_svg]:ui-banshee-h-5 [&_[cmdk-item]_svg]:ui-banshee-w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="ui-banshee-flex ui-banshee-items-center ui-banshee-border-b ui-banshee-border-neutral-3 ui-banshee-px-3"
    data-cmdk-input-wrapper=""
  >
    {/* <Search className="ui-banshee-mr-2 ui-banshee-h-4 ui-banshee-w-4 ui-banshee-shrink-0 ui-banshee-opacity-50" /> */}
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'ui-banshee-flex ui-banshee-h-6 ui-banshee-w-full ui-banshee-rounded-md ui-banshee-bg-transparent ui-banshee-py-3 ui-banshee-text-sm ui-banshee-outline-none placeholder:ui-banshee-text-muted-foreground disabled:ui-banshee-cursor-not-allowed disabled:ui-banshee-opacity-50',
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn(
      'ui-banshee-max-h-[300px] ui-banshee-overflow-y-auto ui-banshee-overflow-x-hidden',
      className,
    )}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="ui-banshee-py-6 ui-banshee-text-center ui-banshee-text-sm"
    {...props}
  />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'ui-banshee-overflow-hidden ui-banshee-p-1 ui-banshee-text-foreground [&_[cmdk-group-heading]]:ui-banshee-px-2 [&_[cmdk-group-heading]]:ui-banshee-py-1.5 [&_[cmdk-group-heading]]:ui-banshee-text-xs [&_[cmdk-group-heading]]:ui-banshee-font-medium [&_[cmdk-group-heading]]:ui-banshee-text-muted-foreground',
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn(
      // 'ui-banshee--mx-1 ui-banshee-h-px ui-banshee-bg-border',
      'ui-banshee-w-72 ui-banshee--mx-1 ui-banshee-h-px',
      className,
    )}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'ui-banshee-relative ui-banshee-flex ui-banshee-cursor-default ui-banshee-gap-2 ui-banshee-select-none ui-banshee-items-center ui-banshee-rounded-sm ui-banshee-px-2 ui-banshee-py-1.5 ui-banshee-text-sm ui-banshee-outline-none data-[disabled=true]:ui-banshee-pointer-events-none data-[selected=true]:ui-banshee-bg-accent data-[selected=true]:ui-banshee-text-accent-foreground data-[disabled=true]:ui-banshee-opacity-50 [&_svg]:ui-banshee-pointer-events-none [&_svg]:ui-banshee-size-4 [&_svg]:ui-banshee-shrink-0',
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ui-banshee-ml-auto ui-banshee-text-xs ui-banshee-tracking-widest ui-banshee-text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
