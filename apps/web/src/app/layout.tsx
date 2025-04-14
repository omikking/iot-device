import './globals.css';
import '@gsp/ui/styles.css';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NavBar } from '@/components/NavBar';
import NextAuthProvider from '@/libs/NextAuthProvider';
import UrqlProvider from '@/libs/UrqlProvider';

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
  console.log('session server', session);
  return (
    <html lang="en">
      <body className="min-h-screen">
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
