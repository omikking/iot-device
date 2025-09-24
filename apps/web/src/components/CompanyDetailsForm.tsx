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
import {
  CreateCompanyFormValues,
  UpdateCompanyFormValues,
} from './schemas/CompanyFormSchema';
import { placeholder } from '@/app/uitexts/placeholder';

type CompanyDetailsFormProps = {
  companyForm: UseFormReturn<UpdateCompanyFormValues | CreateCompanyFormValues>;
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
                  placeholder={placeholder.companyNamePlaceholder}
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder.emailPlaceholder}
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
                  placeholder={placeholder.organisationNumberPlaceholder}
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
                  placeholder={placeholder.countryPlaceholder}
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
                  placeholder={placeholder.cityPlaceholder}
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
                  placeholder={placeholder.addressPlaceholder}
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
                  placeholder={placeholder.postalCodePlaceholder}
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
