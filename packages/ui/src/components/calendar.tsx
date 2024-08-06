'use client';

import * as React from 'react';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '../lib/utils';
import { buttonVariants } from './button';
import { format } from 'date-fns';

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
      className={cn('ui-p-5', mode === 'single' && 'ui-w-[320px]', className)}
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
          'ui-h-8 ui-w-9 ui-bg-transparent ui-p-0 ui-opacity-80 hover:ui-opacity-100',
        ),
        nav_button_previous: 'ui-absolute ui-left-1',
        nav_button_next: 'ui-absolute ui-right-1',
        table: 'ui-w-full ui-border-collapse ui-space-y-1',
        head_row:
          'ui-my-2 ui-py-1 ui-flex ui-justify-between ui-border-b ui-border-neutral-2',
        head_cell:
          'ui-font-sandvik-text ui-text-neutral-4 ui-w-9 ui-text-xs ui-font-[400]',
        row: 'ui-flex ui-justify-between ui-mt-2',
        cell: 'ui-h-9 ui-w-9 ui-text-center ui-text-md ui-p-0 ui-relative [&:has([aria-selected].day-range-end)]:ui-rounded-r-md [&:has([aria-selected].day-outside)]:ui-bg-neutral-2/50 first:[&:has([aria-selected])]:ui-rounded-l-md last:[&:has([aria-selected])]:ui-rounded-r-md focus-within:ui-relative focus-within:ui-z-20',
        day: 'ui-rounded-md ui-font-sandvik-text ui-h-9 ui-w-9 ui-p-0 ui-font-normal hover:ui-bg-neutral-2 ui-transition-all ui-duration-200',
        day_range_start: cn(
          'day-range-start ui-rounded-e-none !ui-rounded-s-md',
          isSameStartAndEndDate && '!ui-rounded-e-md',
        ),
        day_range_end: cn(
          'day-range-end ui-rounded-s-none',
          isSameStartAndEndDate && '!ui-rounded-s-md',
        ),
        day_selected:
          'ui-rounded-md ui-bg-orange-primary ui-text-main-white hover:ui-bg-orange-primary focus:ui-bg-orange-primary focus:ui-text-main-white ui-transition-all ui-duration-200',
        day_today: 'ui-rounded-md ui-bg-neutral-2/50',
        day_outside:
          'day-outside ui-text-neutral-5 ui-opacity-50 aria-selected:ui-bg-neutral-1/50 aria-selected:ui-text-neutral-6 aria-selected:ui-opacity-30',
        day_disabled: 'ui-text-neutral-5 ui-opacity-50',
        day_range_middle:
          'ui-rounded-none aria-selected:ui-bg-neutral-2/50 aria-selected:ui-text-main-black',
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
