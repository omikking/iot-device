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
  RadioGroup,
  RadioGroupItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  RangeCalendar,
  SingleDateCalendar,
  Modal,
  ModalTrigger,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@gsp/ui';

import {
  LucideBot,
  LucideChevronDown,
  LucideCircleCheckBig,
  LucideCloudUpload,
  LucideEllipsis,
  LucideKey,
  LucideGitGraph,
  LucideGrid3X3,
  LucideList,
  LucideMoveRight,
  LucidePickaxe,
  LucideUser,
  LucideTrash2,
  LucideSquarePen,
} from 'lucide-react';

import Link from 'next/link';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { optionsDesignSystemMock, usersMock, sitesMock } from '@/app/mock/mock';

type Role = 'User' | 'Technician' | 'Admin';

export default function Page(): JSX.Element {
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
  const [sites, setSites] = useState(sitesMock);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteSiteModalOpen, setIsDeleteSiteModalOpen] = useState(
    // Array of the same length as sites with all values set to false, AI generated this
    Array(sites.length).fill(false),
  );
  // const [isDeleteSiteModalOpen, setIsDeleteSiteModalOpen] = useState(false);

  const getBadge = (
    // role: 'User' | 'Technician' | 'Admin',
    role: Role,
  ): {
    variant: 'neutral' | 'primary';
    icon: React.ReactNode;
  } => {
    switch (role) {
      case 'User':
        return { variant: 'neutral', icon: <LucideUser /> };
      case 'Technician':
        return { variant: 'neutral', icon: <LucidePickaxe /> };
      case 'Admin':
        return { variant: 'primary', icon: <LucideKey /> };
    }
  };

  const openModal = (index: number) => {
    const newState = [...isDeleteSiteModalOpen];
    newState[index] = true;
    setIsDeleteSiteModalOpen(newState);
  };

  const closeModal = (index: number) => {
    const newState = [...isDeleteSiteModalOpen];
    newState[index] = false;
    setIsDeleteSiteModalOpen(newState);
  };

  const handleDelete = async (index: number) => {
    console.log('index', index);
    setSites((prevSites) => {
      const newSites = [...prevSites];
      newSites.splice(index, 1);
      return newSites;
    });
  };

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <Headline variant="xl" as="h1" color="foreground">
        Design system experiments 🦄
      </Headline>

      <hr className="w-full" />

      <Headline variant="large" as="h1" color="foreground">
        Delete Modal Confirmation 🦄
      </Headline>

      <Button
        variant="destructive"
        size="large"
        onClick={() => setIsDeleteModalOpen(true)}
      >
        <LucideTrash2 />
        Delete item
      </Button>

      <DeleteModalConfirmation
        deleteButtonText="Confirm deletion"
        modalTitle="Delete Site"
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      >
        <Text variant="medium" color={'foreground'}>
          You are about to delete
          <Text variant="medium" color={'foreground'} as="span">
            {` Elliot Alderson `}
          </Text>
          from the list. Are you sure you want to delete?
        </Text>
      </DeleteModalConfirmation>

      <Headline variant="medium" as="h3" color="foreground">
        Dropdown Delete
        {sites.map((site, index) => (
          <div className="flex items-center justify-between py-2" key={index}>
            <Text color={'foreground'} variant={'small'}>
              {site.name}
            </Text>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={'small'} variant="outline">
                  <LucideEllipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-4">
                <DropdownMenuItem
                  onSelect={() => console.log('Clicked on Edit')}
                >
                  <LucideSquarePen />
                  <Text color={'foreground'} variant={'medium'}>
                    Edit
                  </Text>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openModal(index)}>
                  <LucideTrash2 className="text-error" />
                  <Text color={'destructive'} variant={'medium'}>
                    Delete
                  </Text>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteModalConfirmation
              deleteButtonText="Confirm deletion"
              deleteIcon="Site"
              modalTitle="Delete Site"
              isOpen={isDeleteSiteModalOpen[index]}
              index={index}
              onOpenChange={() => closeModal(index)}
              onDelete={() => {
                handleDelete(index),
                  closeModal(index),
                  console.log('site number', site.id);
              }}
            >
              <Text variant="medium" color={'foreground'}>
                You are about to delete
                <Text variant="medium" color={'foreground'} as="span">
                  {/* @TODO add isBold when merged with main */}
                  {` ${site.name} `}
                </Text>
                from the list. Are you sure you want to delete?
              </Text>
            </DeleteModalConfirmation>
          </div>
        ))}
      </Headline>

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

        <Headline as="h4" variant="medium" color="foreground" isBold>
          Medium Headline bold
        </Headline>

        <Headline as="h3" variant="medium" color="muted">
          Medium Headline muted color
        </Headline>

        <Headline as="h4" variant="small" color="foreground" isBold>
          Small Headline
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

        <Text variant="medium" color="foreground" isBold>
          Medium bold text
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
      <div className="flex flex-col items-center gap-12 relative">
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

        <Headline variant="medium" color="foreground" as="h2" className="group">
          <Link href="#" passHref legacyBehavior>
            <Anchor color="foreground">
              <LucideMoveRight className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-1.5" />
              Link with icon and no underline
            </Anchor>
          </Link>
        </Headline>
      </div>
      <hr className="w-full" />
      <Headline variant="large" as="h1" color="foreground">
        Radio 🦄
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
                  <FormItem className="space-y-3">
                    <FormLabel variant="medium">Choose option</FormLabel>
                    <FormControl>
                      <RadioGroup
                        defaultValue="opt1"
                        onValueChange={(e) => console.log('change value', e)}
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
                        className="w-96 h-[140px]"
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
                        className="w-96 h-[140px]"
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
                      <SingleDateCalendar className="w-96" />
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
                      <SingleDateCalendar disabled className="w-96" />
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
                      <RangeCalendar className="w-96" />
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
                      <RangeCalendar disabled className="w-96" />
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
                    <FormLabel>Disabled input</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Enter input"
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
              name="dropdown"
              render={() => {
                return (
                  <FormItem className="w-96">
                    <FormLabel>Dropdown</FormLabel>
                    <FormControl>
                      <Dropdown
                        id="person"
                        placeholder="Select dropdown item"
                        selectedId={dropdownValue}
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
                  <FormItem>
                    <FormLabel>Resettable dropdown</FormLabel>
                    <FormControl>
                      <Dropdown
                        isResettable
                        id="person"
                        placeholder="Select dropdown item"
                        selectedId={dropdownValue}
                        options={optionsDesignSystemMock}
                        onSelect={setDropdownValue}
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
                    <FormLabel>Disabled dropdown</FormLabel>
                    <FormControl>
                      <Dropdown
                        disabled
                        id="person"
                        placeholder="Select dropdown item"
                        options={optionsDesignSystemMock}
                        onSelect={setDropdownValue}
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
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersMock.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.appAccess}</TableCell>
                <TableCell>
                  <Badge variant={getBadge(user.role).variant}>
                    {getBadge(user.role).icon}
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
      <hr className="w-full" />
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

        <Tabs defaultValue="grid">
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
