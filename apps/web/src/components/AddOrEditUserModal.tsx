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
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { technicians, roles } from '@/app/mock/mock';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideLayoutGrid, LucidePlus } from 'lucide-react';
import { UserFormValues, userFormSchema } from './schemas/UserFormSchema';
import { UserSchema } from '@/app/mock/mock';

interface AddOrEditUserModalProps {
  onOpenChange: (open: boolean) => void;
  user?: UserSchema;
}

export const AddOrEditUserModal = ({
  onOpenChange,
  user,
}: AddOrEditUserModalProps) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      id: '',
      fullName: '',
      email: user?.email || '',
      phoneNumber: '',
      workPlace: '',
      globalRole: false,
      isGlobalVisibility: false,
      userPermissions: {
        id: '',
        role: user?.userPermissions?.role || 'User',
        appAccess: [],
      },
    },
  });

  const resetFormValues = () => {
    form.reset({
      id: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      workPlace: '',
      globalRole: false,
      isGlobalVisibility: false,
      userPermissions: {
        id: '',
        role: 'User',
        appAccess: [],
      },
    });
  };

  const onSubmit = async (data: UserFormValues) => {
    // setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('User added', data);

    // setIsSuccessful(true);
    // setIsLoading(false);

    setTimeout(() => {
      onOpenChange(false);
    }, 1500);
    setTimeout(() => {
      // setIsSuccessful(false);
      resetFormValues();
    }, 1700);
  };

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

  const [role, setRole] = useState<'User' | 'Technician' | 'Admin'>(
    user?.userPermissions?.role || 'User',
  );
  const [selectedTechnician, setSelectedTechnician] = useState<
    string | undefined
  >(
    user?.email
      ? technicians.find((tech) => tech.email === user.email)?.id
      : undefined,
  );

  // const [technician, setTechnician] = useState<string | undefined>('');
  const [isGlobalAccess, setGlobalAccess] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

  // const watchPullTest = form.watch('pullTest');
  // const watchxCyclops = form.watch('xCyclops');
  // const watchUltrabolts = form.watch('ultrabolts');
  // const watchRole = form.watch('role');

  // const getRoleById = (id: string) => {
  //   return roles.find((role) => role.name === id)?.name;
  // };

  const getEmailById = (id: string) => {
    return technicians.find((tech) => tech.name === id)?.email;
  };

  const handleGlobalAccess = (checked: boolean) => {
    setGlobalAccess(checked);
    if (checked) {
      form.setValue('userPermissions.appAccess', [
        'PULL_TEST',
        'XCYCLOPS',
        'ULTRABOLTS',
      ] as ('PULL_TEST' | 'PULL_TEST_OPERATOR' | 'ULTRABOLTS' | 'XCYCLOPS')[]);
    } else {
      form.setValue('userPermissions.appAccess', []);
    }
  };

  // useEffect(() => {
  //   if (watchPullTest && watchxCyclops && watchUltrabolts) {
  //     setGlobalAccess(true);
  //   } else {
  //     setGlobalAccess(false);
  //   }
  // }, [watchPullTest, watchxCyclops, watchUltrabolts]);

  useEffect(() => {
    if (user?.userPermissions?.role) {
      setRole(user.userPermissions.role as 'User' | 'Technician' | 'Admin');
    }
  }, [user]);

  // console.log('HelloW', user?.userPermissions?.appAccess);
  console.log('HelloW', user?.userPermissions.appAccess);

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
                name="userPermissions.role"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>* Role</FormLabel>
                      <FormControl>
                        <Dropdown
                          id="role"
                          className="w-96"
                          placeholder="Select role"
                          selectedId={user?.userPermissions?.role}
                          isBadge
                          badgeIcon
                          options={roles}
                          onSelect={(e) => {
                            const selectedRole = e as
                              | 'User'
                              | 'Technician'
                              | 'Admin';
                            setRole(selectedRole);
                            field.onChange(selectedRole);
                            // field.onChange(role);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {(role === 'Admin' || role === 'User') && (
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
              {role === 'Technician' && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    //@TODO find a way to figure out how to prefill the dropdown with the selected technician
                    return (
                      <FormItem>
                        <FormLabel>* Technician</FormLabel>
                        <FormControl>
                          <Dropdown
                            id="email"
                            className="w-96"
                            placeholder="Select technician"
                            selectedId={matchingTechnician?.email}
                            options={technicians}
                            onSelect={(e) => {
                              setSelectedTechnician(e);
                              field.onChange(e ? getEmailById(e) : '');
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
                  name="userPermissions.appAccess"
                  render={({ field }) => {
                    const handleAppAccess = (checked: boolean) => {
                      const apps = field.value || [];
                      if (checked) {
                        field.onChange([...apps, 'PULL_TEST'] as const); // Type assertion to match the expected type
                      } else {
                        field.onChange(
                          apps.filter((app) => app !== 'PULL_TEST') as (
                            | 'PULL_TEST'
                            | 'PULL_TEST_OPERATOR'
                            | 'ULTRABOLTS'
                            | 'XCYCLOPS'
                          )[],
                        );
                      }
                    };

                    return (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value?.includes('PULL_TEST')}
                            onCheckedChange={handleAppAccess}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>
              {/* <div className="flex items-center px-6 py-3 border-b border-neutral-2">
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
                            value={(field.value ?? false).toString()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
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
