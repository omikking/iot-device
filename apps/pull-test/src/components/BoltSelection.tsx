'use client';

import {
  Button,
  Checkbox,
  ContentHolder,
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  Badge,
} from '@gsp/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LucideCircleCheckBig,
  LucideOctagonAlert,
  LucideSlidersHorizontal,
  LucideX,
} from 'lucide-react';
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
    <ContentHolder variant="general" className="ui-py-6">
      <Form {...form}>
        <form
          onSubmit={() => console.log('submit form')}
          className="w-full flex flex-row items-center flex-wrap gap-8"
        >
          {/* <Button variant="primary" size="large" className="mt-8">
            <LucideSlidersHorizontal />
            Filter
          </Button> */}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="primary" size="large" className="mt-8">
                <LucideSlidersHorizontal />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="mt-1.5">
              <div className="space-y-2 bg-neutral-1 px-4 py-3">
                <Text variant="small" color="foreground">
                  Results
                </Text>
              </div>
              <div className="flex flex-row px-4 py-3 gap-3 items-center m">
                <Checkbox className="" />
                <Badge variant="success">
                  <LucideCircleCheckBig size="14" />
                  Pass
                </Badge>
              </div>
              <div className="flex flex-row px-4 py-3 gap-3 items-center m">
                <Checkbox />
                <Badge variant="destructive">
                  <LucideOctagonAlert size="14" />
                  Fail
                </Badge>
              </div>
              <div className="space-y-2 bg-neutral-1 px-4 py-3">
                <Text variant="small" color="foreground">
                  Comment
                </Text>
              </div>
              <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-row items-center gap-3">
                  <Checkbox className=""></Checkbox>
                  <Text variant="small" color="foreground">
                    With comment
                  </Text>
                </div>
                <div className="flex flex-row items-center gap-3">
                  <Checkbox />
                  <Text variant="small" color="foreground">
                    With image
                  </Text>
                </div>
                <div className="flex flex-row items-center gap-3">
                  <Checkbox />
                  <Text variant="small" color="foreground">
                    Reported hazard
                  </Text>
                </div>
              </div>
              <div className="p-4 border-t border-t-1 border-neutral-1">
                <Button variant="outline" size="small" isWide>
                  <LucideX />
                  Reset all filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

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
