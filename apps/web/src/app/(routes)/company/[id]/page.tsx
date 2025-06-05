'use client';
import { Text, Headline } from '@gsp/ui';
import { useState } from 'react';
import { GoBack } from '@/components/GoBack';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { CompanyNavigationCards } from '@/components/CompanyNavigationCards';
import { CompanyForm } from '@/components/CompanyForm';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { Company } from '@/gql/graphql';

const getCompanyQuery = graphql(`
  query getCompany($id: String!) {
    company(id: $id) {
      id
      name
      orgNumber
      address
      postalCode
      city
      country
      companyContactEmail
      plans {
        id
        companyId
        applicationName
        planLevel
        expiringDate
      }
      users {
        id
        fullName
      }
    }
  }
`);

export default function Page({
  params,
}: {
  params: { id: string };
}): JSX.Element {
  const isNewCompany = params.id === 'new';

  // Does not call if it's new company flow.
  const [companyData] = isNewCompany
    ? []
    : useQuery({
        query: getCompanyQuery,
        variables: { id: params.id },
      });
  const company = companyData?.data?.company as Company;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <GoBack />

      <Headline as="h1" variant="xl" color="foreground">
        {isNewCompany ? 'Add Company' : company?.name}
      </Headline>

      {!isNewCompany && <CompanyNavigationCards />}

      <CompanyForm
        company={company}
        isNewCompany={isNewCompany}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
      />

      {company && (
        <DeleteModalConfirmation
          deleteIcon="Company"
          deleteButtonText="Inactivate company"
          modalTitle="Inactivate company"
          modalText="Confirm inactivation"
          isOpen={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onDelete={() => {
            console.log('Deleting item...');
          }}
        >
          <div className="flex flex-col gap-4">
            <Text variant="medium" color={'foreground'} as="span">
              You are about to inactivate
              <Text variant="medium" color={'foreground'} as="span" isBold>
                {` ${company?.name}. `}
              </Text>
              <Text variant="medium" color={'foreground'} as="span">
                Are you sure about this action?
              </Text>
            </Text>
            <Text color={'foreground'} variant={'medium'}>
              The company will become inactive. The company data will not be
              deleted and is recoverable.
            </Text>
          </div>
        </DeleteModalConfirmation>
      )}
    </main>
  );
}
