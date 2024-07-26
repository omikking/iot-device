import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

// import Link from 'next/link';
//@TODO solve using Link from Next instead of <a> tag

// Wrap Link inside the text or headline item

// -- Usage examples --
// <Headline variant={'medium'} color={'foreground'} as="h2">
//   <Link href="#" color={'foreground'}>
//     <LucideMoveRight />
//     Link with icon and no underline
//   </Link>
// </Headline>

// <Text variant={'xs'} color={'foreground'}>
//   <Link isUnderline href="#" color={'foreground'}>
//     Link and black underline
//   </Link>
// </Text>

const linkVariants = cva(
  'ui-font-sandvik-text ui-transition ease-in-out ui-duration-200 ui-flex gap-4 ui-items-center',
  {
    variants: {
      color: {
        foreground:
          'ui-decoration-main-black/30 hover:ui-decoration-main-black', // @TODO update to correct color
        background:
          'ui-decoration-main-white/30 hover:ui-decoration-main-white', // @TODO update to correct color
        muted: 'ui-decoration-neutral-5/30 hover:ui-decoration-neutral-5', // @TODO update to correct color
        destructive: 'ui-decoration-error/30 hover:ui-decoration-error', // @TODO update to correct color
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
