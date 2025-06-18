import React from 'react';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { Button, Form, FormControl, FormField, FormItem, Input } from '@gsp/ui';
import { LucideCircleCheckBig, LucideX } from 'lucide-react';
import { z } from 'zod';

export const siteLocationsSchema = z.object({
  id: z.string(),
  levelName: z.string().optional(),
  driveName: z.string().optional(),
  locationName: z.string().optional(),
});

export type SiteLocationsValue = z.infer<typeof siteLocationsSchema>;

type AddSiteLocationItemFormProps = {
  form: UseFormReturn<SiteLocationsValue>;
  type: 'level' | 'drive' | 'location';
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: SubmitHandler<SiteLocationsValue>;
  onCancel: () => void;
};

export const AddSiteLocationItemForm = ({
  form,
  type,
  inputRef,
  onSubmit,
  onCancel,
}: AddSiteLocationItemFormProps) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-row w-full justify-end items-center gap-2"
      >
        <FormField
          control={form.control}
          name={`${type}Name`}
          render={({ field }) => {
            return (
              <FormItem className="w-full min-w-0 flex-1">
                <FormControl>
                  <Input
                    {...field}
                    autoFocus
                    placeholder={`New ${type}...`}
                    ref={inputRef}
                    className="border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 !p-0 max-h-9 !bg-transparent"
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />
        <Button size="small" variant="outline" type="button" onClick={onCancel}>
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
