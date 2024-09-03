'use client';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { LucideChevronDown } from 'lucide-react';
import { Text } from './text';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DropdownItem {
  id: string;
  name: string;
}

export interface DropdownProps {
  id: string;
  placeholder?: string;
  options: DropdownItem[];
  selectedId?: string;
  className?: string;
  disabled?: boolean;
  onSelect?: (id: string) => void;
}

export const buttonStyling =
  'flex justify-between items-center ui-h-12 ui-border ui-border-neutral-3 ui-rounded ui-w-full ui-bg-main-white ui-px-4 ui-text-md ui-font-sandvik-text ui-text-main-black placeholder:ui-text-neutral-5 ui-outline-none hover:ui-border-blue-primary focus:ui-border-blue-primary ui-transition ease-in-out ui-duration-200 disabled:ui-bg-neutral-2 disabled:ui-text-neutral-5 disabled:ui-border-none disabled:ui-pointer-events-none';

const dropdownItemStyling =
  'flex items-center cursor-pointer hover:ui-bg-neutral-1 ui-px-6 ui-py-3 ui-transform ui-duration-200 ease-in-out';

const dropdownVariants =
  'ui-bg-main-white w-max ui-py-3 ui-overflow-y-auto ui-rounded ui-shadow-md ui-max-h-56 ui-z-10';

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      id,
      placeholder = 'Select',
      options,
      selectedId,
      disabled,
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

    const handleChange = (item: DropdownItem) => {
      setSelectedItem(item);
      onSelect && onSelect(item.id);
      setIsOpen(false);
    };

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
            className="ui-w-auto flex flex-col ui-items-end"
            align="start"
          >
            <div
              aria-label="Dropdown menu"
              className={cn(dropdownVariants, className)}
            >
              <ul
                role="menu"
                aria-labelledby={id}
                aria-orientation="vertical"
                className="ui-w-full"
              >
                {options?.map((item) => (
                  <li
                    aria-hidden="true"
                    key={item.id}
                    onClick={() => {
                      handleChange(item);
                    }}
                    className={cn(
                      dropdownItemStyling,
                      selectedItem?.id === item.id && 'ui-bg-neutral-1',
                    )}
                  >
                    <Text variant="medium" color="foreground">
                      {item.name}
                    </Text>
                  </li>
                ))}
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
