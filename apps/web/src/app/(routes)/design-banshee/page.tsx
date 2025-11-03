'use client';
import {
  Button,
  Headline,
  Text,
  Badge,
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
  TooltipProvider,
  Input,
  Dropdown,
  Combobox,
  TimeCalendar,
  Textarea,
  SingleDateCalendar,
} from '@gsp/ui-banshee';
// import { ArrowDown } from '@gsp/ui-banshee/';
import {
  optionsDesignSystemMock,
  usersDesignSystemMock,
  sitesDesignSystemMock,
} from '@/app/mock/mock';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

export default function Page() {
  const formSchema = z.object({
    input: z.string(),
    dropdown: z.string(),
    calendar: z.string(),
    textarea: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: '',
      dropdown: '',
      calendar: '',
      textarea: '',
    },
  });

  const [dropdownValue, setDropdownValue] = useState<string | undefined>(
    undefined,
  );

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <Headline variant="xl" as="h1" color="foreground">
        Banshee Design System Page 🚀
      </Headline>
      <hr className="w-full border-neutral-2" />
      {/* Textarea */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Textarea 🚀
        </Headline>

        <Textarea
          className="w-96"
          resize={false}
          placeholder="Textarea..."
          rows={5}
        />
      </div>
      <hr className="w-full border-neutral-2" />
      {/* Input Field, Drowdown, Calendar & Time Select */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Input Field, Dropdown, Calendar & Time Select 🚀
        </Headline>

        <Form {...form}>
          <form
            onSubmit={() => console.log('submit form')}
            className="w-full max-w-[1200px] flex flex-row justify-center flex-wrap gap-12"
          >
            <FormField
              control={form.control}
              name="calendar"
              render={() => {
                return (
                  <FormItem>
                    {/* <FormLabel>Time & Date Select</FormLabel> */}
                    <FormControl>
                      <TimeCalendar />
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="calendar"
              render={() => {
                return (
                  <FormItem>
                    <FormLabel>Calendar Select</FormLabel>
                    <FormControl>
                      <SingleDateCalendar
                        className="w-96"
                        onDateChange={() => console.log('date change')}
                      />
                    </FormControl>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="dropdown"
              render={() => {
                return (
                  <FormItem className="w-96">
                    <FormLabel>Dropdown Field</FormLabel>
                    <FormControl>
                      <Dropdown
                        id="technician"
                        placeholder="Select technician"
                        options={optionsDesignSystemMock}
                        onSelect={setDropdownValue}
                        className="w-96"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="dropdown"
              render={() => {
                return (
                  <FormItem className="w-96">
                    <FormLabel>Dropdown Field</FormLabel>
                    <FormControl>
                      <Dropdown
                        id="technician"
                        disabled
                        placeholder="Select technician"
                        options={optionsDesignSystemMock}
                        onSelect={setDropdownValue}
                        className="w-96"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="input"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Input Field</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Default input field..."
                        {...field}
                        className="w-96"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="input"
              disabled
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Disabled input Field </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Disabled input field..."
                        {...field}
                        className="w-96"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>

        <Combobox
          id="combobox"
          className="w-96"
          options={optionsDesignSystemMock}
          disabled={false}
          dropdownLabel="Technician"
          placeholder="Technician..."
          onSelect={(id) => console.log('Combobox selected id:', id)}
        />
      </div>
      <hr className="w-full border-neutral-2" />
      {/* Tooltip */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Tooltips 🚀 (not done)
        </Headline>
        {/* TODO Fix arrow color line and delay for the arrow to appear */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Top</TooltipTrigger>

            <TooltipContent side="top">
              <TooltipArrow />
              This is a top tooltip example!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Right</TooltipTrigger>

            <TooltipContent side="right">
              <TooltipArrow />
              This is a right tooltip example!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Bottom</TooltipTrigger>

            <TooltipContent side="bottom">
              <TooltipArrow />
              This is a bottom tooltip example!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Left</TooltipTrigger>

            <TooltipContent side="left">
              <TooltipArrow />
              This is a left tooltip example!
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <hr className="w-full border-neutral-2" />
      {/* Badge */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Badges 🚀
        </Headline>
        <Badge>Neutral</Badge>
      </div>
      <hr className="w-full border-neutral-2" />
      {/* Graph Time Range */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Graph Time Range 🚀
        </Headline>
        <Headline variant="medium" as="h2" color="foreground">
          (Component coming soon...)
        </Headline>
      </div>
      <hr className="w-full border-neutral-2" />
      {/* Button */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Buttons 🚀
        </Headline>
        <Button variant="primary" size="small">
          Button Primary Regular Small
        </Button>
        <Button variant="primary" size="large">
          Button Primary Regular Large
        </Button>
      </div>
      {/* Texts */}
      <hr className="w-full border-neutral-2" />
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Texts 🚀
        </Headline>
        <Text variant="medium" color={'foreground'}>
          Medium text
        </Text>
        <Text variant="medium" color={'foreground'} isBold>
          <a className="underline" href="https://www.google.se">
            Medium bold text
          </a>
        </Text>
        <Text variant="small" color={'foreground'}>
          Small text
        </Text>
        <Text variant="xs" color={'foreground'}>
          XS text
        </Text>
      </div>
      <hr className="w-full border-neutral-2" />
    </main>
  );
}
