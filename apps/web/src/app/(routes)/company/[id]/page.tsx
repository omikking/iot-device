'use client';
import { graphql } from '@/gql';
import { useState } from 'react';
import { Company } from '@/gql/graphql';
import { useMutation, useQuery } from 'urql';
import { GoBack } from '@/components/GoBack';
import { responses } from '@/app/uitexts/responses';
import { CompanyForm } from '@/components/CompanyForm';
import { Text, Headline, showAlertToast } from '@gsp/ui';
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
      sandvikAdminUserId
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
  mutation removeCompany($id: String!) {
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
    : useQuery({
        query: getCompanyQuery,
        variables: { id: params.id },
      });
  const company = companyData?.data?.company as Company;
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [, deleteCompany] = useMutation(deleteCompanyMutation);

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // TODO still not able to delete company, need to fix it in backend
  const handleDelete = async (): Promise<boolean> => {
    setIsDeleting(true);

    return deleteCompany({
      id: company.id,
    })
      .then((result) => {
        if (result.error) {
          showAlertToast({
            title: responses.companyInactivationFailed,
            variant: 'error',
          });
          return false;
        }
        showAlertToast({
          title: responses.companyDeleteSuccess,
          variant: 'info',
        });
        return true;
      })
      .catch(() => {
        showAlertToast({
          title: responses.companyInactivationFailed,
          variant: 'error',
        });
        return false;
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

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

      <DeleteModalConfirmation
        deleteIcon="Company"
        modalTitle="Inactivate company"
        modalDeleteButtonText="Inactivate company"
        modalText="Confirm inactivation"
        isLoading={isDeleting}
        isOpen={isDeleteModalOpen}
        onDelete={handleDelete}
        onClose={closeDeleteModal}
        onOpenChange={closeDeleteModal}
      >
        <div className="flex flex-col text-center gap-4 max-w-[420px]">
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
    </main>
  );
}
