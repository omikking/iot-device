'use client';

import * as React from 'react';
import { LucideCalendar } from 'lucide-react';
import { DateRange as DateRangeProps } from 'react-day-picker';
import { buttonStyling } from './dropdown';

import { cn } from '../lib/utils';
import { Text } from './text';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { useEffect, useState } from 'react';
import { Button } from './button';

export type DateRange = DateRangeProps;

interface RangeCalendarProps {
  disabled?: boolean;
  selected?: DateRange;
  onSelect?: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

export const RangeCalendar = ({
  selected,
  onSelect,
  disabled,
  className,
}: React.HTMLAttributes<HTMLDivElement> & RangeCalendarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: selected?.from,
    to: selected?.to,
  });

  const getRangeFormat = () => {
    const { from, to } = date || {};

    if (from && to) {
      const formatDate = (date: Date) =>
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

      return `${formatDate(from)} to ${formatDate(to)}`;
    }
    return 'Select dates';
  };

  // Required to reset
  useEffect(() => {
    selected
      ? setDate(selected)
      : setDate({
          from: undefined,
          to: undefined,
        });
  }, [selected]);

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
              color={
                disabled || !date?.from || !date?.to ? 'muted' : 'foreground'
              }
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
            onSelect={(e) => {
              setDate(e);
              onSelect?.(e);
            }}
            numberOfMonths={2}
          />
          <Button
            size="small"
            variant="primary"
            onClick={() => {
              setIsOpen(false);
            }}
            className="ui-mb-5 ui-mr-5 ui-mt-[-8px]"
          >
            Close
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
