'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react';

import { cn } from '../../lib/utils';
// import { buttonVariants } from './button';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) => {
  const { mode, selected } = props;

  const isSameStartAndEndDate =
    mode === 'range' &&
    (selected?.from && format(selected?.from, 'LLL dd, y')) ===
      (selected?.to && format(selected?.to, 'LLL dd, y'));

  const customDayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      formatters={{
        formatWeekdayName: (date) => customDayNames[date.getDay()],
      }}
      className={cn(
        'ds-p-1',
        mode === 'single' && 'ds-w-full',
        className,
      )}
      classNames={{
        months:
          'ds-flex ds-flex-col sm:ds-flex-row ds-space-y-4 sm:ds-space-x-4 sm:ds-space-y-0',
        month: 'ds-w-full ds-space-y-1',
        caption:
          'ds-flex ds-justify-center ds-pt-1 ds-relative ds-items-center ds-w-full',
        caption_label:
          'ds-text-md ds-font-sandvik-text ds-text-main-black',
        nav: 'ds-space-x-1 ds-flex ds-items-center',
        nav_button: cn(
          'ds-h-8 ds-w-9 ds-bg-transparent ds-p-1 ds-opacity-80 hover:ds-opacity-100',
        ),
        nav_button_previous: 'ds-absolute ds-left-0',
        nav_button_next: 'ds-absolute ds-right-0',
        table:
          'ds-w-full ds-border-collapse ds-space-y-1',
        head_row:
          // 'ds-my-2 ds-py-1 ds-flex ds-justify-between ds-border-b ds-border-neutral-2',
          'ds-flex ds-justify-between',
        head_cell:
          // 'ds-font-sandvik-text ds-text-neutral-4 ds-w-9 ds-text-xs ds-font-[400]',
          'ds-font-sandvik-text ds-w-9 ds-text-md ds-font-[400]',
        row: 'ds-flex ds-justify-between ds-mt-2',
        cell: 'ds-h-7 ds-w-9 ds-text-center ds-text-md ds-p-0 ds-relative [&:has([aria-selected].day-range-end)]:ds-rounded-r-md [&:has([aria-selected].day-outside)]:ds-bg-neutral-2/50 first:[&:has([aria-selected])]:ds-rounded-l-md last:[&:has([aria-selected])]:ds-rounded-r-md focus-within:ds-relative focus-within:ds-z-20',
        day: 'ds-rounded-md ds-font-sandvik-text ds-h-6 ds-w-9 ds-p-0 ds-font-normal hover:ds-bg-neutral-2 ds-transition-all ds-duration-200',
        day_range_start: cn(
          'day-range-start ds-rounded-e-none !ds-rounded-s-md',
          isSameStartAndEndDate && '!ds-rounded-e-md',
        ),
        day_range_end: cn(
          'day-range-end ds-rounded-s-none',
          isSameStartAndEndDate && '!ds-rounded-s-md',
        ),
        day_selected:
          'ds-rounded-md ds-bg-orange-primary ds-text-main-white hover:ds-bg-orange-primary focus:ds-bg-orange-primary focus:ds-text-main-white ds-transition-all ds-duration-200',
        day_today: 'ds-rounded-md ds-bg-neutral-2/50',
        day_outside:
          'day-outside ds-text-neutral-5 ds-opacity-50 aria-selected:ds-bg-neutral-1/50 aria-selected:ds-text-neutral-6 aria-selected:ds-opacity-30',
        day_disabled: 'ds-text-neutral-5 ds-opacity-50',
        day_range_middle:
          'ds-rounded-none aria-selected:ds-bg-neutral-2/50 aria-selected:ds-text-main-black',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <LucideChevronLeft size="22" />,
        IconRight: () => <LucideChevronRight size="22" />,
      }}
      {...props}
    />
  );
};
Calendar.displayName = 'Calendar';

export { Calendar };
