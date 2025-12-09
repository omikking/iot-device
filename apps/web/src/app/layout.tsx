import './globals.css';
import '@gsp/ui/styles.css';
import '@gsp/ui-banshee/styles.css';
import { Toaster } from '@gsp/ui';
import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import { NavbarBanshee } from '@/components/banshee-components/NavbarBanshee';
import { authOptions } from '@/libs/authOptions';
import { getServerSession } from 'next-auth/next';
import UrqlProvider from '@/libs/providers/UrqlProvider';
import NextAuthProvider from '@/libs/providers/NextAuthProvider';

export const metadata: Metadata = {
  title: 'Portal | Ground Support Platform | Sandvik',
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
          <Toaster duration={8000} />
          <UrqlProvider>
            {/* <NavBar /> */}
            <NavbarBanshee />
            {children}
            {/* <FooterBanshee /> */}
          </UrqlProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
