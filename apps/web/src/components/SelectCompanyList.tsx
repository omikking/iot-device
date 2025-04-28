'use client';
import Link from 'next/link';
import { Text } from '@gsp/ui';
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
        <Link
          key={company.id}
          href={`/selectapplication`}
          className="w-full flex justify-between items-center ui-border ui-border-gold-3 hover:ui-border-gold-primary ui-transition-all ease-in-out duration-200 ui-px-6 ui-py-6 bg-main-white"
        >
          <Text variant="medium" color="foreground">
            {company.name}
          </Text>
          <LucideMoveRight />
        </Link>
      ))}
    </>
  );
};
