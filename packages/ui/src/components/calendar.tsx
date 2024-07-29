'use client';

import * as React from 'react';
import {
  LucideCalendar,
  LucideChevronLeft,
  LucideChevronRight,
} from 'lucide-react';
import { ClassNames, DayPicker } from 'react-day-picker';
import { useState, useRef, useEffect } from 'react';

import { cn } from '../lib/utils';
import { buttonVariants } from './button';
import { Text } from './text';

import { buttonStyling } from './dropdown';
import useOutsideClick from '../customHooks/use-outside-click';

export type DayPickerProps = React.ComponentProps<typeof DayPicker>;

export interface DayPickerCustomProps {
  isOpen: boolean;
  onSetDate: (date: Date) => void;
  onSetIsOpen: (isOpen: boolean) => void;
}

const DayPickerComponent = ({
  className,
  classNames,
  isOpen,
  onSetDate,
  onSetIsOpen,
  ...props
}: DayPickerProps & DayPickerCustomProps) => {
  return (
    <DayPicker
      showOutsideDays
      className={cn(
        'ui-w-full ui-shadow-md ui-p-5 ui-mt-2 ui-rounded ui-border ui-border-neutral-3 ui-transition-full ui-duration-200 ui-absolute ui-bg-main-white ui-z-10',
        isOpen
          ? 'ui-opacity-1'
          : 'ui-opacity-0 ui-pointer-events-none ui-scale-90',
        className,
      )}
      classNames={{
        months:
          'ui-flex ui-flex-col sm:ui-flex-row ui-space-y-4 sm:ui-space-x-4 sm:ui-space-y-0',
        month: 'ui-w-full ui-space-y-4',
        caption:
          'ui-flex ui-justify-center ui-pt-1 ui-relative ui-items-center',
        caption_label: 'ui-text-md ui-font-sandvik-text ui-text-main-black',
        nav: 'ui-space-x-1 ui-flex ui-items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'ui-h-7 ui-w-7 ui-bg-transparent ui-p-0 ui-opacity-50 hover:ui-opacity-100',
        ),
        nav_button_previous: 'ui-absolute ui-left-1',
        nav_button_next: 'ui-absolute ui-right-1',
        table: 'ui-w-full ui-border-collapse ui-space-y-1',
        head_row:
          'ui-my-2 ui-flex ui-justify-between ui-border-b ui-border-neutral-2',
        head_cell:
          'ui-font-sandvik-text ui-text-neutral-4 ui-w-9 ui-text-xs ui-font-[400]',
        row: 'ui-flex ui-justify-between ui-mt-2',
        cell: 'ui-rounded-full ui-h-9 ui-w-9 ui-text-center ui-text-md ui-p-0 ui-relative [&:has([aria-selected].day-range-end)]:ui-rounded-r-md [&:has([aria-selected].day-outside)]:ui-bg-accent/50 first:[&:has([aria-selected])]:ui-rounded-l-md last:[&:has([aria-selected])]:ui-rounded-r-md focus-within:ui-relative focus-within:ui-z-20',
        day: 'ui-font-sandvik-text hover:ui-bg-neutral-2 ui-transition-all duration-100 ui-rounded-full ui-h-9 ui-w-9 ui-p-0 aria-selected:ui-opacity-100',
        day_range_end: 'ui-day-range-end',
        day_selected:
          'ui-border ui-border-orange-primary ui-text-main-black ui-bg-main-white',
        day_today: 'ui-border ui-border-neutral-3 ui-text-main-black',
        day_outside:
          'ui-day-outside ui-text-neutral-5 ui-opacity-50 aria-selected:ui-bg-accent/50 aria-selected:ui-text-neutral-5 aria-selected:ui-opacity-30',
        day_disabled: 'ui-text-neutral-5 ui-opacity-50',
        day_range_middle:
          'aria-selected:ui-bg-accent aria-selected:ui-text-accent-foreground',
        day_hidden: 'ui-invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <LucideChevronLeft size="20" />,
        IconRight: () => <LucideChevronRight size="20" />,
      }}
      onDayClick={(e) => {
        onSetDate(e);
        onSetIsOpen(false);
      }}
      {...props}
    />
  );
};

export interface CalendarProps {
  className?: string;
  classNames?: ClassNames;
  selectedDate?: Date;
  disabled?: boolean;
  onSelect: (date: Date) => void;
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, classNames, selectedDate, disabled }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [date, setDate] = useState(selectedDate);

    const calendarRef = useRef<HTMLDivElement>(null);

    const formattedDate =
      date && `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    useOutsideClick({
      ref: calendarRef,
      handler: () => {
        setIsOpen(false);
      },
    });

    useEffect(() => {
      selectedDate ? setDate(selectedDate) : setDate(undefined);
    }, [selectedDate]);

    return (
      <div
        ref={calendarRef}
        className={cn('relative ui-border-none', className)}
      >
        <button
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
            color={disabled || !date ? 'muted' : 'foreground'}
          >
            {formattedDate || 'Select date'}
          </Text>
          <LucideCalendar
            size="18"
            className={cn('ui-transform ui-duration-200 ease-in-out')}
          />
        </button>

        <DayPickerComponent
          mode="single"
          selected={date}
          className={className}
          classNames={classNames}
          isOpen={isOpen}
          onSetDate={setDate}
          onSetIsOpen={setIsOpen}
        />
      </div>
    );
  },
);
Calendar.displayName = 'Calendar';

export { Calendar };
