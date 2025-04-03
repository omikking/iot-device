import {
  Button,
  Dropdown,
  DropdownItem,
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
import { graphql } from '@/gql';
import { useMutation, useQuery } from 'urql';
import { SuccessMessage } from './SuccessMessage';
import React, { useEffect, useState } from 'react';
import { User, UserPermission } from '@/gql/graphql';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, set, useForm } from 'react-hook-form';
import { LucideLayoutGrid, LucidePlus } from 'lucide-react';
import { UserFormValues, userFormSchema } from './schemas/UserFormSchema';
import { UpdateUserPermissionFormValues } from './schemas/UserPermissionFormSchema';

type AddOrEditUserModalProps = {
  onOpenChange: (open: boolean) => void;
  user?: User;
};

type Application =
  | 'PULL_TEST'
  | 'PULL_TEST_OPERATOR'
  | 'ULTRABOLTS'
  | 'XCYCLOPS';

const updateCompanyUserMutation = graphql(`
  mutation updateCompanyUser($id: String!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      id
      email
      userPermissions {
        id
        role
        appsAccess
      }
    }
  }
`);

const getTechniciansQuery = graphql(`
  query getTechnicians {
    users(roles: "SANDVIK_TECHNICIAN") {
      id
      fullName
      email
      workPlace
      isGlobalVisibility
      phoneNumber
      globalRole
    }
  }
`);

const updateUserPermissionsMutation = graphql(`
  mutation updateUserPermission(
    $id: String!
    $updateUserPermissionInput: UpdateUserPermissionInput!
  ) {
    updateUserPermission(
      id: $id
      updateUserPermissionInput: $updateUserPermissionInput
    ) {
      id
      userId
      role
      appsAccess
      companyId
    }
  }
`);

export const roles: DropdownItem[] = [
  {
    id: 'COMPANY_USER',
    name: 'User',
    background: 'neutral',
  },
  {
    id: 'SANDVIK_TECHNICIAN',
    name: 'Sandvik technician',
    background: 'neutral',
  },
  {
    id: 'SANDVIK_ADMIN',
    name: 'Sandvik admin',
    background: 'primary',
  },
  {
    id: 'COMPANY_ADMIN',
    name: 'Company admin',
    background: 'primary',
  },
];

export const AddOrEditUserModal = ({
  onOpenChange,
  user,
}: AddOrEditUserModalProps) => {
  // Use gql isLoading instead of useState
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [, updateCompanyUser] = useMutation<UserFormValues>(
    updateCompanyUserMutation,
  );
  const [, updateUserPermission] = useMutation<UpdateUserPermissionFormValues>(
    updateUserPermissionsMutation,
  );

  const [{ data: techniciansData }] = useQuery({
    query: getTechniciansQuery,
  });
  const technicians = (techniciansData?.users as User[]) || [];

  const [role, setRole] = useState<string>(
    user?.userPermissions?.[0]?.role || 'User',
  );

  const [isGlobalAccess, setGlobalAccess] = useState<boolean>(false);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('');

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || '',
      userPermissions: [
        {
          userId: user?.userPermissions?.[0]?.userId || '',
          role: user?.userPermissions?.[0]?.role || 'User',
          appsAccess: (user?.userPermissions?.[0]?.appsAccess || []).map(
            (app) => app as Application,
          ),
        },
      ],
    },
  });

  const resetFormValues = () => {
    setRole('User');
    setSelectedTechnician('');
    form.reset({
      email: '',
      userPermissions: [
        {
          role: 'User',
          appsAccess: [],
        },
      ],
    });
  };

  const onSuccessfulSubmit = () => {
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

  const onSubmit: SubmitHandler<UserFormValues> = (data) => {
    setIsLoading(true);
    if (user) {
      const updateUserInput = {
        email: data.email,
      };

      updateUserPermission({
        id: user.userPermissions?.[0]?.id,
        updateUserPermissionInput: {
          role: data.userPermissions[0].role,
          appsAccess: data.userPermissions[0].appsAccess,
        },
      }).then((result) => {
        if (result.data) {
          console.log('Permission update successful');
        }
      });

      updateCompanyUser({
        id: user.id,
        updateUserInput,
      }).then((result) => {
        console.log('data', data);
        console.log(result);
        if (result.data) {
          onSuccessfulSubmit();
        }
      });
    }
  };

  const handleSelectRole = (e: UserPermission['role']) => {
    form.setValue('userPermissions.0.role', e);
    form.setValue('email', '');
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
      form.setValue('userPermissions.0.appsAccess', [
        'PULL_TEST',
        'PULL_TEST_OPERATOR',
        'XCYCLOPS',
        'ULTRABOLTS',
      ] as ('PULL_TEST' | 'PULL_TEST_OPERATOR' | 'ULTRABOLTS' | 'XCYCLOPS')[]);
    } else {
      form.setValue('userPermissions.0.appsAccess', []);
    }
  };

  const handleAppsAccess = (app: Application) => (checked: boolean) => {
    const apps = form.getValues('userPermissions.0.appsAccess') || [];
    if (checked) {
      form.setValue('userPermissions.0.appsAccess', [...apps, app]);
    } else {
      form.setValue(
        'userPermissions.0.appsAccess',
        apps.filter((appItem) => appItem !== app),
      );
    }
  };

  useEffect(() => {
    const appAccess = form.watch('userPermissions.0.appsAccess') || [];
    const allAppsSelected = [
      'PULL_TEST',
      'PULL_TEST_OPERATOR',
      'ULTRABOLTS',
      'XCYCLOPS',
    ].every((app) => appAccess.includes(app as Application));
    setGlobalAccess(allAppsSelected);
  }, [form.watch('userPermissions.0.appsAccess')]);

  useEffect(() => {
    if (user) {
      const userRole = user.userPermissions?.[0]?.role || 'User';
      setRole(userRole as UserPermission['role']);

      if (userRole === 'SANDVIK_TECHNICIAN') {
        const foundTechnician = technicians.find(
          (tech) => tech.email === user.email,
        );
        if (foundTechnician) {
          console.log(
            'Found technician:',
            foundTechnician.fullName,
            foundTechnician.id,
          );
          setSelectedTechnician(foundTechnician.id);
        }
      }

      form.reset({
        // ...user,
        email: user.email || '',
        userPermissions: [
          {
            ...user.userPermissions?.[0],
            role: userRole,
            appsAccess: user.userPermissions?.[0]?.appsAccess?.map(
              (access) => (access as Application) || [],
            ),
          },
        ],
      });
    }
  }, [user, technicians]);

  // transform technicians to dropdown options
  const technicianDropdownOptions = technicians.map(
    ({ id, fullName, workPlace }) => ({
      id,
      // name: `${fullName} (${user?.workPlace})`,
      name: workPlace ? `${fullName} (${workPlace})` : fullName,
    }),
  );

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
                  name="userPermissions.0.role"
                  render={() => {
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
                              handleSelectRole(e as UserPermission['role']);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {!(role === 'SANDVIK_TECHNICIAN') && (
                  <FormField
                    control={form.control}
                    name="email"
                    disabled={true}
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
                {role === 'SANDVIK_TECHNICIAN' && (
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
                              selectedId={selectedTechnician}
                              options={technicianDropdownOptions}
                              onSelect={(e) => {
                                if (e) {
                                  setSelectedTechnician(e);

                                  const selectedTech = technicians.find(
                                    (tech) => tech.id === e,
                                  );
                                  if (selectedTech) {
                                    console.log(selectedTech.email);
                                    form.setValue(
                                      'technician',
                                      selectedTech.email,
                                    );
                                  }
                                }
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
                    name="userPermissions.0.appsAccess"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            {/* <Switch
                              checked={field.value?.includes('PULL_TEST')}
                              onCheckedChange={handleAppAccess('PULL_TEST')}
                            /> */}
                            <Switch
                              checked={
                                Array.isArray(field.value) &&
                                field.value.includes('PULL_TEST')
                              }
                              onCheckedChange={handleAppsAccess('PULL_TEST')}
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
                    name="userPermissions.0.appsAccess"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value?.includes(
                                'PULL_TEST_OPERATOR',
                              )}
                              onCheckedChange={handleAppsAccess(
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
                    name="userPermissions.0.appsAccess"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value?.includes('ULTRABOLTS')}
                              onCheckedChange={handleAppsAccess('ULTRABOLTS')}
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
                    name="userPermissions.0.appsAccess"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value?.includes('XCYCLOPS')}
                              onCheckedChange={handleAppsAccess('XCYCLOPS')}
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
