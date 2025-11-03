'use client';
import * as React from 'react';
import { CheckIcon } from 'lucide-react';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useState, forwardRef, useEffect } from 'react';
import { ArrowDown } from '../svg/arrow-down';

import { cn } from '../../lib/utils';
import { Label } from './label';

export type ComboboxItem = {
  // TODO Add id and other props
  id: string;
  name: string;
};

export interface ComboboxProps {
  id: string;
  placeholder?: string;
  options: ComboboxItem[];
  dropdownLabel?: string;
  selectedId?: string;
  isResettable?: boolean;
  className?: string;
  disabled?: boolean;
  isBadge?: boolean;
  badgeIcon?: boolean;
  badgeVariant?: 'primary' | 'neutral';
  onSelect?: (id?: string) => void;
}

const buttonStyling =
  'ui-banshee-flex ui-banshee-justify-between ui-banshee-items-center ui-banshee-h-12 ui-banshee-border ui-banshee-border-neutral-3 ui-banshee-rounded ui-banshee-w-full ui-banshee-bg-main-white ui-banshee-px-4 ui-banshee-text-md ui-banshee-font-sandvik-text ui-banshee-text-main-black placeholder:ui-banshee-text-neutral-5 ui-banshee-outline-none hover:ui-banshee-border-blue-primary focus:ui-banshee-border-blue-primary ui-banshee-transition ease-in-out ui-banshee-duration-200 disabled:ui-banshee-bg-neutral-2 disabled:ui-banshee-text-neutral-5 disabled:ui-banshee-border-transparent disabled:ui-banshee-pointer-events-none';

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      id,
      placeholder = 'Select...',
      options,
      selectedId,
      disabled,
      dropdownLabel = 'Select an option',
      className,
      onSelect,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const [selectedItem, setSelectedItem] = useState<ComboboxItem | undefined>(
      selectedId ? options?.find((item) => item.id === selectedId) : undefined,
    );

    // Required to reset
    useEffect(() => {
      if (selectedId && options) {
        const newSelectedItem = options.find((item) => item.id === selectedId);
        newSelectedItem && setSelectedItem(newSelectedItem);
      } else {
        setSelectedItem(undefined);
      }
    }, [selectedId, options]);

    return (
      <div className={cn('relative', className)} {...props} ref={ref}>
        <Popover open={open} onOpenChange={setOpen}>
          <Label className="">{dropdownLabel}</Label>
          <PopoverTrigger asChild>
            <Button
              id={id}
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                buttonStyling,
                open && 'ui-banshee-rounded-b-none',
                !selectedItem && 'ui-banshee-text-neutral-5',
              )}
            >
              {selectedItem?.name || placeholder}

              <ArrowDown
                height={12}
                width={12}
                className={cn(
                  'ui-banshee-transform ui-banshee-duration-200 ease-in-out ui-banshee-mt-0.5',
                  open && 'ui-banshee-rotate-180',
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="ui-banshee-w-[var(--radix-popover-trigger-width)]  ui-banshee-p-0 ui-banshee-mt-[-4px]"
          >
            <Command>
              <CommandInput
                placeholder="Search..."
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>Input not found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.name}
                      onSelect={() => {
                        const newItem =
                          selectedItem?.id === option.id ? undefined : option;
                        setSelectedItem(newItem);
                        onSelect?.(newItem?.id);
                        setOpen(false);
                      }}
                    >
                      {option.name}
                      <CheckIcon
                        className={cn(
                          'ui-banshee-mr-2 ui-banshee-h-4 ui-banshee-w-4',
                          selectedItem?.id === option.id
                            ? 'ui-banshee-opacity-100'
                            : 'ui-banshee-opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              <CommandSeparator />
            </Command>
            {/* TODO Fix all import of Icons */}
            <div className="ui-banshee-flex ui-banshee-row ui-banshee-justify-between ui-banshee-gap-2 ui-banshee-px-3 ui-banshee-border-t ui-banshee-border-neutral-3">
              <div>
                <Button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSelectedItem(undefined);
                    onSelect?.(undefined);
                    setOpen(false);
                  }}
                  className="ui-banshee-flex ui-banshee-gap-1 ui-banshee-w-full ui-banshee-py-1 ui-banshee-text-left ui-banshee-text-sm hover:ui-banshee-bg-neutral-1 ui-banshee-rounded ui-banshee-transition"
                >
                  {/* <ArrowDown height={12} width={12} /> */}X Clear
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setOpen(open);
                  }}
                  className="ui-banshee-flex ui-banshee-gap-1 ui-banshee-w-full ui-banshee-py-1 ui-banshee-text-left ui-banshee-text-sm hover:ui-banshee-bg-neutral-1 ui-banshee-rounded ui-banshee-transition"
                >
                  {/* TODO replace with real icon */}ø
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

Combobox.displayName = 'Combobox';
