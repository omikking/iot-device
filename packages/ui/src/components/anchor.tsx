import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

// We need to use this component with Link from Next, with props href, passHref and legacyBehavior on Link and nothing except styling on Anchor.
// https://nextjs.org/docs/pages/api-reference/components/link

// -- Usage examples --
// <Headline variant="medium" color="foreground" as="h2">
//   <Link href="#" passHref legacyBehavior>
//     <Anchor color="foreground">
//       <LucideMoveRight />
//       Link with icon and no underline
//     </Anchor>
//   </Link>
// </Headline>

// <Text variant="xs" color="foreground">
//   <Link href="#" passHref legacyBehavior>
//     <Anchor isUnderline color="foreground">
//       Link and black underline
//     </Anchor>
//   </Link>
// </Text>

const anchorVariants = cva(
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

export interface AnchorProps
  extends Omit<React.HTMLAttributes<HTMLAnchorElement>, 'color'>,
    Required<Pick<VariantProps<typeof anchorVariants>, 'color'>> {
  href?: string;
  isUnderline?: boolean;
}

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ className, isUnderline, color, href, children }, ref) => {
    return (
      <a
        className={cn(anchorVariants({ color, isUnderline }), className)}
        href={href}
        ref={ref}
      >
        {children}
      </a>
    );
  },
);
Anchor.displayName = 'Anchor';

export { Anchor, anchorVariants };
