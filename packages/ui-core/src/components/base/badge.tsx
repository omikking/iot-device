import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'ds-w-fit ds-flex ds-items-center ds-justify-center ds-rounded-sm',
  {
    variants: {
      variant: {
        // primary: 'ds-bg-gold-3 ds-text-main-black',
        // attention: 'ds-bg-orange-primary ds-text-main-white',
        neutral:
          'ds-bg-neutral-1 ds-text-main-black ds-border ds-border-neutral-3',
        // destructive: 'ds-bg-error ds-text-main-white',
        // success: 'ds-bg-success ds-text-main-black',
        // warning: 'ds-bg-warning ds-text-main-black',
        // pending: 'ds-bg-blue-3 ds-text-blue-primary',
      },
      size: {
        extraSmall:
          'ds-h-[18px] ds-px-4 ds-text-xs ds-gap-1.5 ds-tracking-wide ds-font-sandvik-text [&>svg]:ds-w-[16px] [&>svg]:ds-h-[16px] [&>svg]:ds-mb-[1px]',
        small:
          'ds-h-[34px] ds-px-4 ds-text-xs ds-gap-1.5 ds-tracking-wide ds-font-sandvik-text [&>svg]:ds-w-[16px] [&>svg]:ds-h-[16px] [&>svg]:ds-mb-[1px]',
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
  size?: 'small' | 'extraSmall';
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
