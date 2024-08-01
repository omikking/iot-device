'use client';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import useOutsideClick from '../customHooks/use-outside-click';
import { cn } from '../lib/utils';
import { LucideChevronDown } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Text } from './text';

interface DropdownItem {
  id: string;
  name: string;
}

export interface DropdownProps
  extends Required<Pick<VariantProps<typeof dropdownVariants>, 'position'>> {
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

const dropdownVariants = cva(
  'absolute ui-mt-2 bg-main-white w-max ui-py-3 ui-overflow-y-auto ui-border ui-border-neutral-3 ui-rounded ui-shadow-md ui-max-h-56 ui-z-10',
  {
    variants: {
      position: {
        bottom: 'ui-top-full ui-right-0 ui-mt-2',
        top: 'ui-bottom-full ui-right-0 ui-mb-2',
      },
    },
    defaultVariants: {
      position: 'bottom',
    },
  },
);

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  ({
    id,
    placeholder = 'Select',
    options,
    position,
    selectedId,
    disabled,
    className,
    onSelect,
    ...props
  }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [selectedItem, setSelectedItem] = useState<DropdownItem | undefined>(
      selectedId ? options?.find((item) => item.id === selectedId) : undefined,
    );

    const handleChange = (item: DropdownItem) => {
      setSelectedItem(item);
      onSelect && onSelect(item.id);
      setIsOpen(false);
    };

    const dropdownRef = useRef<HTMLDivElement>(null);
    useOutsideClick({
      ref: dropdownRef,
      handler: () => {
        setIsOpen(false);
      },
    });

    useEffect(() => {
      if (selectedId && options) {
        const newSelectedItem = options.find((item) => item.id === selectedId);
        newSelectedItem && setSelectedItem(newSelectedItem);
      } else {
        setSelectedItem(undefined);
      }
    }, [selectedId, options]);

    return (
      <div ref={dropdownRef} className={cn('relative', className)} {...props}>
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

        {!!options && (
          <div
            aria-label="Dropdown menu"
            className={cn(
              dropdownVariants({ position }),
              'ui-transition-full ui-duration-200',
              isOpen
                ? 'ui-opacity-1'
                : 'ui-opacity-0 ui-pointer-events-none ui-scale-90',
              className,
            )}
          >
            <ul role="menu" aria-labelledby={id} aria-orientation="vertical">
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
        )}
      </div>
    );
  },
);
Dropdown.displayName = 'Dropdown';

export { Dropdown, dropdownVariants };
