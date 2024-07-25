import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

// -- Usage examples --
// <Headline as="h1">{text}<Headline>
// <Headline as="h2" variant="large" textColor="destructive">{text}<Headline>

const headlineVariants = cva('ui-font-sandvik-headline', {
  variants: {
    variant: {
      xl: 'ui-text-4xl',
      large: 'ui-text-3xl',
      medium: 'ui-text-2xl',
      smallBold: 'ui-text-xl ui-font-bold',
    },
    textColor: {
      foreground: 'ui-text-foreground', // @TODO update to correct color
      background: 'ui-text-background', // @TODO update to correct color
      muted: 'ui-text-muted-foreground', // @TODO update to correct color
      destructive: 'ui-text-destructive', // @TODO update to correct color
    },
    as: {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
    },
  },
  defaultVariants: {
    variant: 'medium',
    textColor: 'foreground',
  },
});

export interface HeadlineProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headlineVariants> {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Headline = React.forwardRef<HTMLHeadingElement, HeadlineProps>(
  ({ className, variant, textColor, children, as }, ref) => {
    const HeadlineElement = as;
    return (
      <HeadlineElement
        className={cn(headlineVariants({ variant, textColor }), className)}
        ref={ref}
      >
        {children}
      </HeadlineElement>
    );
  },
);
Headline.displayName = 'Headline';

export { Headline, headlineVariants };
