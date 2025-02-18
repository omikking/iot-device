import { Company } from '@/gql/graphql';
import {
  ContentHolder,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@gsp/ui';
import { UseFormReturn } from 'react-hook-form';

type CompanyDetailsFormProps = {
  // not sure about this
  companyForm: UseFormReturn<Company>;
};

export const CompanyDetailsForm = ({
  companyForm,
}: CompanyDetailsFormProps) => {
  return (
    <ContentHolder variant="general" headlineText="Company details">
      <FormField
        control={companyForm.control}
        name="name"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Company name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter company name..."
                  className="w-full"
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="companyContactEmail"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Full contact email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter full contact email..."
                  className="w-full"
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="orgNumber"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Organisation number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter organisation number..."
                  className="w-full"
                  onChange={field.onChange}
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
                  {...field}
                  placeholder="Enter country..."
                  className="w-full"
                  onChange={field.onChange}
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
                  {...field}
                  placeholder="Enter city..."
                  className="w-full"
                  onChange={field.onChange}
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
                  {...field}
                  placeholder="Enter address..."
                  className="w-full"
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="postalCode"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Postal code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter postal code..."
                  className="w-full"
                  onChange={field.onChange}
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
