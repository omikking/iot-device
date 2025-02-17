import {
  Button,
  FormControl,
  Form,
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
  Headline,
} from '@gsp/ui';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SiteResultSchema } from '@/app/mock/mock';
import { zodResolver } from '@hookform/resolvers/zod';
import { siteFormSchema, SiteFormValues } from './schemas/SitesFormSchema';
import { LucidePlus } from 'lucide-react';
import { SuccessMessage } from './SuccessMessage';

type AddOrEditSiteModalProps = {
  site?: SiteResultSchema;
  appSelected: 'Pull Test' | 'xCyclops' | 'Ultrabolts';
  onOpenChange: (open: boolean) => void;
};

export const AddOrEditSiteModal = ({
  site,
  appSelected,
  onOpenChange,
}: AddOrEditSiteModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: site?.name ?? '',
      address: site?.address ?? '',
      passCriteria: site?.passCriteria ?? '',
    },
  });

  const resetFormValues = () => {
    form.reset({
      name: '',
      address: '',
      passCriteria: '',
    });
  };

  const onSubmit = async (data: SiteFormValues) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Simulate API call
    console.log('Site added', data);
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

  useEffect(() => {
    if (site) {
      form.reset(site);
    }
  }, [site, form]);

  return (
    <ModalContent onCloseAutoFocus={resetFormValues}>
      <ModalHeader>
        <ModalTitle>{site ? 'Edit' : 'Add'} Site</ModalTitle>
      </ModalHeader>
      <SuccessMessage isVisible={isSuccessful}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col px-10 p-10">
              <div className="flex flex-row justify-between pb-10">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>* Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Fill in name..."
                            className="w-96"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>* Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Fill in address..."
                            className="w-96"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <Headline as="h3" color="foreground" variant="small" isBold>
                {appSelected} settings
              </Headline>
              <div className="flex flex-row justify-between pt-5">
                <FormField
                  control={form.control}
                  name="passCriteria"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>* Pass Criteria</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Fill in pass criteria..."
                            className="w-96"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
            <ModalFooter className="px-10 pb-6">
              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner className="animate-spin" size={24} />
                ) : (
                  <LucidePlus />
                )}

                {site ? 'Save changes' : 'Add user'}
              </Button>
            </ModalFooter>
          </form>
        </Form>
      </SuccessMessage>
    </ModalContent>
  );
};
