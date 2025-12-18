'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { buttonVariants } from './button';
import { DayPicker } from 'react-day-picker';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) => {
  const { mode } = props;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      mode={mode}
      navLayout="after"
      className={cn('ui-p-5', mode === 'single' && 'ui-w-[320px]', className)}
      classNames={{
        months:
          'ui-flex ui-flex-col sm:ui-flex-row ui-space-y-4 sm:ui-space-x-4 sm:ui-space-y-0',
        month: 'ui-flex ui-flex-col ui-pt-2 ui-w-full',
        month_caption:
          'ui-flex ui-justify-center ui-items-center ui-pb-4 ui-relative',
        caption_label:
          'ui-pb-3 ui-text-md ui-font-sandvik-text ui-text-main-black',
        nav: 'ui-space-x-1 ui-flex ui-items-center',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'ui-mb-20 ui-ml-4 ui-h-8 ui-w-9 ui-bg-transparent ui-p-0 ui-opacity-80 hover:ui-opacity-100 ui-absolute ui-left-1',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'ui-mb-20 !ui-mr-4 ui-h-8 ui-w-9 ui-bg-transparent ui-p-0 ui-opacity-80 hover:ui-opacity-100 ui-absolute ui-right-1',
        ),
        month_grid: 'ui-w-full ui-border-collapse ui-space-y-1',
        weekday:
          'ui-border-b ui-text-xs ui-font-sandvik-text ui-text-neutral-4 ui-font-regular',
        day: 'ui-h-9 ui-w-9 ui-text-center ui-text-md ui-relative [&:has([aria-selected].range-end)]:ui-rounded-r-md [&:has([aria-selected].outside)]:ui-bg-neutral-2/50 first:[&:has([aria-selected])]:ui-rounded-l-md last:[&:has([aria-selected])]:ui-rounded-r-md focus-within:ui-relative focus-within:ui-z-20',
        day_button:
          'ui-text-center ui-rounded-md ui-font-sandvik-text ui-h-9 ui-w-9 ui-p-0 ui-font-normal hover:ui-bg-neutral-2 ui-transition-all ui-duration-200 active:ui-bg-neutral-3 focus:ui-outline-none focus:ui-bg-orange-primary',
        range_start: cn(
          'range-start ui-rounded-e-none !ui-rounded-s-md !ui-rounded-e-md',
        ),
        range_end: cn('range-end ui-rounded-s-none !ui-rounded-s-md'),
        selected:
          'ui-rounded-md ui-bg-orange-primary ui-text-main-white hover:ui-bg-orange-primary focus:ui-bg-orange-primary focus:ui-text-main-white ui-transition-all ui-duration-200',
        today: 'ui-rounded-md ui-bg-neutral-2/50',
        outside:
          'outside ui-text-neutral-5 ui-opacity-50 aria-selected:ui-bg-neutral-1/50 aria-selected:ui-text-neutral-6 aria-selected:ui-opacity-30',
        disabled: 'ui-text-neutral-5 ui-opacity-50',
        range_middle:
          'ui-rounded-none aria-selected:ui-bg-neutral-2/50 aria-selected:ui-text-main-black',
        hidden: 'invisible',
        ...classNames,
      }}
      {...props}
    />
  );
};
Calendar.displayName = 'Calendar';

export { Calendar };
