import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

export const SignInButton = () => {
  const { data: session } = useSession();
  console.log(session);
  if (session && session.user) {
    return (
      <div>
        <p>Signed in as {session.user.email}</p>
        <Link href="/api/auth/signout">Sign out</Link>
      </div>
    );
  }
  return <Link href="/api/auth/signin">Sign in</Link>;
};

export default SignInButton;
