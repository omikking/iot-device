import { SidebarProvider, AppSidebar, Headline } from '@gsp/ui-banshee';
import Link from 'next/link';
import { SandvikLogo } from 'public/SandvikLogo';

export default function RoutesLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { companyId: string };
}>) {
  return (
    <SidebarProvider>
      <AppSidebar
        header={
          <Link
            href={`/${params.companyId}/overview`}
            className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-start ui-banshee-w-full ui-banshee-gap-1"
          >
            <SandvikLogo />
            <div className="ui-banshee-h-6 ui-banshee-border-l ui-banshee-border-black ui-banshee-mx-1" />
            <Headline variant="medium" color="foreground" as="h3" isBold>
              BANSHEE
            </Headline>
          </Link>
        }
      />
      {children}
    </SidebarProvider>
  );
}
