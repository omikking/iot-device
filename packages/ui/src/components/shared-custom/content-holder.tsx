import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';
import { Headline } from '../base/headline';

// This is the grey box that is used as a wrapper across the projects.

const contentHolderVariants = cva(
  'ui-flex ui-my-4 ui-py-12 ui-px-8 ui-bg-neutral-1 ui-min-w-[1320px] ui-border-2 ui-border-neutral-2',
  {
    variants: {
      variant: {
        general: 'ui-flex-row ui-flex-wrap ui-gap-6 ui-justify-between',
        table: 'ui-flex-col ui-gap-1.5',
        filter: 'ui-flex-row ui-flex-wrap ui-gap-6 ui-justify-between ui-py-6',
      },
    },
  },
);

export interface ContentHolderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Required<Pick<VariantProps<typeof contentHolderVariants>, 'variant'>> {
  headlineText?: string;
}

const ContentHolder = React.forwardRef<HTMLDivElement, ContentHolderProps>(
  ({ className, variant, headlineText, children }) => {
    return (
      <div>
        {!!headlineText && (
          <Headline
            variant="medium"
            color="foreground"
            as="h2"
            className="ui-ml-8"
          >
            {headlineText}
          </Headline>
        )}
        <div className={cn(contentHolderVariants({ variant }), className)}>
          {children}
        </div>
      </div>
    );
  },
);
ContentHolder.displayName = 'ContentHolder';

export { ContentHolder, contentHolderVariants };
