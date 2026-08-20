'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Text } from './text';
import { Checkbox } from './checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';

import { ArrowDown } from '../svg/arrow-down';

export type FilterDropdownItem = {
  id: string;
  name: string;
  iconLabel?: string;
  background?: 'primary' | 'neutral';
};

export type FilterDropdownProps = {
  id: string;
  placeholder?: string;
  options: FilterDropdownItem[];
  selectedIds?: string[];
  className?: string;
  disabled?: boolean;
  onSelect?: (ids: string[]) => void;
};

const buttonStyling =
  'ds-flex ds-justify-between ds-items-center ds-h-12 ds-border ds-border-neutral-3 ds-rounded ds-w-full ds-bg-main-white ds-px-4 ds-text-md ds-font-sandvik-text ds-text-main-black placeholder:ds-text-neutral-5 ds-outline-none hover:ds-border-blue-primary focus:ds-border-blue-primary ds-transition ease-in-out ds-duration-200 disabled:ds-bg-neutral-2 disabled:ds-text-neutral-5 disabled:ds-border-transparent disabled:ds-pointer-events-none';

const FilterDropdown = React.forwardRef<HTMLDivElement, FilterDropdownProps>(
  (
    {
      id,
      placeholder = 'Select',
      options,
      selectedIds = [],
      disabled,
      className,
      onSelect,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [search, setSearch] = useState('');
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
      selectedIds || [],
    );

    const handleReset = () => {
      setSelectedItemIds([]);
      onSelect && onSelect([]);
    };

    const getDisplayText = () => {
      if (selectedItemIds.length === 0) return placeholder;
      if (selectedItemIds.length === 1) {
        const item = options.find((opt) => opt.id === selectedItemIds[0]);
        return item?.name || placeholder;
      }
      return `${selectedItemIds.length} selected`;
    };

    useEffect(() => {
      if (selectedIds && options) {
        const newSelectedIds = options.find((item) =>
          selectedIds.includes(item.id),
        )?.id;
        newSelectedIds && setSelectedItemIds(selectedIds);
      } else {
        setSelectedItemIds([]);
      }
    }, [selectedIds, options]);

    return (
      <div className={cn('relative', className)} {...props} ref={ref}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              id={id}
              aria-label="Toggle dropdown"
              aria-haspopup="true"
              aria-expanded={isOpen}
              type="button"
              disabled={disabled}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              className={cn(
                buttonStyling,
                isOpen && 'ds-rounded-b-none',
              )}
            >
              <Text
                variant="medium"
                color={
                  disabled || selectedItemIds.length === 0
                    ? 'muted'
                    : 'foreground'
                }
              >
                {getDisplayText()}
              </Text>
              <ArrowDown
                height={12}
                width={12}
                className={cn(
                  'ds-transform ds-duration-200 ease-in-out ds-mt-0.5',
                  isOpen && 'ds-rotate-180',
                )}
              />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className="ds-w-[var(--radix-popover-trigger-width)] ds-p-0 ds-mt-[-4px]"
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
                        const newSelectedIds = selectedItemIds.includes(
                          option.id,
                        )
                          ? selectedItemIds.filter((id) => id !== option.id)
                          : [...selectedItemIds, option.id];
                        setSelectedItemIds(newSelectedIds);
                        onSelect && onSelect(newSelectedIds);
                      }}
                    >
                      <div className="ds-flex ds-items-center ds-gap-2">
                        <Checkbox
                          checked={selectedItemIds.includes(option.id)}
                        />
                        {option.name}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <div className="ds-flex ds-row ds-justify-between ds-gap-2 ds-px-3 ds-border-t ds-border-neutral-3">
              <div>
                <Button
                  type="button"
                  tabIndex={-1}
                  onClick={() => {
                    handleReset();
                    setSearch('');
                    setIsOpen(false);
                  }}
                >
                  <Text variant="small" color="foreground">
                    X Clear
                  </Text>
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  tabIndex={-1}
                  onClick={() => {
                    setIsOpen(true);
                    setSearch('');
                  }}
                >
                  <Text variant="small" color="foreground">
                    Ø
                  </Text>
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
FilterDropdown.displayName = 'FilterDropdown';

export { FilterDropdown };
