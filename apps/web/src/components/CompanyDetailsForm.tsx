import {
  ContentHolder,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@gsp/ui';
import { companyFormSchema } from '@/app/(routes)/company/page';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export const CompanyDetailsForm = ({
  companyForm,
}: {
  companyForm: UseFormReturn<CompanyFormValues>;
}) => {
  return (
    <ContentHolder variant="general" headlineText="Company details">
      <FormField
        control={companyForm.control}
        name="companyName"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Company name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter company name..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="fullContactName"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Full contact name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter full contact name..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="organisationNumber"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Organisation number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter organisation number..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="country"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter country..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="city"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter city..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="address"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter address..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </ContentHolder>
  );
};
