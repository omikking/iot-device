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
    fontWeight: {
      default: 'ui-font-normal',
      bold: 'ui-font-bold',
    },
  },
  defaultVariants: {
    variant: 'small',
    color: 'foreground',
    fontWeight: 'default',
  },
});

export interface TextProps
  extends Omit<
      React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement>,
      'color'
    >,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span';
}

const Text = React.forwardRef<
  HTMLParagraphElement | HTMLSpanElement,
  TextProps
>(
  (
    { className, variant, color, fontWeight, children, as = 'p', ...props },
    ref,
  ) => {
    const TextElement = as;
    return (
      <TextElement
        className={cn(textVariants({ variant, color, fontWeight }), className)}
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
