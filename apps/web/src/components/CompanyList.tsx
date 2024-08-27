import { Button, Text } from '@gsp/ui';
import { LucideLayoutGrid, LucideMoveRight } from 'lucide-react';
import Link from 'next/link';

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
    name: 'Valve Software',
    id: '3',
  },
  {
    name: 'Subset Games',
    id: '4',
  },
  {
    name: 'Bohemia Interactive',
    id: '5',
  },
  {
    name: 'Felix Industries',
    id: '6',
  },
];

export const CompanyList = () => {
  return (
    <>
      {mockCompanyList.map((company) => (
        <div
          key={company.id}
          className="w-full flex justify-between items-center px-6 py-4 bg-main-white"
        >
          <Text variant="medium" color="foreground">
            {company.name}
          </Text>
          <div className="flex gap-4">
            <Button size="small" variant="primary" asChild>
              <Link href="/company">
                <LucideMoveRight />
                Administrate
              </Link>
            </Button>
            <Button size="small" variant="outline" asChild>
              <Link href="#">
                <LucideLayoutGrid />
                View Apps
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};
