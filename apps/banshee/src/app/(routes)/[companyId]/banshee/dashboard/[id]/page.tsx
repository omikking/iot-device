'use client';

import React, { useEffect, useMemo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { handleGraphQLErrors } from '@/libs/utils';
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
import { getStatusLabel } from '@/libs/status-color-utils';
import { BansheeStatusPlot } from '@/components/BansheeStatusPlot';
import BansheeDataPlot from '@/components/BansheeDataPlot';
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
        readings {
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

function formatDateTime(dt: string | null | undefined): string {
  if (!dt) return 'N/A';
  try {
    return new Date(dt).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dt;
  }
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

const DetailRow = React.memo(({ label, value }: DetailRowProps) => (
  <div className="ui-banshee-flex ui-banshee-items-start ui-banshee-py-3 ui-banshee-border-b ui-banshee-text-sm">
    <div className="ui-banshee-font-medium ui-banshee-text-neutral-500 ui-banshee-w-[45%] ui-banshee-pr-4">
      {label}
    </div>
    <div className="ui-banshee-text-neutral-800 ui-banshee-w-[55%] ui-banshee-break-words">
      {value ?? 'N/A'}
    </div>
  </div>
));
DetailRow.displayName = 'DetailRow';

type ShareFormValues = {
  email: string;
};

export default function BansheeDashboardPage() {
  const { id } = useParams();
  const bansheeId = id as string;

  const [{ data, fetching, error }] = useQuery({
    query: bansheeDetailQuery,
    variables: { id: bansheeId ?? '' },
    pause: !bansheeId,
  });

  useEffect(() => {
    handleGraphQLErrors(error);
  }, [error]);

  const shareForm = useForm<ShareFormValues>();

  const details = useMemo(() => {
    const request = data?.bansheeRequest;
    if (!request) return null;

    const measurements = request?.proceqData ?? [];
    const latestMeasurement = measurements.at(-1) ?? null;
    const readings = latestMeasurement?.readings ?? [];
    const lastReading = readings.at(-1) ?? null;

    return {
      serialNumber: request.serialNumber,
      status: getStatusLabel(latestMeasurement?.status),
      lastReading: latestMeasurement?.createdTimestamp
        ? formatDateTime(latestMeasurement.createdTimestamp)
        : 'N/A',
      siteName: request.site?.siteName ?? 'N/A',
      levelName: request.level?.levelName ?? 'N/A',
      driveName: request.drive?.driveName ?? 'N/A',
      locationName: request.location?.locationName ?? 'N/A',
      coordsDisplay: parseCoordinatesDisplay(request.coordinates),
      installationDate: formatDateTime(request.boltInstallationDateTime),
      elongation:
        lastReading?.elongation != null
          ? lastReading.elongation.toFixed(1)
          : '-',
      boltType: request.boltType ?? 'N/A',
      period: formatPeriod(request.period),
      lowPlasticLimit: request.boltTypeConstant?.lowPlasticLimit,
      elasticLimit: request.boltTypeConstant?.elasticLimit,
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
    return (request.proceqData ?? []).map((pd, idx) => ({
      key: `${pd.createdTimestamp}-${idx}`,
      date: pd.createdTimestamp
        ? new Date(pd.createdTimestamp)
            .toISOString()
            .replace(/[-T:]/g, '-')
            .slice(0, 10)
        : 'N/A',
      comment: request.comment || '',
      hasPhoto: true,
      userPhoto: null,
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
      <main className="ui-banshee-p-6 ui-banshee-mb-16 ui-banshee-bg-main-white ui-banshee-w-full">
        <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-3 ui-banshee-mb-8">
          <div className="ui-banshee-w-9 ui-banshee-h-9 ui-banshee-rounded-full ui-banshee-bg-neutral-300" />
          <h1 className="ui-banshee-text-2xl ui-banshee-font-semibold ui-banshee-text-neutral-900">
            {details.serialNumber ?? 'Banshee Name'}
          </h1>
        </div>

        <div className="ui-banshee-grid ui-banshee-grid-cols-1 lg:ui-banshee-grid-cols-12 ui-banshee-gap-8">
          <div className="lg:ui-banshee-col-span-5 ui-banshee-bg-neutral-100 ui-banshee-border ui-banshee-border-gray-100 ui-banshee-p-6">
            <div className="ui-banshee-flex ui-banshee-flex-col">
              <DetailRow label="Status" value={details.status} />
              <DetailRow label="Last Reading" value={details.lastReading} />
              <DetailRow
                label="Location Coordinates xyz"
                value={details.coordsDisplay}
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
              <DetailRow label="Due Date" value="N/A" />
              <DetailRow
                label="Low Plastic Limit (mm)"
                value={details.lowPlasticLimit}
              />
              <DetailRow
                label="High Plastic (mm)"
                value={details.elasticLimit}
              />
              <DetailRow
                label="Comment"
                value={
                  <span className="ui-banshee-whitespace-pre-line">
                    text{'\n'}text
                  </span>
                }
              />
            </div>
          </div>

          <div className="lg:ui-banshee-col-span-7">
            <Tabs
              defaultValue="statusPlot"
              className="ui-banshee-w-full ui-banshee-p-0"
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
                  value="commentAndPhoto"
                  className="data-[state=active]:ui-banshee-bg-neutral-1 ui-banshee-px-8"
                >
                  Comment and Photo
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="statusPlot"
                className="!ui-banshee-mt-0 ui-banshee-px-2"
              >
                <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-bg-neutral-1">
                  <div className="ui-banshee-flex ui-banshee-p-6 ui-banshee-border-b ui-banshee-justify-between ui-banshee-items-center ui-banshee-mb-4">
                    <p className="ui-banshee-text-sm ui-banshee-text-neutral-500 ui-banshee-mx-auto">
                      Click and drag in the plot area to zoom in. Hold CTRL and
                      drag to pane
                    </p>
                    <button className="ui-banshee-px-4 ui-banshee-py-1 ui-banshee-text-sm ui-banshee-bg-white ui-banshee-border ui-banshee-border-neutral-300 ui-banshee-rounded">
                      Reset zoom
                    </button>
                  </div>
                  <BansheeStatusPlot
                    bansheeRequests={bansheeRequestsArray}
                    fetching={false}
                  />
                </div>
              </TabsContent>

              <TabsContent
                value="dataPlot"
                className="!ui-banshee-mt-0 ui-banshee-px-2"
              >
                <div className="ui-banshee-bg-neutral-1 ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-text-neutral-500">
                  <BansheeDataPlot
                    bansheeRequests={bansheeRequestsArray}
                    fetching={false}
                  />
                </div>
              </TabsContent>

              <TabsContent
                value="commentAndPhoto"
                className="!ui-banshee-mt-0 ui-banshee-px-2"
              >
                <div className="ui-banshee-bg-neutral-1">
                  <Table variant={'border'}>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="!ui-banshee-text-left ui-banshee-px-4 ui-banshee-font-bold">
                          Date
                        </TableHead>
                        <TableHead className="!ui-banshee-text-left ui-banshee-px-4 ui-banshee-font-bold">
                          Comment
                        </TableHead>
                        <TableHead className="!ui-banshee-text-left ui-banshee-px-4 ui-banshee-font-bold">
                          Photo
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {commentRows.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="ui-banshee-text-center ui-banshee-text-neutral-500 ui-banshee-py-8"
                          >
                            No comments or photos available
                          </TableCell>
                        </TableRow>
                      ) : (
                        commentRows.map((row) => (
                          <TableRow key={row.key}>
                            <TableCell className="!ui-banshee-text-left ui-banshee-px-4">
                              <Text variant="small" color="foreground">
                                {row.date}
                              </Text>
                            </TableCell>
                            <TableCell className="!ui-banshee-text-left ui-banshee-px-4">
                              <Text variant="small" color="foreground">
                                {row.comment}
                              </Text>
                            </TableCell>
                            <TableCell className="!ui-banshee-text-left ui-banshee-px-4">
                              {row.hasPhoto ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <button className="ui-banshee-cursor-pointer hover:ui-banshee-opacity-70">
                                      <ImageIcon size={20} />
                                    </button>
                                  </DialogTrigger>
                                  <DialogContent className="ui-banshee-max-w-lg">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Photo — {row.date}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-p-4 ui-banshee-text-neutral-500">
                                      No image available
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                <Text variant="small" color="muted">
                                  —
                                </Text>
                              )}
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
        <ShareForm form={shareForm} />
      </main>
    </SidebarInset>
  );
}
