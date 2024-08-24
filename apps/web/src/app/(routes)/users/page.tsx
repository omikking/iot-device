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
} from '@gsp/ui';

import {
  LucideEllipsis,
  LucideKey,
  LucideMoveLeft,
  LucidePickaxe,
  LucidePlus,
  LucideUser,
} from 'lucide-react';
import Link from 'next/link';

export default function Page(): JSX.Element {
  // Only superadmin should be able to see this page

  const getRoleBadge = (role: 'User' | 'Technician' | 'Admin') => {
    const badges = {
      User: {
        variant: 'neutral',
        icon: <LucideUser />,
      },
      Technician: {
        variant: 'neutral',
        icon: <LucidePickaxe />,
      },
      Admin: {
        variant: 'primary',
        icon: <LucideKey />,
      },
    };
    return badges[role];
  };

  const usersMock = [
    {
      id: '1',
      name: 'Elliot Alderson',
      email: 'alderson@sandvik.com',
      appAccess: 'Pull-test, Ultrabots, xCyclops',
      role: 'User',
      phoneNumber: '+4683729327',
    },
    {
      id: '2',
      name: 'Jimmy Nwadinkpa',
      email: 'jimmy@sandvik.com',
      appAccess: 'Ultrabots, xCyclops',
      role: 'Technician',
      phoneNumber: '+4683729327',
    },
    {
      id: '3',
      name: 'Felix Östergren',
      email: 'felix@sandvik.com',
      appAccess: 'Pull-test',
      role: 'User',
      phoneNumber: '+4683729327',
    },
    {
      id: '4',
      name: 'Darlene Alderson',
      email: 'darlenealderson@sandvik.com',
      appAccess: 'Pull-test, Ultrabots, xCyclops',
      role: 'Admin',
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
        <Link href="/company" passHref legacyBehavior>
          <Anchor color="foreground">
            <LucideMoveLeft
              size="24"
              className="transition-all ease-in-out opacity-50 group-hover:opacity-100 group-hover:translate-x-[-4px]"
            />
            Go back
          </Anchor>
        </Link>
      </Text>

      <Badge variant="primary" size="large" className="absolute top-24">
        Ecorp AB
      </Badge>

      <Headline as="h1" variant="xl" color="foreground">
        Users
      </Headline>

      <div className="flex flex-col items-end gap-5">
        <Button variant="primary" size="large">
          <LucidePlus />
          Add user
        </Button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[220px]">Full name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>App access</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone number</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersMock.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.appAccess}</TableCell>
                <TableCell>
                  {/* Typing needs to be specified, do later */}
                  <Badge variant={getRoleBadge(user.role).variant}>
                    {getRoleBadge(user.role).icon}
                    {user.role}
                  </Badge>
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
