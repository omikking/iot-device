'use client';

import * as React from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger, Text } from '@gsp/ui-banshee';

type TimePickerProps = {
  selectedTime?: string; // format: "HH:MM AM/PM"
  onTimeChange?: (time: string) => void;
  disabled?: boolean;
};

function parseTime(time: string): {
  hour: number;
  minute: number;
  period: 'AM' | 'PM';
} {
  const match = time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (match) {
    return {
      hour: parseInt(match[1], 10),
      minute: parseInt(match[2], 10),
      period: match[3].toUpperCase() as 'AM' | 'PM',
    };
  }
  return { hour: 12, minute: 0, period: 'PM' };
}

function formatTime(hour: number, minute: number, period: 'AM' | 'PM'): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
}

const triggerStyling =
  'ui-banshee-flex ui-banshee-justify-between ui-banshee-items-center ui-banshee-h-12 ui-banshee-border ui-banshee-border-neutral-3 ui-banshee-rounded ui-banshee-w-full ui-banshee-bg-main-white ui-banshee-px-4 ui-banshee-text-md ui-banshee-font-sandvik-text ui-banshee-text-main-black placeholder:ui-banshee-text-neutral-5 ui-banshee-outline-none hover:ui-banshee-border-blue-primary focus:ui-banshee-border-blue-primary ui-banshee-transition ease-in-out ui-banshee-duration-200 disabled:ui-banshee-bg-neutral-2 disabled:ui-banshee-text-neutral-5 disabled:ui-banshee-border-transparent disabled:ui-banshee-pointer-events-none';

const spinnerBtnStyling =
  'ui-banshee-p-1 ui-banshee-rounded hover:ui-banshee-bg-neutral-1 ui-banshee-transition ui-banshee-duration-150 ui-banshee-text-neutral-5 hover:ui-banshee-text-main-black';

export const TimePicker = ({
  selectedTime = '12:00 PM',
  onTimeChange,
  disabled,
}: TimePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const parsed = parseTime(selectedTime);
  const [hour, setHour] = React.useState(parsed.hour);
  const [minute, setMinute] = React.useState(parsed.minute);
  const [period, setPeriod] = React.useState<'AM' | 'PM'>(parsed.period);

  React.useEffect(() => {
    const p = parseTime(selectedTime);
    setHour(p.hour);
    setMinute(p.minute);
    setPeriod(p.period);
  }, [selectedTime]);

  const emit = (h: number, m: number, p: 'AM' | 'PM') =>
    onTimeChange?.(formatTime(h, m, p));

  const incHour = () => {
    const next = hour >= 12 ? 1 : hour + 1;
    setHour(next);
    emit(next, minute, period);
  };
  const decHour = () => {
    const next = hour <= 1 ? 12 : hour - 1;
    setHour(next);
    emit(next, minute, period);
  };
  const incMinute = () => {
    const next = (minute + 5) % 60;
    setMinute(next);
    emit(hour, next, period);
  };
  const decMinute = () => {
    const next = minute - 5 < 0 ? 55 : minute - 5;
    setMinute(next);
    emit(hour, next, period);
  };
  const togglePeriod = (p: 'AM' | 'PM') => {
    setPeriod(p);
    emit(hour, minute, p);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild className='!ui-banshee-bg-main-white disabled:ui-banshee-bg-neutral-2 disabled:ui-banshee-text-neutral-5 disabled:ui-banshee-border-transparent disabled:ui-banshee-pointer-events-none'>
        <button
          type="button"
          disabled={disabled}
          className={triggerStyling}
          aria-label="Time picker"
        >
          <Text variant="medium" color={disabled ? 'muted' : 'foreground'}>
            {formatTime(hour, minute, period)}
          </Text>
          <Clock
            size={18}
            className="ui-banshee-text-neutral-500 ui-banshee-shrink-0"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent className="ui-banshee-w-[var(--radix-popover-trigger-width)] ui-banshee-p-4 ui-banshee-mt-[-4px]">
        <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-3">
          {/* Hours column */}
          <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-items-center ui-banshee-gap-1">
            <button
              type="button"
              onClick={incHour}
              className={spinnerBtnStyling}
            >
              <ChevronUp size={18} />
            </button>
            <span className="ui-banshee-text-2xl ui-banshee-font-semibold ui-banshee-w-12 ui-banshee-text-center ui-banshee-tabular-nums">
              {String(hour).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={decHour}
              className={spinnerBtnStyling}
            >
              <ChevronDown size={18} />
            </button>
          </div>

          <span className="ui-banshee-text-2xl ui-banshee-font-bold ui-banshee-text-neutral-400 ui-banshee-select-none">
            :
          </span>

          {/* Minutes column */}
          <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-items-center ui-banshee-gap-1">
            <button
              type="button"
              onClick={incMinute}
              className={spinnerBtnStyling}
            >
              <ChevronUp size={18} />
            </button>
            <span className="ui-banshee-text-2xl ui-banshee-font-semibold ui-banshee-w-12 ui-banshee-text-center ui-banshee-tabular-nums">
              {String(minute).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={decMinute}
              className={spinnerBtnStyling}
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* AM / PM toggle */}
          <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-1 ui-banshee-ml-2">
            {(['AM', 'PM'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => togglePeriod(p)}
                className={[
                  'ui-banshee-px-3 ui-banshee-py-1 ui-banshee-rounded ui-banshee-text-sm ui-banshee-font-medium ui-banshee-transition ui-banshee-duration-150',
                  period === p
                    ? 'ui-banshee-bg-blue-primary ui-banshee-text-main-white'
                    : 'ui-banshee-bg-neutral-2 ui-banshee-text-neutral-5 hover:ui-banshee-bg-neutral-1 hover:ui-banshee-text-main-black',
                ].join(' ')}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
