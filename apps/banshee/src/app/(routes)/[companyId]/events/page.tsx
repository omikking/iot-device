import { EventsPageTable } from '@/components/EventsPageTable';

export default function Page({ params }: { params: { companyId: string } }) {
  return (
    <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-w-full ui-banshee-h-full">
      <EventsPageTable params={params} />
    </div>
  );
}