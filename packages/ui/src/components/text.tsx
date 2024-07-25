import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

// -- Usage examples --
// <Text as="p">{text}<Text>
// <Text as="span" variant="medium" textColor="destructive">{text}<Text>

const textVariants = cva('ui-font-sandvik-text', {
  variants: {
    variant: {
      medium: 'ui-text-md',
      small: 'ui-text-sm ui-tracking-wide',
      xs: 'ui-text-xs ui-tracking-wide',
      xsUpper: 'ui-text-xs ui-uppercase ui-tracking-wide',
    },
    textColor: {
      foreground: 'ui-text-foreground', // @TODO update to correct color
      background: 'ui-text-background', // @TODO update to correct color
      muted: 'ui-text-muted-foreground', // @TODO update to correct color
      destructive: 'ui-text-destructive', // @TODO update to correct color
    },
  },
  defaultVariants: {
    variant: 'medium',
    textColor: 'foreground',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement>,
    VariantProps<typeof textVariants> {
  as: 'p' | 'span';
}

const Text = React.forwardRef<
  HTMLParagraphElement | HTMLSpanElement,
  TextProps
>(({ className, variant, textColor, children, as }, ref) => {
  const TextElement = as;
  return (
    <TextElement
      className={cn(textVariants({ variant, textColor }), className)}
      ref={ref as React.RefObject<HTMLParagraphElement>}
    >
      {children}
    </TextElement>
  );
});
Text.displayName = 'Text';

export { Text, textVariants };
