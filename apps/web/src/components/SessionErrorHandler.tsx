'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

/**
 * Component that monitors session errors and triggers logout
 * when the refresh token fails
 */
export function SessionErrorHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signOut({ redirect: true, callbackUrl: '/api/auth/signin' });
    }
  }, [session?.error]);

  return null;
}
