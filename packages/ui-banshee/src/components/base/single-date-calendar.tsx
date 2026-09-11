'use client';

import * as React from 'react';
import { useState } from 'react';
import { LucideCalendar } from 'lucide-react';

import { cn } from '../../lib/utils';
import { buttonStyling } from './dropdown';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar } from './calendar';
import { Text } from './text';

type SingleDateCalendarProps = {
  selectedDate?: Date;
  disabled?: boolean;
  onDateChange: (date?: Date) => void;
};

/** `18/03/2025` — the same day form the rest of the banshee UI writes. */
export const formattedDate = (timestamp: Date) => {
  const date = new Date(timestamp);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};

export const SingleDateCalendar = ({
  selectedDate,
  disabled,
  onDateChange,
  className,
}: React.HTMLAttributes<HTMLDivElement> & SingleDateCalendarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [date, setDate] = React.useState<Date | undefined>(selectedDate);

  const handleDateChange = (selectedDate?: Date) => {
    setDate(selectedDate);
    onDateChange(selectedDate);
    setIsOpen(false);
  };
  React.useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate?.getTime()]);
  return (
    <div
      className={cn(
        'ui-banshee-relative ui-banshee-border-neutral-3 ui-banshee-rounded ui-banshee-border ui-banshee-bg-main-white ui-banshee-text-md ui-banshee-font-sandvik-text ui-banshee-text-main-black placeholder:ui-banshee-text-neutral-5 ui-banshee-outline-none hover:ui-banshee-border-blue-primary focus-visible:ui-banshee-border-blue-primary ui-banshee-transition ease-in-out ui-banshee-duration-200 disabled:ui-banshee-bg-neutral-2 disabled:ui-banshee-text-neutral-5 disabled:ui-banshee-border-transparent disabled:ui-banshee-pointer-events-none',
        className,
      )}
    >
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            id="date"
            aria-label="Toggle dropdown"
            aria-haspopup="true"
            type="button"
            disabled={disabled}
            className={cn(
              buttonStyling(),
              isOpen && 'ui-banshee-rounded-b-none',
            )}
          >
            <Text
              variant="medium"
              color={disabled || !date ? 'muted' : 'foreground'}
            >
              {date ? formattedDate(date) : 'Select date'}
            </Text>

            <LucideCalendar
              size="18"
              className="ui-banshee-transform ui-banshee-duration-200 ease-in-out"
            />
          </button>
        </PopoverTrigger>

        {/* <PopoverContent className="ui-banshee-w-auto ui-banshee-p-0"> */}
        <PopoverContent className="ui-banshee-w-[var(--radix-popover-trigger-width)] ui-banshee-p-0 ui-banshee-mt-[-4px]">
          <Calendar
            initialFocus
            // mode="default"
            mode="single"
            selected={date}
            showOutsideDays={false}
            onSelect={handleDateChange}
            className={className}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
