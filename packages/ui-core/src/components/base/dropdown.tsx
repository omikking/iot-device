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
    'ds-flex hover:ds-bg-main-white/50 ds-justify-between ds-items-center ds-w-full ds-px-4 ds-text-md ds-font-sandvik-text ds-text-main-black placeholder:ds-text-neutral-5 ds-outline-none ds-transition ease-in-out ds-duration-200 disabled:ds-bg-neutral-2 disabled:ds-text-neutral-5 disabled:ds-border-transparent disabled:ds-pointer-events-none',
    variant === 'default'
      ? 'ds-h-12 ds-bg-main-white hover:ds-border-blue-primary focus:ds-border-blue-primary'
      : 'ds-h-9 ds-bg-neutral-1 hover:ds-bg-main-white/50',
  );

const dropdownItemStyling =
  'ds-flex ds-items-center cursor-pointer hover:ds-bg-neutral-1 ds-px-6 ds-py-3 ds-transform ds-duration-200 ease-in-out';

const dropdownVariants =
  'ds-w-full ds-bg-main-white w-max ds-py-3 ds-overflow-y-auto ds-rounded ds-shadow-md ds-max-h-56 ds-z-10';

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
                <Badge size="small" className="ds-mr-2">
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
                  'ds-transform ds-duration-200 ease-in-out ds-mt-0.5',
                  isOpen && 'ds-rotate-180',
                )}
              />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className="ds-w-[var(--radix-popover-trigger-width)]"
          >
            <div aria-label="Dropdown menu" className={dropdownVariants}>
              <ul role="menu" aria-labelledby={id} aria-orientation="vertical">
                {isResettable && options?.length > 0 && (
                  <div className="ds-px-5 ds-pb-3 ds-border-b ds-border-neutral-2">
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
                        'ds-bg-neutral-1 ds-cursor-default ds-pointer-events-none',
                    )}
                  >
                    {isBadge ? (
                      <Badge
                        // variant={item?.background || 'primary'}
                        size="small"
                        className="ds-mr-2"
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
                      'ds-bg-neutral-1',
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
                isOpen && 'ds-rounded-b-none',
                selectedItemIds.length > 0 && '!ds-bg-neutral-2',
              )}
            >
              {selectedItemIds.length === 0 ? (
                <div className="ds-flex ds-items-center ds-gap-1.5">
                  <Text
                    variant="small"
                    color="foreground"
                    className="ds-font-bold"
                  >
                    {placeholder}
                  </Text>
                </div>
              ) : (
                <Text
                  variant="small"
                  color="foreground"
                  className="ds-font-bold ds-truncate ds-min-w-0"
                >
                  {getDisplayText()}
                </Text>
              )}
              <ArrowDown
                height={12}
                width={12}
                className={cn(
                  'ds-transform ds-duration-200 ease-in-out ds-mt-0.5 ds-shrink-0',
                  isOpen && 'ds-rotate-180',
                )}
              />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className="ds-w-[var(--radix-popover-trigger-width)] ds-min-w-[200px] ds-p-0 ds-mt-[-4px]"
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
                      <div className="ds-flex ds-items-center ds-gap-3 ds-w-full">
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
            <div className="ds-flex ds-p-2 ds-justify-between ds-items-center ds-gap-2  ds-border-t ds-border-neutral-3">
              <Button
                type="button"
                variant="outline"
                size="small"
                tabIndex={-1}
                onClick={handleClear}
                className="ds-flex ds-items-center ds-gap-1 ds-text-sm"
              >
                <X className="ds-h-4 ds-w-4" />
                Clear
              </Button>
              <div className="ds-flex ds-items-center ds-gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="ds-p-1 ds-rounded hover:ds-bg-neutral-1 ds-transition"
                >
                  <Ban className="ds-h-4 ds-w-4 ds-text-neutral-5" />
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="ds-p-1 ds-rounded hover:ds-bg-neutral-1 ds-transition"
                >
                  <Check className="ds-h-4 ds-w-4 ds-text-main-black" />
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
                isOpen && 'ds-rounded-b-none',
                'ds-h-full ds-rounded',
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
                  'ds-transform ds-duration-200 ease-in-out ds-mt-0.5',
                  isOpen && 'ds-rotate-180',
                )}
              />
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className="ds-w-[var(--radix-popover-trigger-width)] ds-min-w-[200px] ds-p-0 ds-mt-[-4px]"
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
                          'ds-bg-neutral-1',
                      )}
                    >
                      <Text variant="medium" color="foreground">
                        {option.name}
                      </Text>
                      {selectedItem?.id === option.id && (
                        <Check className="ds-ml-auto ds-h-4 ds-w-4 ds-text-main-black" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <div className="ds-flex ds-p-2 ds-justify-between ds-items-center ds-gap-2 ds-border-t ds-border-neutral-3">
              <Button
                type="button"
                variant="outline"
                size="small"
                tabIndex={-1}
                onClick={handleClear}
                className="ds-flex ds-items-center ds-gap-1 ds-text-sm"
              >
                <X className="ds-h-4 ds-w-4" />
                Clear
              </Button>
              <div className="ds-flex ds-items-center ds-gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="ds-p-1 ds-rounded hover:ds-bg-neutral-1 ds-transition"
                >
                  <Ban className="ds-h-4 ds-w-4 ds-text-neutral-5" />
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="ds-p-1 ds-rounded hover:ds-bg-neutral-1 ds-transition"
                >
                  <Check className="ds-h-4 ds-w-4 ds-text-main-black" />
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
