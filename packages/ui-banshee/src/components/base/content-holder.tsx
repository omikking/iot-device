import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Headline } from './headline';

const contentHolderVariants = cva('ui-banshee-flex ui-banshee-mb-4', {
  variants: {
    variant: {
      general:
        'ui-banshee-w-full ui-banshee-flex-row ui-banshee-py-12 ui-banshee-px-8 ui-banshee-gap-6 ui-banshee-justify-between ui-banshee-items-start',
      table:
        'ui-banshee-w-full ui-banshee-flex-col ui-banshee-gap-2 ui-banshee-py-4 ui-banshee-px-4 ui-banshee-border-y-2 ui-banshee-border-neutral-3',
      filter:
        'ui-banshee-width-full ui-banshee-max-w-[1600px] ui-banshee-flex-row ui-banshee-flex-wrap 2xl:ui-banshee-justify-between ui-banshee-gap-6 ui-banshee-py-6 ui-banshee-px-8',
      image:
        'ui-banshee-w-full ui-banshee-flex-row ui-banshee-gap-6 ui-banshee-items-center',
    },
    background: {
      light: 'ui-banshee-bg-neutral-1',
      transparent: 'ui-banshee-bg-transparent',
    },
  },
  defaultVariants: {
    background: 'light',
  },
});

export interface ContentHolderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Required<Pick<VariantProps<typeof contentHolderVariants>, 'variant'>>,
    Pick<VariantProps<typeof contentHolderVariants>, 'background'> {
  headlineText?: string;
}

const ContentHolder = React.forwardRef<HTMLDivElement, ContentHolderProps>(
  ({ className, variant, background, headlineText, children }, ref) => {
    return (
      <div className="ui-banshee" ref={ref}>
        {!!headlineText && (
          <Headline
            variant="medium"
            color="foreground"
            as="h2"
            className="ui-banshee-ml-4 ui-banshee-mb-1"
          >
            {headlineText}
          </Headline>
        )}

        <div
          className={cn(
            contentHolderVariants({ variant, background }),
            className,
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);
ContentHolder.displayName = 'ContentHolder';

export { ContentHolder, contentHolderVariants };
