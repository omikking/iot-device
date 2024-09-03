'use client';

import {
  ContentHolder,
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gsp/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { BoltResultsFilter } from './BoltResultsFilter';

// @TODO: Add filtering functionality, this is essentially a visual mockup currently.
export const BoltSelection = () => {
  // Might need to move form data to bolt results page.tsx?
  const formSchema = z.object({
    site: z.string(),
    level: z.string(),
    drive: z.string(),
    position: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      site: '',
      level: '',
      drive: '',
      position: '',
    },
  });

  const [dropdownValue, setDropdownValue] = useState<string | undefined>(
    undefined,
  );

  // @TODO: Replace with site, level, drive, position hierarchy data.
  const sites = [
    {
      id: '1',
      name: 'Placeholder site',
    },
    {
      id: '2',
      name: 'Gollum site',
    },
  ];

  return (
    <ContentHolder variant="filter">
      <Form {...form}>
        <form
          onSubmit={() => console.log('submit form')}
          className="w-full flex flex-row items-center gap-8"
        >
          <BoltResultsFilter />

          <FormField
            control={form.control}
            name="site"
            render={() => {
              return (
                <FormItem className="mt-0.5 w-full">
                  <FormLabel>Site</FormLabel>
                  <FormControl>
                    <Dropdown
                      id="person"
                      placeholder="Select site"
                      selectedId={dropdownValue}
                      options={sites}
                      onSelect={(e) => setDropdownValue(e)}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="level"
            render={() => {
              return (
                <FormItem className="mt-0.5 w-full">
                  <FormLabel>Level</FormLabel>
                  <FormControl>
                    <Dropdown
                      id="person"
                      placeholder="Select level"
                      selectedId={dropdownValue}
                      options={sites}
                      onSelect={(e) => setDropdownValue(e)}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="drive"
            render={() => {
              return (
                <FormItem className="mt-0.5 w-full">
                  <FormLabel>Drive</FormLabel>
                  <FormControl>
                    <Dropdown
                      id="person"
                      placeholder="Select drive"
                      selectedId={dropdownValue}
                      options={sites}
                      onSelect={(e) => setDropdownValue(e)}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="position"
            render={() => {
              return (
                <FormItem className="mt-0.5 w-full">
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Dropdown
                      id="person"
                      placeholder="Select position"
                      selectedId={dropdownValue}
                      options={sites}
                      onSelect={(e) => setDropdownValue(e)}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </form>
      </Form>
    </ContentHolder>
  );
};
