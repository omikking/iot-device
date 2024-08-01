import './globals.css';
import '@gsp/ui/styles.css';
import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import { NavBar } from '@/components/NavBar';
import { ApolloWrapper } from '@/libs/ApolloWrapper';

export const metadata: Metadata = {
  title: 'Ground Support Platform',
  description: 'For all your ground support needs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ApolloWrapper>
          <Providers>
            <NavBar />
            {children}
          </Providers>
        </ApolloWrapper>
      </body>
    </html>
  );
}
