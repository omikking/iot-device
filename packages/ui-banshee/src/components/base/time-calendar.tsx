'use client';

import * as React from 'react';
import { Label } from './label';
import { Text } from './text';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import ArrowDown from '../svg/arrow-down';
import { cn } from '../../lib/utils';

type TimeCalendarProps = {
  id?: string;
  selectedTime?: string;
  disabled?: boolean;
  label?: string;
  onTimeChange?: (time: string) => void;
  defaultValue?: string;
  className?: string;
};

const generateTimeSlots = () => {
  const slots: string[] = [];

  // TODO 00:00 AM to 12:00 AM
  for (let i = 0; i < 48; i++) {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    const period = hour >= 12 ? 'PM' : 'AM';
    const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
    slots.push(time24);
  }

  return slots;
};

const buttonStyling =
  'ui-banshee-flex ui-banshee-justify-between ui-banshee-items-center ui-banshee-h-12 ui-banshee-border ui-banshee-border-neutral-3 ui-banshee-rounded ui-banshee-w-full ui-banshee-bg-main-white ui-banshee-px-4 ui-banshee-text-md ui-banshee-font-sandvik-text ui-banshee-text-main-black placeholder:ui-banshee-text-neutral-5 ui-banshee-outline-none hover:ui-banshee-border-blue-primary focus:ui-banshee-border-blue-primary ui-banshee-transition ease-in-out ui-banshee-duration-200 disabled:ui-banshee-bg-neutral-2 disabled:ui-banshee-text-neutral-5 disabled:ui-banshee-border-transparent disabled:ui-banshee-pointer-events-none';

const TimeCalendar = ({
  id,
  selectedTime,
  disabled,
  className,
  label,
  onTimeChange,
  defaultValue = '12:00 PM',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & TimeCalendarProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [time, setTime] = React.useState<string>(selectedTime || defaultValue);
  const timeSlots = React.useMemo(() => generateTimeSlots(), []);

  const handleTimeSelect = (timeString: string) => {
    setTime(timeString);
    onTimeChange?.(timeString);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative', className)} {...props}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        {label && <Label>{label}</Label>}
        <PopoverTrigger asChild>
          <Button
            id={id}
            aria-expanded={isOpen}
            aria-label="Time picker"
            type="button"
            disabled={disabled}
            className={cn(buttonStyling, isOpen && 'ui-banshee-rounded-b-none')}
          >
            <Text color="foreground" variant="small">
              {time || 'Select time'}
            </Text>
            {/* TODO import clock icon */}
            <ArrowDown
              height={12}
              width={12}
              className={cn(
                'ui-banshee-transform ui-banshee-transition-transform ui-banshee-duration-200 ui-banshee-ease-in-out',
                isOpen && 'ui-banshee-rotate-180',
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="ui-banshee-w-[var(--radix-popover-trigger-width)]  ui-banshee-p-0 ui-banshee-mt-[-4px]"
        >
          <div className="ui-banshee-max-h-[300px] ui-banshee-overflow-y-auto">
            {timeSlots.map((timeSlot) => {
              const isSelected = timeSlot === time;

              return (
                // TODO Find out why button doesnt left align
                <button
                  key={timeSlot}
                  type="button"
                  onClick={() => {
                    handleTimeSelect(timeSlot);
                  }}
                  className={cn(
                    'ui-banshee-w-full ui-banshee-px-4 ui-banshee-py-1 ui-banshee-text-left ui-banshee-text-sm ui-banshee-transition-colors hover:ui-banshee-bg-gray-100',
                    isSelected &&
                      'ui-banshee-bg-gray-200 ui-banshee-font-medium',
                  )}
                >
                  {timeSlot}
                </button>
              );
            })}
            {/* TODO Insert time Icon */}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

TimeCalendar.displayName = 'TimeCalendar';

export { TimeCalendar };
