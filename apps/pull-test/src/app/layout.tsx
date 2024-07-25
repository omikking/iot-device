import './globals.css';
import '@gsp/ui/styles.css';
import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import Header from '@/components/Header';

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
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
