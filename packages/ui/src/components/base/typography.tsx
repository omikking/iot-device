import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const typographyVariants = cva('ui-font-sandvik-text', {
  variants: {
    variant: {
      medium: 'ui-text-md',
      small: 'ui-text-sm ui-tracking-wide',
      xs: 'ui-text-xs ui-tracking-wide',
    },
    color: {
      foreground: 'ui-text-main-black',
      background: 'ui-text-main-white',
      muted: 'ui-text-neutral-5',
      destructive: 'ui-text-error',
      accent: 'ui-text-orange-primary',
    },
    isBold: {
      false: 'ui-font-normal',
      true: 'ui-font-bold',
    },
    defaultVariants: {
      isBold: 'false',
    },
  },
});

export interface TypographyProps
  extends Omit<
      React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement>,
      'color'
    >,
    Required<
      Pick<VariantProps<typeof typographyVariants>, 'variant' | 'color'>
    > {
  as?: 'p' | 'span';
  isBold?: boolean;
}

const Typography = React.forwardRef<
  HTMLParagraphElement | HTMLSpanElement,
  TypographyProps
>(
  (
    { className, variant, color, isBold, children, as = 'p', ...props },
    ref,
  ) => {
    const TypographyElement = as;
    return (
      <TypographyElement
        className={cn(
          typographyVariants({ variant, color, isBold }),
          className,
        )}
        ref={ref as React.RefObject<HTMLParagraphElement>}
        {...props}
      >
        {children}
      </TypographyElement>
    );
  },
);
Typography.displayName = 'Typography';

export { Typography, typographyVariants };
