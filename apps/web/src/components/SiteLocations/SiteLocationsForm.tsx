import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button, Form } from '@gsp/ui';
import { LucideCircleCheckBig, LucideX } from 'lucide-react';
import { z } from 'zod';

// unsure if this is the correct way to do this?
const siteLocationsSchema = z.object({
  id: z.string(),
  name: z.string(),
});

type SiteLocationsValue = z.infer<typeof siteLocationsSchema>;
interface SiteLocationsFormProps {
  form: UseFormReturn<SiteLocationsValue>;
  // @TODO Gives error but it works. investigate why.
  // eslint-disable-next-line no-unused-vars
  onSubmit: (event: React.FormEvent<HTMLFormElement>, index: number) => void;
  // eslint-disable-next-line no-unused-vars
  onCancel: (index: number) => void;
  placeholder: string;
  name: string;
  index: number;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const SiteLocationsForm = ({
  form,
  onSubmit,
  onCancel,
  placeholder,
  name,
  index,
  inputRef,
}: SiteLocationsFormProps) => {
  return (
    <Form {...form}>
      <form
        onSubmit={(event) => onSubmit(event, index)}
        className="flex flex-row w-full justify-end items-center gap-2"
      >
        <input
          className="w-full  focus:outline focus:outline-none"
          name={name}
          placeholder={placeholder}
          ref={inputRef}
        />
        <Button
          size="small"
          variant="outline"
          type="button"
          onClick={() => onCancel(index)}
        >
          <LucideX />
        </Button>
        <Button size="small" variant="primary" type="submit">
          <LucideCircleCheckBig />
          Save
        </Button>
      </form>
    </Form>
  );
};
