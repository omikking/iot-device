import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

// -- Usage examples --
// <Text variant="medium" textColor="foreground">{text}<Text>
// <Text as="span" variant="small" textColor="destructive">{text}<Text>

const textVariants = cva('ui-font-sandvik-text', {
  variants: {
    variant: {
      medium: 'ui-text-md',
      small: 'ui-text-sm ui-tracking-wide',
      xs: 'ui-text-xs ui-tracking-wide',
    },
    color: {
      foreground: 'ui-text-main-black', // @TODO update to correct color
      background: 'ui-text-main-white', // @TODO update to correct color
      muted: 'ui-text-neutral-5', // @TODO update to correct color
      destructive: 'ui-text-error', // @TODO update to correct color
    },
  },
});

export interface TextProps
  extends Omit<
      React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement>,
      'color'
    >,
    Required<Pick<VariantProps<typeof textVariants>, 'variant' | 'color'>> {
  as?: 'p' | 'span';
}

const Text = React.forwardRef<
  HTMLParagraphElement | HTMLSpanElement,
  TextProps
>(({ className, variant, color, children, as = 'p' }, ref) => {
  const TextElement = as;
  return (
    <TextElement
      className={cn(textVariants({ variant, color }), className)}
      ref={ref as React.RefObject<HTMLParagraphElement>}
    >
      {children}
    </TextElement>
  );
});
Text.displayName = 'Text';

export { Text, textVariants };
