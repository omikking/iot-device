import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

// We need to use this component with Link from Next when we want text styling. Include props href, passHref, legacyBehavior on Link if used with Anchor.
// https://nextjs.org/docs/pages/api-reference/components/link

const anchorVariants = cva(
  'ui-font-sandvik-text ui-transition ease-in-out ui-duration-200 ui-flex gap-4 ui-items-center',
  {
    variants: {
      color: {
        foreground:
          'ui-decoration-main-black/30 hover:ui-decoration-main-black',
        background:
          'ui-decoration-main-white/30 hover:ui-decoration-main-white',
        muted: 'ui-decoration-neutral-5/30 hover:ui-decoration-neutral-5',
        destructive: 'ui-decoration-error/30 hover:ui-decoration-error',
        accent:
          'ui-decoration-orange-primary/30 hover:ui-decoration-orange-primary',
      },
      isUnderline: {
        true: 'ui-underline ui-underline-offset-2',
      },
    },
  },
);

export interface AnchorProps
  extends
    Omit<React.HTMLAttributes<HTMLAnchorElement>, 'color'>,
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
