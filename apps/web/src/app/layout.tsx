import './globals.css';
import '@gsp/ui/styles.css';
import type { Metadata } from 'next';
import Providers from '../components/Providers';

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
      <body>
        <header className="bg-gray-50 py-10 flex flex-row justify-center">
          <nav className="container flex flex-row justify-between items-center">
            <ul className="flex text-sm uppercase">
              <li>
                <p>Cool Logo: Sandvik</p>
              </li>
            </ul>
            <h1 className="text-md">🚀</h1>
          </nav>
        </header>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
