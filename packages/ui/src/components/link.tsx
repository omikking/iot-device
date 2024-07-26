import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

//@TODO solve handling of texts and headlines inside link
//@TODO solve using Link from Next instead of <a> tag

// Wrap Link around the components

// -- Usage examples --
// <Link href="link.com" color={'foreground'}>
//     <Headline as="h2" variant="large" color={'foreground'}>
//       Page link here
//     </Headline>
// <Link>

// <Link href="link.com" isUnderline color={'foreground'}>
//     <SomeIcon size={'12'} />
//     <Text variant={'medium'} color={'foreground'}>
//       Some link here
//     </Text>
// <Link>

const linkVariants = cva(
  'ui-font-sandvik-text ui-transition ease-in-out ui-duration-200 ui-flex gap-4 ui-items-center',
  {
    variants: {
      color: {
        foreground: 'ui-text-foreground/30 hover:ui-text-foreground', // @TODO update to correct color
        background: 'ui-text-background/30 hover:ui-text-background', // @TODO update to correct color
        muted: 'ui-text-muted-foreground/30 hover:ui-text-muted-foreground', // @TODO update to correct color
        destructive: 'ui-text-destructive/30 hover:ui-text-destructive', // @TODO update to correct color
      },
      isUnderline: {
        true: 'ui-underline ui-underline-offset-2',
      },
    },
  },
);

export interface LinkProps
  extends Omit<React.HTMLAttributes<HTMLLinkElement>, 'color'>,
    Required<Pick<VariantProps<typeof linkVariants>, 'color'>> {
  href: string;
  isUnderline?: boolean;
}

const Link = React.forwardRef<HTMLLinkElement, LinkProps>(
  ({ className, isUnderline, color, href, children }, ref) => {
    return (
      <a
        className={cn(linkVariants({ color, isUnderline }), className)}
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
