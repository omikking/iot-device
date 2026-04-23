'use client';

import React, { useCallback, useMemo, memo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@gsp/ui-banshee';
import { useCompanyRouter } from '@/libs/hooks/useCompanyRouter';
import { Settings, BarChart2 } from 'lucide-react';
import { getStatusLabel } from '@/libs/status-color-utils';

const bansheeDetailQuery = graphql(`
  query BansheeRequestDetail($id: String!) {
    bansheeRequest(id: $id) {
      id
      serialNumber
      boltInstallationDateTime
      period
      coordinates
      boltType
      site {
        siteName
      }
      level {
        levelName
      }
      drive {
        driveName
      }
      location {
        locationName
      }
      proceqData {
        status
        createdTimestamp
        readings {
          elongation
          status
        }
      }
    }
  }
`);

function parseCoordinates(raw: unknown): string {
  if (!raw) return '0.00 0.00 0.00';
  try {
    const coords = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const { x, y, z } = coords ?? {};
    if (x != null && y != null && z != null) return `${x} ${y} ${z}`;
  } catch (e) {
    console.error('Failed to parse coordinates:', e);
  }
  return '0.00 0.00 0.00';
}

function formatPeriod(period: number | null | undefined): string {
  if (period == null) return 'N/A';
  if (period === 1) return '1 month';
  if (period > 1) return `${period} months`;
  return 'N/A';
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

const DetailRow = memo(({ label, value }: DetailRowProps) => (
  <div className="ui-banshee-flex ui-banshee-items-start ui-banshee-py-3 ui-banshee-border-b ui-banshee-border-gray-50 ui-banshee-text-sm">
    <div className="ui-banshee-font-medium ui-banshee-text-neutral-500 ui-banshee-w-1/2 ui-banshee-pr-4">
      {label}
    </div>
    <div className="ui-banshee-text-neutral-800 ui-banshee-w-1/2 ui-banshee-break-words">
      {value ?? 'N/A'}
    </div>
  </div>
));
DetailRow.displayName = 'DetailRow';

interface ActionBarProps {
  onSettingsClick: () => void;
  onBarClick: () => void;
}

const ActionBar = memo(({ onSettingsClick, onBarClick }: ActionBarProps) => (
  <div className="ui-banshee-mt-6 ui-banshee-flex ui-banshee-gap-4 ui-banshee-text-neutral-500">
    <Settings
      size={20}
      onClick={onSettingsClick}
      className="ui-banshee-cursor-pointer hover:ui-banshee-text-neutral-800"
    />
    <BarChart2
      size={20}
      onClick={onBarClick}
      className="ui-banshee-cursor-pointer hover:ui-banshee-text-neutral-800"
    />
  </div>
));
ActionBar.displayName = 'ActionBar';

interface BansheeDetailModalProps {
  bansheeId: string | null;
  onClose: () => void;
}

export const BansheeDetailModal = memo(
  ({ bansheeId, onClose }: BansheeDetailModalProps) => {
    const router = useCompanyRouter();

    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (!open) onClose();
      },
      [onClose],
    );

    const handleSettingsClick = useCallback(
      () => router.push(`/banshee/${bansheeId}`),
      [router, bansheeId],
    );

    const handleBarClick = useCallback(
      () => router.push(`/banshee/dashboard/${bansheeId}`),
      [router, bansheeId],
    );

    const [{ data, fetching }] = useQuery({
      query: bansheeDetailQuery,
      variables: { id: bansheeId ?? '' },
      pause: !bansheeId,
    });

    const details = useMemo(() => {
      const request = data?.bansheeRequest;
      if (!request) return null;

      const measurements = request.proceqData ?? [];
      const latestMeasurement = measurements.at(-1) ?? null;
      const readings = latestMeasurement?.readings ?? [];
      const lastReading = readings.at(-1) ?? null;

      return {
        serialNumber: request.serialNumber,
        status: getStatusLabel(latestMeasurement?.status),
        createdTimeStr: latestMeasurement?.createdTimestamp
          ? new Date(latestMeasurement.createdTimestamp).toLocaleString()
          : 'N/A',
        siteName: request.site?.siteName ?? 'N/A',
        levelName: request.level?.levelName ?? 'N/A',
        driveName: request.drive?.driveName ?? 'N/A',
        locationName: request.location?.locationName ?? 'N/A',
        coordsDisplay: parseCoordinates(request.coordinates),
        boltInstallationDateTime: request.boltInstallationDateTime ?? 'N/A',
        elongation:
          lastReading?.elongation != null
            ? lastReading.elongation.toFixed(1)
            : '-',
        boltType: request.boltType ?? 'N/A',
        period: formatPeriod(request.period),
      };
    }, [data]);

    return (
      <Modal open={!!bansheeId} onOpenChange={handleOpenChange}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {details?.serialNumber ?? (fetching ? 'Loading...' : '—')}
            </ModalTitle>
          </ModalHeader>

          {fetching && (
            <div className="ui-banshee-mt-6 ui-banshee-text-center ui-banshee-text-gray-500">
              Loading details...
            </div>
          )}

          {!fetching && details && (
            <>
              <div className="ui-banshee-mt-6 ui-banshee-flex ui-banshee-flex-col">
                <DetailRow label="Status" value={details.status} />
                <DetailRow
                  label="Last Reading"
                  value={details.createdTimeStr}
                />
                <DetailRow label="Site" value={details.siteName} />
                <DetailRow label="Level" value={details.levelName} />
                <DetailRow label="Drive" value={details.driveName} />
                <DetailRow label="Location" value={details.locationName} />
                <DetailRow
                  label="Location Coordinates xyz"
                  value={details.coordsDisplay}
                />
                <DetailRow
                  label="Installation Date"
                  value={details.boltInstallationDateTime}
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
                <DetailRow label="Low Plastic Limit (mm)" value="N/A" />
                <DetailRow label="High Plastic Limit (mm)" value="N/A" />
              </div>

              <ActionBar
                onSettingsClick={handleSettingsClick}
                onBarClick={handleBarClick}
              />
            </>
          )}
        </ModalContent>
      </Modal>
    );
  },
);

BansheeDetailModal.displayName = 'BansheeDetailModal';
