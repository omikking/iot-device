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
import { CreateCompanyInput, UpdateCompanyInput } from '@/gql/graphql';

type CompanyDetailsFormProps = {
  companyForm?: UseFormReturn<CreateCompanyInput | UpdateCompanyInput>;
};

export const CompanyDetailsForm = ({
  companyForm,
}: CompanyDetailsFormProps) => {
  return (
    <ContentHolder variant="general" headlineText="Company details">
      <FormField
        control={companyForm?.control}
        name="name"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Company name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter company name..."
                  value={field.value ?? ''}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm?.control}
        name="companyContactEmail"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Full contact name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter full contact name..."
                  value={field.value ?? ''}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm?.control}
        name="orgNumber"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Organisation number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter organisation number..."
                  value={field.value ?? ''}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm?.control}
        name="country"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter country..."
                  value={field.value ?? ''}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm?.control}
        name="city"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter city..."
                  value={field.value ?? ''}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm?.control}
        name="address"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter address..."
                  value={field.value ?? ''}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm?.control}
        name="postalCode"
        render={({ field }) => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Postal code</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter postal code..."
                  value={field.value ?? ''}
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
