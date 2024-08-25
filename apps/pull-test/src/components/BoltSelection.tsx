'use client';

import {
  Button,
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
import { LucideSlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

  const sites = [
    {
      id: '1',
      name: '20001',
    },
    {
      id: '2',
      name: '20023',
    },
  ];

  return (
    <ContentHolder variant="filter">
      <Form {...form}>
        <form
          onSubmit={() => console.log('submit form')}
          className="w-full flex flex-row items-center flex-wrap gap-8"
        >
          <Button variant="primary" size="large" className="mt-8">
            <LucideSlidersHorizontal />
            Filter
          </Button>
          <FormField
            control={form.control}
            name="site"
            render={() => {
              return (
                <FormItem className="mt-0.5">
                  <FormLabel>Site</FormLabel>
                  <FormControl>
                    <Dropdown
                      id="person"
                      placeholder="Select site"
                      selectedId={dropdownValue}
                      options={sites}
                      onSelect={(e) => setDropdownValue(e)}
                      className="w-[320px]"
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
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <FormControl>
                    <Dropdown
                      id="person"
                      placeholder="Select level"
                      selectedId={dropdownValue}
                      options={sites}
                      onSelect={(e) => setDropdownValue(e)}
                      className="w-[320px]"
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
                <FormItem>
                  <FormLabel>Drive</FormLabel>
                  <FormControl>
                    <Dropdown
                      id="person"
                      placeholder="Select drive"
                      selectedId={dropdownValue}
                      options={sites}
                      onSelect={(e) => setDropdownValue(e)}
                      className="w-[320px]"
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
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Dropdown
                      id="person"
                      placeholder="Select position"
                      selectedId={dropdownValue}
                      options={sites}
                      onSelect={(e) => setDropdownValue(e)}
                      className="w-[320px]"
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
