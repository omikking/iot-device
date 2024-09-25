'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { LucideChevronDown, LucideX } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Text } from './text';

export interface DropdownItem {
  id: string;
  name: string;
}

export interface DropdownProps {
  id: string;
  placeholder?: string;
  options: DropdownItem[];
  selectedId?: string;
  isResettable?: boolean;
  className?: string;
  disabled?: boolean;
  onSelect?: (id?: string) => void;
}

export const buttonStyling =
  'flex justify-between items-center ui-h-12 ui-border ui-border-neutral-3 ui-rounded ui-w-full ui-bg-main-white ui-px-4 ui-text-md ui-font-sandvik-text ui-text-main-black placeholder:ui-text-neutral-5 ui-outline-none hover:ui-border-blue-primary focus:ui-border-blue-primary ui-transition ease-in-out ui-duration-200 disabled:ui-bg-neutral-2 disabled:ui-text-neutral-5 disabled:ui-border-transparent disabled:ui-pointer-events-none';

const dropdownItemStyling =
  'flex items-center cursor-pointer hover:ui-bg-neutral-1 ui-px-6 ui-py-3 ui-transform ui-duration-200 ease-in-out';

const dropdownVariants =
  'ui-w-full ui-bg-main-white w-max ui-py-3 ui-overflow-y-auto ui-rounded ui-shadow-md ui-max-h-56 ui-z-10';

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
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
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [selectedItem, setSelectedItem] = useState<DropdownItem | undefined>(
      selectedId ? options?.find((item) => item.id === selectedId) : undefined,
    );

    const handleChange = (item?: DropdownItem) => {
      setSelectedItem(item);
      onSelect && onSelect(item?.name);
      setIsOpen(false);
    };

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
              className={buttonStyling}
            >
              <Text
                variant="medium"
                color={disabled || !selectedItem?.name ? 'muted' : 'foreground'}
              >
                {selectedItem?.name || placeholder}
              </Text>
              <LucideChevronDown
                size="22"
                className={cn(
                  'ui-transform ui-duration-200 ease-in-out ui-mt-0.5',
                  isOpen && 'ui-rotate-180',
                )}
              />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className="ui-w-[--radix-popover-trigger-width]"
          >
            <div aria-label="Dropdown menu" className={dropdownVariants}>
              <ul role="menu" aria-labelledby={id} aria-orientation="vertical">
                {isResettable && options?.length > 0 && (
                  <div className="ui-px-5 ui-pb-3 ui-border-b ui-border-neutral-2">
                    <Button
                      isWide
                      variant="outline"
                      size="small"
                      disabled={!selectedItem}
                      tabIndex={-1}
                      onClick={() => {
                        handleChange(undefined);
                      }}
                    >
                      <LucideX />
                      Reset value
                    </Button>
                  </div>
                )}

                {options?.map((item) => (
                  <li
                    aria-hidden="true"
                    key={item.id}
                    onClick={() => {
                      handleChange(item);
                    }}
                    className={cn(
                      dropdownItemStyling,
                      selectedItem?.id === item.id &&
                        'ui-bg-neutral-1 ui-cursor-default ui-pointer-events-none',
                    )}
                  >
                    <Text variant="medium" color="foreground">
                      {item.name}
                    </Text>
                  </li>
                ))}
                {options?.length === 0 && (
                  <li
                    aria-hidden="true"
                    className={cn(dropdownItemStyling, 'ui-bg-neutral-1')}
                  >
                    <Text variant="medium" color="muted">
                      No available options to select
                    </Text>
                  </li>
                )}
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
Dropdown.displayName = 'Dropdown';

export { Dropdown, dropdownVariants };
