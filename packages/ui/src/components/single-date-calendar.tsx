'use client';

import * as React from 'react';
import { LucideCalendar } from 'lucide-react';
import { buttonStyling } from './dropdown';

import { cn } from '../lib/utils';
import { Text } from './text';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useState } from 'react';

interface SingleDateCalendarProps {
  disabled?: boolean;
}

export const SingleDateCalendar = ({
  disabled,
  className,
}: React.HTMLAttributes<HTMLDivElement> & SingleDateCalendarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [date, setDate] = React.useState<Date>();

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
            onSelect={(e) => {
              setDate(e);
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
