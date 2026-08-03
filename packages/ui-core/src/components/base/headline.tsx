import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const headlineVariants = cva('ds-font-sandvik-headline', {
  variants: {
    variant: {
      xl: 'ds-text-4xl',
      large: 'ds-text-3xl',
      medium: 'ds-text-2xl',
      small: 'ds-text-xl',
      base: 'ds-text-base',
    },
    color: {
      foreground: 'ds-text-main-black',
      background: 'ds-text-main-white',
      muted: 'ds-text-neutral-5',
      destructive: 'ds-text-error',
    },
    isBold: {
      false: 'ds-font-normal',
      true: 'ds-font-bold',
    },
  },
});

export interface HeadlineProps
  extends Omit<
      React.HTMLAttributes<HTMLHeadingElement | HTMLSpanElement>,
      'color'
    >,
    Required<Pick<VariantProps<typeof headlineVariants>, 'variant' | 'color'>> {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';
  isBold?: boolean;
}

const Headline = React.forwardRef<
  HTMLHeadingElement | HTMLSpanElement,
  HeadlineProps
>(({ className, variant, color, isBold, children, as }, ref) => {
  const HeadlineElement = as;
  return (
    <HeadlineElement
      className={cn(headlineVariants({ variant, color, isBold }), className)}
      ref={ref as React.RefObject<HTMLParagraphElement>}
    >
      {children}
    </HeadlineElement>
  );
});
Headline.displayName = 'Headline';

export { Headline, headlineVariants };
