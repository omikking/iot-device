'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  LucideX,
  LucideKey,
  LucidePickaxe,
  LucideUser,
  Check,
  X,
  Ban,
  LucideFilter,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Text } from './text';
import { Badge } from './badge';
import { Checkbox } from './checkbox';
import { ArrowDown } from '../svg/arrow-down';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';

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
  variant?: ButtonVariant;
  onSelect?: (id?: string) => void;
}

export interface DropdownMultiSelectSearchProps {
  id: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: DropdownItem[];
  selectedIds?: string[];
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  onSelect?: (ids: string[]) => void;
}

export interface DropdownSearchProps {
  id: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: DropdownItem[];
  selectedId?: string;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  onSelect?: (id?: string) => void;
}

export type ButtonVariant = 'default' | 'compact';

export const buttonStyling = (variant: ButtonVariant = 'default') =>
  cn(
    'ui-banshee-flex hover:ui-banshee-bg-main-white/50 ui-banshee-justify-between ui-banshee-items-center ui-banshee-w-full ui-banshee-px-4 ui-banshee-text-md ui-banshee-font-sandvik-text ui-banshee-text-main-black placeholder:ui-banshee-text-neutral-5 ui-banshee-outline-none ui-banshee-transition ease-in-out ui-banshee-duration-200 disabled:ui-banshee-bg-neutral-2 disabled:ui-banshee-text-neutral-5 disabled:ui-banshee-border-transparent disabled:ui-banshee-pointer-events-none',
    variant === 'default'
      ? 'ui-banshee-h-12 ui-banshee-bg-main-white hover:ui-banshee-border-blue-primary focus:ui-banshee-border-blue-primary'
      : 'ui-banshee-h-9 ui-banshee-bg-neutral-2',
  );

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
      variant = 'default',
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
              className={buttonStyling(variant)}
            >
              {isBadge && selectedItem?.name ? (
                <Badge size="small" className="ui-banshee-mr-2">
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

const DropdownMultiSelectSearch = React.forwardRef<
  HTMLDivElement,
  DropdownMultiSelectSearchProps
>(
  (
    {
      id,
      placeholder = 'Select',
      searchPlaceholder = '...',
      options,
      selectedIds = [],
      disabled,
      className,
      onSelect,
      variant = 'default',
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [search, setSearch] = useState('');
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>(
      selectedIds || [],
    );

    const handleClear = () => {
      setSelectedItemIds([]);
    };

    const handleConfirm = () => {
      onSelect && onSelect(selectedItemIds);
      setIsOpen(false);
    };

    const handleCancel = () => {
      setSelectedItemIds(selectedIds || []);
      setSearch('');
      setIsOpen(false);
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
                buttonStyling(variant),
                isOpen && 'ui-banshee-rounded-b-none',
              )}
            >
              {selectedItemIds.length === 0 ? (
                <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-1.5">
                  <LucideFilter
                    size={11}
                    className="ui-banshee-text-neutral-5"
                  />
                  <Text
                    variant="small"
                    color="foreground"
                    className="ui-banshee-font-bold"
                  >
                    {placeholder}
                  </Text>
                </div>
              ) : (
                <Text
                  variant="small"
                  color="foreground"
                  className="ui-banshee-font-bold"
                >
                  {getDisplayText()}
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
            className="ui-banshee-w-[--radix-popover-trigger-width] ui-banshee-min-w-[200px] ui-banshee-p-0 ui-banshee-mt-[-4px]"
          >
            <Command>
              <CommandInput
                placeholder={searchPlaceholder}
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
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
                      }}
                    >
                      <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-3 ui-banshee-w-full">
                        <Checkbox
                          checked={selectedItemIds.includes(option.id)}
                        />
                        <Text variant="medium" color="foreground">
                          {option.name}
                        </Text>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <div className="ui-banshee-flex ui-banshee-p-2 ui-banshee-justify-between ui-banshee-items-center ui-banshee-gap-2  ui-banshee-border-t ui-banshee-border-neutral-3">
              <Button
                type="button"
                variant="ghost"
                size="small"
                tabIndex={-1}
                onClick={handleClear}
                className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-1 ui-banshee-text-sm"
              >
                <X className="ui-banshee-h-4 ui-banshee-w-4" />
                Clear
              </Button>
              <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="ui-banshee-p-1 ui-banshee-rounded hover:ui-banshee-bg-neutral-1 ui-banshee-transition"
                >
                  <Ban className="ui-banshee-h-4 ui-banshee-w-4 ui-banshee-text-neutral-5" />
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="ui-banshee-p-1 ui-banshee-rounded hover:ui-banshee-bg-neutral-1 ui-banshee-transition"
                >
                  <Check className="ui-banshee-h-4 ui-banshee-w-4 ui-banshee-text-main-black" />
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
DropdownMultiSelectSearch.displayName = 'DropdownMultiSelectSearch';

const DropdownSearch = React.forwardRef<HTMLDivElement, DropdownSearchProps>(
  (
    {
      id,
      placeholder = 'Select',
      searchPlaceholder = '...',
      options,
      selectedId,
      disabled,
      className,
      onSelect,
      variant = 'default',
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState<DropdownItem | undefined>(
      selectedId ? options?.find((item) => item.id === selectedId) : undefined,
    );

    const handleClear = () => {
      setSelectedItem(undefined);
    };

    const handleConfirm = () => {
      onSelect && onSelect(selectedItem?.id);
      setIsOpen(false);
    };

    const handleCancel = () => {
      const originalItem = selectedId
        ? options?.find((item) => item.id === selectedId)
        : undefined;
      setSelectedItem(originalItem);
      setSearch('');
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
              className={cn(
                buttonStyling(variant),
                isOpen && 'ui-banshee-rounded-b-none',
              )}
            >
              <Text
                variant="medium"
                color={disabled || !selectedItem?.name ? 'muted' : 'foreground'}
              >
                {selectedItem?.name || placeholder}
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
            className="ui-banshee-w-[--radix-popover-trigger-width] ui-banshee-min-w-[200px] ui-banshee-p-0 ui-banshee-mt-[-4px]"
          >
            <Command>
              <CommandInput
                placeholder={searchPlaceholder}
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.name}
                      onSelect={() => {
                        setSelectedItem(option);
                      }}
                      className={cn(
                        selectedItem?.id === option.id &&
                          'ui-banshee-bg-neutral-1',
                      )}
                    >
                      <Text variant="medium" color="foreground">
                        {option.name}
                      </Text>
                      {selectedItem?.id === option.id && (
                        <Check className="ui-banshee-ml-auto ui-banshee-h-4 ui-banshee-w-4 ui-banshee-text-main-black" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <div className="ui-banshee-flex ui-banshee-p-2 ui-banshee-justify-between ui-banshee-items-center ui-banshee-gap-2 ui-banshee-border-t ui-banshee-border-neutral-3">
              <Button
                type="button"
                variant="ghost"
                size="small"
                tabIndex={-1}
                onClick={handleClear}
                className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-1 ui-banshee-text-sm"
              >
                <X className="ui-banshee-h-4 ui-banshee-w-4" />
                Clear
              </Button>
              <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="ui-banshee-p-1 ui-banshee-rounded hover:ui-banshee-bg-neutral-1 ui-banshee-transition"
                >
                  <Ban className="ui-banshee-h-4 ui-banshee-w-4 ui-banshee-text-neutral-5" />
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="ui-banshee-p-1 ui-banshee-rounded hover:ui-banshee-bg-neutral-1 ui-banshee-transition"
                >
                  <Check className="ui-banshee-h-4 ui-banshee-w-4 ui-banshee-text-main-black" />
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);
DropdownSearch.displayName = 'DropdownSearch';

export {
  Dropdown,
  dropdownVariants,
  DropdownMultiSelectSearch,
  DropdownSearch,
};
