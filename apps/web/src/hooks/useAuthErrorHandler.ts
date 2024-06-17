import { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

export const useAuthErrorHandler = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signOut({ redirect: false }).then(() => signIn());
    }
  }, [session]);
};
