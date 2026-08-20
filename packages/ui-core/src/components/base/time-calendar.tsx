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
  'ds-flex ds-justify-between ds-items-center ds-h-12 ds-border ds-border-neutral-3 ds-rounded ds-w-full ds-bg-main-white ds-px-4 ds-text-md ds-font-sandvik-text ds-text-main-black placeholder:ds-text-neutral-5 ds-outline-none hover:ds-border-blue-primary focus:ds-border-blue-primary ds-transition ease-in-out ds-duration-200 disabled:ds-bg-neutral-2 disabled:ds-text-neutral-5 disabled:ds-border-transparent disabled:ds-pointer-events-none';

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
  React.useEffect(() => {
    setTime(selectedTime || defaultValue);
  }, [selectedTime]);
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
            className={cn(buttonStyling, isOpen && 'ds-rounded-b-none')}
          >
            <Text color="foreground" variant="small">
              {time || 'Select time'}
            </Text>
            {/* TODO import clock icon */}
            <ArrowDown
              height={12}
              width={12}
              className={cn(
                'ds-transform ds-transition-transform ds-duration-200 ds-ease-in-out',
                isOpen && 'ds-rotate-180',
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="ds-w-[var(--radix-popover-trigger-width)]  ds-p-0 ds-mt-[-4px]"
        >
          <div className="ds-max-h-[300px] ds-overflow-y-auto">
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
                    'ds-w-full ds-px-4 ds-py-1 ds-text-left ds-text-sm ds-transition-colors hover:ds-bg-gray-100',
                    isSelected &&
                      'ds-bg-gray-200 ds-font-medium',
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
