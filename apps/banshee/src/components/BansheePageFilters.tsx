'use client';
import { Button } from '@gsp/ui-banshee';
import { useEffect } from 'react';

const timeframes = ['7D', '1M', '3M', '1Y', 'ALL'];

export const BansheePageFilters = ({
  active,
  setActive,
  onDateChange,
}: {
  active: string;
  setActive: (val: string) => void;
  onDateChange: (startDate?: string, endDate?: string) => void;
}) => {
  useEffect(() => {
    if (active === 'ALL') {
      onDateChange(undefined, undefined);
      return;
    }
    const end = new Date();
    const start = new Date();

    if (active === '7D') start.setDate(end.getDate() - 7);
    else if (active === '1M') start.setMonth(end.getMonth() - 1);
    else if (active === '3M') start.setMonth(end.getMonth() - 3);
    else if (active === '1Y') start.setFullYear(end.getFullYear() - 1);
    else start.setDate(end.getDate() - 7);

    onDateChange(start.toISOString(), end.toISOString());
  }, [active, onDateChange]);

  return (
    <div className="ui-banshee-flex ui-banshee-flex-wrap ui-banshee-gap-2 ui-banshee-mb-10">
      {timeframes.map((tf) => (
        <Button
          key={tf}
          variant={active === tf ? 'primary' : 'outline'}
          size="small"
          onClick={() => setActive(tf)}
          className={
            active === tf
              ? 'ui-banshee-bg-blue-600 ui-banshee-text-white'
              : 'ui-banshee-bg-gray-100 ui-banshee-text-main-black ui-banshee-border-gray-200'
          }
        >
          {tf}
        </Button>
      ))}
    </div>
  );
};
