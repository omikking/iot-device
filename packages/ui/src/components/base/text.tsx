import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const textVariants = cva('ui-font-sandvik-text', {
  variants: {
    variant: {
      large: 'ui-text-lg',
      medium: 'ui-text-md',
      small: 'ui-text-sm ui-tracking-wide',
      xs: 'ui-text-xs ui-tracking-wide',
    },
    color: {
      foreground: 'ui-text-main-black',
      background: 'ui-text-main-white',
      muted: 'ui-text-neutral-4',
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

export interface TextProps
  extends Omit<
      React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement>,
      'color'
    >,
    Required<Pick<VariantProps<typeof textVariants>, 'variant' | 'color'>> {
  as?: 'p' | 'span';
  isBold?: boolean;
}

const Text = React.forwardRef<
  HTMLParagraphElement | HTMLSpanElement,
  TextProps
>(
  (
    { className, variant, color, isBold, children, as = 'p', ...props },
    ref,
  ) => {
    const TextElement = as;
    return (
      <TextElement
        className={cn(textVariants({ variant, color, isBold }), className)}
        ref={ref as React.RefObject<HTMLParagraphElement>}
        {...props}
      >
        {children}
      </TextElement>
    );
  },
);
Text.displayName = 'Text';

export { Text, textVariants };
