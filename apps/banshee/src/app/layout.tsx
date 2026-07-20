import type { Metadata } from 'next';
import './globals.css';
import '@gsp/ui-banshee/styles.css';
import '@gsp/ui-banshee/styles.css';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/authOptions';
import NextAuthProvider from '@/libs/providers/NextAuthProvider';
import { NavbarBanshee } from '@/components/NavbarBanshee';
import UrqlProvider from '@/libs/providers/UrqlProvider';
import { FooterBanshee } from '@/components/FooterBanshee';
import { Toaster, MobileNavProvider } from '@gsp/ui-banshee';
export const metadata: Metadata = {
  title: 'Banshee | Ground Support Platform | Sandvik',
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
          <UrqlProvider>
            <MobileNavProvider>
              <NavbarBanshee />
              {children}
              <FooterBanshee />
              <Toaster duration={8000} />
            </MobileNavProvider>
          </UrqlProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
