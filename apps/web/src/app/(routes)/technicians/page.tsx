'use client';
import { Button, Headline, Modal, ModalTrigger } from '@gsp/ui';
import { LucidePlus } from 'lucide-react';
import { AddOrEditTechnicianModal } from '@/components/AddOrEditTechnicianModal';
import { TechniciansTable } from '@/components/TechniciansTable';
import { GoBack } from '@/components/GoBack';
import { useState, type JSX } from 'react';
import { User, Role } from '@/gql/graphql';
import { graphql } from '@/gql';
import { useQuery } from 'urql';

export type TechnicianRow = User & {
  isInvitation: boolean;
  expiresAt?: string;
};

const getPendingTechniciansQuery = graphql(`
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

const getTechniciansQuery = graphql(`
  query getTechnicians {
    users(roles: "SANDVIK_TECHNICIAN") {
      id
      fullName
      email
      workPlace
      isGlobalVisibility
      phoneNumber
      globalRole
      createdAt
    }
  }
`);

export default function Page(): JSX.Element {
  const [selectedTechnician, setSelectedTechnician] = useState<
    User | undefined
  >(undefined);
  const [openTechModal, setOpenTechModal] = useState<boolean>(false);

  // Data queries and refresh logic
  const [techniciansData, refetchTechnicians] = useQuery({
    query: getTechniciansQuery,
  });
  const [pendingTechniciansData, refetchPendingTechnicians] = useQuery({
    query: getPendingTechniciansQuery,
  });

  const technicians = (techniciansData.data?.users as User[]) || [];

  const pendingInvitations = (
    pendingTechniciansData.data?.pendingGlobalInvitations || []
  )
    .filter(
      (invitation) =>
        invitation.globalRole === Role.SandvikTechnician && !invitation.used,
    )
    .map((invitation) => ({
      id: invitation.id,
      email: invitation.email,
      fullName: '',
      workPlace: 'N/A',
      phoneNumber: 'N/A',
      globalRole: invitation.globalRole,
      isGlobalVisibility: invitation.isGlobalVisibility,
      createdAt: invitation.createdAt,
      updatedAt: undefined,
      isInvitation: true,
    }));

  const activeTechnicians = technicians.map((user) => ({
    ...user,
    isInvitation: false,
    expiresAt: undefined,
  }));

  const allTechnicians = [...activeTechnicians, ...pendingInvitations].sort(
    (a, b) => {
      const aDate = new Date(a.createdAt as string);
      const bDate = new Date(b.createdAt as string);
      return bDate.getTime() - aDate.getTime();
    },
  );

  const refreshTechnicians = () => {
    refetchTechnicians({ requestPolicy: 'network-only' });
    refetchPendingTechnicians({ requestPolicy: 'network-only' });
  };

  const handleModalClose = (open: boolean) => {
    setOpenTechModal(open);
    if (!open) {
      setSelectedTechnician(undefined);
    }
  };

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <GoBack />

      <Headline as="h1" variant="xl" color="foreground">
        Technicians
      </Headline>

      <div className="flex flex-col items-end gap-5 w-full max-w-[1320px]">
        <Modal open={openTechModal} onOpenChange={handleModalClose}>
          <ModalTrigger asChild>
            <Button variant="primary" size="large">
              <LucidePlus />
              Add technician
            </Button>
          </ModalTrigger>
          <AddOrEditTechnicianModal
            onOpenChange={handleModalClose}
            technician={selectedTechnician}
            refreshTechnicians={refreshTechnicians}
          />
        </Modal>

        <TechniciansTable
          allTechnicians={allTechnicians}
          refreshTechnicians={refreshTechnicians}
          onOpenChange={handleModalClose}
          onSelectTechnician={setSelectedTechnician}
        />
      </div>
    </main>
  );
}
