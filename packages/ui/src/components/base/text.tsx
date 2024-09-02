import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const textVariants = cva('ui-font-sandvik-text', {
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
