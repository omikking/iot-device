import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const textVariants = cva('ui-banshee-font-sandvik-text', {
  variants: {
    variant: {
      large: 'ui-banshee-text-lg',
      medium: 'ui-banshee-text-md',
      small: 'ui-banshee-text-sm ui-banshee-tracking-wide',
      xs: 'ui-banshee-text-xs ui-banshee-tracking-wide',
    },
    color: {
      foreground: 'ui-banshee-text-main-black',
      background: 'ui-banshee-text-main-white',
      muted: 'ui-banshee-text-neutral-5',
      destructive: 'ui-banshee-text-error',
      // accent: 'ui-banshee-text-orange-primary',
    },
    isBold: {
      false: 'ui-banshee-font-normal',
      true: 'ui-banshee-font-bold',
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
