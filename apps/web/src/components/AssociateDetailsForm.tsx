import { UseFormReturn } from 'react-hook-form';
// import { CompanyFormValues } from '@/components/schemas/CompanyFormSchema';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@gsp/ui';

interface AssociateDetailsFormProps {
  //   companyForm: UseFormReturn<CompanyFormValues>;
  companyForm: any;
}

export const AssociateDetailsForm = ({
  companyForm,
}: AssociateDetailsFormProps) => {
  return (
    <>
      <FormField
        control={companyForm.control}
        name="assignSandvikAdministrator"
        render={() => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input value="Darlene Alderson" className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="assignSandvikAdministrator"
        render={() => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input value="darlene@gmail.com" className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        control={companyForm.control}
        name="assignSandvikAdministrator"
        render={() => {
          return (
            <FormItem className="min-w-[31%]">
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input value="+46701740621" className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
};
