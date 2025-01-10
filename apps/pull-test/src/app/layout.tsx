import './globals.css';
import '@gsp/ui/styles.css';
import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import { NavBar } from '@/components/NavBar';
import { UrqlWrapper } from '@/libs/UrqlClient';

export const metadata: Metadata = {
  title: 'Pull Test Web',
  description: 'The Sandvik GSP Pull Test Module',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <UrqlWrapper>
          <Providers>
            <NavBar />
            {children}
          </Providers>
        </UrqlWrapper>
      </body>
    </html>
  );
}
