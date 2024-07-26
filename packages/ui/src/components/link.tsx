import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

// Always wrap Link around the components

// -- Usage examples --
// <Link href="link.com">
//     <Headline as="h2" variant="large">
//       Page link here
//     </Headline>
// <Link>

// <Link href="link.com" isUnderline>
//     <SomeIcon size={'12'} />
//     <Text as="p">
//       Some link here
//     </Text>
// <Link>

const linkVariants = cva('ui-font-sandvik-text', {
  variants: {
    isUnderline: {
      true: 'ui-underline ui-underline-offset-2',
    },
  },
  defaultVariants: {
    isUnderline: false,
  },
});

export interface LinkProps
  extends React.HTMLAttributes<HTMLLinkElement>,
    VariantProps<typeof linkVariants> {
  href: string;
}

const Link = React.forwardRef<HTMLLinkElement, LinkProps>(
  ({ className, isUnderline, href, children }, ref) => {
    return (
      <a
        className={cn(linkVariants({ isUnderline }), className)}
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
