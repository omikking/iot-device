'use client';
import Link from 'next/link';
import { Button, Text } from '@gsp/ui';
import { LucideMoveRight } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}
interface SelectCompanyListProps {
  companies: Company[];
}
export const SelectCompanyList: React.FC<SelectCompanyListProps> = ({
  companies,
}) => {
  return (
    <>
      {companies?.map((company) => (
        <div
          key={company.id}
          className="w-full flex justify-between items-center px-6 py-4 bg-main-white"
        >
          <Text variant="medium" color="foreground">
            {company.name}
          </Text>
          <div className="flex gap-4">
            <Button size="small" variant="primary" asChild>
              <Link href={`/selectapplication`}>
                <LucideMoveRight />
                Select
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </>
  );
};
