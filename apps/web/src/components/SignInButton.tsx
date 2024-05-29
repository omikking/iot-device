import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import Link from 'next/link';

export const SignInButton = () => {
  const { data: session } = useSession();
  console.log('FROM SIGNIN BUTTON: ', session);
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signIn();
    }
  }, [session]);

  if (session && session.userData) {
    return (
      <div>
        <p>Signed in as {session.userData.email}</p>
        <Link href="/api/auth/signout">Sign out</Link>
      </div>
    );
  }
  return <Link href="/api/auth/signin">Sign in</Link>;
};

export default SignInButton;
