'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const navigationCardVariants = cva(
  'ui-flex ui-flex-col ui-items-center ui-gap-4 ui-px-16 ui-py-8 ui-min-w-[300px] ui-border ui-border-gold-3 hover:ui-border-gold-primary hover:ui-bg-gold-3 ui-transition-all ease-in-out duration-200',
  {
    variants: {
      variant: {
        default: '',
        centered:
          'ui-flex ui-flex-col ui-items-center ui-w-80 ui-gap-6 ui-relative',
        highlighted: 'ui-bg-gold-1 ui-border-gold-2',
        shadowed: 'ui-shadow-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface NavigationCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof navigationCardVariants> {
  children: React.ReactNode;
}

export const NavigationCard = React.forwardRef<
  HTMLDivElement,
  NavigationCardProps
>(({ className, variant, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(navigationCardVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
});

NavigationCard.displayName = 'NavigationCard';
