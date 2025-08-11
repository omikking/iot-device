import './globals.css';
import '@gsp/ui/styles.css';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { NavBar } from '@/components/NavBar';
import { authOptions } from '@/libs/authOptions';
import NextAuthProvider from '@/libs/providers/NextAuthProvider';
import UrqlProvider from '@/libs/providers/UrqlProvider';
import { Toaster } from '@gsp/ui';

export const metadata: Metadata = {
  title: 'Ground Support Platform',
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
        <Toaster duration={8000} />
        <NextAuthProvider session={session}>
          <UrqlProvider>
            <NavBar />
            {children}
          </UrqlProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
