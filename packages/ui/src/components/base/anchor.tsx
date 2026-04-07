import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

// Use asChild to compose with Next.js <Link> without nesting <a> tags:
// <Anchor asChild color="accent" isUnderline><Link href="/path">label</Link></Anchor>
// https://www.radix-ui.com/primitives/docs/utilities/slot

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
  asChild?: boolean;
}

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ className, isUnderline, color, href, children, asChild = false }, ref) => {
    const Component = asChild ? Slot : 'a';
    return (
      <Component
        className={cn(anchorVariants({ color, isUnderline }), className)}
        href={href}
        ref={ref}
      >
        {children}
      </Component>
    );
  },
);
Anchor.displayName = 'Anchor';

export { Anchor, anchorVariants };
