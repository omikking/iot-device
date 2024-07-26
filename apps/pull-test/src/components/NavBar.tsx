'use client';
import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@gsp/ui';
import { User } from 'lucide-react';
import Sandviklogo from 'public/sandviklogo.svg';

export const NavBar = () => {
  const { data: session, status } = useSession();

  return (
    <header className=" mx-10 py-5 flex flex-row justify-between border-b-[1px] border-neutral-6">
      <nav className="w-full flex flex-row justify-between items-center">
        <ul className="flex text-sm uppercase">
          <li>
            <Sandviklogo className="" />
          </li>
        </ul>
        <div className="flex gap-10 ">
          {status === 'authenticated' ? (
            <div className="flex items-center gap-4">
              {/* link will lead to your profile */}

              <Button size={'large'} variant={'secondary'}>
                <User className="mr-2 h-4 w-4" />
                {session.userData.email}
              </Button>

              <Button
                variant={'secondary'}
                size={'large'}
                onClick={() => signOut()}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Button
              variant={'secondary'}
              size={'large'}
              onClick={() => signIn()}
            >
              Sign in
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
