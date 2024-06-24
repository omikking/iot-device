import './globals.css';
import '@gsp/ui/styles.css';
import type { Metadata } from 'next';
import Providers from '../components/Providers';
import Header from '../components/Header';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '../libs/apollo-client';

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
        {/* <ApolloProvider client={apolloClient}> */}
        <Providers>
          <Header />
          {children}
        </Providers>
        {/* </ApolloProvider> */}
      </body>
    </html>
  );
}
