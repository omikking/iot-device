import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const headlineVariants = cva('ui-banshee-font-sandvik-headline', {
  variants: {
    variant: {
      xl: 'ui-banshee-text-4xl',
      large: 'ui-banshee-text-3xl',
      medium: 'ui-banshee-text-2xl',
      small: 'ui-banshee-text-xl',
      base: 'ui-banshee-text-base',
    },
    color: {
      foreground: 'ui-banshee-text-main-black',
      background: 'ui-banshee-text-main-white',
      muted: 'ui-banshee-text-neutral-5',
      destructive: 'ui-banshee-text-error',
    },
    isBold: {
      false: 'ui-banshee-font-normal',
      true: 'ui-banshee-font-bold',
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
