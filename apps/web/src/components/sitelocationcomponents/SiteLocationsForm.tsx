import React from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { Button } from '@gsp/ui';
import { LucideCircleCheckBig, LucideX } from 'lucide-react';

interface SiteLocationsFormProps {
  form: UseFormReturn<any>;
  // Gives error but it works. investigate why.
  onSubmit: (event: React.FormEvent<HTMLFormElement>, index: number) => void;
  onCancel: (event: React.MouseEvent<HTMLButtonElement>, index: number) => void;
  placeholder: string;
  name: string;
  index: number;
  inputRef: React.RefObject<HTMLInputElement>;
}

const SiteLocationsForm: React.FC<SiteLocationsFormProps> = ({
  form,
  onSubmit,
  onCancel,
  placeholder,
  name,
  index,
  inputRef,
}) => {
  return (
    <FormProvider {...form}>
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
          onClick={(event) => onCancel(event, index)}
        >
          <LucideX />
        </Button>
        <Button size="small" variant="primary" type="submit">
          <LucideCircleCheckBig />
          Save
        </Button>
      </form>
    </FormProvider>
  );
};

export default SiteLocationsForm;
