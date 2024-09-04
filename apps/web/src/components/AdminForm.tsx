import { adminsMock } from '@/app/mock/mock';
import {
  Dropdown,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gsp/ui';

import { useState } from 'react';

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
          <FormItem>
            <FormLabel>Assigned Sandvik administrator</FormLabel>
            <FormControl>
              <Dropdown
                id="person"
                placeholder="Select Sandvik administrator"
                selectedId={administrator}
                options={adminsMock}
                onSelect={(e) => setAdministrator(e)}
                className="w-[400px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
