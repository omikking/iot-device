import * as React from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { ContentHolder, type ContentHolderProps } from './content-holder';
import { Form } from './form';
import { Headline } from './headline';

export interface ContentHolderTableProps<T extends FieldValues = FieldValues> {
  variant: ContentHolderProps['variant'];
  headlineText?: string;
  background?: ContentHolderProps['background'];
  className?: string;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
  layout?: 'row' | 'column';
}

const ContentHolderTable = React.forwardRef<
  HTMLDivElement,
  ContentHolderTableProps
>(
  (
    {
      form,
      onSubmit,
      children,
      layout = 'row',
      variant,
      headlineText,
      background,
      className,
      ...rest
    },
    ref,
  ) => {
    const layoutClass =
      layout === 'row'
        ? 'ui-banshee-flex-row ui-banshee-justify-start ui-banshee-items-center'
        : 'ui-banshee-flex-col';

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
      void form.handleSubmit(onSubmit)(e);
    };

    return (
      <div className="ui-banshee-w-full">
        <Headline
          variant="medium"
          color="foreground"
          isBold
          as="h2"
          className="ui-banshee-ml-4 ui-banshee-mb-1"
        >
          {headlineText}
        </Headline>
        <ContentHolder
          ref={ref}
          variant={variant}
          background={background}
          className={className}
          {...rest}
        >
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className={`ui-banshee-w-full ui-banshee-flex ${layoutClass} ui-banshee-flex-nowrap ui-banshee-gap-2 [&>:last-child]:ml-auto`}
            >
              {children}
            </form>
          </Form>
        </ContentHolder>
      </div>
    );
  },
);
ContentHolderTable.displayName = 'ContentHolderTable';

export { ContentHolderTable };
