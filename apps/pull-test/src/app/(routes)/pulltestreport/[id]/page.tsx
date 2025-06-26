'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { LucideFileDown } from 'lucide-react';

import { BoltResultSchema } from '@/app/mock/mock';
import { BoltResultsGraphView } from '@/components/BoltResultsGraphView';
import { GoBack } from '@/components/GoBack';
import PdfComponent from '@/components/PullTestReportPDF';
import { pdfComponentMockData } from '@/app/mock/mock';

import { gql, useQuery } from 'urql';
import {
  Headline,
  Badge,
  Modal,
  Tabs,
  TabsContent,
  DateRange,
  Button,
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
  const [site] = useState<SiteType | undefined>();
  const [level] = useState<LevelType | undefined>();
  const [drive] = useState<DriveType | undefined>();
  const [location] = useState<LocationType | undefined>();

  const [dateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const [filterState] = useState({
    pass: false,
    fail: false,
    abort: false,
    withComment: false,
    withImage: false,
    reportedHazard: false,
  });
  type PdfRefType = {
    generatePdf: () => void;
  };

  const pdfRef = useRef<PdfRefType | null>(null);

  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('pdfPayload');
    if (stored) {
      setPdfData(JSON.parse(stored));
    }
  }, []);

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
  const [{ data: boltResultsResponse }] = useQuery<{
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

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <GoBack />

      <Badge variant="primary" size="large" className="absolute top-24">
        {companyByIdResponse?.company?.name ?? 'Select company'}
      </Badge>

      <Headline as="h1" variant="xl" color="foreground">
        Pull Test Report
      </Headline>

      {pdfData && (
        <Button
          onClick={() => pdfRef.current?.generatePdf()}
          variant="outline"
          size="large"
        >
          <LucideFileDown className="mr-2" />
          Export PDF
        </Button>
      )}

      <Tabs defaultValue="graphs" className="w-full max-w-[1600px]">
        <div className="w-full flex flex-row justify-between items-center pb-2 gap-10">
          <Modal>
            <PdfComponent
              disabled={false}
              objList={boltResultsResponse?.boltResults}
              reportDetails={pdfComponentMockData.reportDetails}
              layout={{
                logo: pdfComponentMockData.Layout.logo,
                authorImage: pdfComponentMockData.Layout.authorImage,
                authorSignature: pdfComponentMockData.Layout.authorSignature,
                contactHtml: '<strong>John Doe</strong> - Site Manager',
              }}
              parentUrl={window.parent.location.toString()}
              pdfName={'pull_test_report.pdf'}
              pdfPageTitle={'Bolt Result'}
              currentDate={new Date().toLocaleDateString()}
            />
          </Modal>
        </div>

        <TabsContent value="graphs">
          <BoltResultsGraphView />
        </TabsContent>
      </Tabs>
    </main>
  );
}
