import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'ui-w-fit ui-flex ui-items-center ui-justify-center ui-rounded-lg',
  {
    variants: {
      variant: {
        primary: 'ui-bg-gold-3 ui-text-main-black',
        attention: 'ui-bg-orange-primary ui-text-main-white',
        neutral:
          'ui-bg-neutral-1 ui-text-main-black ui-border ui-border-neutral-3',
        destructive: 'ui-bg-error ui-text-main-white',
        success: 'ui-bg-success ui-text-main-black',
        warning: 'ui-bg-warning ui-text-main-black',
      },
      size: {
        small:
          'ui-h-[26px] ui-px-4 ui-text-xs ui-gap-1.5 ui-tracking-wide ui-font-sandvik-text [&>svg]:ui-w-[16px] [&>svg]:ui-h-[16px] [&>svg]:ui-mb-[1px]',
        large:
          'ui-pt-0.5 ui-h-10 ui-px-6 ui-text-xl ui-gap-3 ui-font-sandvik-headline [&>svg]:ui-w-[20px] [&>svg]:ui-h-[20px] [&>svg]:ui-mb-[3px]',
      },
    },
    defaultVariants: {
      size: 'small',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Required<Pick<VariantProps<typeof badgeVariants>, 'variant'>> {
  size?: 'small' | 'large';
  badgeText?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size = 'small', children }, ref) => {
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
