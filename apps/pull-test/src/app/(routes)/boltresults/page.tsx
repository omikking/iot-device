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
  Text,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
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

  const [filterState, setFilterState] = useState({
    pass: false,
    fail: false,
    abort: false,
    withComment: false,
    withImage: false,
    reportedHazard: false,
  });

  const [boltResults, setBoltResults] = useState<BoltResultSchema[]>([]);

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

      // Filtering
      const matchResult =
        (!filterState.pass && !filterState.fail && !filterState.abort) ||
        (filterState.pass && bolt.result === 'Pass') ||
        (filterState.fail && bolt.result === 'Fail') ||
        (filterState.abort && bolt.result === 'Abort');

      const matchComment =
        (!filterState.withComment || bolt.comment) &&
        (!filterState.withImage || bolt.image) &&
        (!filterState.reportedHazard || bolt.isHazard);

      return (
        matchLocation &&
        matchDrive &&
        matchLevel &&
        matchDateRange &&
        matchResult &&
        matchComment
      );
    });
  };

  const filteredResults = filterBoltResults(level, drive, location, dateRange);

  useEffect(() => {
    // @TODO each time site gets updated, make a request to the BE to fetch and set them as below
    site ? setBoltResults(boltResultsMock) : setBoltResults([]);
  }, [site]);

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <GoBack />

      <Badge variant="primary" size="large" className="absolute top-24">
        {site || 'Select site'}
      </Badge>

      <Headline as="h1" variant="xl" color="foreground">
        Bolt results
      </Headline>

      <Tabs
        defaultValue="table"
        onValueChange={setSelectedTab}
        className="w-full max-w-[1600px]"
      >
        <div className="w-full flex flex-row justify-between items-center pb-2 gap-10">
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
          <div className="flex-1 flex justify-start ">
            <Breadcrumb>
              <BreadcrumbList>
                {site && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Text variant="medium" color="foreground">
                        {site}
                      </Text>
                    </BreadcrumbItem>
                  </>
                )}
                {level && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Text variant="medium" color="foreground">
                        {level}
                      </Text>
                    </BreadcrumbItem>
                  </>
                )}
                {drive && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Text variant="medium" color="foreground">
                        {drive}
                      </Text>
                    </BreadcrumbItem>
                  </>
                )}
                {location && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Text variant="medium" color="foreground">
                        {location}
                      </Text>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Modal>
            <ModalTrigger asChild>
              <Button
                disabled={!filteredResults?.length}
                variant="primary"
                size="large"
              >
                <LucideFileDown />
                View PDF
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
          selectedTab={selectedTab}
          filterState={filterState}
          onSetSite={setSite}
          onSetLevel={setLevel}
          onSetDrive={setDrive}
          onSetLocation={setLocation}
          onSetDateRange={setDateRange}
          onFilterChange={setFilterState}
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
