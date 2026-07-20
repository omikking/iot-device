'use client';

import { SidebarInset } from '@gsp/ui-banshee';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@gsp/ui-banshee';
import { BansheePageFilters } from '@/components/BansheePageFilters';
import { BansheePageDonuts } from '@/components/BansheePageDonuts';
import { BansheeListView } from '@/components/BansheeListView';
import { BansheeStatusPlot } from '@/components/BansheeStatusPlot';
import type { BansheeStatusPlotHandle } from '@/components/BansheeStatusPlot';
import { BansheeExportMenu } from '@/components/BansheeExportMenu';
import { graphql } from '@/gql';
import { useQuery } from 'urql';
import { buildBansheeCsvFile } from '@/libs/utils';
import { useSharePlotList } from '@/libs/hooks/useSharePlotList';
import BansheeDataPlot from '@/components/BansheeDataPlot';
import type { BansheeDataPlotHandle } from '@/components/BansheeDataPlot';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ShareForm } from '@/components/ShareForm';
import type { BansheeRequestsListQuery } from '@/gql/graphql';
import { handleGraphQLErrors } from '@/libs/utils';

//TODO : need to change it measured true
const bansheeRequestsListQuery = graphql(`
  query bansheeRequestsList(
    $companyId: String
    $locationId: String
    $startDate: DateTime
    $endDate: DateTime
  ) {
    bansheeRequests(
      limit: 100
      companyId: $companyId
      locationId: $locationId
      startDate: $startDate
      endDate: $endDate
    ) {
      results {
        id
        name
        serialNumber
        site {
          siteName
        }
        drive {
          driveName
        }
        level {
          levelName
        }
        location {
          locationName
        }
        comment
        proceqData {
          status
          createdTimestamp
          updatedTimestamp
          readings {
            elongation
            status
          }
        }
        eventLogs {
          createdAt
          eventType
          previousStatus
          newStatus
        }
      }
    }
  }
`);

const bansheeStatusDistributionQuery = graphql(`
  query bansheePageStatusDistribution(
    $companyId: String
    $startDate: DateTime
    $endDate: DateTime
  ) {
    bansheeStatusDistribution(
      companyId: $companyId
      startDate: $startDate
      endDate: $endDate
    ) {
      total
      statusCounts {
        status
        count
      }
      byLocation {
        locationId
        locationName
        siteName
        levelName
        driveName
        total
        statusCounts {
          status
          count
        }
      }
    }
  }
`);
type ShareFormValues = {
  email: string;
};
type BansheeRequestResult =
  BansheeRequestsListQuery['bansheeRequests']['results'][number];

export default function Page({ params }: { params: { companyId: string } }) {
  const companyId = params.companyId;

  const statusPlotRef = useRef<BansheeStatusPlotHandle>(null);
  const dataPlotRef = useRef<BansheeDataPlotHandle>(null);

  const [timeframe, setTimeframe] = useState('ALL');
  const [activeLocationDonut, setActiveLocationDonut] = useState('total');
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  const handleDateChange = useCallback(
    (startDate?: string, endDate?: string) => {
      setDateRange({ startDate, endDate });
    },
    [],
  );

  const [{ data: distData, error: distError }] = useQuery({
    query: bansheeStatusDistributionQuery,
    variables: {
      companyId,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
  });

  useEffect(() => {
    handleGraphQLErrors(distError);
  }, [distError]);

  const [{ data, fetching, error: bansheeListError }] = useQuery({
    query: bansheeRequestsListQuery,
    variables: {
      companyId,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      locationId:
        activeLocationDonut !== 'total' ? activeLocationDonut : undefined,
    },
  });

  useEffect(() => {
    handleGraphQLErrors(bansheeListError);
  }, [bansheeListError]);

  const bansheeRequests = data?.bansheeRequests?.results || [];
  const distributionData = distData?.bansheeStatusDistribution ?? null;
  const form = useForm<ShareFormValues>();
  const sharePlotList = useSharePlotList(companyId);

  const exportToCsv = (
    data: BansheeRequestResult[],
    filename = 'banshee_data.csv',
  ) => {
    if (!data.length) return;

    const csvFile = buildBansheeCsvFile(data, filename);
    const link = document.createElement('a');
    const url = URL.createObjectURL(csvFile);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Shares the plot list (CSV + PNG of the given plot) via email-as-PDF.
  const sharePlot = (email: string, pngFile: File | undefined) =>
    sharePlotList({
      email,
      rows: bansheeRequests,
      pngFile,
      onSuccess: () => form.reset({ email: '' }),
    });

  return (
    <SidebarInset>
      <main className="ui-banshee-min-h-[calc(100vh-80px)] ui-banshee-p-7 !ui-banshee-pr-0 ui-banshee-bg-main-white ui-banshee-w-full">
        <BansheePageFilters
          active={timeframe}
          setActive={setTimeframe}
          onDateChange={handleDateChange}
        />

        <BansheePageDonuts
          activeDonut={activeLocationDonut}
          setActiveDonut={setActiveLocationDonut}
          distributionData={distributionData ?? null}
        />

        <div className="ui-banshee-mt-8 ">
          <Tabs defaultValue="statusPlot" className="ui-banshee-w-full">
            <TabsList className="ui-banshee-justify-start ui-banshee-border-none ui-banshee-p-0 ui-banshee-h-auto">
              <TabsTrigger
                value="statusPlot"
                className="data-[state=active]:ui-banshee-bg-neutral-1  ui-banshee-px-12 ui-banshee-py-3 data-[state=active]:ui-banshee-text-black"
              >
                Status Plot
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="data-[state=active]:ui-banshee-bg-neutral-1  ui-banshee-px-12 ui-banshee-py-3 data-[state=active]:ui-banshee-text-black"
              >
                List
              </TabsTrigger>
              <TabsTrigger
                value="dataPlot"
                className="data-[state=active]:ui-banshee-bg-neutral-1  ui-banshee-px-12 ui-banshee-py-3 data-[state=active]:ui-banshee-text-black"
              >
                Data Plot
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="statusPlot"
              className="!ui-banshee-mt-0 ui-banshee-px-2"
            >
              <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-bg-neutral-1 ">
                <div className="ui-banshee-flex ui-banshee-p-6 ui-banshee-justify-between ui-banshee-items-center">
                  <p className="ui-banshee-text-sm ui-banshee-text-neutral-500 ui-banshee-mx-auto">
                    Click and drag in the plot area to zoom in. Hold CTRL and
                    drag to pan
                  </p>
                  <div className="ui-banshee-flex ui-banshee-gap-2">
                    <button
                      className="ui-banshee-px-4 ui-banshee-py-1 ui-banshee-text-sm ui-banshee-bg-white ui-banshee-border ui-banshee-border-neutral-300 ui-banshee-rounded"
                      onClick={() => statusPlotRef.current?.resetZoom()}
                    >
                      Reset zoom
                    </button>
                    <BansheeExportMenu
                      onDownloadCsv={() => exportToCsv(bansheeRequests)}
                      onDownloadPng={() => statusPlotRef.current?.downloadPng()}
                    />
                  </div>
                </div>

                <BansheeStatusPlot
                  ref={statusPlotRef}
                  bansheeRequests={bansheeRequests}
                  fetching={fetching}
                />
              </div>
              <ShareForm
                form={form}
                onShare={async (email) =>
                  sharePlot(
                    email,
                    await statusPlotRef.current?.getPngFile(
                      'banshee_status_plot.png',
                    ),
                  )
                }
              />
            </TabsContent>

            <TabsContent
              value="list"
              className="!ui-banshee-mt-0  ui-banshee-px-2"
            >
              <BansheeListView entries={bansheeRequests} loading={fetching} />
            </TabsContent>

            <TabsContent
              value="dataPlot"
              className="!ui-banshee-mt-0 ui-banshee-px-2"
            >
              <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-bg-neutral-1 ">
                <div className="ui-banshee-flex ui-banshee-p-6 ui-banshee-border-b ui-banshee-justify-between ui-banshee-items-center ui-banshee-mb-8">
                  <p className="ui-banshee-text-sm ui-banshee-text-neutral-500 ui-banshee-mx-auto">
                    Click and drag in the plot area to zoom in. Hold CTRL and
                    drag to pan
                  </p>
                  <div className="ui-banshee-flex ui-banshee-gap-2">
                    <button
                      className="ui-banshee-px-4 ui-banshee-py-1 ui-banshee-text-sm ui-banshee-bg-white ui-banshee-border ui-banshee-border-neutral-300 ui-banshee-rounded"
                      onClick={() => dataPlotRef.current?.resetZoom()}
                    >
                      Reset zoom
                    </button>
                    <BansheeExportMenu
                      onDownloadCsv={() => exportToCsv(bansheeRequests)}
                      onDownloadPng={() => dataPlotRef.current?.downloadPng()}
                    />
                  </div>
                </div>
                <BansheeDataPlot
                  ref={dataPlotRef}
                  bansheeRequests={bansheeRequests}
                  fetching={fetching}
                />
              </div>
              <ShareForm
                form={form}
                onShare={async (email) =>
                  sharePlot(
                    email,
                    await dataPlotRef.current?.getPngFile(
                      'banshee_data_plot.png',
                    ),
                  )
                }
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SidebarInset>
  );
}
