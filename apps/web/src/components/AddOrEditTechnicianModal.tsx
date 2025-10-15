import {
  Button,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Headline,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  RadioGroupItem,
  RadioGroup,
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Text,
  showAlertToast,
} from '@gsp/ui';
import {
  UpdateTechnicianFormValues,
  updateTechnicianFormSchema,
} from './schemas/TechnicianFormSchema';
import { graphql } from '@/gql';
import { useMutation } from 'urql';
import { User } from '@/gql/graphql';
import { useEffect, useState } from 'react';
import { SuccessMessage } from './SuccessMessage';
import { responses } from '@/app/uitexts/responses';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LucideCircleHelp, LucidePlus, LucideSquarePen } from 'lucide-react';
import { handleGraphQLErrors } from '@/libs/utils';
import { Role } from '@/gql/graphql';
import { placeholder } from '@/app/uitexts/placeholder';

const createGlobalInvitationMutation = graphql(`
  mutation createGlobalInvitation($input: CreateGlobalInvitationInput!) {
    createGlobalInvitation(input: $input) {
      invitationId
      isNewUser
    }
  }
`);

const updateTechnicianMutation = graphql(`
  mutation updateTechnician($id: String!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      id
      email
      isGlobalVisibility
    }
  }
`);

type AddOrEditTechnicianModalProps = {
  onOpenChange: (open: boolean) => void;
  technician?: User;
  refreshTechnicians: () => void;
};

export const AddOrEditTechnicianModal = ({
  onOpenChange,
  technician,
  refreshTechnicians,
}: AddOrEditTechnicianModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [, createGlobalInvitation] = useMutation(
    createGlobalInvitationMutation,
  );

  const [, updateTechnician] = useMutation<UpdateTechnicianFormValues>(
    updateTechnicianMutation,
  );

  const form = useForm<UpdateTechnicianFormValues>({
    resolver: zodResolver(updateTechnicianFormSchema),
    defaultValues: {
      email: technician?.email || '',
      isGlobalVisibility: technician?.isGlobalVisibility || false,
    },
  });

  const resetFormValues = () => {
    form.reset({
      email: '',
      isGlobalVisibility: false,
    });
  };

  const handleSuccess = () => {
    setIsSuccessful(true);
    setIsLoading(false);
    setTimeout(() => {
      onOpenChange(false);
      refreshTechnicians();
    }, 1500);
    setTimeout(() => {
      setIsSuccessful(false);
      resetFormValues();
    }, 1700);
  };

  const onSubmit: SubmitHandler<UpdateTechnicianFormValues> = (data) => {
    setIsLoading(true);

    if (technician) {
      updateTechnician({
        id: technician.id,
        updateUserInput: data,
      })
        .then((result) => {
          // Backend errors
          handleGraphQLErrors(result.error);

          // Success
          if (result.data) {
            handleSuccess();

            setTimeout(() => {
              showAlertToast({
                title: responses.technicianUpdateSuccess,
                variant: 'success',
              });
            }, 1500);
          }
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.technicianUpdateFailedError,
            description: responses.contactSupportError,
            variant: 'error',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (!technician) {
      createGlobalInvitation({
        input: {
          email: data.email,
          globalRole: Role.SandvikTechnician,
          isGlobalVisibility: data.isGlobalVisibility,
        },
      })
        .then((result) => {
          // Backend errors
          handleGraphQLErrors(result.error);

          // Success
          if (result.data) {
            handleSuccess();

            setTimeout(() => {
              showAlertToast({
                title: responses.technicianInviteSuccess,
                variant: 'success',
              });
            }, 1500);
          }
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.technicianInviteFailError,
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
    if (technician) {
      form.reset({
        ...technician,
        isGlobalVisibility: technician.isGlobalVisibility || false,
      });
    }
  }, [technician, form]);

  const formValues = form.watch();
  const isDirty = form.formState.isDirty;
  const isAnyFieldEmpty = !formValues.email;

  const isSubmitDisabled = isAnyFieldEmpty || !isDirty;
  return (
    <ModalContent
      onCloseAutoFocus={resetFormValues}
      onOpenAutoFocus={(event) => event.preventDefault()}
    >
      <ModalHeader>
        <ModalTitle>
          {technician ? 'Edit technician' : 'Add technician'}
        </ModalTitle>
      </ModalHeader>
      <SuccessMessage
        isVisible={isSuccessful}
        title={
          technician ? 'Successfully saved' : 'Successfully sent invitation'
        }
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex gap-2 justify-between px-10 pt-10">
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
                          autoFocus
                          placeholder={placeholder.emailPlaceholder}
                          {...field}
                          className="w-96"
                          disabled={technician ? true : false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="pt-2">
                <div className="flex flex-row items-center gap-2">
                  <Headline as="h3" color="foreground" variant="small" isBold>
                    Make technician visible globally?
                  </Headline>
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger>
                        <LucideCircleHelp className="text-orange-primary" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <Text
                          color={'foreground'}
                          variant={'small'}
                          className="w-72"
                        >
                          If it’s set to visible, all your customers will be
                          able to assign this technician on them. If it’s
                          private, only the administrator will be able to assign
                          this technician.
                        </Text>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <FormField
                  control={form.control}
                  name="isGlobalVisibility"
                  render={({ field }) => (
                    <FormItem className="pt-1">
                      <FormControl>
                        <RadioGroup
                          value={String(field.value)}
                          onValueChange={(value) => {
                            field.onChange(value === 'true');
                          }}
                        >
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <RadioGroupItem value="false" />
                            </FormControl>
                            <FormLabel>Private</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3">
                            <FormControl>
                              <RadioGroupItem value="true" />
                            </FormControl>
                            <FormLabel>Visible</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <ModalFooter className="ui-px-10 ui-py-6">
              <Button
                type="submit"
                size="large"
                variant="primary"
                disabled={isSubmitDisabled || isLoading}
                isLoading={isLoading}
              >
                {technician ? (
                  <>
                    {!isLoading && <LucideSquarePen />}
                    Edit technician
                  </>
                ) : (
                  <>
                    {!isLoading && <LucidePlus />}
                    Add technician
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
