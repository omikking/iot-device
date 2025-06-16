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
  Text,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from '@gsp/ui';
import { GetCompanyQuery } from '@/gql/graphql';

interface Props {
  params: {
    id: string;
  };
}

type CompanyType = GetCompanyQuery['company'];
type SiteType = NonNullable<CompanyType['sites']>[number];
type LevelType = NonNullable<SiteType['levels']>[number];
type DriveType = NonNullable<LevelType['drives']>[number];
type LocationType = NonNullable<DriveType['locations']>[number];
export default function Page({ params }: Props): JSX.Element {
  const companyId = params.id;

  const boltResultQuery = gql`
    query GetBoltResult(
      $offset: Int
      $limit: Int
      $siteId: String
      $levelId: String
      $driveId: String
      $locationId: String
      $result: [String!]
      $isHazard: Boolean
      $withImage: Boolean
      $withComment: Boolean
      $startDate: DateTime
      $endDate: DateTime
    ) {
      boltResults(
        offset: $offset
        limit: $limit
        siteId: $siteId
        levelId: $levelId
        driveId: $driveId
        locationId: $locationId
        result: $result
        isHazard: $isHazard
        withImage: $withImage
        withComment: $withComment
        startDate: $startDate
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
          site {
            siteName
          }
          drive {
            driveName
          }
          location {
            locationName
          }
          level {
            levelName
          }
        }
      }
    }
  `;
  const getCompanyQuery = gql`
    query GetCompany($id: String!) {
      company(id: $id) {
        name
        sites {
          id
          name: siteName
          levels {
            id
            name: levelName
            drives {
              id
              name: driveName
              locations {
                id
                name: locationName
              }
            }
          }
        }
      }
    }
  `;

  const [site, setSite] = useState<SiteType | undefined>();
  const [level, setLevel] = useState<LevelType | undefined>();
  const [drive, setDrive] = useState<DriveType | undefined>();
  const [location, setLocation] = useState<LocationType | undefined>();

  const [selectedTab, setSelectedTab] = useState<'table' | 'graphs'>('table');
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

  const result = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { withComment, withImage, reportedHazard, ...rest } = filterState;

    return Object.entries(rest)
      .filter(([, value]) => value === true)
      .map(([key]) => key.toUpperCase());
  }, [filterState]);

  const [{ data: companyByIdResponse }] = useQuery({
    query: getCompanyQuery,
    variables: { id: companyId },
  });
  const [{ data }] = useQuery<{
    boltResults: { totalRecords: number; results: BoltResultSchema[] };
  }>({
    query: boltResultQuery,
    variables: {
      siteId: site?.id,
      levelId: level?.id,
      driveId: drive?.id,
      locationId: location?.id,
      isHazard: filterState.reportedHazard || undefined,
      withImage: filterState.withImage || undefined,
      withComment: filterState.withComment || undefined,
      startDate: dateRange?.from,
      endDate: dateRange?.to,
      result: result.length ? result : undefined,
    },
    pause: !site?.id,
  });

  const [boltResults, setBoltResults] = useState<BoltResultSchema[]>([]);

  useEffect(() => {
    if (data?.boltResults?.results) {
      setBoltResults(data.boltResults.results);
    } else {
      setBoltResults([]);
    }
  }, [data]);

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <GoBack />

      <Badge variant="primary" size="large" className="absolute top-24">
        {companyByIdResponse?.company?.name ?? 'Select company'}
      </Badge>

      <Headline as="h1" variant="xl" color="foreground">
        Bolt results
      </Headline>

      <Tabs
        defaultValue="table"
        onValueChange={(value) => setSelectedTab(value as 'table' | 'graphs')}
        className="w-full max-w-[1600px]"
      >
        <div className="w-full flex flex-row justify-between items-center pb-2 gap-10">
          <TabsList>
            <TabsTrigger value="table">
              <LucideGrid3X3 size={18} className="mr-1.5" />
              Table
            </TabsTrigger>
            <TabsTrigger value="graphs">
              <LucideLineChart size={18} className="mr-1.5" />
              Graphs
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 flex justify-start">
            <Breadcrumb>
              <BreadcrumbList>
                {site && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Text variant="medium" color="foreground">
                        {site.name}
                      </Text>
                    </BreadcrumbItem>
                  </>
                )}
                {level && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Text variant="medium" color="foreground">
                        {level.name}
                      </Text>
                    </BreadcrumbItem>
                  </>
                )}
                {drive && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Text variant="medium" color="foreground">
                        {drive.name}
                      </Text>
                    </BreadcrumbItem>
                  </>
                )}
                {location && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <Text variant="medium" color="foreground">
                        {location.name}
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
                disabled={!boltResults.length}
                variant="primary"
                size="large"
              >
                <LucideFileDown />
                View PDF
              </Button>
            </ModalTrigger>
            {/* TODO: Add modal content */}
          </Modal>
        </div>

        <BoltSelection
          companyByIdResponse={companyByIdResponse}
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
          boltResults={boltResults}
        />

        <TabsContent value="table">
          <BoltResultsTable site={site?.id} boltResults={boltResults} />
        </TabsContent>

        <TabsContent value="graphs">
          <BoltResultsGraphView />
        </TabsContent>
      </Tabs>
    </main>
  );
}
