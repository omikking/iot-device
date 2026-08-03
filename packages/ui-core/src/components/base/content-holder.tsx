import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Headline } from './headline';

const contentHolderVariants = cva('ds-flex ds-mb-4', {
  variants: {
    variant: {
      general:
        'ds-w-full ds-flex-row ds-py-12 ds-px-8 ds-gap-6 ds-justify-between ds-items-start',
      table:
        'ds-w-full ds-flex-col ds-gap-2 ds-py-4 ds-px-4 ds-border-y-2 ds-border-neutral-3',
      filter:
        'ds-width-full ds-max-w-[1600px] ds-flex-row ds-flex-wrap 2xl:ds-justify-between ds-gap-6 ds-py-6 ds-px-8',
      image:
        'ds-w-full ds-flex-row ds-gap-6 ds-items-center',
    },
    background: {
      light: 'ds-bg-neutral-1',
      transparent: 'ds-bg-transparent',
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
            className="ds-ml-4 ds-mb-1"
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
