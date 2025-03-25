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
  LoadingSpinner,
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Text,
} from '@gsp/ui';
import {
  UpdateTechnicianFormValues,
  updateTechnicianFormSchema,
} from './schemas/TechnicianFormSchema';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { SuccessMessage } from './SuccessMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideCircleHelp, LucidePlus, LucideSquarePen } from 'lucide-react';
import { User } from '@/gql/graphql';
import { graphql } from '@/gql';
import { useMutation } from 'urql';

// @TODO make the create user query later when BE is advanced.

const updateTechnicianMutation = graphql(`
  mutation updateTechnician($id: String!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      id
      email
      fullName
      workPlace
      phoneNumber
      globalRole
      isGlobalVisibility
    }
  }
`);

interface AddOrEditTechnicianModalProps {
  onOpenChange: (open: boolean) => void;
  technician?: User;
}

export const AddOrEditTechnicianModal = ({
  onOpenChange,
  technician,
}: AddOrEditTechnicianModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [, updateTechnician] = useMutation<UpdateTechnicianFormValues>(
    updateTechnicianMutation,
  );

  const form = useForm<UpdateTechnicianFormValues>({
    resolver: zodResolver(updateTechnicianFormSchema),
    defaultValues: {
      fullName: technician?.fullName || '',
      workPlace: technician?.workPlace || '',
      email: technician?.email || '',
      phoneNumber: technician?.phoneNumber || '',
      isGlobalVisibility: technician?.isGlobalVisibility || false,
    },
  });

  const resetFormValues = () => {
    form.reset({
      fullName: '',
      workPlace: '',
      email: '',
      phoneNumber: '',
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

  const onSubmit: SubmitHandler<UpdateTechnicianFormValues> = (data) => {
    setIsLoading(true);

    if (technician) {
      updateTechnician({
        id: technician.id,
        updateUserInput: data,
      }).then((result) => {
        if (result.data) {
          onSuccessfulSubmit();
        }
      });
    }

    if (!technician) {
      // fix later for create technician flow
    }
  };

  useEffect(() => {
    if (technician) {
      form.reset({
        ...technician,
        phoneNumber: technician.phoneNumber || '',
        isGlobalVisibility: technician.isGlobalVisibility || false,
      });
    }
  }, [technician, form]);

  return (
    <ModalContent onCloseAutoFocus={resetFormValues}>
      <ModalHeader>
        <ModalTitle>
          {technician ? 'Edit technician' : 'Add technician'}
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
              </div>
              <div className="pt-10">
                <div className="flex flex-row items-center gap-2">
                  <Headline as="h3" color="foreground" variant="small" isBold>
                    Make this technician visible globally?
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
                    <FormItem className="pt-4">
                      <FormControl>
                        <RadioGroup
                          value={String(field.value)}
                          onValueChange={field.onChange}
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
                disabled={isLoading}
              >
                {technician ? (
                  <>
                    {isLoading ? (
                      <LoadingSpinner className="animate-spin" size={24} />
                    ) : (
                      <LucideSquarePen />
                    )}
                    Edit technician
                  </>
                ) : (
                  <>
                    {isLoading ? (
                      <LoadingSpinner className="animate-spin" size={24} />
                    ) : (
                      <LucidePlus />
                    )}
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
