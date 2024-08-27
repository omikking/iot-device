'use client';
import {
  Button,
  Headline,
  Text,
  Anchor,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  Modal,
  ModalTrigger,
} from '@gsp/ui';

import {
  LucideEllipsis,
  LucideEyeOff,
  LucideMoveLeft,
  LucidePlus,
  LucideView,
} from 'lucide-react';

import { AddOrEditTechnicianModal } from '@/components/AddOrEditTechnicianModal';
import Link from 'next/link';

export default function Page(): JSX.Element {
  // Only superadmin should be able to see this page

  const usersMock = [
    {
      id: '1',
      name: 'Elliot Alderson',
      email: 'elliotalderson@sandvik.com',
      company: 'Sandvik',
      isGlobal: true,
      phoneNumber: '+4683729327',
    },
    {
      id: '2',
      name: 'Jimmy Nwadinkpa',
      email: 'jimmy@sandvik.com',
      company: 'Sandvik',
      isGlobal: false,
      phoneNumber: '+4683729327',
    },
    {
      id: '3',
      name: 'Felix Östergren',
      email: 'felix@sandvik.com',
      company: 'Sandvik',
      isGlobal: false,
      phoneNumber: '+4683729327',
    },
    {
      id: '4',
      name: 'Whiterose',
      email: 'whiterose@sandvik.com',
      company: 'Sandvik',
      isGlobal: true,
      phoneNumber: '+4683729327',
    },
    {
      id: '5',
      name: 'Darlene Alderson',
      email: 'darlenealderson@sandvik.com',
      company: 'Sandvik',
      isGlobal: false,
      phoneNumber: '+4683729327',
    },
    {
      id: '6',
      name: 'Tyrell Wellick',
      email: 'tyrellwellick@sandvik.com',
      company: 'Sandvik',
      isGlobal: true,
      phoneNumber: '+4683729327',
    },
  ];

  return (
    <main className="min-h-[calc(100vh-64px)] max-w-[1320px] flex flex-col m-auto items-center py-28 gap-16 bg-neutral-main-white">
      <Text
        variant="medium"
        color="foreground"
        className="absolute top-28 left-10 group"
      >
        <Link href="/" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-[-4px]" />
            Go back
          </Anchor>
        </Link>
      </Text>

      <Headline as="h1" variant="xl" color="foreground">
        Technicians
      </Headline>

      <div className="flex flex-col items-end gap-5">
        <Modal>
          <ModalTrigger asChild>
            <Button variant="primary" size="large">
              <LucidePlus />
              Add technician
            </Button>
          </ModalTrigger>
          <AddOrEditTechnicianModal />
        </Modal>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full name</TableHead>
              <TableHead className="w-[310px]">Email</TableHead>
              <TableHead className="w-[180px]">Company</TableHead>
              <TableHead>Visible globally</TableHead>
              <TableHead>Phone number</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersMock.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell>
                  {user.isGlobal && (
                    <Badge variant="success">
                      <LucideView />
                      Visible
                    </Badge>
                  )}
                  {!user.isGlobal && (
                    <Badge variant="neutral">
                      <LucideEyeOff />
                      Private
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="small">
                    <LucideEllipsis />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Badge variant="neutral" className="self-start">
          {usersMock.length} total
        </Badge>
      </div>
    </main>
  );
}
