'use client';
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

  // @TODO this logic might needs some modification. Having trouble when the update mutation differs with users vs userPermissions etc.
  // Leave it for now, and will be worked on later.

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
                    // @TODO Fix
                    isNewCompany
                      ? { userId: '87506bef-5283-44d8-ab42-a668ea616975' }
                      : {
                          newUserId: '87506bef-5283-44d8-ab42-a668ea616975',
                          oldUserId: '87506bef-5283-44d8-ab42-a668ea616975',
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
