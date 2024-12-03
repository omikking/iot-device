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
} from '@gsp/ui';
import {
  TechnicianFormValues,
  technicianFormSchema,
} from './schemas/TechnicianFormSchema';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { SuccessMessage } from './SuccessMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucidePlus, LucideSquarePen } from 'lucide-react';

interface AddOrEditTechnicianModalProps {
  onOpenChange: (open: boolean) => void;
  technician?: TechnicianFormValues | null;
}

export const AddOrEditTechnicianModal = ({
  onOpenChange,
  technician,
}: AddOrEditTechnicianModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const form = useForm<TechnicianFormValues>({
    resolver: zodResolver(technicianFormSchema),
    defaultValues: {
      fullName: '',
      company: '',
      email: '',
      phoneNumber: '',
      isGlobal: false,
    },
  });

  const resetFormValues = () => {
    form.reset({
      fullName: '',
      company: '',
      email: '',
      phoneNumber: '',
      isGlobal: false,
    });
  };

  const onSubmit = async (data: TechnicianFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Technician added:', data);
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

  const handleModalClose = () => {
    form.reset({
      fullName: '',
      company: '',
      email: '',
      phoneNumber: '',
      isGlobal: false,
    });
    onOpenChange(false);
  };

  useEffect(() => {
    if (technician) {
      form.reset({
        fullName: technician.fullName,
        company: technician.company,
        email: technician.email,
        phoneNumber: technician.phoneNumber,
        isGlobal: technician.isGlobal,
      });
    }

    if (!technician) {
      handleModalClose();
    }
  }, [technician, form]);

  return (
    <ModalContent className="sm:max-w-[425px]">
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
                  name="company"
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
                <Headline as="h3" color="foreground" variant="small" isBold>
                  Make this technician visible globally?
                </Headline>

                <FormField
                  control={form.control}
                  name="isGlobal"
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
                {isLoading ? (
                  <LoadingSpinner className="animate-spin" size={24} />
                ) : technician ? (
                  <>
                    <LucideSquarePen />
                    Edit technician
                  </>
                ) : (
                  <>
                    <LucidePlus />
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
