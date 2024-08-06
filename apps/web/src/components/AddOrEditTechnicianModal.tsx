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
} from '@gsp/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { LucidePlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const AddOrEditTechnicianModal = () => {
  const formSchema = z.object({
    fullName: z.string(),
    company: z.string(),
    email: z.string(),
    phoneNumber: z.string(),
    isGlobal: z.boolean(),
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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('submit form', form.getValues());
  };

  return (
    <ModalContent className="sm:max-w-[425px]">
      <ModalHeader>
        <ModalTitle>Add technician</ModalTitle>
      </ModalHeader>
      <Form {...form}>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="px-10 py-10">
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
            <div className="py-10">
              <Headline as="h3" color="foreground" variant="smallBold">
                Make this technician visible globally?
              </Headline>
              {/* Add radio components here later */}
            </div>
          </div>
          <ModalFooter className="ui-px-10 ui-py-6">
            <Button type="submit" size="large" variant="primary">
              <LucidePlus />
              Add technician
            </Button>
          </ModalFooter>
        </form>
      </Form>
    </ModalContent>
  );
};
