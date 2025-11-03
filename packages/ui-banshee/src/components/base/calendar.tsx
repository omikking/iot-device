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

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'ui-banshee-p-5',
        mode === 'single' && 'ui-banshee-w-[320px]',
        className,
      )}
      classNames={{
        months:
          'ui-banshee-flex ui-banshee-flex-col sm:ui-banshee-flex-row ui-banshee-space-y-4 sm:ui-banshee-space-x-4 sm:ui-banshee-space-y-0',
        month: 'ui-banshee-w-full ui-banshee-space-y-4',
        caption:
          'ui-banshee-flex ui-banshee-justify-center ui-banshee-pt-1 ui-banshee-relative ui-banshee-items-center',
        caption_label:
          'ui-banshee-text-md ui-banshee-font-sandvik-text ui-banshee-text-main-black',
        nav: 'ui-banshee-space-x-1 ui-banshee-flex ui-banshee-items-center',
        nav_button: cn(
          // buttonVariants({ variant: 'outline' }),
          'ui-banshee-h-8 ui-banshee-w-9 ui-banshee-bg-transparent ui-banshee-p-0 ui-banshee-opacity-80 hover:ui-banshee-opacity-100',
        ),
        nav_button_previous: 'ui-banshee-absolute ui-banshee-left-1',
        nav_button_next: 'ui-banshee-absolute ui-banshee-right-1',
        table:
          'ui-banshee-w-full ui-banshee-border-collapse ui-banshee-space-y-1',
        head_row:
          'ui-banshee-my-2 ui-banshee-py-1 ui-banshee-flex ui-banshee-justify-between ui-banshee-border-b ui-banshee-border-neutral-2',
        head_cell:
          'ui-banshee-font-sandvik-text ui-banshee-text-neutral-4 ui-banshee-w-9 ui-banshee-text-xs ui-banshee-font-[400]',
        row: 'ui-banshee-flex ui-banshee-justify-between ui-banshee-mt-2',
        cell: 'ui-banshee-h-9 ui-banshee-w-9 ui-banshee-text-center ui-banshee-text-md ui-banshee-p-0 ui-banshee-relative [&:has([aria-selected].day-range-end)]:ui-banshee-rounded-r-md [&:has([aria-selected].day-outside)]:ui-banshee-bg-neutral-2/50 first:[&:has([aria-selected])]:ui-banshee-rounded-l-md last:[&:has([aria-selected])]:ui-banshee-rounded-r-md focus-within:ui-banshee-relative focus-within:ui-banshee-z-20',
        day: 'ui-banshee-rounded-md ui-banshee-font-sandvik-text ui-banshee-h-9 ui-banshee-w-9 ui-banshee-p-0 ui-banshee-font-normal hover:ui-banshee-bg-neutral-2 ui-banshee-transition-all ui-banshee-duration-200',
        day_range_start: cn(
          'day-range-start ui-banshee-rounded-e-none !ui-banshee-rounded-s-md',
          isSameStartAndEndDate && '!ui-banshee-rounded-e-md',
        ),
        day_range_end: cn(
          'day-range-end ui-banshee-rounded-s-none',
          isSameStartAndEndDate && '!ui-banshee-rounded-s-md',
        ),
        day_selected:
          'ui-banshee-rounded-md ui-banshee-bg-orange-primary ui-banshee-text-main-white hover:ui-banshee-bg-orange-primary focus:ui-banshee-bg-orange-primary focus:ui-banshee-text-main-white ui-banshee-transition-all ui-banshee-duration-200',
        day_today: 'ui-banshee-rounded-md ui-banshee-bg-neutral-2/50',
        day_outside:
          'day-outside ui-banshee-text-neutral-5 ui-banshee-opacity-50 aria-selected:ui-banshee-bg-neutral-1/50 aria-selected:ui-banshee-text-neutral-6 aria-selected:ui-banshee-opacity-30',
        day_disabled: 'ui-banshee-text-neutral-5 ui-banshee-opacity-50',
        day_range_middle:
          'ui-banshee-rounded-none aria-selected:ui-banshee-bg-neutral-2/50 aria-selected:ui-banshee-text-main-black',
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
