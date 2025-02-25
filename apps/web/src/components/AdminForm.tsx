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
import {
  CreateCompanyFormValues,
  UpdateCompanyFormValues,
} from './schemas/CompanyFormSchema';

interface AdminFormProps {
  isNewCompany: boolean;
  companyForm: UseFormReturn<UpdateCompanyFormValues | CreateCompanyFormValues>;
}

export const AdminForm = ({ isNewCompany, companyForm }: AdminFormProps) => {
  const [administrator, setAdministrator] = useState<string | undefined>(
    undefined,
  );

  return (
    <FormField
      control={companyForm.control}
      name="userPermissions"
      render={({ field }) => {
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
                  field.onChange([
                    isNewCompany
                      ? { userId: '123' }
                      : {
                          newUserId: '456',
                          oldUserId: '789',
                        },
                  ]);
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
