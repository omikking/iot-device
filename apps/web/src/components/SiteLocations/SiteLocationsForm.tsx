import { z } from 'zod';
import React from 'react';
import { LucideCircleCheckBig, LucideX } from 'lucide-react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { Button, Form, FormControl, FormField, FormItem, Input } from '@gsp/ui';

type ILocationType = 'level' | 'drive' | 'location';

export const siteLocationsSchema = z.object({
  id: z.string(),
  levelName: z.string().optional(),
  driveName: z.string().optional(),
  locationName: z.string().optional(),
});

export type SiteLocationsValue = z.infer<typeof siteLocationsSchema>;
interface SiteLocationsFormProps {
  form: UseFormReturn<SiteLocationsValue>;
  onSubmit: SubmitHandler<SiteLocationsValue>;
  onCancel: (index: number) => void;
  type: ILocationType;
  index: number;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const SiteLocationsForm = ({
  form,
  onSubmit,
  onCancel,
  type,
  index,
  inputRef,
}: SiteLocationsFormProps) => {
  const getFieldConfig = (
    type: ILocationType,
  ): {
    name: keyof SiteLocationsValue;
    placeholder: string;
  } => {
    switch (type) {
      case 'level':
        return {
          name: 'levelName',
          placeholder: 'New level...',
        };
      case 'drive':
        return {
          name: 'driveName',
          placeholder: 'New drive...',
        };
      case 'location':
        return {
          name: 'locationName',
          placeholder: 'New location...',
        };
    }
  };

  const { name, placeholder } = getFieldConfig(type);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row w-full justify-end items-center gap-2"
      >
        <FormField
          control={form.control}
          name={name}
          render={({ field }) => {
            console.log('hajj');
            return (
              <FormItem className="w-full min-w-0 flex-1">
                <FormControl>
                  <Input
                    {...field}
                    placeholder={placeholder}
                    ref={inputRef}
                    className="border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                  />
                </FormControl>
              </FormItem>
            );
          }}
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
