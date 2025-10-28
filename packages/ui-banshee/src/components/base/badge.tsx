import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'ui-banshee-w-fit ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-rounded-sm',
  {
    variants: {
      variant: {
        // primary: 'ui-banshee-bg-gold-3 ui-banshee-text-main-black',
        // attention: 'ui-banshee-bg-orange-primary ui-banshee-text-main-white',
        neutral:
          'ui-banshee-bg-neutral-1 ui-banshee-text-main-black ui-banshee-border ui-banshee-border-neutral-3',
        // destructive: 'ui-banshee-bg-error ui-banshee-text-main-white',
        // success: 'ui-banshee-bg-success ui-banshee-text-main-black',
        // warning: 'ui-banshee-bg-warning ui-banshee-text-main-black',
        // pending: 'ui-banshee-bg-blue-3 ui-banshee-text-blue-primary',
      },
      size: {
        small:
          'ui-banshee-h-[34px] ui-banshee-px-4 ui-banshee-text-xs ui-banshee-gap-1.5 ui-banshee-tracking-wide ui-banshee-font-sandvik-text [&>svg]:ui-banshee-w-[16px] [&>svg]:ui-banshee-h-[16px] [&>svg]:ui-banshee-mb-[1px]',
      },
    },
    defaultVariants: {
      size: 'small',
      variant: 'neutral',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  size?: 'small';
  variant?: 'neutral';
  badgeText?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'neutral', size = 'small', children }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size }), className)}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
