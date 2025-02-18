import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { adminsMock } from '@/app/mock/mock';
import {
  Dropdown,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gsp/ui';
import { Company } from '@/gql/graphql';

interface AdminFormProps {
  // companyForm: UseFormReturn<CreateCompanyInput | UpdateCompanyInput>;
  companyForm: UseFormReturn<Company>;
}

export const AdminForm = ({ companyForm }: AdminFormProps) => {
  const [administrator, setAdministrator] = useState<string | undefined>(
    undefined,
  );

  return (
    <FormField
      control={companyForm.control}
      // @TODO fix this
      name="users"
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
                onSelect={(e) => {
                  setAdministrator(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
