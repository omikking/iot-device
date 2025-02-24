'use client';
import { useState } from 'react';
import { LucidePlus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { GoBack } from '@/components/GoBack';
import { UsersTable } from '@/components/UsersTable';
import { AddOrEditUserModal } from '@/components/AddOrEditUserModal';
import { Button, Headline, Badge, Modal, ModalTrigger } from '@gsp/ui';
import { CompanyNameUrql } from '@/components/urql-selectapplications/SelectApplicationUrql';

type ICompanyUser = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  userPermissions: UserPermission[];
};

type UserPermission = {
  id: string;
  userId: string;
  role:
    | 'COMPANY_USER'
    | 'COMPANY_ADMIN'
    | 'SANDVIK_TECHNICIAN'
    | 'SANDVIK_ADMIN';
  appsAccess: string[];
};

export default function Page(): JSX.Element {
  // @TODO Only superadmin should be able to see this page
  const [openUserModal, setOpenUserModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<ICompanyUser | undefined>(
    undefined,
  );

  const handleModalClose = (open: boolean) => {
    setOpenUserModal(open);
    if (!open) {
      setSelectedUser(undefined);
    }
  };

  const params = useParams();

  const companyId = Array.isArray(params.id) ? params.id[0] : params.id;

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <GoBack />

      {/* TODO Get company name, replace with Shreyas query */}
      <Badge variant="primary" size="large" className="absolute top-24">
        <CompanyNameUrql companyId={companyId} />
      </Badge>

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
          />
        </Modal>
        <UsersTable
          onOpenChange={handleModalClose}
          onSelectUser={setSelectedUser}
        />
      </div>
    </main>
  );
}
