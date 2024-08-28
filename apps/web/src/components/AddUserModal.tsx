import {
  Badge,
  Button,
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Headline,
  Input,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Switch,
  Text,
} from '@gsp/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LucideCheckCircle,
  LucideLayoutGrid,
  LucideOctagonAlert,
  LucidePlus,
  LucideSearchX,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const AddUserModal = () => {
  const getResultBadge = (
    result: 'Pass' | 'Fail' | 'Abort',
  ): {
    variant: 'success' | 'destructive' | 'warning';
    icon: React.ReactNode;
  } => {
    switch (result) {
      case 'Pass':
        return { variant: 'success', icon: <LucideCheckCircle /> };
      case 'Fail':
        return { variant: 'destructive', icon: <LucideOctagonAlert /> };
      case 'Abort':
        return { variant: 'warning', icon: <LucideSearchX /> };
    }
  };
  const [hasGlobalAccess, setHasGlobalAccess] = useState(false);
  const [hasPullTestAccess, setHasPullTestAccess] = useState(false);
  const [hasXCyclopsAccess, setHasXCyclopsAccess] = useState(false);
  const [hasUltrabotsAccess, setHasUltrabotsAccess] = useState(false);
  const [dropdownValue, setDropdownValue] = useState<string | undefined>('');

  const formSchema = z.object({
    role: z.enum(['admin', 'technician', 'user']),
    fullName: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    globalAccess: z.string().transform((val) => val === 'true'),
    pullTest: z.string().transform((val) => val === 'true'),
    xCyclops: z.string().transform((val) => val === 'true'),
    ultrabots: z.string().transform((val) => val === 'true'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      // role: 'user',
      fullName: '',
      email: '',
      phoneNumber: '',
      globalAccess: false,
      pullTest: false,
      xCyclops: false,
      ultrabots: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (dropdownValue && dropdownValue.length > 0) {
      form.setValue('role', dropdownValue as 'admin' | 'technician' | 'user');
    }
    console.log(values);
  }

  // Need to make the handleSwitches dynamic
  const handleCheckedChange = (state: boolean) => {
    console.log('HANDLE CHECKED CHANGE', state);
    setHasGlobalAccess(state);
    handlePullTestCheckedChange(state);
    setHasPullTestAccess(state);
    setHasXCyclopsAccess(state);
    setHasUltrabotsAccess(state);
  };

  const handlePullTestCheckedChange = (state: boolean) => {
    console.log('PULL TEST CHANGE', state);
    setHasPullTestAccess(state);
  };

  const handleXCyclopsCheckedChange = (state: boolean) => {
    setHasXCyclopsAccess(state);
  };

  const handleUltrabotsCheckedChange = (state: boolean) => {
    setHasUltrabotsAccess(state);
  };

  const roles = [
    {
      id: '1',
      name: 'User',
    },
    {
      id: '2',
      name: 'Technician',
    },
    {
      id: '3',
      name: 'Admin',
    },
  ];

  const getRoleById = (id: string) => {
    return roles.find((role) => role.id === id)?.name;
  };

  useEffect(() => {
    console.log('GLOBAL', hasGlobalAccess);
    handlePullTestCheckedChange(hasGlobalAccess);
  }, [
    hasGlobalAccess,
    hasPullTestAccess,
    hasXCyclopsAccess,
    hasUltrabotsAccess,
  ]);

  return (
    <ModalContent className="sm:max-w-[425px]">
      <ModalHeader>
        <ModalTitle className="mb-10">Add user</ModalTitle>
      </ModalHeader>
      <Form {...form}>
        <Badge variant={getResultBadge('Abort').variant}>
          {getResultBadge('Abort').icon}
          Pass or whatever you want!
        </Badge>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* <form onSubmit={form.handleSubmit((e) => handleToggleSwitch(e))}> */}
          <div className="flex px-10 gap-10">
            <div className="flex flex-col gap-8">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>* Role</FormLabel>
                      <FormControl>
                        <Dropdown
                          id="role"
                          placeholder="Select role"
                          selectedId={dropdownValue}
                          {...field}
                          options={roles}
                          className="w-[400px]"
                          onSelect={(e) => {
                            setDropdownValue(e); // without this the dropdown value disappears when using switches
                            field.onChange(getRoleById(e)?.toLowerCase());
                            // logging values
                            console.log('HELLOOOO', getRoleById(e));
                            console.log('Dropdown value: ', dropdownValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>* Full name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter full name..."
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
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>* Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter fill in email..."
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
                name="phoneNumber"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fill in phone number..."
                          {...field}
                          className="w-[400px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            {/* RIGHT */}
            <div className="flex flex-col flex-grow w-full">
              <div className="flex items-center p-4 border bg-main-white border-neutral-3">
                <div className="flex flex-grow items-center gap-2">
                  <LucideLayoutGrid size={20} />
                  <Headline color={'foreground'} as="h3" variant={'smallBold'}>
                    All apps
                  </Headline>
                </div>
                <FormField
                  control={form.control}
                  name="globalAccess"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            // onCheckedChange={field.onChange}
                            onCheckedChange={(e) => {
                              field.onChange(e);
                              // handleCheckedChange(e);
                            }}
                            {...field}
                            value={field.value.toString()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex items-center px-4 py-4 border-x border-b border-neutral-3">
                <Text
                  color={'foreground'}
                  variant={'medium'}
                  className="flex flex-grow"
                >
                  Pull Test
                </Text>
                <FormField
                  control={form.control}
                  name="pullTest"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            // onCheckedChange={field.onChange}
                            onCheckedChange={(e) => {
                              // handlePullTestCheckedChange(e);
                              handleCheckedChange(e);
                            }}
                            {...field}
                            value={field.value.toString()}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex items-center px-4 py-4 border-x border-b border-neutral-3">
                <Text
                  color={'foreground'}
                  variant={'medium'}
                  className="flex flex-grow"
                >
                  xCyclops
                </Text>
                <FormField
                  control={form.control}
                  name="xCyclops"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            {...field}
                            value={field.value.toString()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex items-center px-4 py-4 border-x border-b border-neutral-3">
                <Text
                  color={'foreground'}
                  variant={'medium'}
                  className="flex flex-grow"
                >
                  Ultrabots
                </Text>
                <FormField
                  control={form.control}
                  name="ultrabots"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            {...field}
                            value={field.value.toString()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              {/* Need to make the following dynamic */}
              {/* <div className="flex items-center px-4 py-4 border-x border-b border-neutral-3">
                <Text
                  variant="medium"
                  color="foreground"
                  className="flex flex-grow"
                >
                  Pull Test
                </Text>
                <Switch
                  checked={hasPullTestAccess}
                  onCheckedChange={handlePullTestCheckedChange}
                />
              </div>
              <div className="flex items-center px-4 py-2 border-x border-b border-neutral-3">
                <Text
                  variant="medium"
                  color="foreground"
                  className="flex flex-grow"
                >
                  xCyclops
                </Text>
                <Switch
                  checked={hasXCyclopsAccess}
                  onCheckedChange={handleXCyclopsCheckedChange}
                />
              </div>
              <div className="flex items-center px-4 py-2 border-x border-b border-neutral-3">
                <Text
                  variant="medium"
                  color="foreground"
                  className="flex flex-grow"
                >
                  Ultrabots
                </Text>
                <Switch
                  checked={hasUltrabotsAccess}
                  onCheckedChange={handleUltrabotsCheckedChange}
                />
              </div> */}
            </div>
          </div>

          <ModalFooter className="px-10 pt-8 pb-6">
            <Button type="submit" size="large" variant="primary">
              <LucidePlus />
              Add user
            </Button>
          </ModalFooter>
        </form>
      </Form>
    </ModalContent>
  );
};
