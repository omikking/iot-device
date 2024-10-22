'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

interface BoltResultCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const BoltResultCard = React.forwardRef<
  HTMLDivElement,
  BoltResultCardProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'ui-flex ui-flex-col ui-items-center ui-gap-3 ui-px-16 ui-py-8 ui-min-w-[300px] ui-rounded-md ui-border ui-border-gold-primary hover:ui-border-gold-primary hover:ui-bg-gold-3 ui-transition-all ease-in-out duration-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

BoltResultCard.displayName = 'BoltResultCard';
