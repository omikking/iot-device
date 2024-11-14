import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const headlineVariants = cva('ui-font-sandvik-headline', {
  variants: {
    variant: {
      xl: 'ui-text-4xl',
      large: 'ui-text-3xl',
      medium: 'ui-text-2xl',
      small: 'ui-text-xl',
    },
    color: {
      foreground: 'ui-text-main-black',
      background: 'ui-text-main-white',
      muted: 'ui-text-neutral-5',
      destructive: 'ui-text-error',
    },
    isBold: {
      false: 'ui-font-normal',
      true: 'ui-font-bold',
    },
  },
});

export interface HeadlineProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    Required<Pick<VariantProps<typeof headlineVariants>, 'variant' | 'color'>> {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  isBold?: boolean;
}

const Headline = React.forwardRef<HTMLHeadingElement, HeadlineProps>(
  ({ className, variant, color, isBold, children, as }, ref) => {
    const HeadlineElement = as;
    return (
      <HeadlineElement
        className={cn(headlineVariants({ variant, color, isBold }), className)}
        ref={ref}
      >
        {children}
      </HeadlineElement>
    );
  },
);
Headline.displayName = 'Headline';

export { Headline, headlineVariants };
