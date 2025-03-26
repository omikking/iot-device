import {
  Button,
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  LoadingSpinner,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@gsp/ui';
import {
  administratorFormSchema,
  AdministratorFormValues,
} from './schemas/AdministratorFormSchema';
import { useEffect, useState } from 'react';
import { LucidePlus, LucideSquarePen } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SuccessMessage } from './SuccessMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { optionAdministratorRoleMock } from '@/app/mock/mock';
import { graphql } from '@/gql';
// import { User } from '@/gql/graphql';
import { useMutation } from 'urql';
import { GetAdminsQuery } from '@/gql/graphql';

type AddOrEditAdministratorModalProps = {
  onOpenChange: (open: boolean) => void;
  administrator?: GetAdminsQuery['users'][0];
};

const updateAdministratorsMutation = graphql(`
  mutation UpdateUser($id: String!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      email
      fullName
      workPlace
      phoneNumber
      globalRole
      isGlobalVisibility
    }
  }
`);

export const AddOrEditAdministratorModal = ({
  onOpenChange,
  administrator,
}: AddOrEditAdministratorModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [, updateUser] = useMutation<AdministratorFormValues>(
    updateAdministratorsMutation,
  );

  const form = useForm<AdministratorFormValues>({
    resolver: zodResolver(administratorFormSchema),
    defaultValues: {
      fullName: administrator?.fullName || '',
      workPlace: administrator?.workPlace || '',
      email: administrator?.email || '',
      phoneNumber: administrator?.phoneNumber || '',
      globalRole: administrator?.globalRole || '',
      isGlobalVisibility: administrator?.isGlobalVisibility || false,
      // userPermissions:
      //   administrator?.userPermissions?.map((userPermission) => ({
      //     newUserId: userPermission.id,
      //     oldUserId: userPermission.id,
      //   })) || [],
    },
  });

  const resetFormValues = () => {
    form.reset({
      fullName: '',
      workPlace: '',
      email: '',
      phoneNumber: '',
      globalRole: '',
      isGlobalVisibility: false,
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

  const onSubmit: SubmitHandler<AdministratorFormValues> = (data) => {
    if (administrator) {
      updateUser({
        id: administrator.id,
        updateUser: data,
      }).then((result) => {
        // @TODO Add component later for handling error
        console.log(result);
        if (result.data) {
          onSuccessfulSubmit();
        }
      });
    }
  };

  // const onSubmit = async (data: AdministratorFormValues) => {
  //   setIsLoading(true);
  //   // Simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   console.log('Administrator added:', data);
  //   setIsSuccessful(true);
  //   setIsLoading(false);

  //   setTimeout(() => {
  //     onOpenChange(false);
  //   }, 1500);
  //   setTimeout(() => {
  //     setIsSuccessful(false);
  //     resetFormValues();
  //   }, 1700);
  // };

  useEffect(() => {
    if (administrator) {
      form.reset({});
    }
  }, [administrator, form]);

  return (
    <ModalContent onCloseAutoFocus={resetFormValues}>
      <ModalHeader>
        <ModalTitle>
          {administrator ? 'Edit Administrator' : 'Add administrator'}
        </ModalTitle>
      </ModalHeader>
      <SuccessMessage isVisible={isSuccessful}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-10 pt-10">
              <div className="flex flex-row flex-wrap justify-between gap-8">
                <FormField
                  control={form.control}
                  name="fullName"
                  disabled={isSuccessful}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter full name"
                            {...field}
                            className="w-96"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="workPlace"
                  disabled={isSuccessful}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter company"
                            {...field}
                            className="w-96"
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
                  disabled={isSuccessful}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter email"
                            {...field}
                            className="w-96"
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
                  disabled={isSuccessful}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phone number"
                            {...field}
                            className="w-96"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="globalRole"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-96">
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Dropdown
                            id="globalRole"
                            placeholder="Select role..."
                            selectedId={field.value}
                            options={optionAdministratorRoleMock}
                            onSelect={field.onChange}
                            className="w-96"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
            <ModalFooter className="px-10 py-6">
              <Button
                type="submit"
                size="large"
                variant="primary"
                disabled={isLoading}
              >
                {administrator ? (
                  <>
                    {isLoading ? (
                      <LoadingSpinner className="animate-spin" size={24} />
                    ) : (
                      <LucideSquarePen />
                    )}
                    Edit administrator
                  </>
                ) : (
                  <>
                    {isLoading ? (
                      <LoadingSpinner className="animate-spin" size={24} />
                    ) : (
                      <LucidePlus />
                    )}
                    Add administrator
                  </>
                )}
              </Button>
            </ModalFooter>
          </form>
        </Form>
      </SuccessMessage>
    </ModalContent>
  );
};
