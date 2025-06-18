'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: Props) => {
  return <SessionProvider session={null}>{children}</SessionProvider>;
};

export default Providers;
