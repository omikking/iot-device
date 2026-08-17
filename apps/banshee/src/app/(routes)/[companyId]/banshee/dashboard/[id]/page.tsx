'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import {
  handleGraphQLErrors,
  formatDateTime,
  downloadBansheeCsv,
  formatBoltType,
} from '@/libs/utils';
import {
  formatElongation,
  getLatestMeasurement,
  sortProceqDataAscending,
} from '@/libs/latest-measurement';
import { useSharePlotList } from '@/libs/hooks/useSharePlotList';
import {
  SidebarInset,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Text,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
  Table,
  LoadingSpinner,
} from '@gsp/ui-banshee';
import { useParams } from 'next/navigation';
import { getStatusColorHex, getStatusLabel } from '@/libs/status-color-utils';
import { BansheeStatusPlot } from '@/components/BansheeStatusPlot';
import type { BansheeStatusPlotHandle } from '@/components/BansheeStatusPlot';
import BansheeDataPlot from '@/components/BansheeDataPlot';
import type { BansheeDataPlotHandle } from '@/components/BansheeDataPlot';
import { BansheeExportMenu } from '@/components/BansheeExportMenu';
import { DetailRow } from '@/components/DetailRow';
import { useForm } from 'react-hook-form';
import { ShareForm } from '@/components/ShareForm';
import { ImageIcon } from 'lucide-react';

const bansheeDetailQuery = graphql(`
  query bansheeDetailQuery($id: String!) {
    bansheeRequest(id: $id) {
      id
      serialNumber
      name
      boltInstallationDateTime
      period
      coordinates
      boltType
      locationDetails
      comment
      activateNotifications
      ringPosition
      companyId
      proceqData {
        status
        createdTimestamp
        updatedTimestamp
        dueDate
        comments
        readings {
          readingIndex
          elongation
          status
        }
      }
      boltTypeConstant {
        lowPlasticLimit
        elasticLimit
      }
      site {
        id
        siteName
      }
      level {
        id
        levelName
      }
      drive {
        id
        driveName
      }
      location {
        id
        locationName
      }
    }
  }
`);

function parseCoordinatesDisplay(raw: unknown): string {
  if (!raw) return '0.00 0.00 0.00';
  try {
    const coords = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const { x, y, z } = coords ?? {};
    if (x != null && y != null && z != null) return `${x} ${y} ${z}`;
  } catch (e) {
    console.error('Error parsing coordinates:', e);
  }
  return '0.00 0.00 0.00';
}

function formatPeriod(period: number | null | undefined): string {
  if (period == null) return 'N/A';
  if (period === 1) return '1 month';
  if (period > 1) return `${period} months`;
  return 'N/A';
}

type ShareFormValues = {
  email: string;
};

export default function BansheeDashboardPage() {
  const { id, companyId } = useParams();
  const bansheeId = id as string;

  const statusPlotRef = useRef<BansheeStatusPlotHandle>(null);
  const dataPlotRef = useRef<BansheeDataPlotHandle>(null);

  const [{ data, fetching, error }] = useQuery({
    query: bansheeDetailQuery,
    variables: { id: bansheeId ?? '' },
    pause: !bansheeId,
  });

  useEffect(() => {
    handleGraphQLErrors(error);
  }, [error]);

  const shareForm = useForm<ShareFormValues>();
  const sharePlotList = useSharePlotList(companyId as string);

  const details = useMemo(() => {
    const request = data?.bansheeRequest;
    if (!request) return null;

    const { measurement: latestMeasurement, reading: lastReading } =
      getLatestMeasurement(request.proceqData);

    return {
      bansheeName: request?.name,
      serialNumber: request.serialNumber,
      status: latestMeasurement?.status,
      lastReading: latestMeasurement?.createdTimestamp
        ? formatDateTime(latestMeasurement?.createdTimestamp)
        : 'N/A',
      siteName: request.site?.siteName ?? 'N/A',
      levelName: request.level?.levelName ?? 'N/A',
      driveName: request.drive?.driveName ?? 'N/A',
      locationName: request.location?.locationName ?? 'N/A',
      coordsDisplay: parseCoordinatesDisplay(request.coordinates),
      installationDate: formatDateTime(request.boltInstallationDateTime),
      comment: request?.comment || 'No comment available.',
      elongation: formatElongation(lastReading) ?? '-',
      boltType: formatBoltType(request?.boltType) ?? 'N/A',
      period: formatPeriod(request.period),
      lowPlasticLimit: request.boltTypeConstant?.lowPlasticLimit,
      elasticLimit: request.boltTypeConstant?.elasticLimit,
      dueDate: latestMeasurement?.dueDate
        ? new Date(latestMeasurement.dueDate).toLocaleDateString('en-GB')
        : '-',
    };
  }, [data]);

  const bansheeRequestsArray = useMemo(() => {
    const request = data?.bansheeRequest;
    if (!request) return [];
    return [request];
  }, [data]);
  const commentRows = useMemo(() => {
    const request = data?.bansheeRequest;
    if (!request) return [];

    // Newest comment first, ranked the same way as the latest measurement.
    return sortProceqDataAscending(request.proceqData)
      .reverse()
      .filter((pd) => pd.comments?.trim())
      .map((pd, idx) => ({
        key: `${pd.createdTimestamp}-${idx}`,
        date: pd.createdTimestamp
          ? new Date(pd.createdTimestamp)
              .toISOString()
              .replace(/[-T:]/g, '-')
              .slice(0, 10)
          : 'N/A',
        comment: pd.comments!,
      }));
  }, [data]);
  if (fetching) {
    return (
      <SidebarInset>
        <main className="ui-banshee-min-h-[calc(100vh-80px)] ui-banshee-p-6 ui-banshee-bg-main-white ui-banshee-w-full">
          <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-3 ui-banshee-h-64 ui-banshee-text-neutral-500">
            <LoadingSpinner />
            <Text variant="medium" color="muted">
              Loading dashboard...
            </Text>
          </div>
        </main>
      </SidebarInset>
    );
  }

  if (!details) {
    return (
      <SidebarInset>
        <main className="ui-banshee-min-h-[calc(100vh-80px)] ui-banshee-p-6 ui-banshee-bg-main-white ui-banshee-w-full">
          <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-h-64 ui-banshee-text-neutral-500">
            Banshee unit not found.
          </div>
        </main>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <main className="ui-banshee-p-7 ui-banshee-pr-0 ui-banshee-mb-16 ui-banshee-bg-main-white ui-banshee-w-full">
        <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-3 ui-banshee-mb-8">
          <div
            className="ui-banshee-w-9 ui-banshee-h-9 ui-banshee-rounded-full ui-banshee-bg-neutral-300"
            style={{
              backgroundColor: getStatusColorHex(details?.status),
            }}
          />
          <h1 className="ui-banshee-text-2xl ui-banshee-font-semibold ui-banshee-text-neutral-900">
            {details.bansheeName ?? 'Banshee Name'}
          </h1>
        </div>

        <div className="ui-banshee-grid ui-banshee-grid-cols-1 lg:ui-banshee-grid-cols-12 ui-banshee-gap-8">
          <div className="lg:ui-banshee-col-span-5 ui-banshee-bg-neutral-100 ui-banshee-border ui-banshee-border-gray-100 ui-banshee-p-6">
            <div className="ui-banshee-flex ui-banshee-flex-col">
              <DetailRow label="Serial Number" value={details?.serialNumber} />
              <DetailRow
                label="Status"
                value={getStatusLabel(details?.status)}
              />
              <DetailRow label="Last Reading" value={details.lastReading} />
              <DetailRow
                label="Site"
                value={
                  <span className="ui-banshee-whitespace-pre-line">
                    {details.siteName}
                  </span>
                }
              />
              <DetailRow
                label="Level"
                value={
                  <span className="ui-banshee-whitespace-pre-line">
                    {details.levelName}
                  </span>
                }
              />
              <DetailRow
                label="Drive"
                value={
                  <span className="ui-banshee-whitespace-pre-line">
                    {details.driveName}
                  </span>
                }
              />
              <DetailRow
                label="Location"
                value={
                  <span className="ui-banshee-whitespace-pre-line">
                    {details.locationName}
                  </span>
                }
              />
              <DetailRow
                label="Location Coordinates xyz"
                value={details.coordsDisplay}
              />
              <DetailRow
                label="Installation Date"
                value={details.installationDate}
              />
              <DetailRow
                label="Total Elongation (mm)"
                value={details.elongation}
              />
              <DetailRow label="Bolt Type" value={details.boltType} />
              <DetailRow
                label="Period for automatic service reminder"
                value={details.period}
              />
              <DetailRow label="Due Date" value={details.dueDate} />
              <DetailRow
                label="Low Plastic Limit (mm)"
                value={details.lowPlasticLimit}
              />
              <DetailRow
                label="High Plastic (mm)"
                value={details.elasticLimit}
              />
              <DetailRow label="Comment" value={details.comment} />
            </div>
          </div>

          <div className="lg:ui-banshee-col-span-7">
            <Tabs
              defaultValue="statusPlot"
              className="ui-banshee-w-full ui-banshee-h-full ui-banshee-p-0 ui-banshee-flex ui-banshee-items-start ui-banshee-flex-col"
            >
              <TabsList className="ui-banshee-justify-start ui-banshee-border-none ui-banshee-p-0 ui-banshee-h-auto">
                <TabsTrigger
                  value="statusPlot"
                  className="data-[state=active]:ui-banshee-bg-neutral-1 ui-banshee-px-8"
                >
                  Status Plot
                </TabsTrigger>
                <TabsTrigger
                  value="dataPlot"
                  className="data-[state=active]:ui-banshee-bg-neutral-1 ui-banshee-px-8"
                >
                  Data Plot
                </TabsTrigger>
                <TabsTrigger
                  value="comment"
                  className="data-[state=active]:ui-banshee-bg-neutral-1 ui-banshee-px-8"
                >
                  Comment
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="statusPlot"
                className="!ui-banshee-mt-0 ui-banshee-px-2 ui-banshee-flex-1"
              >
                <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-bg-neutral-1 ui-banshee-h-full">
                  <div className="ui-banshee-flex ui-banshee-p-6 ui-banshee-border-b ui-banshee-justify-between ui-banshee-items-center ui-banshee-mb-4">
                    <p className="ui-banshee-text-sm ui-banshee-text-neutral-500 ui-banshee-mx-auto">
                      Click and drag anywhere in the plot area to zoom into a
                      specific section of the chart.
                    </p>
                    <div className="ui-banshee-flex ui-banshee-gap-2">
                      <button
                        className="ui-banshee-px-4 ui-banshee-py-1 ui-banshee-text-sm ui-banshee-bg-white ui-banshee-border ui-banshee-border-neutral-300 ui-banshee-rounded"
                        onClick={() => statusPlotRef.current?.resetZoom()}
                      >
                        Reset zoom
                      </button>
                      <BansheeExportMenu
                        onDownloadCsv={() =>
                          downloadBansheeCsv(bansheeRequestsArray)
                        }
                        onDownloadPng={() =>
                          statusPlotRef.current?.downloadPng()
                        }
                      />
                    </div>
                  </div>
                  <BansheeStatusPlot
                    ref={statusPlotRef}
                    bansheeRequests={bansheeRequestsArray}
                    fetching={false}
                  />
                </div>
              </TabsContent>

              <TabsContent
                value="dataPlot"
                className="!ui-banshee-mt-0 ui-banshee-px-2 ui-banshee-flex-1"
              >
                <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-bg-neutral-1 ui-banshee-h-full">
                  <div className="ui-banshee-flex ui-banshee-p-6 ui-banshee-border-b ui-banshee-justify-between ui-banshee-items-center ui-banshee-mb-4">
                    <p className="ui-banshee-text-sm ui-banshee-text-neutral-500 ui-banshee-mx-auto">
                      Click and drag anywhere in the plot area to zoom into a
                      specific section of the chart.
                    </p>
                    <div className="ui-banshee-flex ui-banshee-gap-2">
                      <button
                        className="ui-banshee-px-4 ui-banshee-py-1 ui-banshee-text-sm ui-banshee-bg-white ui-banshee-border ui-banshee-border-neutral-300 ui-banshee-rounded"
                        onClick={() => dataPlotRef.current?.resetZoom()}
                      >
                        Reset zoom
                      </button>
                      <BansheeExportMenu
                        onDownloadCsv={() =>
                          downloadBansheeCsv(bansheeRequestsArray)
                        }
                        onDownloadPng={() => dataPlotRef.current?.downloadPng()}
                      />
                    </div>
                  </div>
                  <BansheeDataPlot
                    ref={dataPlotRef}
                    bansheeRequests={bansheeRequestsArray}
                    fetching={false}
                  />
                </div>
              </TabsContent>

              <TabsContent
                value="comment"
                className="!ui-banshee-mt-0 ui-banshee-px-2 ui-banshee-w-full ui-banshee-flex-1"
              >
                <div className="ui-banshee-bg-neutral-1 ui-banshee-h-full">
                  <Table variant={'border'}>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="!ui-banshee-text-left ui-banshee-px-4 ui-banshee-font-bold ui-banshee-text-md">
                          Date
                        </TableHead>
                        <TableHead className="!ui-banshee-text-left ui-banshee-px-4 ui-banshee-font-bold ui-banshee-items-center ui-banshee-text-md">
                          Comment
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commentRows.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="ui-banshee-text-center ui-banshee-py-2"
                          >
                            <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-2 ui-banshee-text-neutral-500">
                              <Text variant="medium" color="muted">
                                No comments available.
                              </Text>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        commentRows.map((row) => (
                          <TableRow key={row.key}>
                            <TableCell className="!ui-banshee-text-left ui-banshee-px-4">
                              <Text variant="medium" color="foreground">
                                {row.date}
                              </Text>
                            </TableCell>
                            <TableCell className="!ui-banshee-text-left ui-banshee-px-4">
                              <Text variant="medium" color="foreground">
                                {row.comment}
                              </Text>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <ShareForm
          form={shareForm}
          onShare={async (email) =>
            sharePlotList({
              email,
              rows: bansheeRequestsArray,
              pngFile: await statusPlotRef.current?.getPngFile(
                'banshee_status_plot.png',
              ),
              onSuccess: () => shareForm.reset({ email: '' }),
            })
          }
        />
      </main>
    </SidebarInset>
  );
}
