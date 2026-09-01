import Link from 'next/link';
import { Headline, SidebarProvider } from '@gsp/ui-core';
import { SandvikLogo } from 'public/SandvikLogo';
import { HydraSidebar } from '@/hydra-component/HydraSidebar';

export default function CompanyLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { companyId: string };
}>) {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center border-b border-neutral-2 px-6">
        <Link
          href={`/${params.companyId}/overview`}
          className="flex items-center justify-start gap-1"
        >
          <SandvikLogo />
          <div className="mx-1 h-6 border-l border-black" />
          <Headline variant="medium" color="foreground" as="h3" isBold>
            HYDRA
          </Headline>
        </Link>
      </header>
      <SidebarProvider className="flex-1 min-h-0">
        <HydraSidebar
          header={
            <Link
              href={`/${params.companyId}/overview`}
              className="flex w-full items-center justify-start gap-1"
            >
              <SandvikLogo />
              <div className="mx-1 h-6 border-l border-black" />
              <Headline variant="medium" color="foreground" as="h3" isBold>
                HYDRA
              </Headline>
            </Link>
          }
        />
        {children}
      </SidebarProvider>
    </div>
  );
}
