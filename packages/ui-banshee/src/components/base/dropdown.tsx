'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { LucideX, LucideKey, LucidePickaxe, LucideUser } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Text } from './text';
import { Badge } from './badge';
import { ArrowDown } from '../svg/arrow-down';

export interface DropdownItem {
  id: string;
  name: string;
  iconLabel?: string;
  background?: 'primary' | 'neutral';
}

export interface DropdownProps {
  id: string;
  placeholder?: string;
  options: DropdownItem[];
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

const dropdownItemStyling =
  'ui-banshee-flex ui-banshee-items-center cursor-pointer hover:ui-banshee-bg-neutral-1 ui-banshee-px-6 ui-banshee-py-3 ui-banshee-transform ui-banshee-duration-200 ease-in-out';

const dropdownVariants =
  'ui-banshee-w-full ui-banshee-bg-main-white w-max ui-banshee-py-3 ui-banshee-overflow-y-auto ui-banshee-rounded ui-banshee-shadow-md ui-banshee-max-h-56 ui-banshee-z-10';

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
      isBadge,
      badgeIcon,
      // badgeVariant = 'primary',
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
      onSelect && onSelect(item?.id);
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

    const iconHandler = (iconLabel: string) => {
      switch (iconLabel) {
        case 'company user':
          return <LucideUser />;
        case 'company admin':
          return <LucideKey />;
        case 'sandvik technician':
          return <LucidePickaxe />;
        case 'sandvik admin':
          return <LucideKey />;
        default:
          return null;
      }
    };

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
              {isBadge && selectedItem?.name ? (
                <Badge
                  // variant={selectedItem?.background || badgeVariant}
                  size="small"
                  className="ui-banshee-mr-2"
                >
                  {selectedItem.iconLabel &&
                    iconHandler(selectedItem.iconLabel.toLowerCase())}
                  {selectedItem?.name}
                </Badge>
              ) : (
                <Text
                  variant="medium"
                  color={
                    disabled || !selectedItem?.name ? 'muted' : 'foreground'
                  }
                >
                  {selectedItem?.name || placeholder}
                </Text>
              )}
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
            className="ui-banshee-w-[--radix-popover-trigger-width]"
          >
            <div aria-label="Dropdown menu" className={dropdownVariants}>
              <ul role="menu" aria-labelledby={id} aria-orientation="vertical">
                {isResettable && options?.length > 0 && (
                  <div className="ui-banshee-px-5 ui-banshee-pb-3 ui-banshee-border-b ui-banshee-border-neutral-2">
                    <Button
                      // isWide
                      // variant="outline"
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
                        'ui-banshee-bg-neutral-1 ui-banshee-cursor-default ui-banshee-pointer-events-none',
                    )}
                  >
                    {isBadge ? (
                      <Badge
                        // variant={item?.background || 'primary'}
                        size="small"
                        className="ui-banshee-mr-2"
                      >
                        {badgeIcon && item?.iconLabel
                          ? iconHandler(item.iconLabel.toLowerCase())
                          : null}
                        {item.name}
                      </Badge>
                    ) : (
                      <Text variant="medium" color="foreground">
                        {item.name}
                      </Text>
                    )}
                  </li>
                ))}
                {options?.length === 0 && (
                  <li
                    aria-hidden="true"
                    className={cn(
                      dropdownItemStyling,
                      'ui-banshee-bg-neutral-1',
                    )}
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
