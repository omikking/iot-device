import './globals.css';
import '@gsp/ui/styles.css';
import '@gsp/ui-banshee/styles.css';
import { Toaster } from '@gsp/ui';
import type { Metadata } from 'next';
import { authOptions } from '@/libs/authOptions';
import { getServerSession } from 'next-auth/next';
import UrqlProvider from '@/libs/providers/UrqlProvider';
import NextAuthProvider from '@/libs/providers/NextAuthProvider';
import { NavbarBanshee } from '@/components/banshee-components/NavbarBanshee';

import { SidebarProvider } from '@gsp/ui-banshee';
import { AppSidebar } from '@gsp/ui-banshee';

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
            <NavbarBanshee />
            <SidebarProvider>
              <AppSidebar />
              {children}
            </SidebarProvider>
          </UrqlProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
