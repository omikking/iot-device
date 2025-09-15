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
} from '@gsp/ui';
import {
  createAdministratorFormSchema,
  CreateAdministratorFormValues,
} from './schemas/AdministratorFormSchema';
import { useEffect, useState } from 'react';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { showAlertToast } from '@gsp/ui';

const createGlobalInvitationMutation = graphql(`
  mutation createGlobalInvitation($input: CreateGlobalInvitationInput!) {
    createGlobalInvitation(input: $input) {
      invitationId
      isNewUser
    }
  }
`);

import { GetAdminsQuery, Role } from '@/gql/graphql';
import { SuccessMessage } from './SuccessMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LucidePlus } from 'lucide-react';
import { responses } from '@/app/uitexts/responses';
import { handleGraphQLErrors } from '@/libs/utils';

type AddAdministratorModalProps = {
  onOpenChange: (open: boolean) => void;
  administrator?: GetAdminsQuery['users'][0];
  refreshAdmins: () => void;
};

export const AddAdministratorModal = ({
  onOpenChange,
  administrator,
  refreshAdmins,
}: AddAdministratorModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [, createGlobalInvitation] = useMutation(
    createGlobalInvitationMutation,
  );

  const form = useForm<CreateAdministratorFormValues>({
    resolver: zodResolver(createAdministratorFormSchema),
    defaultValues: {
      email: administrator?.email || '',
    },
  });

  const resetFormValues = () => {
    form.reset({
      email: '',
    });
  };

  const handleSuccess = () => {
    setIsSuccessful(true);
    setIsLoading(false);
    refreshAdmins();
    setTimeout(() => {
      onOpenChange(false);
    }, 1500);
    setTimeout(() => {
      setIsSuccessful(false);
      resetFormValues();
    }, 1700);
  };

  const onSubmit: SubmitHandler<CreateAdministratorFormValues> = (data) => {
    setIsLoading(true);

    createGlobalInvitation({
      input: { email: data.email, globalRole: Role.SandvikAdmin },
    })
      .then((result) => {
        // Backend errors
        handleGraphQLErrors(result.error);

        // Success
        if (result.data) {
          handleSuccess();

          setTimeout(() => {
            showAlertToast({
              title: responses.adminInviteSuccess,
              variant: 'success',
            });
          }, 1500);
        }
      })
      // Fallback error
      .catch(() => {
        showAlertToast({
          title: responses.adminInviteFailError,
          description: responses.contactSupportError,
          variant: 'error',
        });
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (administrator) {
      form.reset({
        email: administrator.email || '',
      });
    }
  }, [administrator, form]);

  const formValues = form.watch();
  const isAnyFieldEmpty = !formValues.email;

  return (
    <ModalContent onCloseAutoFocus={resetFormValues}>
      <ModalHeader>
        <ModalTitle>Add administrator</ModalTitle>
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
                {!isLoading && <LucidePlus />}
                Add administrator
              </Button>
            </ModalFooter>
          </form>
        </Form>
      </SuccessMessage>
    </ModalContent>
  );
};
