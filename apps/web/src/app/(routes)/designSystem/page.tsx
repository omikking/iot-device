'use client';
import {
  Button,
  Headline,
  Anchor,
  Text,
  Badge,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  Dropdown,
  Textarea,
  Checkbox,
  Switch,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Popover,
  PopoverTrigger,
  PopoverContent,
  RadioGroup,
  RadioGroupItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  RangeCalendar,
  SingleDateCalendar,
  HazardCard,
} from '@gsp/ui';

import {
  LucideBot,
  LucideChevronDown,
  LucideCircleCheckBig,
  LucideOctagonAlert,
  LucideCloudUpload,
  LucideEllipsis,
  LucideKey,
  LucideGitGraph,
  LucideGrid3X3,
  LucideList,
  LucideMoveLeft,
  LucideMoveRight,
  LucidePickaxe,
  LucideUser,
  LucideX,
  LucideSlidersHorizontal,
} from 'lucide-react';

import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const boltInfoItems = [
  { title: 'Diameter', text: '66.40 cm' },
  { title: 'Pass Criteria', text: 'N/A' },
  {
    title: 'Location',
    text: 'Södra Larmgatan 4, 411 16 Göteborg, Sweden',
  },
];

export default function Page(): JSX.Element {
  const formSchema = z.object({
    input: z.string(),
    dropdown: z.string(),
    calendar: z.string(),
    textarea: z.string(),
  });

  // to validate the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: '',
      dropdown: '',
      calendar: '',
      textarea: '',
    },
  });

  const options = [
    {
      id: '1',
      name: 'Elliot Anderson',
    },
    {
      id: '2',
      name: 'Darlene Anderson',
    },
    {
      id: '3',
      name: 'Tyrell Wellick',
    },
    {
      id: '4',
      name: 'Joanna Wellick',
    },
  ];

  const [dropdownValue, setDropdownValue] = useState<string | undefined>(
    undefined,
  );

  // For SingleDateCalendar
  // const [date, setDate] = useState<Date | undefined>(undefined);

  // For RangeCalendar
  // const [rangeDate, setRangeDate] = useState<DateRange | undefined>({
  //   from: undefined,
  //   to: undefined,
  // });

  const getRoleBadge = (role: 'User' | 'Technician' | 'Admin') => {
    const badges = {
      User: {
        variant: 'neutral',
        icon: <LucideUser />,
      },
      Technician: {
        variant: 'neutral',
        icon: <LucidePickaxe />,
      },
      Admin: {
        variant: 'primary',
        icon: <LucideKey />,
      },
    };
    return badges[role];
  };

  const usersMock = [
    {
      id: '1',
      name: 'Elliot Anderson',
      email: 'anderson@sandvik.com',
      appAccess: 'Pull-test, Ultrabots, xCyclops',
      role: 'User',
      phoneNumber: '+4683729327',
    },
    {
      id: '2',
      name: 'Jimmy Nwadinkpa',
      email: 'jimmy@sandvik.com',
      appAccess: 'Ultrabots, xCyclops',
      role: 'Technician',
      phoneNumber: '+4683729327',
    },
    {
      id: '3',
      name: 'Felix Östergren',
      email: 'felix@sandvik.com',
      appAccess: 'Pull-test',
      role: 'User',
      phoneNumber: '+4683729327',
    },
    {
      id: '4',
      name: 'Darlene Anderson',
      email: 'darleneanderson@sandvik.com',
      appAccess: 'Pull-test, Ultrabots, xCyclops',
      role: 'Admin',
      phoneNumber: '+4683729327',
    },
  ];

  return (
    <main className="flex flex-col items-center justify-start gap-12 min-h-screen p-24 ">
      <Headline variant="xl" as="h1" color="foreground">
        Design system experiments 🦄
      </Headline>

      <hr className="w-full" />

      <HazardCard
        dateTitle="2021-05-23"
        isHazard={true}
        boltInfoItems={boltInfoItems}
        boltDescription="Bolt could not be tested..."
      ></HazardCard>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Popover 🦄
      </Headline>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="primary" size="small">
            <LucideSlidersHorizontal />
            Filter
          </Button>
        </PopoverTrigger>
        <PopoverContent>
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

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Buttons 🦄
      </Headline>
      <div className="flex flex-row flex-wrap justify-center gap-12">
        <Button variant="primary" size="large">
          <LucideBot />
        </Button>

        <Button variant="secondary" size="large">
          <LucideBot />
          Secondary large with icon
        </Button>

        <Button variant="outline" size="large">
          Outline large
        </Button>

        <Button variant="primary" size="large" disabled>
          Disabled large
        </Button>

        <Button variant="destructive" size="large">
          Destructive large
        </Button>

        <Button variant="secondary" size="small">
          <LucideChevronDown />
        </Button>

        <Button variant="primary" size="small">
          <LucideChevronDown />
          Primary small with icon
        </Button>

        <Button variant="primary" size="small">
          Primary small
        </Button>

        <Button variant="secondary" size="small">
          Secondary small
        </Button>

        <Button variant="outline" size="small">
          Outline small
        </Button>

        <Button variant="primary" size="small" disabled>
          Disabled small
        </Button>

        <Button variant="destructive" size="small">
          Destructive small
        </Button>

        <Button variant="secondary" size="small" asChild>
          <Link href="#">
            <LucideMoveRight />
            Button used as link
          </Link>
        </Button>
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Badges 🦄
      </Headline>
      <div className="flex flex-row flex-wrap gap-12 justify-center">
        <Badge variant="primary">Primary</Badge>

        <Badge variant="attention">Attention</Badge>

        <Badge variant="neutral">Neutral</Badge>

        <Badge variant="destructive">Destructive</Badge>

        <Badge variant="success">Success</Badge>

        <Badge variant="warning">Warning</Badge>

        <Badge variant="primary">
          <LucideCircleCheckBig size="14" />
          Primary with icon
        </Badge>

        <Badge variant="attention">
          <LucideCloudUpload size="14" />
          Attention with icon
        </Badge>

        <Badge variant="neutral">
          <LucideBot size="14" />
        </Badge>

        <Badge variant="primary" size="large">
          Primary large
        </Badge>

        <Badge variant="primary" size="large">
          <LucideBot />
          Primary large with icon
        </Badge>

        <Badge variant="primary" size="large">
          <LucideBot />
        </Badge>
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Headlines 🦄
      </Headline>
      <div className="flex flex-col items-center gap-12">
        <Headline as="h1" variant="xl" color="foreground">
          XL Headline
        </Headline>

        <Headline as="h2" variant="large" color="destructive">
          Large Headline destructive color
        </Headline>

        <Headline as="h3" variant="medium" color="muted">
          Medium Headline muted color
        </Headline>

        <Headline as="h4" variant="smallBold" color="foreground">
          Small bold Headline
        </Headline>
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Texts 🦄
      </Headline>
      <div className="flex flex-col items-center gap-12">
        <Text variant="medium" color="foreground">
          Medium text
        </Text>

        <Text variant="small" color="destructive">
          Small text with destructive color
        </Text>

        <Text variant="xs" color="muted">
          XS text with muted color
        </Text>
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Links 🦄
      </Headline>
      <div className="flex flex-col items-center gap-12">
        <Text variant="xs" color="foreground">
          <Link href="#" passHref legacyBehavior>
            <Anchor isUnderline color="foreground">
              Link and black underline
            </Anchor>
          </Link>
        </Text>

        <Text variant="medium" color="destructive">
          <Link href="#" passHref legacyBehavior>
            <Anchor isUnderline color="destructive">
              Link and destructive underline
            </Anchor>
          </Link>
        </Text>

        <Headline variant="medium" color="foreground" as="h2">
          <Link href="#" passHref legacyBehavior>
            <Anchor color="foreground">
              <LucideMoveRight />
              Link with icon and no underline
            </Anchor>
          </Link>
        </Headline>

        <Text variant="medium" color="foreground">
          <Link href="#" passHref legacyBehavior>
            <Anchor color="foreground">
              <LucideMoveLeft size="20" />
              Go back
            </Anchor>
          </Link>
        </Text>
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Radio 🦄
      </Headline>
      <div className="flex ui-flex-row ui-flex-wrap ui-gap-12 ui-justify-center">
        <Form {...form}>
          <form
            onSubmit={() => console.log('submit form')}
            className="w-full flex flex-row justify-center flex-wrap gap-12"
          >
            <FormField
              control={form.control}
              name="textarea"
              render={() => {
                return (
                  <FormItem className="space-y-3">
                    <FormLabel variant="medium">Choose option</FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue="opt1"
                        // onValueChange={console.log('change value')}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="opt1" />
                          </FormControl>
                          <FormLabel
                            variant="medium"
                            className="cursor-pointer"
                          >
                            Option 1
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="opt2" />
                          </FormControl>
                          <FormLabel
                            variant="medium"
                            className="cursor-pointer"
                          >
                            Option 2
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem disabled value="opt3" />
                          </FormControl>
                          <FormLabel disabled variant="medium">
                            Disabled option 3
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Checkbox 🦄
      </Headline>
      <div className="flex flex-row flex-wrap gap-12 justify-center">
        <Form {...form}>
          <form
            onSubmit={() => console.log('submit form')}
            className="w-full flex flex-row justify-center flex-wrap gap-12"
          >
            <FormField
              control={form.control}
              name="textarea"
              render={() => {
                return (
                  <FormItem className="flex gap-3">
                    <FormControl>
                      <Checkbox />
                    </FormControl>
                    <FormLabel variant="medium" className="cursor-pointer">
                      Checkbox label
                    </FormLabel>
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="textarea"
              render={() => {
                return (
                  <FormItem className="flex gap-3">
                    <FormControl>
                      <Checkbox disabled />
                    </FormControl>
                    <FormLabel variant="medium">Disabled checkbox</FormLabel>
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        TextArea 🦄
      </Headline>
      <div className="flex flex-row flex-wrap gap-12 justify-center">
        <Form {...form}>
          <form
            onSubmit={() => console.log('submit form')}
            className="w-full flex flex-row justify-center flex-wrap gap-12"
          >
            <FormField
              control={form.control}
              name="textarea"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Text area label</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Text area placeholder..."
                        className="w-[400px] h-[140px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="textarea"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Disabled text area label</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled
                        placeholder="Text area placeholder..."
                        className="w-[400px] h-[140px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Input field, dropdown & calendar 🦄
      </Headline>
      <div>
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
                    <FormLabel>Single calendar</FormLabel>
                    <FormControl>
                      <SingleDateCalendar className="w-[400px]" />
                    </FormControl>
                    <FormMessage />
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
                    <FormLabel>Disabled single calendar</FormLabel>
                    <FormControl>
                      <SingleDateCalendar disabled className="w-[400px]" />
                    </FormControl>
                    <FormMessage />
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
                    <FormLabel>Range calendar</FormLabel>
                    <FormControl>
                      <RangeCalendar className="w-[400px]" />
                    </FormControl>
                    <FormMessage />
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
                    <FormLabel>Disabled range calendar</FormLabel>
                    <FormControl>
                      <RangeCalendar disabled className="w-[400px]" />
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
                    <FormLabel>Input</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter input"
                        {...field}
                        className="w-[400px]"
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
                    <FormLabel>Disabled input</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Enter input"
                        {...field}
                        className="w-[400px]"
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
                  <FormItem>
                    <FormLabel>Dropdown</FormLabel>
                    <FormControl>
                      <Dropdown
                        id="person"
                        placeholder="Select dropdown item"
                        selectedId={dropdownValue}
                        options={options}
                        onSelect={(e) => setDropdownValue(e)}
                        className="w-[400px]"
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
                  <FormItem>
                    <FormLabel>Disabled dropdown</FormLabel>
                    <FormControl>
                      <Dropdown
                        disabled
                        id="person"
                        placeholder="Select dropdown item"
                        options={options}
                        onSelect={(e) => setDropdownValue(e)}
                        className="w-[400px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </form>
        </Form>
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Switch toggle 🦄
      </Headline>
      <div className="flex flex-row flex-wrap gap-12">
        <Switch checked />
        <Switch />
        <Switch disabled />
      </div>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Table 🦄
      </Headline>
      <div className="flex flex-row flex-wrap gap-5 max-w-[1320px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[220px]">Full name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>App access</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone number</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersMock.map((user, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.appAccess}</TableCell>
                <TableCell>
                  {/* Typing needs to be specified, do later */}
                  <Badge variant={getRoleBadge(user.role).variant}>
                    {getRoleBadge(user.role).icon}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="small">
                    <LucideEllipsis />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Badge variant="neutral" className="self-start">
          {usersMock.length} total
        </Badge>
      </div>

      <Headline variant="large" as="h1" color="foreground">
        Tabs 🦄
      </Headline>
      <div className="flex flex-row flex-wrap gap-12">
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Tab 1 content here</TabsContent>
          <TabsContent value="tab2">Tab 2 content here</TabsContent>
        </Tabs>

        <Tabs defaultValue="images">
          <TabsList>
            <TabsTrigger value="grid">
              <LucideGrid3X3 size="18" className="mr-1.5" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="graphs">
              <LucideGitGraph size="18" className="mr-1.5" />
              Graphs
            </TabsTrigger>
            <TabsTrigger value="list">
              <LucideList size="18" className="mr-1.5" />
              List
            </TabsTrigger>
          </TabsList>
          <TabsContent value="grid">Grid layout</TabsContent>
          <TabsContent value="graphs">Graphs layout</TabsContent>
          <TabsContent value="list">List layout</TabsContent>
        </Tabs>
      </div>

      <hr className="w-full" />
    </main>
  );
}
