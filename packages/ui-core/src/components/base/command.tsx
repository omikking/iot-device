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
      'ds-flex ds-h-full ds-w-full ds-flex-col ds-overflow-hidden ds-rounded-md ds-bg-popover ds-text-popover-foreground',
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="ds-overflow-hidden ds-p-0 ds-shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:ds-px-2 [&_[cmdk-group-heading]]:ds-font-medium [&_[cmdk-group-heading]]:ds-text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:ds-pt-0 [&_[cmdk-group]]:ds-px-2 [&_[cmdk-input-wrapper]_svg]:ds-h-5 [&_[cmdk-input-wrapper]_svg]:ds-w-5 [&_[cmdk-input]]:ds-h-12 [&_[cmdk-item]]:ds-px-2 [&_[cmdk-item]]:ds-py-3 [&_[cmdk-item]_svg]:ds-h-5 [&_[cmdk-item]_svg]:ds-w-5">
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
    className="ds-flex ds-items-center ds-border-b ds-border-neutral-3 ds-px-3"
    data-cmdk-input-wrapper=""
  >
    {/* <Search className="ds-mr-2 ds-h-4 ds-w-4 ds-shrink-0 ds-opacity-50" /> */}
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'ds-flex ds-h-6 ds-w-full ds-rounded-md ds-bg-transparent ds-py-3 ds-text-sm ds-outline-none placeholder:ds-text-muted-foreground disabled:ds-cursor-not-allowed disabled:ds-opacity-50',
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
      'ds-max-h-[300px] ds-overflow-y-auto ds-overflow-x-hidden',
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
    className="ds-py-6 ds-text-center ds-text-sm"
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
      'ds-overflow-hidden ds-p-1 ds-text-foreground [&_[cmdk-group-heading]]:ds-px-2 [&_[cmdk-group-heading]]:ds-py-1.5 [&_[cmdk-group-heading]]:ds-text-xs [&_[cmdk-group-heading]]:ds-font-medium [&_[cmdk-group-heading]]:ds-text-muted-foreground',
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
      // 'ds--mx-1 ds-h-px ds-bg-border',
      'ds-w-72 ds--mx-1 ds-h-px',
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
      'ds-relative ds-flex ds-cursor-default ds-gap-2 ds-select-none ds-items-center ds-rounded-sm ds-px-2 ds-py-1.5 ds-text-sm ds-outline-none data-[disabled=true]:ds-pointer-events-none data-[selected=true]:ds-bg-accent data-[selected=true]:ds-text-accent-foreground data-[disabled=true]:ds-opacity-50 [&_svg]:ds-pointer-events-none [&_svg]:ds-size-4 [&_svg]:ds-shrink-0',
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
        'ds-ml-auto ds-text-xs ds-tracking-widest ds-text-muted-foreground',
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
