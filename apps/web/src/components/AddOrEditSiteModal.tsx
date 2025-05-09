import {
  Button,
  FormControl,
  Form,
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
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createSiteFormSchema,
  updateSiteFormSchema,
  CreateSiteFormValues,
  UpdateSiteFormValues,
} from './schemas/SiteFormSchema';
import { LucidePlus } from 'lucide-react';
import { SuccessMessage } from './SuccessMessage';
import { graphql } from '@/gql';
import { Site } from '@/gql/graphql';
import { useMutation } from 'urql';
import { useSession } from 'next-auth/react';

const createSiteMutation = graphql(`
  mutation createSite($createSiteInput: CreateSiteInput!) {
    createSite(createSiteInput: $createSiteInput) {
      id
      siteName
      address
      postalCode
      city
      country
      companyId
    }
  }
`);

const updateSiteMutation = graphql(`
  mutation updateSite($id: String!, $updateSiteInput: UpdateSiteInput!) {
    updateSite(id: $id, updateSiteInput: $updateSiteInput) {
      id
      siteName
      address
      postalCode
      city
      country
      companyId
    }
  }
`);

type AddOrEditSiteModalProps = {
  site?: Site;
  onOpenChange: (open: boolean) => void;
};

export const AddOrEditSiteModal = ({
  site,
  onOpenChange,
}: AddOrEditSiteModalProps) => {
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [, createSite] = useMutation<CreateSiteFormValues>(createSiteMutation);
  const [, updateSite] = useMutation<UpdateSiteFormValues>(updateSiteMutation);

  const form = useForm<CreateSiteFormValues | UpdateSiteFormValues>({
    resolver: zodResolver(site ? updateSiteFormSchema : createSiteFormSchema),
    defaultValues: {
      siteName: site?.siteName || '',
      address: site?.address || '',
      postalCode: site?.postalCode || '',
      city: site?.city || '',
      country: site?.country || '',
      companyId: site?.companyId || session?.company.id,
    },
  });

  const resetFormValues = () => {
    form.reset({
      siteName: '',
      address: '',
      postalCode: '',
      city: '',
      country: '',
      companyId: session?.company.id,
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

  const onSubmit: SubmitHandler<CreateSiteFormValues | UpdateSiteFormValues> = (
    data,
  ) => {
    setIsLoading(true);

    if (site) {
      updateSite({
        id: site.id,
        updateSiteInput: data,
      }).then((result) => {
        // @TODO Add component later for handling error
        console.log(result);
        if (result.data) {
          onSuccessfulSubmit();
        }
      });
    }

    if (!site) {
      createSite({
        createSiteInput: data,
      }).then((result) => {
        // @TODO Add component later for handling error
        console.log(result);
        if (result.data) {
          onSuccessfulSubmit();
        }
      });
    }
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
            <div className="px-10 pt-10">
              <div className="flex flex-row flex-wrap justify-between gap-8">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Site name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Fill in site name..."
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
                        <FormLabel>Address</FormLabel>
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
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Postal code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Fill in postal code..."
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
                  name="city"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Fill in city..."
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
                  name="country"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Fill in country..."
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
            <ModalFooter className="px-10 py-6">
              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={isLoading}
                isLoading={isLoading}
              >
                {!isLoading && <LucidePlus />}

                {site ? 'Save changes' : 'Add site'}
              </Button>
            </ModalFooter>
          </form>
        </Form>
      </SuccessMessage>
    </ModalContent>
  );
};
