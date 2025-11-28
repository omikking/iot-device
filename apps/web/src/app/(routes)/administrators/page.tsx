'use client';
import { useState, type JSX } from 'react';
import { LucidePlus } from 'lucide-react';
import { GoBack } from '@/components/GoBack';
import { GetAdminsQuery } from '@/gql/graphql';
import { Button, Headline, Modal, ModalTrigger } from '@gsp/ui';
import { AdministratorsTable } from '@/components/AdministratorsTable';
import { AddAdministratorModal } from '@/components/AddAdministratorModal';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { Role } from '@/gql/graphql';

const getPendingAdminsQuery = graphql(`
  query getPendingGlobalInvitations {
    pendingGlobalInvitations {
      id
      email
      globalRole
      createdAt
      used
      isGlobalVisibility
    }
  }
`);

const getAdminsQuery = graphql(`
  query getAdmins {
    users(roles: "SANDVIK_ADMIN") {
      id
      createdAt
      email
      fullName
      workPlace
      phoneNumber
      globalRole
    }
  }
`);

export default function Page(): JSX.Element {
  const [openAdministratorsModal, setOpenAdministratorsModal] =
    useState<boolean>(false);
  const [selectedAdministrator, setSelectedAdministrator] = useState<
    GetAdminsQuery['users'][0] | undefined
  >(undefined);

  // Admin data queries and refresh logic
  const [administratorsData, refetchAdmins] = useQuery({
    query: getAdminsQuery,
  });
  const [pendingAdminsData, refetchPendingAdmins] = useQuery({
    query: getPendingAdminsQuery,
  });

  const administrators =
    (administratorsData?.data?.users as GetAdminsQuery['users']) || [];

  const adminInvitations = (
    pendingAdminsData?.data?.pendingGlobalInvitations || []
  )
    .filter(
      (pendingAdmin) =>
        pendingAdmin.globalRole === Role.SandvikAdmin && !pendingAdmin.used,
    )
    .map((pendingAdmin) => ({
      id: pendingAdmin.id,
      email: pendingAdmin.email,
      fullName: '',
      workPlace: 'N/A',
      phoneNumber: 'N/A',
      globalRole: pendingAdmin.globalRole,
      createdAt: pendingAdmin.createdAt,
      isInvitation: true,
    }));

  const admins = administrators.map((user) => ({
    ...user,
    isInvitation: false,
    createdAt: user.createdAt,
  }));

  const allAdmins = [...admins, ...adminInvitations].sort((a, b) => {
    const aDate = new Date(a.createdAt);
    const bDate = new Date(b.createdAt);
    return bDate.getTime() - aDate.getTime();
  });

  const refreshAdmins = () => {
    refetchAdmins({ requestPolicy: 'network-only' });
    refetchPendingAdmins({ requestPolicy: 'network-only' });
  };

  const handleToggleModal = (open: boolean) => {
    setOpenAdministratorsModal(open);
    if (!open) {
      setSelectedAdministrator(undefined);
    }
  };

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <GoBack />

      <Headline as="h1" variant="xl" color="foreground">
        Administrators
      </Headline>

      <div className="flex flex-col items-end gap-5 w-full max-w-[1320px]">
        <Modal open={openAdministratorsModal} onOpenChange={handleToggleModal}>
          <ModalTrigger asChild>
            <Button variant="primary" size="large">
              <LucidePlus />
              Add administrator
            </Button>
          </ModalTrigger>
          <AddAdministratorModal
            onOpenChange={handleToggleModal}
            administrator={selectedAdministrator}
            refreshAdmins={refreshAdmins}
          />
        </Modal>

        <AdministratorsTable
          allAdmins={allAdmins}
          refreshAdmins={refreshAdmins}
        />
      </div>
    </main>
  );
}
