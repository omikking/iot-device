'use client';
import * as React from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
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
import { useState, forwardRef } from 'react';
import { ArrowDown } from '../svg/arrow-down';

import { cn } from '../../lib/utils';

export type ComboboxItem = {
  // TODO Add id and other props
  id: string;
  name: string;
};

export interface ComboboxProps {
  id: string;
  placeholder?: string;
  options: ComboboxItem[];
  selectedId?: string;
  isResettable?: boolean;
  className?: string;
  disabled?: boolean;
  isBadge?: boolean;
  badgeIcon?: boolean;
  badgeVariant?: 'primary' | 'neutral';
  onSelect?: (id?: string) => void;
}

export const buttonStyling =
  'ui-banshee-flex ui-banshee-justify-between ui-banshee-items-center ui-banshee-h-12 ui-banshee-border ui-banshee-border-neutral-3 ui-banshee-rounded ui-banshee-w-full ui-banshee-bg-main-white ui-banshee-px-4 ui-banshee-text-md ui-banshee-font-sandvik-text ui-banshee-text-main-black placeholder:ui-banshee-text-neutral-5 ui-banshee-outline-none hover:ui-banshee-border-blue-primary focus:ui-banshee-border-blue-primary ui-banshee-transition ease-in-out ui-banshee-duration-200 disabled:ui-banshee-bg-neutral-2 disabled:ui-banshee-text-neutral-5 disabled:ui-banshee-border-transparent disabled:ui-banshee-pointer-events-none';

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      id,
      placeholder = 'Select',
      options,
      selectedId,
      disabled,
      isResettable,
      className,
      onSelect,
      isBadge,
      badgeIcon,
      // badgeVariant = 'primary',
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [search, setSearch] = useState('');

    return (
      <div className={cn('relative', className)} {...props} ref={ref}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              role="combobox"
              aria-expanded={open}
              className={buttonStyling}
            >
              {value
                ? options.find((option) => option.id === value)?.name
                : 'Select...'}
              <ArrowDown
                height={12}
                width={12}
                className={cn(
                  'ui-banshee-transform ui-banshee-duration-200 ease-in-out ui-banshee-mt-0.5',
                  open && 'ui-banshee-rotate-180',
                )}
              />
            </Button>
            {/* </button> */}
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="ui-banshee-w-[var(--radix-popover-trigger-width)]  ui-banshee-p-0"
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
                        const newValue = value === option.id ? '' : option.id;
                        setValue(newValue);
                        onSelect?.(newValue || undefined);
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          'ui-banshee-mr-2 ui-banshee-h-4 ui-banshee-w-4',
                          value === option.id
                            ? 'ui-banshee-opacity-100'
                            : 'ui-banshee-opacity-0',
                        )}
                      />
                      {option.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              <CommandSeparator />
            </Command>
            <div className="ui-banshee-flex ui-banshee-row ui-banshee-justify-between ui-banshee-gap-2 ui-banshee-p-2 ui-banshee-border-t ui-banshee-border-neutral-2">
              <div>
                <Button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setValue('');
                    onSelect?.(undefined);
                    setOpen(false);
                  }}
                  className="ui-banshee-w-full ui-banshee-px-3 ui-banshee-py-2 ui-banshee-text-left ui-banshee-text-sm hover:ui-banshee-bg-neutral-1 ui-banshee-rounded ui-banshee-transition"
                >
                  Clear
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    // onSelect?.(undefined);
                    setOpen(open);
                  }}
                  className="ui-banshee-w-full ui-banshee-px-3 ui-banshee-py-2 ui-banshee-text-left ui-banshee-text-sm hover:ui-banshee-bg-neutral-1 ui-banshee-rounded ui-banshee-transition"
                >
                  Reset
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
