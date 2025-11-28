'use client';
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const navigationCardVariants = cva(
  'ui-flex ui-flex-col ui-items-center ui-gap-4 ui-px-14 ui-py-8 ui-min-w-[300px] ui-h-full ui-border ui-border-gold-3 hover:ui-border-gold-primary ui-transition-all ease-in-out duration-200',
  {
    variants: {
      size: {
        small: 'ui-gap-4',
        medium: 'ui-gap-6',
        large: 'ui-gap-8',
      },
    },
    defaultVariants: {
      size: 'small',
    },
  },
);

interface NavigationCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof navigationCardVariants> {
  children: React.ReactNode;
}

export const NavigationCard = React.forwardRef<
  HTMLDivElement,
  NavigationCardProps
>(({ className, size, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(navigationCardVariants({ size }), className)}
      {...props}
    >
      {children}
    </div>
  );
});

NavigationCard.displayName = 'NavigationCard';
