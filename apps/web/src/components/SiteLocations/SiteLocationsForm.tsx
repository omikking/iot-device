import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button, Form } from '@gsp/ui';
import { LucideCircleCheckBig, LucideX } from 'lucide-react';
interface SiteLocationsFormProps {
  // @TODO fick this type
  form: UseFormReturn<any>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, index: number) => void;
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
