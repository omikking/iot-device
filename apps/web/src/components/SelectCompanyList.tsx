'use client';
import Link from 'next/link';
import { Text } from '@gsp/ui';
import { LucideMoveRight, LucideSearchX } from 'lucide-react';
import { GetAllCompaniesQuery } from '@/gql/graphql';

type SelectCompanyListProps = {
  companies: GetAllCompaniesQuery['companies']['results'];
};

export const SelectCompanyList = ({ companies }: SelectCompanyListProps) => {
  return (
    <>
      {!companies?.length ? (
        <div className="flex h-60 flex-col justify-center items-center gap-5">
          <div className="text-center">
            <Text color="foreground" variant="medium">
              You don't have access to any companies yet.
            </Text>
            <Text color="foreground" variant="medium">
              Once you're added to a company, you'll see it here.
            </Text>
          </div>
          <LucideSearchX color="gray" />
        </div>
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
                    className="transition-all ease-in-out opacity-30 group-hover:opacity-100 group-hover:translate-x-1.5"
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
