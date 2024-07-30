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
  const options = [
    {
      id: '1',
      name: 'Elliot Anderson',
    },
    {
      id: '2',
      name: 'Darlene Anderson',
    },
    {
      id: '3',
      name: 'Tyrell Wellick',
    },
    {
      id: '4',
      name: 'Joanna Wellick',
    },
    {
      id: '5',
      name: 'Angela Moss',
    },
    {
      id: '6',
      name: 'Whiterose',
    },
    {
      id: '7',
      name: 'Felix Östergren',
    },
    {
      id: '8',
      name: 'Jimmy Nwadinkpa',
    },
  ];

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
                position="bottom"
                options={options}
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
