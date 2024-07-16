import './globals.css';
import '@gsp/ui/styles.css';
import type { Metadata } from 'next';
import Providers from '../components/Providers';
import Header from '../components/Header';
import { ApolloWrapper } from '../libs/ApolloWrapper';
import { ThemeProvider } from '../components/ThemeProvider';

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApolloWrapper>
            <Providers>
              <Header />
              {children}
            </Providers>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
