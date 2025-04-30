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
import {
  CreateUserPermissionFormValues,
  UpdateUserPermissionFormValues,
} from './schemas/UserPermissionFormSchema';
import { useSession } from 'next-auth/react';

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

const getAllUsersQuery = graphql(`
  query getAllUsers {
    users {
      id
      email
      fullName
      workPlace
      globalRole
      userPermissions {
        id
        role
        appsAccess
        companyId
      }
    }
  }
`);

const getTechniciansQuery = graphql(`
  query getTechniciansByRole {
    users(roles: "SANDVIK_TECHNICIAN") {
      id
      fullName
      email
      workPlace
    }
  }
`);

const createUserPermissionsMutation = graphql(`
  mutation createUserPermission(
    $createUserPermissionInput: CreateUserPermissionInput!
  ) {
    createUserPermission(
      createUserPermissionInput: $createUserPermissionInput
    ) {
      userId
      role
      appsAccess
      companyId
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

export const getRoles = (user?: User): DropdownItem[] => [
  {
    id: 'COMPANY_USER',
    name: 'User',
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
  ...(!user || user?.globalRole === 'SANDVIK_TECHNICIAN'
    ? [
        {
          id: 'SANDVIK_TECHNICIAN',
          name: 'Sandvik technician',
          background: 'neutral' as const,
        },
      ]
    : []),
];

export const AddOrEditUserModal = ({
  onOpenChange,
  user,
}: AddOrEditUserModalProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [, updateCompanyUser] = useMutation<UserFormValues>(
    updateCompanyUserMutation,
  );

  const [{ data: allUsers, fetching, error }] = useQuery({
    query: getAllUsersQuery,
  });

  const [, createUserPermission] = useMutation<CreateUserPermissionFormValues>(
    createUserPermissionsMutation,
  );

  const [, updateUserPermission] = useMutation<UpdateUserPermissionFormValues>(
    updateUserPermissionsMutation,
  );

  const [{ data: techniciansData }] = useQuery({
    query: getTechniciansQuery,
  });
  const technicians = (techniciansData?.users as User[]) || [];

  const [role, setRole] = useState<string | undefined>(
    user?.userPermissions?.[0]?.role || undefined,
  );

  const [isFullAccess, setFullAccess] = useState<boolean>(false);
  const [selectedTechnician, setSelectedTechnician] = useState<
    string | undefined
  >('');
  const [selectedTechEmail, setSelectedTechEmail] = useState<string>('');

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || '',
      technician: selectedTechEmail || undefined,
      userPermissions: [
        {
          role: user?.userPermissions?.[0]?.role,
          appsAccess: (user?.userPermissions?.[0]?.appsAccess || []).map(
            (app) => app as Application,
          ),
        },
      ],
    },
  });

  const resetFormValues = () => {
    setRole(undefined);
    // setSelectedTechnician(undefined);
    form.reset({
      email: '',
      userPermissions: [
        {
          role: undefined,
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

  const onSubmit: SubmitHandler<UserFormValues> = async (data) => {
    try {
      setIsLoading(true);
      if (user) {
        const updateUserInput = {
          email: data.email,
        };

        const permissionResult = await updateUserPermission({
          id: user.userPermissions?.[0]?.id,
          updateUserPermissionInput: {
            role: data.userPermissions[0].role,
            appsAccess: data.userPermissions[0].appsAccess,
          },
        });

        if (!permissionResult.data) {
          throw new Error('Permission update failed');
        }

        const userResult = await updateCompanyUser({
          id: user.id,
          updateUserInput,
        });

        if (!userResult.data) {
          throw new Error('User update failed');
        }

        onSuccessfulSubmit();
      } else {
        let userId;

        if (role === 'SANDVIK_TECHNICIAN') {
          const selectedTech = technicians.find(
            (tech) => tech.id === selectedTechnician,
          );
          if (!selectedTech) {
            throw new Error('No technician selected');
          }

          userId = selectedTech.id;
        } else {
          const foundUser = allUsers?.users?.find(
            (user) => user.email === data.email,
          );
          if (!foundUser) {
            throw new Error('User not found');
          }
          userId = foundUser.id;
        }

        const userResult = await createUserPermission({
          createUserPermissionInput: {
            role: data.userPermissions[0].role,
            appsAccess: data.userPermissions[0].appsAccess,
            userId: userId,
            companyId: session?.company.id,
          },
        });
        if (!userResult.data) {
          throw new Error('User creation failed');
        }
        onSuccessfulSubmit();
      }
    } catch (error) {
      //@TODO add toast error here.
      setIsLoading(false);
      setIsSuccessful(false);
    }
  };

  const handleSelectRole = (e: UserPermission['role']) => {
    form.setValue('userPermissions.0.role', e);
    setRole(e);

    if (e === 'SANDVIK_TECHNICIAN') {
      form.setValue('technician', user?.email || undefined);
    }
  };

  const handleGlobalAccess = (checked: boolean) => {
    setFullAccess(checked);
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
    setFullAccess(allAppsSelected);
  }, [form.watch('userPermissions.0.appsAccess')]);

  useEffect(() => {
    if (user) {
      const userRole = user.userPermissions?.[0]?.role || undefined;
      setRole(userRole as UserPermission['role']);

      if (userRole === 'SANDVIK_TECHNICIAN') {
        const foundTechnician = technicians.find(
          (tech) => tech.email === user.email,
        );
        if (foundTechnician) {
          setSelectedTechnician(foundTechnician.id);
          setSelectedTechEmail(foundTechnician.email);
        }
      }

      form.reset({
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

  const technicianDropdownOptions = technicians.map(
    ({ id, fullName, workPlace }) => ({
      id,
      name: workPlace ? `${fullName} (${workPlace})` : fullName,
    }),
  );

  const formValues = form.watch();

  const isAnyFieldEmpty =
    !formValues.email ||
    !formValues.userPermissions[0]?.appsAccess.length ||
    !role;

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
                            options={getRoles(user as User)}
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
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>* Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Fill in email..."
                              className="w-96"
                              disabled={user ? true : false}
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
                              selectedId={selectedTechnician}
                              options={technicianDropdownOptions}
                              disabled={user ? true : false}
                              onSelect={(e) => {
                                if (e) {
                                  setSelectedTechnician(e);
                                  const selectedTech = technicians.find(
                                    (tech) => tech.id === e,
                                  );
                                  if (selectedTech) {
                                    form.setValue('email', selectedTech.email);
                                    form.setValue(
                                      'technician',
                                      selectedTech.fullName,
                                    );
                                  }
                                }
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
                    checked={isFullAccess}
                    onCheckedChange={handleGlobalAccess}
                  />
                </div>

                {isFullAccess ? (
                  //@TODO find a way to remove hardcoded width
                  <div className="flex items-center justify-center h-full max-w-[390px] px-6 py-3">
                    <Text
                      color={'foreground'}
                      variant={'medium'}
                      className="text-start "
                    >
                      The administrator will have
                      <Text
                        variant="medium"
                        color={'foreground'}
                        isBold
                        as="span"
                      >
                        {` full access `}
                      </Text>
                      to manage the company and all its applications.
                    </Text>
                  </div>
                ) : (
                  <>
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
                                <Switch
                                  checked={
                                    Array.isArray(field.value) &&
                                    field.value.includes('PULL_TEST')
                                  }
                                  onCheckedChange={handleAppsAccess(
                                    'PULL_TEST',
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
                                  onCheckedChange={handleAppsAccess(
                                    'ULTRABOLTS',
                                  )}
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
                  </>
                )}
              </div>
            </div>
            <ModalFooter className="px-10 pt-8 pb-6">
              <Button
                type="submit"
                variant="primary"
                size="large"
                // disabled={isLoading}
                disabled={isAnyFieldEmpty}
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
