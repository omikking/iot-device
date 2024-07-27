import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

// -- Usage examples --
// <Badge variant="attention">Attention</Badge>

// <Badge variant="attention">
//     <LucideCloudUpload size="14" />
//     Attention with icon
// </Badge>

// <Badge variant="primary" size="large">
//     Primary large
// </Badge>

// <Badge variant="primary" size="large">
//     <LucideBot size="18" />
//     Primary large with icon
// </Badge>

const badgeVariants = cva(
  'ui-inline-flex ui-items-center ui-justify-center ui-rounded-lg',
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
          'ui-h-6 ui-px-4 ui-text-xs ui-gap-1.5 ui-tracking-wide ui-font-sandvik-text',
        large: 'ui-h-9 ui-px-6 ui-text-xl ui-gap-2.5 ui-font-sandvik-headline',
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
