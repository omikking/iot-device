import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { adminsMock } from '@/app/mock/mock';
import { CompanyFormValues } from '@/components/schemas/CompanyFormSchema';
import {
  Dropdown,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gsp/ui';

interface AdminFormProps {
  companyForm: UseFormReturn<CompanyFormValues>;
}

export const AdminForm = ({ companyForm }: AdminFormProps) => {
  const [administrator, setAdministrator] = useState<string | undefined>(
    undefined,
  );

  return (
    <FormField
      control={companyForm.control}
      name="assignSandvikAdministrator"
      render={() => {
        return (
          <FormItem className="w-96">
            <FormLabel>Assigned Sandvik administrator</FormLabel>
            <FormControl>
              <Dropdown
                id="person"
                placeholder="Select Sandvik administrator"
                selectedId={administrator}
                options={adminsMock}
                onSelect={(e) => setAdministrator(e)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
