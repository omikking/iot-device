'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { LucideCalendar } from 'lucide-react';

import { cn } from '../../lib/utils';
import { buttonStyling } from './dropdown';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Calendar } from './calendar';
import { Text } from './text';

interface SingleDateCalendarProps {
  disabled?: boolean;
  expiryDate?: Date;
  onDateChange: (expiringDate: Date | undefined) => void;
}

export const SingleDateCalendar = ({
  disabled,
  className,
  expiryDate,
  onDateChange,
}: React.HTMLAttributes<HTMLDivElement> & SingleDateCalendarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const initialDate = expiryDate ? new Date(expiryDate) : undefined;
  const [date, setDate] = useState<Date | undefined>(initialDate);
  useEffect(() => {
    if (expiryDate) {
      setDate(new Date(expiryDate));
    }
  }, [expiryDate]);

  const formattedDate =
    date && `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  return (
    <div className={cn('ui-relative ui-border-none', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            id="date"
            aria-label="Toggle dropdown"
            aria-haspopup="true"
            type="button"
            disabled={disabled}
            className={buttonStyling}
          >
            <Text
              variant="medium"
              color={disabled || !date ? 'muted' : 'foreground'}
            >
              {formattedDate || 'Select date'}
            </Text>

            <LucideCalendar
              size="18"
              className="ui-transform ui-duration-200 ease-in-out"
            />
          </button>
        </PopoverTrigger>

        <PopoverContent className="ui-w-auto ui-p-0">
          <Calendar
            initialFocus
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              if (selectedDate instanceof Date) {
                setDate(selectedDate);
                onDateChange(selectedDate);
              }
              setTimeout(() => {
                setIsOpen(false);
              }, 150);
            }}
            className={className}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
