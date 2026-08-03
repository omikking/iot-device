import { EventsPageTable } from '@/components/EventsPageTable';
import { SidebarInset } from '@gsp/ui-core';

export default function Page({ params }: { params: { companyId: string } }) {
  return (
    <SidebarInset>
      <main className="ui-banshee-flex ui-banshee-flex-col ui-banshee-w-full ui-banshee-h-full ui-banshee-p-7 ui-banshee-pr-0">
        <EventsPageTable params={params} />
      </main>
    </SidebarInset>
  );
}
