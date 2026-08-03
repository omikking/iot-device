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

export const formattedDate = (timestamp: Date) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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
        'ds-relative ds-border-neutral-3 ds-rounded ds-border ds-bg-main-white ds-text-md ds-font-sandvik-text ds-text-main-black placeholder:ds-text-neutral-5 ds-outline-none hover:ds-border-blue-primary focus-visible:ds-border-blue-primary ds-transition ease-in-out ds-duration-200 disabled:ds-bg-neutral-2 disabled:ds-text-neutral-5 disabled:ds-border-transparent disabled:ds-pointer-events-none',
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
              isOpen && 'ds-rounded-b-none',
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
              className="ds-transform ds-duration-200 ease-in-out"
            />
          </button>
        </PopoverTrigger>

        {/* <PopoverContent className="ds-w-auto ds-p-0"> */}
        <PopoverContent className="ds-w-[var(--radix-popover-trigger-width)] ds-p-0 ds-mt-[-4px]">
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
