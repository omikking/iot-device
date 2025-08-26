'use client';
import {
  Text,
  Tabs,
  Badge,
  Headline,
  TabsList,
  DateRange,
  Breadcrumb,
  TabsTrigger,
  TabsContent,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  showAlertToast,
} from '@gsp/ui';
import { gql, useQuery } from 'urql';
import { useEffect, useMemo, useState } from 'react';
import { GoBack } from '@/components/GoBack';
import { GetCompanyQuery } from '@/gql/graphql';
import { BoltResult } from '@/gql/graphql';
import { BoltSelection } from '@/components/BoltSelection';
import { BoltResultsTable } from '@/components/BoltResultsTable';
import { BoltResultsGraphView } from '@/components/BoltResultsGraphView';
import { LucideGrid3X3, LucideLineChart } from 'lucide-react';
import { responses } from '@/app/uitexts/responses';
import { PullTestReportPDF } from '@/components/PullTestReportPDF';
import { getEarliestAndLatestDates } from '@/libs/utils';
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

const allBoltResultQuery = gql`
  query GetAllBoltResults(
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
        level {
          levelName
        }
        drive {
          driveName
        }
        location {
          locationName
        }
        positionInRing
        result
        comment
        isHazard
        abortReason
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

export default function Page({ params }: Props): JSX.Element {
  const companyId = params.id;

  const [site, setSite] = useState<SiteType | undefined>();
  const [level, setLevel] = useState<LevelType | undefined>();
  const [drive, setDrive] = useState<DriveType | undefined>();
  const [location, setLocation] = useState<LocationType | undefined>();

  const [selectedTab, setSelectedTab] = useState<'table' | 'graphs'>('table');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const [shouldFetchAllResults, setShouldFetchAllResults] = useState(false);

  const [filterState, setFilterState] = useState({
    pass: false,
    fail: false,
    abort: false,
    withComment: false,
    withImage: false,
    reportedHazard: false,
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 50;

  const result = useMemo(() => {
    const resultFilters = {
      pass: filterState.pass,
      fail: filterState.fail,
      abort: filterState.abort,
    };
    return Object.entries(resultFilters)
      .filter(([, value]) => value === true)
      .map(([key]) => key.toUpperCase());
  }, [filterState]);

  const [{ data: companyData }] = useQuery({
    query: getCompanyQuery,
    variables: { id: companyId },
  });

  // Bolt results for table
  const [{ data: boltResultsResponse, error }] = useQuery<{
    boltResults: { totalRecords: number; results: BoltResult[] };
  }>({
    query: boltResultQuery,
    variables: {
      offset: (currentPage - 1) * pageSize,
      limit: pageSize,
      siteId: site?.id,
      levelId: level?.id,
      driveId: drive?.id,
      locationId: location?.id,
      isHazard: filterState.reportedHazard || undefined,
      withImage: filterState.withImage || undefined,
      withComment: filterState.withComment || undefined,
      startDate: dateRange?.from,
      endDate: dateRange?.to,
      result: result.length > 0 ? result : undefined,
    },
    pause: !site?.id,
  });

  // All bolt results for PDF
  const [{ data: allBoltResultsResponse, fetching: isLoadingAllResults }] =
    useQuery<{
      boltResults: { totalRecords: number; results: BoltResult[] };
    }>({
      query: allBoltResultQuery,
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
        result: result.length > 0 ? result : undefined,
      },
      pause: !shouldFetchAllResults || !site?.id,
    });

  const { testingStartDate, testingEndDate } = getEarliestAndLatestDates(
    allBoltResultsResponse?.boltResults?.results || [],
  );

  const handleFetchAllResults = () => {
    setShouldFetchAllResults(true);
    setTimeout(() => {
      setShouldFetchAllResults(true);
    }, 50);
  };

  useEffect(() => {
    if (!isLoadingAllResults && allBoltResultsResponse) {
      setShouldFetchAllResults(false);
    }
  }, [isLoadingAllResults, allBoltResultsResponse]);

  useEffect(() => {
    if (error) {
      showAlertToast({
        title: responses.boltResultFetchError,
        variant: 'error',
      });
    }
  }, [error]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [site, level, drive, location, filterState, dateRange]);

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <GoBack />

      {companyData?.company?.name && (
        <Badge variant="primary" size="large" className="absolute top-24">
          {companyData?.company?.name}
        </Badge>
      )}

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

          {boltResultsResponse && (
            <>
              <PullTestReportPDF
                disabled={false}
                allBoltResults={allBoltResultsResponse?.boltResults}
                fetchAllResults={handleFetchAllResults}
                reportDetails={{
                  testingStartDate: testingStartDate,
                  testingEndDate: testingEndDate,
                  companyName: companyData?.company?.name || '',
                  mine: site?.name || '',
                }}
                parentUrl={window.parent.location.toString()}
              />
            </>
          )}
        </div>

        <BoltSelection
          companyData={companyData}
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
          boltResults={boltResultsResponse?.boltResults?.results || []}
        />

        <TabsContent value="table">
          <BoltResultsTable
            site={site?.id}
            boltResults={site ? boltResultsResponse?.boltResults?.results : []}
            totalCount={boltResultsResponse?.boltResults?.totalRecords || 0}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </TabsContent>

        <TabsContent value="graphs">
          <BoltResultsGraphView
            site={site?.id}
            boltResults={site ? boltResultsResponse?.boltResults?.results : []}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
