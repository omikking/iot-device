'use client';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { useState } from 'react';
import { Application, Role, User } from '@/gql/graphql';
import { LucidePlus } from 'lucide-react';
import { GoBack } from '@/components/GoBack';
import { UsersTable } from '@/components/UsersTable';
import { AddOrEditUserModal } from '@/components/AddOrEditUserModal';
import { Button, Headline, Badge, Modal, ModalTrigger } from '@gsp/ui';
import { useSession } from 'next-auth/react';
import { isCompanyAdmin } from '@/libs/utils';

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
      plans {
        id
        applicationName
        planLevel
        expiringDate
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

  const { data: session } = useSession();
  const isUserSandvikAdmin = session?.user?.globalRole === Role.SandvikAdmin;
  const isUserCompanyAdmin = isCompanyAdmin(
    session?.user?.userPermissions,
    companyId,
  );

  const [openUserModal, setOpenUserModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const [{ data: companyData }, executeQuery] = useQuery({
    query: getCompanyUsersQuery,
    variables: { id: companyId },
  });

  const companyPlans = companyData?.company.plans;
  const currentDate = new Date();

  const availableCompanyPlans = (companyPlans ?? [])
    .filter((plan) => {
      if (!plan.planLevel) {
        return false;
      }
      if (plan.expiringDate) {
        const expiryDate = new Date(plan.expiringDate);
        return expiryDate > currentDate;
      }
      return true;
    })
    .map((plan) => plan.applicationName) as Application[];

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
        {(isUserSandvikAdmin || isUserCompanyAdmin) && (
          <Modal open={openUserModal} onOpenChange={handleModalClose}>
            <ModalTrigger asChild>
              <Button variant="primary" size="large">
                <LucidePlus />
                Add user
              </Button>
            </ModalTrigger>
            <AddOrEditUserModal
              user={selectedUser}
              availableCompanyPlans={availableCompanyPlans}
              onOpenChange={handleModalClose}
              onUserAdded={refetchUsers}
            />
          </Modal>
        )}
        <UsersTable
          companyData={companyData}
          availableCompanyPlans={availableCompanyPlans}
          onOpenChange={handleModalClose}
          onSelectUser={setSelectedUser}
        />
      </div>
    </main>
  );
}
