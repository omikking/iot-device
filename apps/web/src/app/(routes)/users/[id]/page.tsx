'use client';
import { useState } from 'react';
import { LucidePlus } from 'lucide-react';
import { GoBack } from '@/components/GoBack';
import { UsersTable } from '@/components/UsersTable';
import { AddOrEditUserModal } from '@/components/AddOrEditUserModal';
import { Button, Headline, Badge, Modal, ModalTrigger } from '@gsp/ui';
import { User } from '@/gql/graphql';
import { useQuery } from 'urql';
import { graphql } from '@/gql';

const getCompanyUsersQuery = graphql(`
  query getCompanyUsers($id: String!) {
    company(id: $id) {
      id
      users {
        id
        email
        fullName
        workPlace
        phoneNumber
        globalRole
        userPermissions {
          id
          userId
          companyId
          role
          appsAccess
        }
      }
    }
  }
`);
const getCompanyName = graphql(`
  query getCompanyName($id: String!) {
    company(id: $id) {
      id
      name
    }
  }
`);
export default function Page({
  params,
}: {
  params: { id: string; name?: string };
}): JSX.Element {
  const companyId = params.id;

  const [openUserModal, setOpenUserModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const [{ data: companyData }, executeQuery] = useQuery({
    query: getCompanyUsersQuery,
    variables: { id: companyId || '' },
    pause: !companyId,
  });
  const [{ data }] = useQuery({
    query: getCompanyName,
    variables: { id: companyId },
  });

  const companyName = data?.company?.name;
  const refetchUsers = () => {
    executeQuery({ requestPolicy: 'network-only' });
  };

  const handleModalClose = (open: boolean) => {
    setOpenUserModal(open);
    if (!open) {
      setSelectedUser(undefined);
    }
  };

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <GoBack />
      {companyName && (
        <Badge variant="primary" size="large" className="absolute top-24">
          {companyName}
        </Badge>
      )}
      {params.name && (
        <Badge variant="primary" size="large" className="absolute top-24">
          {params.name}
        </Badge>
      )}

      <Headline as="h1" variant="xl" color="foreground">
        Users
      </Headline>

      <div className="flex flex-col items-end gap-5 w-full max-w-[1320px]">
        <Modal open={openUserModal} onOpenChange={handleModalClose}>
          <ModalTrigger asChild>
            <Button variant="primary" size="large">
              <LucidePlus />
              Add user
            </Button>
          </ModalTrigger>
          <AddOrEditUserModal
            onOpenChange={handleModalClose}
            user={selectedUser}
            onUserAdded={refetchUsers}
          />
        </Modal>
        <UsersTable
          companyData={companyData}
          onOpenChange={handleModalClose}
          onSelectUser={setSelectedUser}
        />
      </div>
    </main>
  );
}
