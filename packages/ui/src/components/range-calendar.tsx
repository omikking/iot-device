'use client';

import * as React from 'react';
import { LucideCalendar } from 'lucide-react';
import { DateRange as DateRangeProps } from 'react-day-picker';
import { buttonStyling } from './dropdown';

import { cn } from '../lib/utils';
import { Text } from './text';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useState } from 'react';
import { Button } from './button';

export type DateRange = DateRangeProps;

interface RangeCalendarProps {
  disabled?: boolean;
}

export const RangeCalendar = ({
  disabled,
  className,
}: React.HTMLAttributes<HTMLDivElement> & RangeCalendarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const getRangeFormat = () => {
    if (date?.from) {
      if (date?.to) {
        return (
          <>
            {date.from.getFullYear()}-{date.from.getMonth() + 1}-
            {date.from.getDate()} to {date.to.getFullYear()}-
            {date.to.getMonth() + 1}-{date.to.getDate()}
          </>
        );
      }
    }
    return 'Select dates';
  };

  return (
    <div className={cn('ui-grid ui-gap-2', className)}>
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
              {getRangeFormat()}
            </Text>

            <LucideCalendar
              size="18"
              className="ui-transform ui-duration-200 ui-ease-in-out"
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="ui-w-auto flex flex-col ui-items-end"
          align="start"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <Button
            disabled={!date?.from || !date?.to}
            size="small"
            variant="primary"
            onClick={() => {
              setIsOpen(false);
            }}
            className="ui-mb-5 ui-mr-5 ui-mt-[-8px]"
          >
            Update
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
