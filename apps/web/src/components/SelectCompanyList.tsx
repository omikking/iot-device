'use client';
import Link from 'next/link';
import { Headline, Text } from '@gsp/ui';
import { LucideMoveRight, LucideSearchX } from 'lucide-react';
import { GetAllCompaniesQuery } from '@/gql/graphql';

interface SelectCompanyListProps {
  companies: GetAllCompaniesQuery['companies']['results'];
}

export const SelectCompanyList: React.FC<SelectCompanyListProps> = ({
  companies,
}) => {
  if (!companies?.length) {
    return (
      <section
        aria-labelledby="no-companies-heading"
        className="w-full flex flex-col items-center justify-center gap-4 ui-border ui-px-6 ui-py-12 bg-main-white"
        role="region"
      >
        <LucideSearchX size={32} className="text-gray-400" aria-hidden="true" />
        <Headline
          variant="medium"
          color="foreground"
          id="no-companies-heading"
          as="h2"
        >
          No companies found
        </Headline>
        <Text variant="small" color="foreground" className="text-center">
          Either no companies exist or you do not have permission to view any
          companies.
        </Text>
      </section>
    );
  }

  return (
    <nav aria-label="Companies list">
      <ul>
        {companies.map((company) => (
          <li key={company.id} className="mb-2">
            <Link
              href={`/selectapplication`}
              className="w-full flex justify-between items-center ui-border ui-border-gold-3 hover:ui-border-gold-primary focus:ui-border-gold-primary focus:outline-none focus:ring-1 focus:ring-gold-primary ui-transition-all ease-in-out duration-200 ui-px-6 ui-py-6 bg-main-white"
              aria-label={`Select ${company.name}`}
            >
              <Text variant="medium" color="foreground">
                {company.name}
              </Text>
              <LucideMoveRight aria-hidden="true" className="flex-shrink-0" />
              <span className="sr-only">Select {company.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
