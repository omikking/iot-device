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
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { technicians, roles } from '@/app/mock/mock';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideLayoutGrid, LucidePlus } from 'lucide-react';
import { UserFormValues, userFormSchema } from './schemas/UserFormSchema';

interface AddOrEditUserModalProps {
  onOpenChange: (open: boolean) => void;
  user?: UserFormValues;
}

export const AddOrEditUserModal = ({
  onOpenChange,
  user,
}: AddOrEditUserModalProps) => {
  //@Todo move out form + formschema, make the code more readable
  // type FormSchema = z.infer<typeof formSchema>;
  // {
  //   /* @TODO dynamic validation messages */
  // }

  // const formSchema = z.object({
  //   // @TODO error message
  //   role: z.enum(['admin', 'technician', 'user']),
  //   email: z
  //     .string()
  //     .email({ message: 'Email must be a valid email address.' }),
  //   pullTest: z.boolean(),
  //   xCyclops: z.boolean(),
  //   ultrabolts: z.boolean(),
  // });

  // const form = useForm<z.infer<typeof userFormSchema>>({
  //   resolver: zodResolver(userFormSchema),
  //   defaultValues: {
  //     email: user?.email || '',
  //     role: user?.role.toLowerCase() as 'admin' | 'user' | 'technician',
  //     pullTest: user?.pullTest || false,
  //     xCyclops: user?.xCyclops || false,
  //     ultrabolts: user?.ultrabolts || false,
  //   },
  // });

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      role: 'user',
      pullTest: false,
      xCyclops: false,
      ultrabolts: false,
    },
  });

  const resetFormValues = () => {
    form.reset({
      email: '',
      pullTest: false,
      xCyclops: false,
      ultrabolts: false,
    });
  };

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('User added:', data);
    setIsSuccessful(true);
    setIsLoading(false);
    setTimeout(() => {
      onOpenChange(false);
    }, 1500);
    setTimeout(() => {
      setIsSuccessful(false);
      resetFormValues();
    }, 1700);
  };

  // const [role, setRole] = useState<FormSchema['role']>('user');
  const [role, setRole] = useState<z.infer<typeof userFormSchema>['role']>(
    user?.role || 'user',
  );
  const [technician, setTechnician] = useState<string | undefined>('');
  const [isGlobalAccess, setGlobalAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

  const watchPullTest = form.watch('pullTest');
  const watchxCyclops = form.watch('xCyclops');
  const watchUltrabolts = form.watch('ultrabolts');
  const watchRole = form.watch('role');

  const getRoleById = (id: string) => {
    return roles.find((role) => role.name === id)?.name;
  };

  const getEmailById = (id: string) => {
    return technicians.find((tech) => tech.name === id)?.email;
  };

  const handleGlobalAccess = (checked: boolean) => {
    setGlobalAccess(checked);
    form.setValue('pullTest', checked);
    form.setValue('xCyclops', checked);
    form.setValue('ultrabolts', checked);
  };

  useEffect(() => {
    form.setValue('email', '');
    setTechnician('');
  }, [watchRole]);

  useEffect(() => {
    if (watchPullTest && watchxCyclops && watchUltrabolts) {
      setGlobalAccess(true);
    } else {
      setGlobalAccess(false);
    }
  }, [watchPullTest, watchxCyclops, watchUltrabolts]);

  const handleModalClose = () => {
    resetFormValues();
    onOpenChange(false);
  };

  useEffect(() => {
    if (user) {
      form.reset(user);
    }

    if (!user) {
      handleModalClose();
    }
  }, [user, form]);
  console.log('USER', user?.email);
  console.log('FORM', form.getValues());
  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle className="mb-10">
          {user ? 'Edit user' : 'Add user'}
        </ModalTitle>
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
                          className="w-96"
                          placeholder="Select role"
                          selectedId={role}
                          isBadge
                          badgeIcon
                          options={roles}
                          onSelect={(e) => {
                            setRole(e as UserFormValues['role']);
                            field.onChange(
                              getRoleById(
                                e as UserFormValues['role'],
                              )?.toLowerCase(),
                            );
                          }}
                          {...field}
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
                            className="w-96"
                            {...field}
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
                            className="w-96"
                            placeholder="Select technician"
                            selectedId={technician}
                            options={technicians}
                            onSelect={(e) => {
                              setTechnician(e as UserFormValues['role']);
                              field.onChange(
                                getEmailById(e as UserFormValues['role']),
                              );
                            }}
                            {...field}
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
                  <Headline
                    color={'foreground'}
                    as="h3"
                    variant={'small'}
                    isBold
                  >
                    All apps
                  </Headline>
                </div>
                <Switch
                  checked={isGlobalAccess}
                  onCheckedChange={handleGlobalAccess}
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
                            // value={field.value.toString()}
                            // value={(field.value ?? false).toString()}

                            value={String(field.value)}
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
                            // value={field.value.toString()}
                            value={(field.value ?? false).toString()}
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
                  Ultrabolts
                </Text>
                <FormField
                  control={form.control}
                  name="ultrabolts"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            // value={field.value.toString()}
                            value={(field.value ?? false).toString()}
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
