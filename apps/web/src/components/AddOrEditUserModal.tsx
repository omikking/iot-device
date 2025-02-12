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
import { technicians } from '@/app/mock/mock';
import { SuccessMessage } from './SuccessMessage';
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideLayoutGrid, LucidePlus } from 'lucide-react';
import { UsersUpdateUrql } from './urql-users/UsersUpdateUrql';
import { UserFormValues, userFormSchema } from './schemas/UserFormSchema';

type AddOrEditUserModalProps = {
  onOpenChange: (open: boolean) => void;
  user?: ICompanyUser;
};

type AppPermission =
  | 'PULL_TEST'
  | 'PULL_TEST_OPERATOR'
  | 'ULTRABOLTS'
  | 'XCYCLOPS';

type ICompanyUser = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  userPermissions: UserPermission[];
};

type UserPermission = {
  id: string;
  userId: string;
  role:
    | 'COMPANY_USER'
    | 'COMPANY_ADMIN'
    | 'SANDVIK_TECHNICIAN'
    | 'SANDVIK_ADMIN';
  appsAccess: string[];
};

const getUserPermissions = (permissions: UserPermission[]): UserPermission => {
  const defaultPermission: UserPermission = {
    id: '',
    userId: '',
    role: 'COMPANY_USER',
    appsAccess: [],
  };

  return permissions[0] || defaultPermission;
};

// return readable name if the value is a role
const roles = [
  { id: 'COMPANY_USER', name: 'User', value: 'COMPANY_USER' },
  { id: 'COMPANY_ADMIN', name: 'Admin', value: 'COMPANY_ADMIN' },
  { id: 'SANDVIK_TECHNICIAN', name: 'Technician', value: 'SANDVIK_TECHNICIAN' },
  { id: 'SANDVIK_ADMIN', name: 'S. Admin', value: 'SANDVIK_ADMIN' },
];

export const AddOrEditUserModal = ({
  onOpenChange,
  user,
}: AddOrEditUserModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [role, setRole] = useState<
    'COMPANY_USER' | 'COMPANY_ADMIN' | 'SANDVIK_TECHNICIAN' | 'SANDVIK_ADMIN'
  >(getUserPermissions(user?.userPermissions || []).role || 'User');
  const [isGlobalAccess, setGlobalAccess] = useState<boolean>(false);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');
  const { updateUser } = UsersUpdateUrql();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || '',
      userPermissions: {
        userId: '',
        role: getUserPermissions(user?.userPermissions || []).role || 'User',
        appsAccess: [],
      },
    },
  });

  // keep this function for now Felix.
  // It resets the form when switching from edit to add a new user.
  const resetFormValues = () => {
    setRole('COMPANY_USER');
    form.reset({
      email: '',
      userPermissions: {
        userId: '',
        role: 'COMPANY_USER',
        appsAccess: [],
      },
    });
  };

  //@Todo - remove one of these functions or merge them. Look them over to see if they are needed
  const getEmailById = (id: string) => {
    const technician = technicians.find((tech) => tech.id === id);
    return technician?.email;
  };

  const getTechnicianIdByEmail = (email: string) => {
    const technician = technicians.find((tech) => tech.email === email);
    return technician?.userId || '';
  };

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    try {
      if (user) {
        await updateUser(user.id, {
          email: data.email,
        });
      }

      setIsSuccessful(true);
      // Close modal after success
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);

      // Reset form and success state
      setTimeout(() => {
        setIsSuccessful(false);
        resetFormValues();
      }, 1700);
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGlobalAccess = (checked: boolean) => {
    setGlobalAccess(checked);
    if (checked) {
      form.setValue('userPermissions.appsAccess', [
        'PULL_TEST',
        'PULL_TEST_OPERATOR',
        'XCYCLOPS',
        'ULTRABOLTS',
      ] as ('PULL_TEST' | 'PULL_TEST_OPERATOR' | 'ULTRABOLTS' | 'XCYCLOPS')[]);
    } else {
      form.setValue('userPermissions.appsAccess', []);
    }
  };

  useEffect(() => {
    const appAccess = form.watch('userPermissions.appsAccess');
    const allAppsSelected = [
      'PULL_TEST',
      'PULL_TEST_OPERATOR',
      'ULTRABOLTS',
      'XCYCLOPS',
    ].every((app) => appAccess?.includes(app as AppPermission));
    setGlobalAccess(allAppsSelected);
  }, [form.watch('userPermissions.appsAccess')]);

  // Steps in if user exists
  useEffect(() => {
    if (user) {
      const userRole = getUserPermissions(user?.userPermissions).role || 'User';
      setRole(userRole);

      if (userRole === 'SANDVIK_TECHNICIAN') {
        const techId = getTechnicianIdByEmail(user.email);
        setSelectedTechnician(techId);
      }

      form.reset({
        ...user,
        userPermissions: {
          ...user.userPermissions,
          userId: '',
          role: userRole,

          appsAccess: getUserPermissions(user.userPermissions).appsAccess.map(
            (access) => access as AppPermission,
          ),
        },
      });
    } else {
      resetFormValues();
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
                  render={({ field }) => {
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
                              const selectedRole = e as
                                | 'COMPANY_USER'
                                | 'COMPANY_ADMIN'
                                | 'SANDVIK_TECHNICIAN'
                                | 'SANDVIK_ADMIN';
                              setRole(selectedRole);
                              field.onChange(selectedRole);
                              if (selectedRole !== 'SANDVIK_TECHNICIAN') {
                                form.setValue('email', '');
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {(role === 'COMPANY_ADMIN' || role === 'COMPANY_USER') && (
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
                {(role === 'SANDVIK_TECHNICIAN' ||
                  role === 'SANDVIK_ADMIN') && (
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
                              selectedId={
                                selectedTechnician ||
                                getTechnicianIdByEmail(field.value)
                              }
                              options={technicians}
                              onSelect={(e) => {
                                setSelectedTechnician(e ?? '');
                                field.onChange(e ? getEmailById(e) : '');
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
                    name="userPermissions.appsAccess"
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
                    name="userPermissions.appsAccess"
                    render={({ field }) => {
                      const handleAppAccess = (checked: boolean) => {
                        const apps = field.value || [];
                        if (checked) {
                          field.onChange([
                            ...apps,
                            'PULL_TEST_OPERATOR',
                          ] as const); // Type assertion to match the expected type
                        } else {
                          field.onChange(
                            apps.filter(
                              (app) => app !== 'PULL_TEST_OPERATOR',
                            ) as (
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
                              checked={field.value?.includes(
                                'PULL_TEST_OPERATOR',
                              )}
                              onCheckedChange={handleAppAccess}
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
                    name="userPermissions.appsAccess"
                    render={({ field }) => {
                      const handleAppAccess = (checked: boolean) => {
                        const apps = field.value || ([] as AppPermission[]);
                        if (checked) {
                          field.onChange([...apps, 'ULTRABOLTS'] as const); // Type assertion to match the expected type
                        } else {
                          field.onChange(
                            apps.filter((app) => app !== 'ULTRABOLTS') as (
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
                              checked={field.value?.includes('ULTRABOLTS')}
                              onCheckedChange={handleAppAccess}
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
                    name="userPermissions.appsAccess"
                    render={({ field }) => {
                      const handleAppAccess = (checked: boolean) => {
                        const apps = field.value || [];
                        if (checked) {
                          field.onChange([...apps, 'XCYCLOPS'] as const); // Type assertion to match the expected type
                        } else {
                          field.onChange(
                            apps.filter((app) => app !== 'XCYCLOPS') as (
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
                              checked={field.value?.includes('XCYCLOPS')}
                              onCheckedChange={handleAppAccess}
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
