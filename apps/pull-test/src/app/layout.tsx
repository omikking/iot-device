import './globals.css';
import '@gsp/ui/styles.css';
import { Toaster } from '@gsp/ui';
import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import { authOptions } from '@/libs/authOptions';
import { getServerSession } from 'next-auth/next';
import UrqlProvider from '@/libs/providers/UrqlProvider';
import NextAuthProvider from '@/libs/providers/NextAuthProvider';
import { SessionErrorHandler } from '@/components/SessionErrorHandler';

export const metadata: Metadata = {
  title: 'Pull Test | Ground Support Platform | Sandvik',
  description: 'For all your ground support needs.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className="min-h-screen">
        <NextAuthProvider session={session}>
          <SessionErrorHandler />
          <Toaster duration={8000} />
          <UrqlProvider>
            <NavBar />
            {children}
          </UrqlProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
