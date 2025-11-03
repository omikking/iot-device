'use client';

import * as React from 'react';
// import { ChevronDownIcon } from 'lucide-react';
// import { Button } from './button';
// import { Calendar } from './calendar';
import { Input } from './input';
import { Label } from './label';
// import { Popover, PopoverContent, PopoverTrigger } from './popover';

function TimeCalendar() {
  // const [open, setOpen] = React.useState(false);
  // const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className="ui-banshee-flex ui-banshee-gap-4">
      <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-3">
        {/* <Label htmlFor="date-picker" className="ui-banshee-px-1">
          Date
        </Label> */}
        {/* <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              //   variant="outline"
              id="date-picker"
              className="ui-banshee-w-32 ui-banshee-justify-between ui-banshee-font-normal"
            >
              {date ? date.toLocaleDateString() : 'Select date'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="ui-banshee-w-auto ui-banshee-overflow-hidden ui-banshee-p-0"
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover> */}
      </div>
      <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          defaultValue="10:30:00"
          className="ui-banshee-bg-background  ui-banshee-appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}

TimeCalendar.displayName = 'TimeCalendar';

export { TimeCalendar };
