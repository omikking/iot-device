import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucideCircleCheckBig, LucidePlus } from 'lucide-react';
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

      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isSuccessFull
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-32 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-center h-96 gap-4">
          <LucideCircleCheckBig size={30} className="text-success" />
          <Headline as="h3" color="foreground" variant="smallBold">
            Successfully saved
          </Headline>
        </div>
      </div>
      <div
        className={`transition-all duration-100 ${
          isSuccessFull ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => onSubmit())}>
            <div className="px-10 pt-10">
              <div className="flex flex-row flex-wrap justify-between gap-8">
                <FormField
                  control={form.control}
                  name="fullName"
                  disabled={isSuccessFull}
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
                  disabled={isSuccessFull}
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
                  disabled={isSuccessFull}
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
                  disabled={isSuccessFull}
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
                <Button type="submit" size="large" variant="primary">
                  <LoadingSpinner className="animate-spin" size={24} />
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
      </div>
    </ModalContent>
  );
};
