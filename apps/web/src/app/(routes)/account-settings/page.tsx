'use client';
import React from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { User } from '@/gql/graphql';
import { Headline } from '@gsp/ui';
import AccountSettingsForm from '@/components/AccountSettingsForm';
import { useSession } from 'next-auth/react';

const getUserQuery = graphql(`
  query getUser($id: String!) {
    user(id: $id) {
      id
      email
      fullName
      workPlace
      phoneNumber
    }
  }
`);

export default function Page(): JSX.Element {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [{ data: getUser }] = useQuery({
    query: getUserQuery,
    variables: { id: userId ?? '' },
  });
  const user = getUser?.user as User;
  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white max-w-[1400px]">
      <Headline as="h1" variant="xl" color="foreground">
        Account settings
      </Headline>
      {user && <AccountSettingsForm user={user} />}
    </main>
  );
}
