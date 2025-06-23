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
import { User, UserPermission, Application, Role } from '@/gql/graphql';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LucideEdit, LucideLayoutGrid, LucidePlus } from 'lucide-react';
import { UserFormValues, userFormSchema } from './schemas/UserFormSchema';
import {
  CreateUserPermissionFormValues,
  UpdateUserPermissionFormValues,
} from './schemas/UserPermissionFormSchema';
import { useParams } from 'next/navigation';

type AddOrEditUserModalProps = {
  user?: User;
  onOpenChange: (open: boolean) => void;
  onUserAdded: () => void;
};

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
      id
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
    id: Role.CompanyUser,
    name: 'User',
    iconLabel: 'company user',
    background: 'neutral',
  },
  ...(!user || user?.globalRole === Role.SandvikTechnician
    ? [
        {
          id: Role.SandvikTechnician,
          name: 'Technician',
          iconLabel: 'sandvik technician',
          background: 'neutral' as const,
        },
      ]
    : []),
  {
    id: Role.CompanyAdmin,
    name: 'Admin',
    iconLabel: 'company admin',
    background: 'primary',
  },
];

export const AddOrEditUserModal = ({
  user,
  onOpenChange,
  onUserAdded,
}: AddOrEditUserModalProps) => {
  const params = useParams();
  const companyId = params.id;

  const allApplications = Object.values(Application);
  const permission = user?.userPermissions?.[0];

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isFullAccess, setFullAccess] = useState<boolean>(false);
  const [role, setRole] = useState<string | undefined>(
    permission?.role || undefined,
  );
  const [selectedTechnician, setSelectedTechnician] = useState<
    User | undefined
  >();

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

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user?.email || '',
      technician: undefined,
      userPermissions: [
        {
          role: permission?.role,
          appsAccess: (permission?.appsAccess || []).map(
            (app) => app as Application,
          ),
        },
      ],
    },
  });

  const resetFormValues = () => {
    setRole(undefined);
    setSelectedTechnician(undefined);
    form.reset({
      email: '',
      technician: undefined,
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
      // If there is a user then we are in EDIT MODE otherwise we are in ADD MODE
      if (user) {
        const permissionResult = await updateUserPermission({
          id: permission?.id,
          updateUserPermissionInput: {
            role: data.userPermissions[0].role,
            appsAccess: data.userPermissions[0].appsAccess,
          },
        });

        // TODO change to use toaster on all errors
        if (!permissionResult.data) {
          throw new Error('Permission update failed');
        }
        onSuccessfulSubmit();
        onUserAdded();
      } else {
        const createdUser = await createUserPermission({
          createUserPermissionInput: {
            userEmail: data.email,
            role: data.userPermissions[0].role,
            appsAccess: data.userPermissions[0].appsAccess,
            companyId: companyId,
          },
        });
        if (!createdUser.data) {
          throw new Error('User creation failed');
        }
        onSuccessfulSubmit();
        onUserAdded();
      }
    } catch (error) {
      setIsLoading(false);
      setIsSuccessful(false);
    }
  };

  const handleSelectRole = (e: UserPermission['role']) => {
    if (isFullAccess) {
      setFullAccess(false);
      form.setValue('userPermissions.0.appsAccess', []);
    }
    form.setValue('userPermissions.0.role', e);
    setRole(e);

    if (e === Role.CompanyAdmin) {
      setFullAccess(true);
      form.setValue('userPermissions.0.appsAccess', allApplications);
    }

    if (e === Role.SandvikTechnician) {
      form.setValue('technician', user?.email || undefined);
    }

    // Resets technician & email on ADD move if role changes
    if (e !== Role.SandvikTechnician && !user) {
      form.setValue('email', undefined);
      form.setValue('technician', undefined);
      setSelectedTechnician(undefined);
    }
  };

  const handleGlobalAccess = (checked: boolean) => {
    setFullAccess(checked);
    if (checked) {
      form.setValue('userPermissions.0.appsAccess', allApplications);
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

  const watchAppAccess = form.watch('userPermissions.0.appsAccess');

  useEffect(() => {
    const appAccess = watchAppAccess || [];
    const allAppsSelected = allApplications.every((app) =>
      appAccess.includes(app as Application),
    );
    setFullAccess(allAppsSelected);
  }, [watchAppAccess]);

  useEffect(() => {
    if (user) {
      const userRole = permission?.role;
      setRole(permission?.role);

      if (userRole === Role.SandvikTechnician) {
        const foundTechnician = technicians.find(
          (tech) => tech.email === user.email,
        );
        if (foundTechnician) {
          setSelectedTechnician(foundTechnician);
        }
      }

      form.reset({
        email: user.email || '',
        technician:
          userRole === Role.SandvikTechnician ? user.email : undefined,
        userPermissions: [
          {
            ...permission,
            role: userRole,
            appsAccess: permission?.appsAccess?.map(
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
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Dropdown
                            id="role"
                            className="w-96"
                            placeholder="Select role"
                            selectedId={role}
                            isBadge
                            badgeIcon
                            disabled={
                              user?.userPermissions?.[0]?.role ===
                              Role.SandvikTechnician
                            }
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
                {!(role === Role.SandvikTechnician) && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Fill in email..."
                              className="w-96"
                              disabled={!!user}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                )}
                {role === Role.SandvikTechnician && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Technician</FormLabel>
                          <FormControl>
                            <Dropdown
                              id="technician"
                              className="w-96"
                              placeholder="Select technician"
                              selectedId={selectedTechnician?.id}
                              options={technicianDropdownOptions}
                              disabled={!!user}
                              onSelect={(technicianId) => {
                                if (technicianId) {
                                  const selectedTech = technicians.find(
                                    (tech) => tech.id === technicianId,
                                  );
                                  if (selectedTech) {
                                    setSelectedTechnician(selectedTech);
                                    form.setValue('email', selectedTech.email);
                                    form.setValue(
                                      'technician',
                                      selectedTech.email,
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

                {role === Role.CompanyAdmin ? (
                  <div className="flex items-center justify-center h-full max-w-[390px] px-6 py-3">
                    <Text color={'foreground'} variant={'medium'}>
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
                                    field.value.includes(Application.PullTest)
                                  }
                                  onCheckedChange={handleAppsAccess(
                                    Application.PullTest,
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
                                    Application.PullTestOperator,
                                  )}
                                  onCheckedChange={handleAppsAccess(
                                    Application.PullTestOperator,
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
                                  checked={field.value?.includes(
                                    Application.Ultrabolts,
                                  )}
                                  onCheckedChange={handleAppsAccess(
                                    Application.Ultrabolts,
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
                                  checked={field.value?.includes(
                                    Application.Xcyclops,
                                  )}
                                  onCheckedChange={handleAppsAccess(
                                    Application.Xcyclops,
                                  )}
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
                disabled={isAnyFieldEmpty || isLoading}
                isLoading={isLoading}
              >
                {!isLoading && (user ? <LucideEdit /> : <LucidePlus />)}
                {user ? 'Edit user' : 'Add user'}
              </Button>
            </ModalFooter>
          </form>
        </Form>
      </SuccessMessage>
    </ModalContent>
  );
};
