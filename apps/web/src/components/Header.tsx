'use client';
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { render } from 'react-dom';
import { Button } from '@gsp/ui';
// import { gql, useSuspenseQuery } from '@apollo/client';
// import { useQuery } from '@apollo/client';

export const Header = () => {
  // const userQuery = gql`
  //   query {
  //     coffees {
  //       id
  //       name
  //       brand
  //       createdAt
  //       updatedAt
  //       flavors {
  //         id
  //         name
  //       }
  //     }
  //   }
  // `;
  // const { data: dataCoffee, loading } = useQuery(userQuery);

  // console.log('dataCoffee: ', dataCoffee);
  // if (loading) return <p>Loading...</p>;
  const { data: session, status } = useSession();
  return (
    <header className=" mx-10 py-5 flex flex-row justify-center border-b-[1px] border-neutral-6">
      <nav className="container flex flex-row justify-between items-center">
        <ul className="flex text-sm uppercase">
          <li>
            <p>Logo</p>
          </li>
        </ul>
        <div className="flex gap-10">
          {status === 'authenticated' ? (
            <div className="flex items-center gap-4">
              {/* link will lead to your profile */}

              <Button size={'lg'} variant={'secondary'}>
                {session.userData.email}
              </Button>

              <Button variant={'secondary'} onClick={() => signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <Button variant={'secondary'} onClick={() => signIn()}>
              Sign in
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
