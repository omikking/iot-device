'use client';

import React, { useCallback, useEffect, useMemo, memo } from 'react';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  LoadingSpinner,
} from '@gsp/ui-banshee';
import { useCompanyRouter } from '@/libs/hooks/useCompanyRouter';
import { Settings, BarChart2 } from 'lucide-react';
import { getStatusLabel } from '@/libs/status-color-utils';
import { handleGraphQLErrors } from '@/libs/utils';
import {
  formatElongation,
  getLatestMeasurement,
} from '@/libs/latest-measurement';
import { DetailRow } from './DetailRow';

const bansheeDetailEventQuery = graphql(`
  query bansheeDetailEventQuery($id: String!) {
    bansheeRequest(id: $id) {
      id
      name
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
      boltTypeConstant {
        lowPlasticLimit
        elasticLimit
      }
      proceqData {
        status
        dueDate
        createdTimestamp
        updatedTimestamp
        readings {
          readingIndex
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

interface ActionBarProps {
  onSettingsClick: () => void;
  onBarClick: () => void;
}

const ActionBar = memo(({ onSettingsClick, onBarClick }: ActionBarProps) => (
  <div className="ui-banshee-mt-6 ui-banshee-flex ui-banshee-gap-4 ui-banshee-text-main-black">
    <Settings
      size={20}
      onClick={onSettingsClick}
      className="ui-banshee-cursor-pointer hover:ui-banshee-text-main-black"
    />
    <BarChart2
      size={20}
      onClick={onBarClick}
      className="ui-banshee-cursor-pointer hover:ui-banshee-text-main-black"
    />
  </div>
));
ActionBar.displayName = 'ActionBar';

interface BansheeDetailModalProps {
  bansheeId: string | null;
  dateOfEvent: string | null;
  eventDescription: string | null;
  onClose: () => void;
}

export const EventDetailModal = memo(
  ({
    bansheeId,
    dateOfEvent,
    eventDescription,
    onClose,
  }: BansheeDetailModalProps) => {
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

    const [{ data, fetching, error }] = useQuery({
      query: bansheeDetailEventQuery,
      variables: { id: bansheeId ?? '' },
      pause: !bansheeId,
    });

    useEffect(() => {
      handleGraphQLErrors(error);
    }, [error]);

    const details = useMemo(() => {
      const request = data?.bansheeRequest;
      if (!request) return null;

      const { measurement: latestMeasurement, reading: lastReading } =
        getLatestMeasurement(request.proceqData);

      return {
        name: request?.name,
        serialNumber: request?.serialNumber,
        status: getStatusLabel(latestMeasurement?.status),
        createdTimeStr: latestMeasurement?.createdTimestamp
          ? new Date(latestMeasurement.createdTimestamp).toLocaleString()
          : 'N/A',
        dueDate: latestMeasurement?.dueDate
          ? new Date(latestMeasurement.dueDate).toLocaleString()
          : 'N/A',
        siteName: request?.site?.siteName ?? 'N/A',
        levelName: request?.level?.levelName ?? 'N/A',
        driveName: request?.drive?.driveName ?? 'N/A',
        locationName: request?.location?.locationName ?? 'N/A',
        coordsDisplay: parseCoordinates(request?.coordinates),
        boltInstallationDateTime: request?.boltInstallationDateTime
          ? new Date(request?.boltInstallationDateTime)?.toLocaleString()
          : 'N/A',
        lowPlasticLimit: request?.boltTypeConstant?.elasticLimit
          ? request.boltTypeConstant.elasticLimit.toFixed(1)
          : 'N/A',
        highPlasticLimit: request?.boltTypeConstant?.lowPlasticLimit
          ? request.boltTypeConstant.lowPlasticLimit.toFixed(1)
          : 'N/A',
        elongation: formatElongation(lastReading) ?? '-',
        boltType: request?.boltType ?? 'N/A',
        period: formatPeriod(request?.period),
      };
    }, [data]);

    return (
      <Modal open={!!bansheeId} onOpenChange={handleOpenChange}>
        <ModalContent className="ui-banshee-overflow-auto">
          <ModalHeader>
            <ModalTitle>
              {details?.name ?? (fetching ? 'Loading...' : '—')}
            </ModalTitle>
          </ModalHeader>

          {fetching && (
            <div className="ui-banshee-mt-6 ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-2 ui-banshee-text-gray-500">
              <LoadingSpinner size={18} />
              Loading details...
            </div>
          )}

          {!fetching && details && (
            <>
              <div className="ui-banshee-mt-6 ui-banshee-flex ui-banshee-flex-col">
                <DetailRow label="Serial Number" value={details.serialNumber} />
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
                <DetailRow label="Due Date" value={details.dueDate || 'N/A'} />
                <DetailRow
                  label="Low Plastic Limit (mm)"
                  value={details.lowPlasticLimit}
                />
                <DetailRow
                  label="High Plastic Limit (mm)"
                  value={details.highPlasticLimit}
                />
                <DetailRow
                  label="Date of Event"
                  value={
                    dateOfEvent ? new Date(dateOfEvent).toLocaleString() : 'N/A'
                  }
                />
                <DetailRow label="Event Description" value={eventDescription} />
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

EventDetailModal.displayName = 'EventDetailModal';
