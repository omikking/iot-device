'use client';
import { graphql } from '@/gql';
import { Company } from '@/gql/graphql';
import { Text, Headline } from '@gsp/ui';
import { useClient, useQuery } from 'urql';
import { GoBack } from '@/components/GoBack';
import { useCallback, useState } from 'react';
import { CompanyForm } from '@/components/CompanyForm';
import { CompanyNavigationCards } from '@/components/CompanyNavigationCards';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';

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

const deleteCompanyMutation = graphql(`
  mutation deleteComany($id: String!) {
    removeCompany(id: $id) {
      id
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
    : useQuery({ query: getCompanyQuery, variables: { id: params.id } });
  const company = companyData?.data?.company as Company;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const client = useClient();

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = useCallback(async (): Promise<boolean> => {
    setIsDeleting(true);

    try {
      const result = await client
        .mutation(deleteCompanyMutation, {
          id: company.id,
        })
        .toPromise();
      if (result.error) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [company?.id, client]);

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

      {/* TODO Discuss how to deal with  */}
      {company && (
        <DeleteModalConfirmation
          deleteIcon="Company"
          modalTitle="Inactivate company"
          modalText="Confirm inactivation"
          isLoading={isDeleting}
          isOpen={isDeleteModalOpen}
          onDelete={handleDelete}
          onClose={closeDeleteModal}
          onOpenChange={closeDeleteModal}
        >
          <div className="flex flex-col text-center gap-4 max-w-[450px]">
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
