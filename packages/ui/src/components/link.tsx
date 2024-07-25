import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

// -- Usage examples --
// <Link href="link.com">link text<Link>
// <Link href="link.com" variant="medium" textColor="destructive" isUnderline>link text<Link>

const linkVariants = cva('ui-font-sandvik-text', {
  variants: {
    variant: {
      large: 'ui-font-sandvik-headline ui-text-2xl',
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
    isUnderline: {
      true: 'ui-underline ui-underline-offset-2',
    },
  },
  defaultVariants: {
    variant: 'medium',
    textColor: 'foreground',
    isUnderline: false,
  },
});

export interface LinkProps
  extends React.HTMLAttributes<HTMLLinkElement>,
    VariantProps<typeof linkVariants> {
  href: string;
}

const Link = React.forwardRef<HTMLLinkElement, LinkProps>(
  ({ className, variant, textColor, isUnderline, href, children }, ref) => {
    return (
      <a
        className={cn(
          linkVariants({ variant, textColor, isUnderline }),
          className,
        )}
        href={href}
        ref={ref as React.RefObject<HTMLAnchorElement>}
      >
        {children}
      </a>
    );
  },
);
Link.displayName = 'Link';

export { Link, linkVariants };
