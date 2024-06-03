import { Button, Label } from '@gsp/ui';
import React from 'react';

const mockCompanyList = [
  {
    name: 'E-Corp',
    id: '1',
  },
  {
    name: 'Vandelay Industries',
    id: '2',
  },
  {
    name: 'Valve Industries',
    id: '3',
  },
];

export const Companies = () => {
  return (
    <div>
      <h3 className="px-md text-md font-light">All companies</h3>
      <ul className="bg-neutral-1 px-md py-md border-2 border-neutral-2">
        {mockCompanyList.map((company) => (
          <div
            key={company.id}
            className="flex justify-between my-1 px-md p-sm items-center bg-main-white"
          >
            <div>
              <Label>{company.name}</Label>
            </div>
            <div className="flex gap-sm ">
              <Button className="bg-gold-primary" size={'lg'}>
                Administrate
              </Button>
              <Button size={'lg'} variant={'secondary'}>
                View Apps
              </Button>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Companies;
