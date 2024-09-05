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
  type FormSchema = z.infer<typeof formSchema>;

  const formSchema = z.object({
    role: z.enum(['admin', 'technician', 'user']),
    email: z
      .string()
      .email({ message: 'Email must be a valid email address.' }),
    pullTest: z.boolean(),
    xCyclops: z.boolean(),
    ultrabots: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      pullTest: false,
      xCyclops: false,
      ultrabots: false,
    },
  });

  const [roleDropDownValue, setRoleDropDownValue] =
    useState<FormSchema['role']>('user');
  const [techDropDownValue, setTechDropDownValue] = useState<
    string | undefined
  >('');
  const [hasGlobalAccess, setHasGlobalAccess] = useState(false);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const watchPullTest = form.watch('pullTest');
  const watchxCyclops = form.watch('xCyclops');
  const watchUltrabots = form.watch('ultrabots');
  const watchRole = form.watch('role');

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

  const technicians = [
    {
      id: '1',
      name: 'Elliot Alderson',
      email: 'elliot@ecorp.com',
    },
    {
      id: '2',
      name: 'Darlene Alderson',
      email: 'dolores@haze.com',
    },
    {
      id: '3',
      name: 'Tyrell Wellick',
      email: 'tyrell@ecorp.com',
    },
    {
      id: '4',
      name: 'Joanna Wellick',
      email: 'joanna@ecorp.com',
    },
    {
      id: '5',
      name: 'Angela Moss',
      email: 'angela@ecorp.com',
    },
    {
      id: '6',
      name: 'Whiterose',
      email: 'dark@army.com',
    },
    {
      id: '7',
      name: 'Felix Östergren',
      email: 'felix@ecorp.com',
    },
    {
      id: '8',
      name: 'Jimmy Nwadinkpa',
      email: 'jimmy@ecorp.com',
    },
  ];

  const getRoleById = (id: string) => {
    return roles.find((role) => role.id === id)?.name;
  };

  const getEmailById = (id: string) => {
    return technicians.find((tech) => tech.id === id)?.email;
  };

  const handleGlobalAccess = (checked: boolean) => {
    setHasGlobalAccess(checked);
    form.setValue('pullTest', checked);
    form.setValue('xCyclops', checked);
    form.setValue('ultrabots', checked);
  };

  useEffect(() => {
    form.setValue('email', '');
    setTechDropDownValue('');
  }, [watchRole]);

  useEffect(() => {
    if (watchPullTest && watchxCyclops && watchUltrabots) {
      setHasGlobalAccess(true);
    } else {
      setHasGlobalAccess(false);
    }
  }, [watchPullTest, watchxCyclops, watchUltrabots]);

  return (
    <ModalContent className="sm:max-w-[425px]">
      <ModalHeader>
        <ModalTitle className="mb-10">Add user</ModalTitle>
      </ModalHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                          selectedId={roleDropDownValue}
                          isBadge
                          badgeIcon
                          {...field}
                          options={roles}
                          className="w-[400px]"
                          onSelect={(e) => {
                            setRoleDropDownValue(e);
                            field.onChange(getRoleById(e)?.toLowerCase());
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {(watchRole === 'admin' || watchRole === 'user') && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>* Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Fill in email..."
                            {...field}
                            className="w-[400px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}
              {watchRole === 'technician' && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>* Technician</FormLabel>
                        <FormControl>
                          <Dropdown
                            id="email"
                            placeholder="Select technician"
                            selectedId={techDropDownValue}
                            {...field}
                            options={technicians}
                            onSelect={(e) => {
                              setTechDropDownValue(e);
                              field.onChange(getEmailById(e));
                            }}
                            className="w-[400px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}
            </div>
            <div className="flex flex-col flex-grow w-full border-2 border-neutral-2">
              <div className="flex items-center px-6 py-5 bg-main-white border-b border-neutral-2">
                <div className="flex flex-grow  items-center gap-2">
                  <LucideLayoutGrid size={20} className="text-orange-600" />
                  <Headline color={'foreground'} as="h3" variant={'smallBold'}>
                    All apps
                  </Headline>
                </div>
                <Switch
                  checked={hasGlobalAccess}
                  onCheckedChange={(e) => {
                    handleGlobalAccess(e);
                  }}
                />
              </div>
              <div className="flex items-center px-6 py-3 border-b border-neutral-2">
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
                            onCheckedChange={field.onChange}
                            {...field}
                            value={field.value.toString()}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex items-center px-6 py-3 border-b border-neutral-2">
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
              <div className="flex items-center px-6 py-3">
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
