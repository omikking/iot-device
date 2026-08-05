import type { Metadata } from 'next';
import './globals.css';
// The design system's prebuilt, `ds-`-prefixed stylesheet. Resolves to
// packages/ui-core/dist/index.css, which is a build artifact — run
// `pnpm --filter @gsp/ui-core build` at least once or this import fails.
import '@gsp/ui-core/styles.css';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/authOptions';
import NextAuthProvider from '@/libs/providers/NextAuthProvider';
import UrqlProvider from '@/libs/providers/UrqlProvider';
import { Toaster } from '@gsp/ui-core';

export const metadata: Metadata = {
  title: 'Hydra | Ground Support Platform | Sandvik',
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
            {children}
            <Toaster duration={8000} />
          </UrqlProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
