'use client';
import Link from 'next/link';
import { Headline, Text } from '@gsp/ui';
import { LucideMoveRight, LucideSearchX } from 'lucide-react';
import { GetAllCompaniesQuery } from '@/gql/graphql';

interface SelectCompanyListProps {
  companies: GetAllCompaniesQuery['companies']['results'];
}

export const SelectCompanyList = ({ companies }: SelectCompanyListProps) => {
  return (
    <>
      {!companies?.length ? (
        <section
          aria-labelledby="no-companies-heading"
          className="w-full flex flex-col items-center justify-center gap-4 border pl-6 pr-8 py-12 bg-main-white"
          role="region"
        >
          <LucideSearchX
            size={32}
            className="text-gray-400"
            aria-hidden="true"
          />
          <Headline
            variant="medium"
            color="foreground"
            id="no-companies-heading"
            as="h2"
          >
            No companies found
          </Headline>
          <Text variant="small" color="foreground" className="text-center">
            You do not have permission to view any companies.
          </Text>
        </section>
      ) : (
        <nav aria-label="Companies list">
          <ul>
            {companies.map((company) => (
              <li key={company.id} className="mb-2">
                <Link
                  href={`/selectapplication/${company.id}`}
                  className="group w-full flex justify-between items-center border border-gold-3 hover:border-gold-primary focus:border-gold-primary focus:outline-none focus:ring-1 focus:ring-gold-primary transition-all ease-in-out duration-200 px-6 py-6 bg-main-white"
                  aria-label={`Select ${company.name}`}
                >
                  <Text variant="medium" color="foreground">
                    {company.name}
                  </Text>
                  <LucideMoveRight
                    aria-hidden="true"
                    className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-1.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
};
