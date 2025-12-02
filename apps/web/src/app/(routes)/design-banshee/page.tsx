'use client';
import Image from 'next/image';
import {
  Text,
  Form,
  Tabs,
  Badge,
  Input,
  Table,
  Label,
  Button,
  Switch,
  Tooltip,
  Headline,
  FormItem,
  Dropdown,
  Combobox,
  Textarea,
  Checkbox,
  TabsList,
  TableRow,
  FormLabel,
  FormField,
  TableHead,
  ColumnDef,
  TableBody,
  TableCell,
  FormControl,
  FormMessage,
  TabsTrigger,
  TabsContent,
  TableHeader,
  TooltipArrow,
  TimeCalendar,
  ContentHolder,
  ChartPieDonut,
  ScheduleTable,
  TooltipContent,
  FilterDropdown,
  TooltipTrigger,
  ChartLineLinear,
  TooltipProvider,
  ScheduleTableHead,
  ScheduleTableCell,
  ScheduleDataTable,
  ContentHolderTable,
  SmallChartPieDonut,
  SingleDateCalendar,
  ScheduleTableHeadWithSorting,
} from '@gsp/ui-banshee';
import {
  UserSchema,
  chartDataMock,
  chartItemsMock,
  chartConfigMock,
  usersDesignSystemMock,
  optionsDesignSystemMock,
  tableViewDesignSystemMock,
} from '@/app/mock/mock';
import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConfirmModal } from '@/components/banshee-components/ConfirmModal';
import { ChartConfig } from 'node_modules/@gsp/ui-banshee/src/components/charts/chart';
import bansheeImage from '../../../../../../packages/ui-banshee/src/images/banshee-xcell.png';

type Technician = UserSchema;

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
  const [filterValues, setFilterValues] = useState<string[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const loremText =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla accumsan fermentum arcu auctor imperdiet. Cras tincidunt enim nec augue efficitur, vitae varius metus vehicula. Proin efficitur laoreet pharetra. ';

  const columns: ColumnDef<Technician>[] = [
    {
      accessorKey: 'id',
      header: '',
    },
    {
      accessorKey: 'fullName',
      header: ({ column }) => (
        // TODO Fix arrowDown SVG
        <ScheduleTableHeadWithSorting column={column} header="Full name" />
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <ScheduleTableHeadWithSorting column={column} header="Email" />
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => (
        <ScheduleTableHeadWithSorting column={column} header="Phone number" />
      ),
    },
  ];

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <Headline variant="xl" as="h1" color="foreground">
        Banshee Design System Page 🚀
      </Headline>
      <hr className="w-full border-neutral-2" />
      <Headline variant="large" as="h1" color="foreground">
        Line Chart 🚀
      </Headline>
      <div className="w-full flex justify-center">
        <ChartLineLinear
          showAxis={true}
          hideXAxisLabel={false}
          showLegend={false}
          chartLabel={'Pls god make this chart stop'}
        />
      </div>
      <hr className="w-full border-neutral-2" />
      {/* Donut Chart */}
      <Headline variant="large" as="h1" color="foreground">
        Donut Chart 🚀
      </Headline>
      <div className="w-full flex justify-center">
        <ChartPieDonut
          chartData={chartDataMock}
          chartConfig={chartConfigMock}
          chartItems={chartItemsMock}
        />
      </div>
      <div className="flex flex-row gap-2">
        <SmallChartPieDonut
          chartData={chartDataMock}
          chartConfig={chartConfigMock}
        />
        <SmallChartPieDonut
          chartData={chartDataMock}
          chartConfig={chartConfigMock}
          footerText="Group 1"
        />
      </div>

      <hr className="w-full border-neutral-2" />
      {/* Modal */}
      <Headline variant="large" as="h1" color="foreground">
        Modal 🚀
      </Headline>

      <Button onClick={() => setIsConfirmModalOpen(true)}>
        Open THE Incredible Modal
      </Button>

      {/* Confirm Modal */}
      <ConfirmModal
        modalTitle="Jamiroquai"
        modalConfirmButtonText="Confirm"
        isLoading={isConfirming}
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onOpenChange={closeConfirmModal}
        // commentBox="Using Sandvik carbon black, the modal is placed over a 60% transparent background overlay."
        // onConfirm={handleConfirm}
        // tableView={tableViewDesignSystemMock}
      >
        <Text variant={'medium'} color={'foreground'}>
          {loremText}
        </Text>

        <Image
          src={bansheeImage}
          alt="Example Image"
          width={384}
          height={384}
        />
      </ConfirmModal>

      {/* Table row & Table header */}
      <Headline variant="large" as="h1" color="foreground">
        Table Row & Table Header 🚀
      </Headline>
      <div className="w-[700px] h-40 overflow-y-auto border-b">
        {/* TODO Fix border bottom on the headers */}
        <ScheduleDataTable columns={columns} data={usersDesignSystemMock} />
      </div>

      <ScheduleTable>
        <TableHeader>
          <TableRow>
            <ScheduleTableHead className="w-4">A</ScheduleTableHead>
            <ScheduleTableHead className="w-[220px]">
              Full name
            </ScheduleTableHead>
            <ScheduleTableHead>Email</ScheduleTableHead>
            <ScheduleTableHead>App access</ScheduleTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersDesignSystemMock.map((user) => {
            return (
              <TableRow key={user.id}>
                <ScheduleTableCell>{'A'}</ScheduleTableCell>
                <ScheduleTableCell>{user.fullName}</ScheduleTableCell>
                <ScheduleTableCell>{user.email}</ScheduleTableCell>
                <ScheduleTableCell>{'Banshee'}</ScheduleTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </ScheduleTable>
      <div className="max-w-[1320px] w-full h-40 overflow-y-auto border-b">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[220px]">Full name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>App access</TableHead>
              <TableHead>Phone number</TableHead>
              <TableHead>Last</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersDesignSystemMock.map((user) => {
              return (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{'Banshee'}</TableCell>
                  <TableCell>{user.phoneNumber}</TableCell>
                  <TableCell>|||</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div></div>
      <hr className="w-full border-neutral-2" />
      {/* Content Holder */}
      <Headline variant="large" as="h1" color="foreground">
        Content Holder 🚀
      </Headline>
      <ContentHolderTable
        variant="table"
        headlineText="Content Holder Table"
        form={form}
        onSubmit={(data) => console.log('Form submitted:', data)}
      >
        <FormField
          control={form.control}
          name="input"
          render={({ field }) => (
            <FormItem className="w-48">
              <Input placeholder="Input field..." {...field} className="w-48" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="input"
          render={({ field }) => (
            <FormItem className="w-48">
              <Input
                placeholder="Input field..."
                {...field}
                className="w-full"
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="input"
          render={({ field }) => (
            <FormItem className="w-72">
              <Input
                placeholder="Input field..."
                {...field}
                className="w-full"
              />
            </FormItem>
          )}
        />
        <Button variant="primary" size="large">
          Add New Banshee
        </Button>
      </ContentHolderTable>
      <div className="flex flex-col items-center gap-12">
        <ContentHolder variant="image" headlineText="Content Holder Image">
          <Image
            src={bansheeImage}
            alt="Example Image"
            width={384}
            height={384}
          />
        </ContentHolder>
      </div>
      <Form {...form}>
        <form
          onSubmit={() => console.log('submit form')}
          className="w-full max-w-[1200px] flex flex-row justify-center flex-nowrap gap-12"
        >
          <ContentHolder
            variant="general"
            className="w-full flex flex-wrap gap-12"
            headlineText="Example with inputs"
          >
            <FormField
              control={form.control}
              name="textarea"
              render={({ field }) => {
                return (
                  // TODO Find a better solution for the width calc
                  <FormItem className="w-[calc(50%-12px)]">
                    <FormLabel>Textarea Field</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Textarea..."
                        {...field}
                        className="w-full"
                        rows={5}
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
                  <FormItem className="w-[calc(50%-12px)]">
                    <FormLabel>Combo Field</FormLabel>
                    <FormControl>
                      <Combobox
                        id="technician"
                        placeholder="Select technician"
                        options={optionsDesignSystemMock}
                        onSelect={setDropdownValue}
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
              name="input"
              render={({ field }) => {
                return (
                  <FormItem className="w-[calc(50%-12px)]">
                    <FormLabel>Input Field </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="I field..."
                        {...field}
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
              name="input"
              render={({ field }) => {
                return (
                  <FormItem className="w-[calc(50%-12px)]">
                    <FormLabel>Disabled Input Field </FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Disabled input field..."
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </ContentHolder>
        </form>
      </Form>
      <hr className="w-full border-neutral-2" />
      {/* Filter Dropdown */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Filter Dropdown 🚀
        </Headline>
        <FilterDropdown
          id="filter-users"
          placeholder="Filter technicians..."
          options={optionsDesignSystemMock}
          onSelect={setFilterValues}
          className="w-96"
        />
      </div>
      <hr className="w-full border-neutral-2" />
      {/* Checkbox */}
      <div className="flex flex-col items-center gap-6">
        <Headline variant="large" as="h1" color="foreground">
          Checkbox 🚀
        </Headline>
        <div className="flex flex-row items-center gap-3">
          <Checkbox />
          Select All
        </div>
        <div className="flex flex-row items-center gap-3">
          <Checkbox />
          Select This
        </div>
        <div className="flex flex-row items-center gap-3">
          <Checkbox />
          Select That
        </div>
      </div>
      <hr className="w-full border-neutral-2" />
      {/* Tabs */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Tabs 🚀
        </Headline>
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Text variant="medium" color="foreground">
              This is the content of Tab 1.
            </Text>
          </TabsContent>
          <TabsContent value="tab2">
            <Text variant="medium" color="foreground">
              This is the content of Tab 2.
            </Text>
          </TabsContent>
        </Tabs>
      </div>
      <hr className="w-full border-neutral-2" />
      {/* Switch */}
      <div className="flex flex-col items-center gap-12">
        <Headline variant="large" as="h1" color="foreground">
          Switch 🚀
        </Headline>
        <Switch />
        <Switch disabled />
      </div>
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
                    {/* TODO disabled should change color of text */}
                    <FormControl>
                      <TimeCalendar id="time" className="w-96" />
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
        <div>
          {/* check why padding not working as it should */}
          <Label className="">Combobox</Label>
          <Combobox
            id="combobox"
            className="w-96"
            options={optionsDesignSystemMock}
            disabled={false}
            placeholder="Technician..."
            onSelect={(id) => console.log('Combobox selected id:', id)}
          />
        </div>
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
