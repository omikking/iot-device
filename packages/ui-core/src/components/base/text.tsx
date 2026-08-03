import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const textVariants = cva('ds-font-sandvik-text', {
  variants: {
    variant: {
      large: 'ds-text-lg',
      medium: 'ds-text-md',
      small: 'ds-text-sm ds-tracking-wide',
      xs: 'ds-text-xs ds-tracking-wide',
    },
    color: {
      foreground: 'ds-text-main-black',
      background: 'ds-text-main-white',
      muted: 'ds-text-neutral-5',
      destructive: 'ds-text-error',
      // accent: 'ds-text-orange-primary',
    },
    isBold: {
      false: 'ds-font-normal',
      true: 'ds-font-bold',
    },
    defaultVariants: {
      isBold: 'false',
      color: 'foreground',
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
