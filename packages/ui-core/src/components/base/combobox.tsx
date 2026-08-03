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
// import { Label } from './label';

export type ComboboxItem = {
  // TODO Add id and other props
  id: string;
  name: string;
};

export interface ComboboxProps {
  id: string;
  placeholder?: string;
  options: ComboboxItem[];
  // dropdownLabel?: string;
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
  'ds-flex ds-justify-between ds-items-center ds-h-12 ds-border ds-border-neutral-3 ds-rounded ds-w-full ds-bg-main-white ds-px-4 ds-text-md ds-font-sandvik-text ds-text-main-black placeholder:ds-text-neutral-5 ds-outline-none hover:ds-border-blue-primary focus:ds-border-blue-primary ds-transition ease-in-out ds-duration-200 disabled:ds-bg-neutral-2 disabled:ds-text-neutral-5 disabled:ds-border-transparent disabled:ds-pointer-events-none';

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      id,
      placeholder = 'Select...',
      options,
      selectedId,
      disabled,
      // dropdownLabel = 'Select an option',
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
          {/* <Label>{dropdownLabel}</Label> */}
          <PopoverTrigger asChild>
            <Button
              id={id}
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                buttonStyling,
                open && 'ds-rounded-b-none',
                !selectedItem && 'ds-text-neutral-5',
              )}
            >
              {selectedItem?.name || placeholder}

              <ArrowDown
                height={12}
                width={12}
                className={cn(
                  'ds-transform ds-duration-200 ease-in-out ds-mt-0.5',
                  open && 'ds-rotate-180',
                )}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="ds-w-[var(--radix-popover-trigger-width)]  ds-p-0 ds-mt-[-4px]"
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
                          'ds-mr-2 ds-h-4 ds-w-4',
                          selectedItem?.id === option.id
                            ? 'ds-opacity-100'
                            : 'ds-opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
              <CommandSeparator />
            </Command>
            {/* TODO Fix all import of Icons */}
            <div className="ds-flex ds-row ds-justify-between ds-gap-2 ds-px-3 ds-border-t ds-border-neutral-3">
              <div>
                <Button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSelectedItem(undefined);
                    onSelect?.(undefined);
                    setOpen(false);
                  }}
                  className="ds-flex ds-gap-1 ds-w-full ds-py-1 ds-text-left ds-text-sm hover:ds-bg-neutral-1 ds-rounded ds-transition"
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
                  className="ds-flex ds-gap-1 ds-w-full ds-py-1 ds-text-left ds-text-sm hover:ds-bg-neutral-1 ds-rounded ds-transition"
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
