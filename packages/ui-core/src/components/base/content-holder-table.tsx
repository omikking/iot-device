'use client';
import * as React from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { ContentHolder, type ContentHolderProps } from './content-holder';
import { Form } from './form';
import { Headline } from './headline';

type FormValue = {
  input: string;
  dropdown: string;
  calendar: string;
  textarea: string;
};

export interface ContentHolderTableProps<T extends FieldValues = FieldValues> {
  variant: ContentHolderProps['variant'];
  headlineText?: string;
  background?: ContentHolderProps['background'];
  className?: string;
  form: UseFormReturn<T>; // TODO Need a schema when using useForm
  onSubmit: (data: T) => void;
  children: React.ReactNode;
  layout?: 'row' | 'column';
}

const ContentHolderTable = React.forwardRef<
  HTMLDivElement,
  ContentHolderTableProps<FormValue>
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
        ? 'ds-flex-row ds-justify-start ds-items-center'
        : 'ds-flex-col';

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
      void form.handleSubmit(onSubmit)(e);
    };

    return (
      <div className="ds-w-full">
        <Headline
          variant="medium"
          color="foreground"
          isBold
          as="h2"
          className="ds-ml-4 ds-mb-1"
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
              className={`ds-w-full ds-flex ${layoutClass} ds-flex-nowrap ds-gap-2 [&>:last-child]:ml-auto`}
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
