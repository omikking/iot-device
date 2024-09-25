import { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderIcon, LucideCircleCheckBig, LucidePlus } from 'lucide-react';
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

export const AddOrEditTechnicianModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessFull, setIsSuccessFull] = useState(false);
  const formSchema = z.object({
    fullName: z
      .string()
      .min(3, { message: 'Full name must be at least 3 characters.' })
      .max(50, { message: 'Full name must be at most 50 characters.' }),
    company: z
      .string()
      .min(3, { message: 'Company must be at least 3 characters.' }),
    email: z
      .string()
      .email({ message: 'Email must be a valid email address.' })
      .min(2, { message: 'Email must be at least 2 characters.' })
      .max(50, { message: 'Email must be at most 50 characters.' }),
    phoneNumber: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 numbers' }),
    isGlobal: z
      .string({
        message: 'Please select the visibility of the technician.',
      })
      .transform((val) => val === 'true'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      company: '',
      email: '',
      phoneNumber: '',
      isGlobal: false,
    },
  });

  const onSubmit = () => {
    console.log('submit form', form.getValues());
  };

  // call to the backend to create the technician
  const activateSpinner = () => {
    console.log('Adding technician...');
    setIsLoading(true);
    setTimeout(() => {
      console.log('Technician added!');
      setIsLoading(false);
      setIsSuccessFull(true);
    }, 1000);
  };

  return (
    <ModalContent className="sm:max-w-[425px]">
      <ModalHeader>
        <ModalTitle>Add technician</ModalTitle>
      </ModalHeader>
      {isSuccessFull ? (
        <div className="flex items-center justify-center h-96 gap-4">
          <LucideCircleCheckBig size={30} className="text-success" />
          <Headline as="h3" color="foreground" variant="smallBold">
            Successfully saved
          </Headline>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => onSubmit())}>
            <div className="px-10 pt-10">
              <div className="flex flex-row flex-wrap justify-between gap-8">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter full name"
                            {...field}
                            className="w-[390px]"
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
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter company"
                            {...field}
                            className="w-[390px]"
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
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter email"
                            {...field}
                            className="w-[390px]"
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
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phone number"
                            {...field}
                            className="w-[390px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="pt-10">
                <Headline as="h3" color="foreground" variant="smallBold">
                  Make this technician visible globally?
                </Headline>

                <FormField
                  control={form.control}
                  name="isGlobal"
                  render={({ field }) => (
                    <FormItem className="pt-4">
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange}>
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
              {isLoading ? (
                <Button type="submit" size="large" variant="primary" disabled>
                  {/* This Loading spinner is slimmer and more elegant. We have more control over it. */}
                  <LoadingSpinner className="animate-spin" size={24} />
                  {/* this one requieres no setup
                <LoaderIcon className="animate-spin" /> */}
                  Add technician
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="large"
                  variant="primary"
                  onClick={() => activateSpinner()}
                >
                  <LucidePlus />
                  Add technician
                </Button>
              )}
            </ModalFooter>
          </form>
        </Form>
      )}
    </ModalContent>
  );
};
