import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  showAlertToast,
} from '@gsp/ui';
import {
  updateAdministratorFormSchema,
  UpdateAdministratorFormValues,
} from './schemas/AdministratorFormSchema';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { useEffect, useState } from 'react';
import { GetAdminsQuery } from '@/gql/graphql';
import { SuccessMessage } from './SuccessMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LucidePlus, LucideSquarePen } from 'lucide-react';
import { GraphQLErrorExtensions } from '@/libs/utils';
import { responses } from '@/app/uitexts/responses';

type AddAdministratorModalProps = {
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
    }
  }
`);

export const AddAdministratorModal = ({
  onOpenChange,
  administrator,
}: AddAdministratorModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [, updateUser] = useMutation<UpdateAdministratorFormValues>(
    updateAdministratorsMutation,
  );

  const form = useForm<UpdateAdministratorFormValues>({
    resolver: zodResolver(updateAdministratorFormSchema),
    defaultValues: {
      fullName: administrator?.fullName || '',
      workPlace: administrator?.workPlace || '',
      email: administrator?.email || '',
      phoneNumber: administrator?.phoneNumber || '',
    },
  });

  const resetFormValues = () => {
    form.reset({
      fullName: '',
      workPlace: '',
      email: '',
      phoneNumber: '',
    });
  };

  const handleSuccess = () => {
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

  const onSubmit: SubmitHandler<UpdateAdministratorFormValues> = (data) => {
    if (administrator) {
      setIsLoading(true);

      updateUser({
        id: administrator.id,
        updateUserInput: data,
      })
        .then((result) => {
          // Backend errors
          if (result.error?.graphQLErrors) {
            const { title, message, type } = result.error.graphQLErrors[0]
              .extensions as unknown as GraphQLErrorExtensions;

            showAlertToast({
              title: title,
              description: message,
              variant: type || 'error',
            });
          }
          // Success
          if (result.data) {
            handleSuccess();

            setTimeout(() => {
              showAlertToast({
                title: responses.adminUpdateSuccess,
                variant: 'success',
              });
            }, 1500);
          }
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.adminUpdateFailedError,
            description: responses.contactSupportError,
            variant: 'error',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    if (administrator) {
      form.reset({
        fullName: administrator.fullName || '',
        email: administrator.email || '',
        workPlace: administrator.workPlace || '',
        phoneNumber: administrator.phoneNumber || '',
      });
    }
  }, [administrator, form]);

  const formValues = form.watch();
  const isAnyFieldEmpty = !formValues.email;

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
            </div>
            <ModalFooter className="px-10 pt-14 pb-6">
              <Button
                type="submit"
                size="large"
                variant="primary"
                disabled={isAnyFieldEmpty || isLoading}
                isLoading={isLoading}
              >
                {administrator ? (
                  <>
                    {!isLoading && <LucideSquarePen />}
                    Edit administrator
                  </>
                ) : (
                  <>
                    {!isLoading && <LucidePlus />}
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
