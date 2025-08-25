'use client';

import { useEffect, useState } from 'react';
import { BoltResultResponse } from '@/gql/graphql';
import { BoltResultsGraphView } from '@/components/BoltResultsGraphView';
import { GoBack } from '@/components/GoBack';
import { PullTestReportPDF } from '@/components/PullTestReportPDF';

import { gql, useQuery } from 'urql';
import { Headline, Badge } from '@gsp/ui';
import { SandvikLogo } from 'public/SandvikLogo';

interface Props {
  params: {
    id: string;
  };
}

type pdfDataType = {
  objList?: BoltResultResponse;
  reportDetails: {
    startDate: string;
    companyName: string;
    mine: string;
    contractor: string;
    commodity: string;
    contactPerson: { name: string; designation: string }[];
    author: string;
    designation: string;
    email: string;
    contactNumber: string;
  };
  layout: {
    contactHtml: string;
    // logo: {
    //   src: string;
    // };
  };
  parentUrl?: string;
  currentDate?: string;
  disabled?: boolean;
};

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

  // const [site] = useState<SiteType | undefined>();
  // const [level] = useState<LevelType | undefined>();
  // const [drive] = useState<DriveType | undefined>();
  // const [location] = useState<LocationType | undefined>();

  // const [dateRange] = useState<DateRange | undefined>({
  //   from: undefined,
  //   to: undefined,
  // });

  // const [filterState] = useState({
  //   pass: false,
  //   fail: false,
  //   abort: false,
  //   withComment: false,
  //   withImage: false,
  //   reportedHazard: false,
  // });

  const [pdfData, setPdfData] = useState<pdfDataType>();

  console.log('Company Name:', pdfData?.reportDetails);

  // DELETE THIS ROUTE

  // TODO fix later
  useEffect(() => {
    const stored = sessionStorage.getItem('pullTestReportPDF');
    if (stored) {
      setPdfData(JSON.parse(stored));
    }
  }, []);

  // const result = useMemo(() => {
  //   const { ...rest } = filterState;

  //   return Object.entries(rest)
  //     .filter(([, value]) => value === true)
  //     .map(([key]) => key.toUpperCase());
  // }, [filterState]);

  const [{ data: companyByIdResponse }] = useQuery({
    query: getCompanyQuery,
    variables: { id: companyId },
  });

  // const [{ data: boltResultsResponse }] = useQuery<{
  //   boltResults: { totalRecords: number; results: BoltResult[] };
  // }>({
  //   query: boltResultQuery,
  //   variables: {
  //     siteId: site?.id,
  //     levelId: level?.id,
  //     driveId: drive?.id,
  //     locationId: location?.id,
  //     isHazard: filterState.reportedHazard || undefined,
  //     withImage: filterState.withImage || undefined,
  //     withComment: filterState.withComment || undefined,
  //     startDate: dateRange?.from,
  //     endDate: dateRange?.to,
  //     result: result.length ? result : undefined,
  //   },
  //   pause: !site?.id,
  // });

  console.log('PDF DATA:', pdfData);

  return (
    <main className="w-full flex flex-col m-auto items-center py-28 px-10 gap-16 bg-main-white">
      <GoBack />

      <Badge variant="primary" size="large" className="absolute top-24">
        {companyByIdResponse?.company?.name ?? 'Select company'}
      </Badge>

      <Headline as="h1" variant="xl" color="foreground">
        Pull Test Report
      </Headline>

      <div className="w-full max-w-[1400px] flex flex-col items-end gap-6">
        {pdfData && (
          <PullTestReportPDF
            disabled={false}
            objList={pdfData.objList}
            // reportDetails={pdfComponentMockData.reportDetails}
            reportDetails={pdfData.reportDetails}
            layout={{
              contactHtml: '<strong>John Doe</strong> - Site Manager',
            }}
            parentUrl={window.parent.location.toString()}
            currentDate={new Date().toLocaleDateString()}
          />
        )}

        <div className="w-full pt-8 bg-neutral-1 border-2 rounded-lg border-neutral-3 shadow-[0_-4px_8px_-1px_rgba(0,0,0,0.1),0_8px_15px_-3px_rgba(0,0,0,0.2)]">
          <div className="flex gap-4 px-12 pt-5 items-center">
            <SandvikLogo height="35" width="35" />
            <Headline as="h2" variant="large" color="foreground" isBold>
              Ground Support Platform
            </Headline>
          </div>
          <Headline
            as="h2"
            variant="xl"
            color="foreground"
            className="px-12 pt-16"
            isBold
          >
            PULL TEST REPORT
          </Headline>
          <BoltResultsGraphView />
        </div>
      </div>
    </main>
  );
}
