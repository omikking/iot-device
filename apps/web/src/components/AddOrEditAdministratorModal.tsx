import {
  Button,
  // Dropdown,
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
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { SuccessMessage } from './SuccessMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucidePlus, LucideSquarePen } from 'lucide-react';
import { AdministratorUpdateUrql } from '@/components/urql-administrator/AdministratorUpdateUrql';

type AddOrEditAdministratorModalProps = {
  onOpenChange: (open: boolean) => void;
  administrator?: ICompanyUser;
};

type ICompanyUser = {
  id: string;
  email: string;
  fullName: string;
  workPlace: string;
  phoneNumber: string;
};

export const AddOrEditAdministratorModal = ({
  onOpenChange,
  administrator,
}: AddOrEditAdministratorModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const { updateUser } = AdministratorUpdateUrql();

  const form = useForm<AdministratorFormValues>({
    resolver: zodResolver(administratorFormSchema),
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

  const onSubmit = async (data: AdministratorFormValues) => {
    setIsLoading(true);

    try {
      if (administrator) {
        await updateUser(administrator.id, {
          fullName: data.fullName,
          workPlace: data.workPlace,
          phoneNumber: data.phoneNumber,
          email: data.email,
        });
      }
      setIsSuccessful(true);
      setTimeout(() => {
        onOpenChange(false);
      }, 1500);

      setTimeout(() => {
        setIsSuccessful(false);
        resetFormValues();
      }, 1700);
    } catch (error) {
      console.log('Failed to save administrator: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    resetFormValues();
    onOpenChange(false);
  };

  useEffect(() => {
    if (administrator) {
      form.reset(administrator);
    }

    if (!administrator) {
      handleModalClose();
    }
  }, [administrator, form]);

  return (
    <ModalContent
      className="sm:max-w-[425px]"
      onCloseAutoFocus={resetFormValues}
    >
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
                {/* <FormField
                  control={form.control}
                  name="globalRole"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-96">
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Dropdown
                            id="role"
                            placeholder="Select role..."
                            selectedId={form.getValues('globalRole') || role}
                            options={roles}
                            onSelect={(e) => {
                              const selectedRole = e as
                                | 'COMPANY_ADMIN'
                                | 'SANDVIK_ADMIN';
                              setRole(selectedRole);
                              field.onChange(selectedRole);
                              if (selectedRole !== 'SANDVIK_ADMIN') {
                                form.setValue('globalRole', '');
                              }
                            }}
                            className="w-96"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                /> */}
              </div>
            </div>
            <ModalFooter className="ui-px-10 ui-py-6">
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
