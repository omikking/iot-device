'use client';
import { graphql } from '@/gql';
import { useState } from 'react';
import { Company } from '@/gql/graphql';
import { useMutation, useQuery } from 'urql';
import { useRouter } from 'next/navigation';
import { GoBack } from '@/components/GoBack';
import { responses } from '@/app/uitexts/responses';
import { CompanyForm } from '@/components/CompanyForm';
import { Text, Headline, showAlertToast } from '@gsp/ui';
import { CompanyNavigationCards } from '@/components/CompanyNavigationCards';
import { DeleteModalConfirmation } from '@/components/DeleteModalConfirmation';
import { handleGraphQLErrors } from '@/libs/utils';

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
        phoneNumber
        email
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
  const router = useRouter();
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

  const handleDelete = async (): Promise<boolean> => {
    setIsDeleting(true);

    return (
      deleteCompany({
        id: company.id,
      })
        .then((result) => {
          handleGraphQLErrors(result.error);
          // Success
          if (result.data) {
            setTimeout(() => {
              showAlertToast({
                title: responses.companyDeleteSuccess,
                variant: 'info',
              });
              router.replace('/administration-portal');
            }, 1500);
          }
          return true;
        })
        // Fallback error
        .catch(() => {
          showAlertToast({
            title: responses.companyDeletionFailed,
            description: responses.contactSupportError,
            variant: 'error',
          });
          return false;
        })
        .finally(() => {
          setIsDeleting(false);
        })
    );
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
        modalTitle="Delete company"
        modalDeleteButtonText="Delete company"
        modalText="Confirm deletion"
        isLoading={isDeleting}
        isOpen={isDeleteModalOpen}
        onDelete={handleDelete}
        onClose={closeDeleteModal}
        onOpenChange={closeDeleteModal}
      >
        <div className="flex flex-col text-center gap-4 max-w-[460px]">
          <Text variant="medium" color={'foreground'} as="span">
            You are about to permanently delete
            <Text variant="medium" color={'foreground'} as="span" isBold>
              {` ${company?.name}. `}
            </Text>
            <Text color={'foreground'} variant={'medium'} className="mt-4">
              This will{' '}
              <Text variant="medium" color={'foreground'} as="span" isBold>
                permanently{' '}
              </Text>
              delete the company and all associated data from the system. Are
              you sure you want to proceed?
            </Text>
          </Text>
          <Text color={'foreground'} variant={'medium'}>
            This action is irreversible and all records will be lost.
          </Text>
        </div>
      </DeleteModalConfirmation>
    </main>
  );
}
