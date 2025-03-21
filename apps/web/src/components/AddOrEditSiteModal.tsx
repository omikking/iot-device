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
import { zodResolver } from '@hookform/resolvers/zod';
import { siteFormSchema, SiteFormValues } from './schemas/SitesFormSchema';
import { LucidePlus } from 'lucide-react';
import { SuccessMessage } from './SuccessMessage';
import { useMutation } from 'urql';
import { useParams } from 'next/navigation';
import { graphql } from '@/gql';

const createSiteQuery = graphql(`
  mutation CreateSite($createSiteInput: CreateSiteInput!) {
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

const updateSiteQuery = graphql(`
  mutation UpdateSite($id: String!, $updateSiteInput: UpdateSiteInput!) {
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
  site?: ISite;
  appSelected: 'Pull Test' | 'xCyclops' | 'Ultrabolts';
  onOpenChange: (open: boolean) => void;
};

type ISite = {
  id: string;
  siteName: string;
  address: string;
  passCriteria: string;
  postalCode: string;
  city: string;
  country: string;
};

export const AddOrEditSiteModal = ({
  site,
  appSelected,
  onOpenChange,
}: AddOrEditSiteModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const siteParams = useParams();
  const siteId = Array.isArray(siteParams?.id)
    ? siteParams?.id[0]
    : siteParams?.id;

  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: '',
      address: '',
      passCriteria: '',
      postalCode: '',
      city: '',
      country: '',
    },
  });

  const resetFormValues = () => {
    form.reset({
      name: '',
      address: '',
      passCriteria: '',
      postalCode: '',
      city: '',
      country: '',
    });
  };
  useEffect(() => {
    if (site) {
      form.setValue('name', site.siteName);
      form.setValue('address', site.address);
      form.setValue('passCriteria', site.passCriteria);
      form.setValue('postalCode', site.postalCode);
      form.setValue('city', site.city);
      form.setValue('country', site.country);
    }
  }, [site, form]);

  const [, createSite] = useMutation(createSiteQuery);
  const [, updateSite] = useMutation(updateSiteQuery);

  const onSubmit = async (data: SiteFormValues) => {
    setIsLoading(true);

    const input = {
      siteName: data.name,
      address: data.address,
      passCriteria: undefined,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
      companyId: siteId,
    };

    if (site) {
      try {
        const response = await updateSite({
          id: site.id,
          updateSiteInput: input,
        });
        if (response.data) {
          setIsSuccessful(true);
          setTimeout(() => onOpenChange(false), 1500);
        }
      } catch (error) {
        console.error('Error updating site', error);
      }
    } else {
      try {
        const response = await createSite({ createSiteInput: input });
        if (response.data) {
          setIsSuccessful(true);
          setTimeout(() => onOpenChange(false), 1500);
        }
      } catch (error) {
        console.error('Error creating site', error);
      }
    }

    setTimeout(() => {
      setIsSuccessful(false);
      resetFormValues();
    }, 1700);

    setIsLoading(false);
  };

  return (
    <ModalContent
      onCloseAutoFocus={resetFormValues}
      className="max-h-[90vh] overflow-hidden"
    >
      <ModalHeader>
        <ModalTitle>{site ? 'Edit' : 'Add'} Site</ModalTitle>
      </ModalHeader>
      <SuccessMessage isVisible={isSuccessful}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col px-10 p-10 max-h-[60vh] overflow-x-auto">
              <div className="flex flex-row justify-between pb-10">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
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
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
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
                  )}
                />
              </div>
              <div className="flex flex-row justify-between pb-10">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>* City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fill in city..."
                          className="w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>* Country</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fill in country..."
                          className="w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row justify-between pb-10">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>* Postal Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Fill in postal code..."
                          className="w-96"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Headline as="h3" color="foreground" variant="small" isBold>
                {appSelected} settings
              </Headline>
              <div className="flex flex-row justify-between pt-5">
                <FormField
                  control={form.control}
                  name="passCriteria"
                  render={({ field }) => (
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
                  )}
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
                {site ? 'Save changes' : 'Add site'}
              </Button>
            </ModalFooter>
          </form>
        </Form>
      </SuccessMessage>
    </ModalContent>
  );
};
