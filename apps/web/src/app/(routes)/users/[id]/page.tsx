'use client';
import type { User, Application, Invitation } from '@/gql/graphql';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { useState } from 'react';
import { Role } from '@/gql/graphql';
import { LucidePlus } from 'lucide-react';
import { GoBack } from '@/components/GoBack';
import { UsersTable } from '@/components/UsersTable';
import { AddOrEditUserModal } from '@/components/AddOrEditUserModal';
import { Button, Headline, Badge, Modal, ModalTrigger } from '@gsp/ui';
import { useSession } from 'next-auth/react';
import { isCompanyAdmin } from '@/libs/utils';

const getPendingInvitationsQuery = graphql(`
  query getPendingInvitations($companyId: String!) {
    pendingInvitations(companyId: $companyId) {
      id
      email
      role
      expiresAt
      createdAt
      used
    }
  }
`);

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
          createdAt
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

  const [{ data: pendingUsersData }, refetchPendingUsers] = useQuery<
    { pendingInvitations: Invitation[] },
    { companyId: string }
  >({
    query: getPendingInvitationsQuery,
    variables: { companyId },
  });

  const companyPlans = companyData?.company?.plans;
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
    .map((plan) => plan.applicationName as Application);

  const [{ data }] = useQuery({
    query: getCompanyName,
    variables: { id: companyId },
  });
  const companyName = data?.company?.name;

  const refetchUsers = () => {
    executeQuery({ requestPolicy: 'network-only' });
    refetchPendingUsers({ requestPolicy: 'network-only' });
  };

  const handleModalClose = (open: boolean) => {
    setOpenUserModal(open);
    if (!open) {
      setSelectedUser(undefined);
    }
  };

  const users = (companyData?.company?.users || []) as User[];

  // Filter out users who are Sandvik Admins
  const filteredUsers = users.filter(
    (user) => user.globalRole !== Role.SandvikAdmin,
  );

  const pendingInvitations = (pendingUsersData?.pendingInvitations || []).map(
    (invitation: Invitation) => ({
      id: invitation.id,
      email: invitation.email ?? '',
      fullName: '',
      workPlace: 'N/A',
      phoneNumber: 'N/A',
      globalRole: '',
      role: invitation.role || 'N/A',
      userPermissions: [],
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
      updatedAt: '',
      isInvitation: true,
    }),
  );

  const activeUsers = filteredUsers.map((user) => ({
    ...user,
    isInvitation: false,
    expiresAt: undefined,
  }));

  // Sort all users by date
  const allUsers = [...activeUsers, ...pendingInvitations].sort((a, b) => {
    const getDate = (user: typeof a): Date => {
      if (user.userPermissions && user.userPermissions.length > 0) {
        const perm = user.userPermissions.find(
          (perm) => perm.companyId === companyId,
        );
        if (perm && perm.createdAt) {
          return new Date(perm.createdAt);
        }
      }
      if (user.createdAt) {
        return new Date(user.createdAt as string);
      }
      return new Date(0);
    };
    const aDate = getDate(a);
    const bDate = getDate(b);
    return bDate.getTime() - aDate.getTime();
  });

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
          allUsers={allUsers}
          availableCompanyPlans={availableCompanyPlans}
          onOpenChange={handleModalClose}
          onSelectUser={setSelectedUser}
          refetchUsers={refetchUsers}
        />
      </div>
    </main>
  );
}
