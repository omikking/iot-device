import { useState } from 'react';
import {
  Dropdown,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gsp/ui';
import { adminsMock } from '@/app/mock/mock';

export const AdminForm = ({ companyForm }) => {
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
