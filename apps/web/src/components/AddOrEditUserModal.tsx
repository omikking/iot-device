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
  LoadingSpinner,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Switch,
  Text,
} from '@gsp/ui';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideLayoutGrid, LucidePlus } from 'lucide-react';
import { technicians, roles, UserSchema, Application } from '@/app/mock/mock';
import { UserFormValues, userFormSchema } from './schemas/UserFormSchema';
import { SuccessMessage } from './SuccessMessage';

interface AddOrEditUserModalProps {
  onOpenChange: (open: boolean) => void;
  user?: UserSchema;
}

export const AddOrEditUserModal = ({
  onOpenChange,
  user,
}: AddOrEditUserModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [role, setRole] = useState<UserSchema['userPermissions']['role']>(
    user?.userPermissions?.role || 'User',
  );
  const [isGlobalAccess, setGlobalAccess] = useState<boolean>(false);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || '',
      userPermissions: {
        userId: '',
        role: user?.userPermissions?.role || 'User',
        appAccess: [],
      },
    },
  });

  const resetFormValues = () => {
    setRole('User');
    setSelectedTechnician('');
    form.reset({
      email: '',
      userPermissions: {
        userId: '',
        role: 'User',
        appAccess: [],
      },
    });
  };

  const getTechnicianIdByEmail = (email: string) => {
    const technician = technicians.find((tech) => tech.email === email);
    return technician?.userId || '';
  };

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Simulate API call
    console.log('User added', data);
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

  const handleSelectRole = (e: UserSchema['userPermissions']['role']) => {
    form.setValue('userPermissions.role', e);
    form.setValue('email', undefined);
    setRole(e);

    if (e !== 'Technician') {
      form.setValue('email', '');
      form.setValue('technician', undefined);
      setSelectedTechnician('');
    }
  };

  const handleGlobalAccess = (checked: boolean) => {
    setGlobalAccess(checked);
    if (checked) {
      form.setValue('userPermissions.appAccess', [
        'PULL_TEST',
        'PULL_TEST_OPERATOR',
        'XCYCLOPS',
        'ULTRABOLTS',
      ] as ('PULL_TEST' | 'PULL_TEST_OPERATOR' | 'ULTRABOLTS' | 'XCYCLOPS')[]);
    } else {
      form.setValue('userPermissions.appAccess', []);
    }
  };

  const handleAppAccess = (app: Application) => (checked: boolean) => {
    const apps = form.getValues('userPermissions.appAccess') || [];
    if (checked) {
      form.setValue('userPermissions.appAccess', [...apps, app]);
    } else {
      form.setValue(
        'userPermissions.appAccess',
        apps.filter((appItem) => appItem !== app),
      );
    }
  };

  useEffect(() => {
    const appAccess = form.watch('userPermissions.appAccess');
    const allAppsSelected = [
      'PULL_TEST',
      'PULL_TEST_OPERATOR',
      'ULTRABOLTS',
      'XCYCLOPS',
    ].every((app) => appAccess?.includes(app as Application));
    setGlobalAccess(allAppsSelected);
  }, [form.watch('userPermissions.appAccess')]);

  useEffect(() => {
    if (user) {
      const userRole = user.userPermissions?.role || 'User';
      setRole(userRole as UserSchema['userPermissions']['role']);

      if (userRole === 'Technician') {
        const technicianId = getTechnicianIdByEmail(user.email);
        setSelectedTechnician(technicianId);
      }

      form.reset({
        ...user,
        userPermissions: {
          ...user.userPermissions,
          role: userRole,
          appAccess: user.userPermissions.appAccess.map(
            (access) => access as Application,
          ),
        },
      });
    }
  }, [user]);

  return (
    <ModalContent onCloseAutoFocus={resetFormValues}>
      <ModalHeader>
        <ModalTitle className="mb-10">
          {user ? 'Edit user' : 'Add user'}
        </ModalTitle>
      </ModalHeader>
      <SuccessMessage isVisible={isSuccessful}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex px-10 gap-10">
              <div className="flex flex-col gap-8">
                <FormField
                  control={form.control}
                  name="userPermissions.role"
                  render={() => {
                    return (
                      <FormItem>
                        <FormLabel>* Role</FormLabel>
                        <FormControl>
                          <Dropdown
                            id="role"
                            className="w-96"
                            placeholder="Select role"
                            selectedId={form.getValues('userPermissions.role')}
                            isBadge
                            badgeIcon
                            options={roles}
                            onSelect={(e) => {
                              handleSelectRole(
                                e as UserSchema['userPermissions']['role'],
                              );
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
                    name="technician"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>* Technician</FormLabel>
                          <FormControl>
                            <Dropdown
                              id="technician"
                              className="w-96"
                              placeholder="Select technician"
                              selectedId={
                                selectedTechnician ||
                                getTechnicianIdByEmail(field.value || '')
                              }
                              options={technicians}
                              onSelect={(e) => {
                                form.setValue('technician', e);
                                setSelectedTechnician(e ?? '');
                              }}
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
                      return (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value?.includes('PULL_TEST')}
                              onCheckedChange={handleAppAccess('PULL_TEST')}
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
                    Pull Test Operator
                  </Text>
                  <FormField
                    control={form.control}
                    name="userPermissions.appAccess"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value?.includes(
                                'PULL_TEST_OPERATOR',
                              )}
                              onCheckedChange={handleAppAccess(
                                'PULL_TEST_OPERATOR',
                              )}
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
                    Ultrabolts
                  </Text>
                  <FormField
                    control={form.control}
                    name="userPermissions.appAccess"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value?.includes('ULTRABOLTS')}
                              onCheckedChange={handleAppAccess('ULTRABOLTS')}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="flex items-center px-6 py-3 border-b border-neutral-1">
                  <Text
                    color={'foreground'}
                    variant={'medium'}
                    className="flex flex-grow"
                  >
                    xCyclops
                  </Text>
                  <FormField
                    control={form.control}
                    name="userPermissions.appAccess"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value?.includes('XCYCLOPS')}
                              onCheckedChange={handleAppAccess('XCYCLOPS')}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <ModalFooter className="px-10 pt-8 pb-6">
              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner className="animate-spin" size={24} />
                ) : (
                  <LucidePlus />
                )}

                {user ? 'Save changes' : 'Add user'}
              </Button>
            </ModalFooter>
          </form>
        </Form>
      </SuccessMessage>
    </ModalContent>
  );
};
