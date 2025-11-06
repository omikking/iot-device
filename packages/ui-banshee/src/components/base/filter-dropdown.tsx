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
  'flex justify-between items-center ui-h-12 ui-border ui-border-neutral-3 ui-rounded ui-w-full ui-bg-main-white ui-px-4 ui-text-md ui-font-sandvik-text ui-text-main-black placeholder:ui-text-neutral-5 ui-outline-none hover:ui-border-blue-primary focus:ui-border-blue-primary ui-transition ease-in-out ui-duration-200 disabled:ui-bg-neutral-2 disabled:ui-text-neutral-5 disabled:ui-border-transparent disabled:ui-pointer-events-none';

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
        setSelectedItemIds(selectedIds);
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
                isOpen && 'ui-banshee-rounded-b-none',
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
                  'ui-banshee-transform ui-banshee-duration-200 ease-in-out ui-banshee-mt-0.5',
                  isOpen && 'ui-banshee-rotate-180',
                )}
              />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className="ui-banshee-w-[--radix-popover-trigger-width]  ui-banshee-p-0 ui-banshee-mt-[-4px]"
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
                      <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-2">
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
            <div className="ui-banshee-flex ui-banshee-row ui-banshee-justify-between ui-banshee-gap-2 ui-banshee-px-3 ui-banshee-border-t ui-banshee-border-neutral-3">
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
            {/* <div aria-label="Dropdown menu" className={filterDropdownVariants}>

              <div className="ui-banshee-px-4 ui-banshee-py-2 ui-banshee-border-b ui-banshee-border-neutral-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  className="ui-banshee-w-full ui-banshee-px-3 ui-banshee-py-2 ui-banshee-border ui-banshee-border-neutral-3 ui-banshee-rounded ui-banshee-text-md ui-banshee-font-sandvik-text placeholder:ui-banshee-text-neutral-5 ui-banshee-outline-none focus:ui-banshee-border-blue-primary"
                />
              </div>

              <ul role="menu" aria-labelledby={id} aria-orientation="vertical">
                {isResettable && options?.length > 0 && (
                  <div className="ui-banshee-px-4 ui-banshee-py-2 ui-banshee-border-b ui-banshee-border-neutral-2">
                    <Button
                      size="small"
                      disabled={selectedItemIds.length === 0}
                      tabIndex={-1}
                      onClick={() => {
                        handleReset();
                      }}
                    >
                      <LucideX />
                      Clear
                    </Button>
                  </div>
                )}

                {filteredOptions?.map((item) => (
                  <li
                    key={item.id}
                    className={cn(dropdownItemStyling, 'ui-banshee-gap-3')}
                  >
                    <input
                      type="checkbox"
                      id={`checkbox-${item.id}`}
                      checked={selectedItemIds.includes(item.id)}
                      onChange={() => {
                        handleToggleItem(item.id);
                      }}
                      className="ui-banshee-cursor-pointer"
                    />
                    <label
                      htmlFor={`checkbox-${item.id}`}
                      className="ui-banshee-flex-1 ui-banshee-cursor-pointer"
                    >
                      <Text variant="medium" color="foreground">
                        {item.name}
                      </Text>
                    </label>
                  </li>
                ))}

                {filteredOptions?.length === 0 && (
                  <li
                    aria-hidden="true"
                    className={cn(
                      dropdownItemStyling,
                      'ui-banshee-bg-neutral-1',
                    )}
                  >
                    <Text variant="medium" color="muted">
                      No results found
                    </Text>
                  </li>
                )}
              </ul>
            </div> */}
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
FilterDropdown.displayName = 'FilterDropdown';

export { FilterDropdown };
