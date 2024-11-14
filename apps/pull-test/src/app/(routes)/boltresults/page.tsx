'use client';
import { useEffect, useState } from 'react';
import { LucideFileDown, LucideGrid3X3, LucideLineChart } from 'lucide-react';
import { BoltResultSchema, boltResultsMock } from '@/app/mock/mock';
import { BoltResultsTable } from '@/components/BoltResultsTable';
import { BoltSelection } from '@/components/BoltSelection';
import { BoltResultsGraphView } from '@/components/BoltResultsGraphView';
import { GoBack } from '@/components/GoBack';
import {
  Button,
  Headline,
  Badge,
  Modal,
  ModalTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  DateRange,
} from '@gsp/ui';

export default function Page(): JSX.Element {
  const [site, setSite] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<string | undefined>(undefined);
  const [drive, setDrive] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState('table');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const [boltResults, setBoltResults] = useState<
    BoltResultSchema[] | undefined
  >([]);

  const filterBoltResults = (
    level?: string,
    drive?: string,
    location?: string,
    dateRange?: DateRange,
  ): BoltResultSchema[] | undefined => {
    return boltResults?.filter((bolt) => {
      const matchLevel = level ? bolt.level === level : true;
      const matchDrive = drive ? bolt.drive === drive : true;
      const matchLocation = location ? bolt.location === location : true;

      // Date range filtering
      const matchDateRange =
        dateRange?.from && dateRange?.to
          ? bolt.createdDate >= dateRange.from &&
            bolt.createdDate <= dateRange.to
          : true;

      return matchLocation && matchDrive && matchLevel && matchDateRange;
    });
  };

  const filteredResults = filterBoltResults(level, drive, location, dateRange);

  useEffect(() => {
    // @TODO each time site gets updated, make a request to the BE to fetch and set them as below
    site ? setBoltResults(boltResultsMock) : setBoltResults(undefined);
  }, [site]);

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <GoBack />

      <Badge variant="primary" size="large" className="absolute top-24">
        Garpenberg
      </Badge>

      <Headline as="h1" variant="xl" color="foreground">
        Bolt results
      </Headline>

      <Tabs
        defaultValue="table"
        onValueChange={setSelectedTab}
        className="w-full max-w-[1600px]"
      >
        <div className="w-full flex flex-row justify-between items-center pb-2">
          <TabsList>
            <TabsTrigger value="table">
              <LucideGrid3X3 size="18" className="mr-1.5" />
              Table
            </TabsTrigger>
            <TabsTrigger value="graphs">
              <LucideLineChart size="18" className="mr-1.5" />
              Graphs
            </TabsTrigger>
          </TabsList>

          <Modal>
            <ModalTrigger asChild>
              <Button variant="primary" size="large">
                <LucideFileDown />
                Export PDF
              </Button>
            </ModalTrigger>
            {/* @TODO Modal goes here /> */}
          </Modal>
        </div>

        <BoltSelection
          site={site}
          level={level}
          drive={drive}
          location={location}
          dateRange={dateRange}
          onSetSite={setSite}
          onSetLevel={setLevel}
          onSetDrive={setDrive}
          onSetLocation={setLocation}
          onSetDateRange={setDateRange}
          selectedTab={selectedTab}
        />

        <TabsContent value="table">
          <BoltResultsTable site={site} boltResults={filteredResults} />
        </TabsContent>

        <TabsContent value="graphs">
          <BoltResultsGraphView />
        </TabsContent>
      </Tabs>
    </main>
  );
}
