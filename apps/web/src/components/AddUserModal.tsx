import {
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
import type { DropdownItem } from '@gsp/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideLayoutGrid, LucidePlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const AddUserModal = () => {
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
    // if (dropdownValue && dropdownValue.length > 0) {
    //   form.setValue('role', dropdownValue as 'admin' | 'technician' | 'user');
    // }
    console.log(values);
  }

  const roles: DropdownItem[] = [
    {
      id: '1',
      name: 'User',
      background: 'neutral',
    },
    {
      id: '2',
      name: 'Technician',
    },
    {
      id: '3',
      name: 'Admin',
      background: 'primary',
    },
  ];

  const getRoleById = (id: string) => {
    return roles.find((role) => role.id === id)?.name;
  };

  useEffect(() => {
    console.log('DROPDOWN', dropdownValue);
    // setRole(getRoleById(dropdownValue));
    if (dropdownValue) {
      console.log(getRoleById(dropdownValue));
    }
  }, [dropdownValue]);

  return (
    <ModalContent className="sm:max-w-[425px]">
      <ModalHeader>
        <ModalTitle className="mb-10">Add user</ModalTitle>
      </ModalHeader>
      <Form {...form}>
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
                          isBadge
                          badgeIcon
                          {...field}
                          options={roles}
                          className="w-[400px]"
                          onSelect={(e) => {
                            setDropdownValue(e); // without this the dropdown value disappears when using switches
                            field.onChange(getRoleById(e)?.toLowerCase());
                            // logging values
                            // console.log('HELLOOOO', getRoleById(e));
                            // console.log('Dropdown value: ', dropdownValue);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {/* need a more generic way to control the fields */}
              {}
              {form.watch('role') === 'user' && (
                <>
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
                </>
              )}
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
                            onCheckedChange={(e) => {}}
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
