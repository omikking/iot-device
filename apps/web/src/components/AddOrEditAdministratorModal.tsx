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
import { useState } from 'react';
import { LucidePlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { SuccessMessage } from './SuccessMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { optionAdministratorRoleMock } from '@/app/mock/mock';

interface AddOrEditAdministratorModalProps {
  onOpenChange: (open: boolean) => void;
}

export const AddOrEditAdministratorModal = ({
  onOpenChange,
}: AddOrEditAdministratorModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const form = useForm<AdministratorFormValues>({
    resolver: zodResolver(administratorFormSchema),
    defaultValues: {
      fullName: '',
      company: '',
      email: '',
      phoneNumber: '',
      role: '',
    },
  });

  const resetFormValues = () => {
    form.reset({
      fullName: '',
      company: '',
      email: '',
      phoneNumber: '',
      role: '',
    });
  };

  const onSubmit = async (data: AdministratorFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Administrator added:', data);
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

  return (
    <ModalContent className="sm:max-w-[425px]">
      <ModalHeader>
        <ModalTitle>Add administrator</ModalTitle>
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
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-96">
                        <FormLabel>Dropdown</FormLabel>
                        <FormControl>
                          <Dropdown
                            id="role"
                            placeholder="Select role..."
                            selectedId={field.value}
                            options={optionAdministratorRoleMock}
                            onSelect={(value) => field.onChange(value)}
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
            <ModalFooter className="ui-px-10 ui-py-6">
              <Button
                type="submit"
                size="large"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner className="animate-spin" size={24} />
                ) : (
                  <LucidePlus />
                )}
                Add administrator
              </Button>
            </ModalFooter>
          </form>
        </Form>
      </SuccessMessage>
    </ModalContent>
  );
};
