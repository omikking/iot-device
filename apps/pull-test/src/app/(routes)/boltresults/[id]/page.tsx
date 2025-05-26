'use client';
import { useEffect, useMemo, useState } from 'react';
import { LucideFileDown, LucideGrid3X3, LucideLineChart } from 'lucide-react';
import { BoltResultSchema } from '@/app/mock/mock';
import { BoltResultsTable } from '@/components/BoltResultsTable';
import { BoltSelection } from '@/components/BoltSelection';
import { BoltResultsGraphView } from '@/components/BoltResultsGraphView';
import { GoBack } from '@/components/GoBack';
import { gql, useQuery } from 'urql';
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

interface SiteOption {
  id: string;
  name: string;
}

export default function Page(): JSX.Element {

  const boltResultQuery = gql`
        query GetBoltResult(
          $offset: Int,
          $limit: Int,
          $siteId: String,
          $levelId: String,
          $driveId: String,
          $locationId: String,
          $result: [String!],
          $isHazard: Boolean,
          $withImage: Boolean,
          $withComment: Boolean,
          $startDate: DateTime,
          $endDate: DateTime
        ) {
          boltResults(
            offset: $offset,
            limit: $limit,
            siteId: $siteId,
            levelId: $levelId,
            driveId: $driveId,
            locationId: $locationId,
            result: $result,  
            isHazard: $isHazard,
            withImage: $withImage,
            withComment: $withComment,
            startDate: $startDate,
            endDate: $endDate
          ) {
            totalRecords
            results {
              id
              createdAt
              updatedAt
              boltNumber
              boltType
              peakLoad
              peakDisplacement
              positionInRing
              result
              isHazard
              hazardCompletedDate
              abortReason
              comment
              image
              siteId
              levelId
              driveId
              locationId
              userId
              site { siteName }
              drive { driveName }
              location { locationName }
              level { levelName }
            }
        }
      }
`;


  const [site, setSite] = useState<SiteOption | undefined>(undefined);
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
  const result = useMemo(() => {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      withComment,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      withImage,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      reportedHazard,
      ...rest
    } = filterState

    return Object.entries(rest)
      .filter(([, value]) => value === true)
      .map(([key]) => key.toUpperCase());
  }, [filterState]);


  const [{ data }] = useQuery({
    query: boltResultQuery,
    variables: {
      siteId: site?.id,
      levelId: level,
      driveId: drive,
      locationId: location,
      isHazard: filterState.reportedHazard ? true : undefined,
      withImage: filterState.withImage ? true : undefined,
      withComment: filterState.withComment ? true : undefined,
      startDate: dateRange?.from,
      endDate: dateRange?.to,
      result: result,
    },
  });


  useEffect(() => {
    if (data?.boltResults.results) {
      setBoltResults(data.boltResults.results)
    } else {
      setBoltResults([]);
    }

  }, [data]);

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <GoBack />

      <Badge variant="primary" size="large" className="absolute top-24">
        {site?.name || 'Select site'}
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

          <Modal>
            <ModalTrigger asChild>
              <Button
                disabled={!boltResults?.length}
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
          site={site?.id}
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
          boltResults={boltResults}
        />
        <TabsContent value="table">
          <BoltResultsTable site={site?.id
          } boltResults={boltResults} />
        </TabsContent>
        <TabsContent value="graphs">
          <BoltResultsGraphView />
        </TabsContent>
      </Tabs>
    </main>
  );
}
