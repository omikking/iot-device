'use client';

import {
  Text,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableHeadWithSorting,
  LoadingSpinner,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from '@gsp/ui-banshee';
import { gql, useQuery } from 'urql';
import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { getStatusColorHex, getStatusLabel } from '@/libs/status-color-utils';
import { Plus } from 'lucide-react';
import { EventDetailModal } from './EventDetailModal';
import { BansheeEventLog } from '@/gql/graphql';
import { handleGraphQLErrors } from '@/libs/utils';
import { compareValues } from '@/libs/sort-compare';

type ColumnProp = ComponentProps<typeof TableHeadWithSorting>['column'];

const eventsPageTableQuery = gql`
  query eventsPageTableQuery($companyId: String) {
    bansheeEventLogs(companyId: $companyId) {
      totalRecords
      results {
        id
        createdAt
        eventType
        previousStatus
        newStatus
        bansheeRequest {
          serialNumber
          name
          id
          location {
            locationName
          }
          site {
            siteName
          }
          level {
            levelName
          }
          drive {
            driveName
          }
        }
      }
    }
  }
`;

export const EventsPageTable = ({
  params,
}: {
  params: { companyId: string };
}) => {
  const { companyId } = params;
  const [{ data, fetching, error }] = useQuery({
    query: eventsPageTableQuery,
    variables: { companyId },
  });

  useEffect(() => {
    handleGraphQLErrors(error);
  }, [error]);

  const flattenedEvents = data?.bansheeEventLogs?.results || [];

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<BansheeEventLog | null>(
    null,
  );

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const createMockColumn = (key: string) =>
    ({
      getIsSorted: () =>
        sortConfig?.key === key ? sortConfig.direction : false,
      toggleSorting: () => requestSort(key),
    }) as ColumnProp;

  const sortedEvents = useMemo(() => {
    const sortable = [...flattenedEvents];
    if (sortConfig !== null) {
      // The hierarchy columns live under `bansheeRequest`, so they have to be
      // reached explicitly — reading them off the event row yields undefined
      // and the column silently stops sorting.
      const sortValue = (event: (typeof sortable)[number]) => {
        switch (sortConfig.key) {
          case 'banshee':
            return event.bansheeRequest?.name;
          case 'site':
            return event.bansheeRequest?.site?.siteName;
          case 'level':
            return event.bansheeRequest?.level?.levelName;
          case 'drive':
            return event.bansheeRequest?.drive?.driveName;
          case 'location':
            return event.bansheeRequest?.location?.locationName;
          // Sort on the instant, not the rendered locale date string.
          case 'createdAt':
            return event.createdAt ? new Date(event.createdAt).getTime() : null;
          default:
            return event[sortConfig.key];
        }
      };

      sortable.sort((a, b) =>
        compareValues(sortValue(a), sortValue(b), sortConfig.direction),
      );
    }
    return sortable;
  }, [flattenedEvents, sortConfig]);

  return (
    <>
      <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-w-full ui-banshee-h-[50vh]">
        <div className="ui-banshee-bg-neutral-1 ui-banshee-overflow-auto ui-banshee-flex-1 ui-banshee-min-h-0">
          <Table variant="noBorder">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Text
                    variant="medium"
                    color="foreground"
                    className="ui-banshee-font-bold ui-banshee-px-4"
                  >
                    Details
                  </Text>
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <TableHeadWithSorting
                    header="Status"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-center ui-banshee-text-md"
                    column={createMockColumn('newStatus')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0 ui-banshee-w-[15%]">
                  <TableHeadWithSorting
                    header="Banshee"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 !ui-banshee-justify-start ui-banshee-text-md"
                    column={createMockColumn('banshee')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0 ui-banshee-w-[20%]">
                  <TableHeadWithSorting
                    header="Site"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 !ui-banshee-justify-start ui-banshee-text-md"
                    column={createMockColumn('site')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0 ui-banshee-w-[20%]">
                  <TableHeadWithSorting
                    header="Level"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 !ui-banshee-justify-start ui-banshee-text-md"
                    column={createMockColumn('level')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0 ui-banshee-w-[20%]">
                  <TableHeadWithSorting
                    header="Drive"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 !ui-banshee-justify-start ui-banshee-text-md"
                    column={createMockColumn('drive')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0 ui-banshee-w-[20%]">
                  <TableHeadWithSorting
                    header="Location"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 !ui-banshee-justify-start ui-banshee-text-md"
                    column={createMockColumn('location')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0 ui-banshee-w-[30%]">
                  <TableHeadWithSorting
                    header="Created on"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 !ui-banshee-justify-start ui-banshee-whitespace-nowrap ui-banshee-text-md"
                    column={createMockColumn('createdAt')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <TableHeadWithSorting
                    header="Description"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 !ui-banshee-justify-start ui-banshee-text-md"
                    column={createMockColumn('eventType')}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetching ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="ui-banshee-text-center ui-banshee-py-8"
                  >
                    <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-2">
                      <LoadingSpinner size={16} />
                      <Text variant="medium" color="foreground">
                        Loading events...
                      </Text>
                    </div>
                  </TableCell>
                </TableRow>
              ) : flattenedEvents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="!ui-banshee-text-center ui-banshee-py-8"
                  >
                    <Text variant="medium" color="foreground">
                      No recent events tracked.
                    </Text>
                  </TableCell>
                </TableRow>
              ) : (
                sortedEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="ui-banshee-bg-neutral-2">
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="ui-banshee-p-1 hover:ui-banshee-bg-neutral-100 ui-banshee-rounded ui-banshee-w-full ui-banshee-h-full ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                style={{
                                  backgroundColor: getStatusColorHex(
                                    event.newStatus,
                                  ),
                                }}
                                className="ui-banshee-inline-block ui-banshee-w-3 ui-banshee-h-3 ui-banshee-rounded-full ui-banshee-cursor-pointer"
                              />
                            </TooltipTrigger>

                            <TooltipContent>
                              {getStatusLabel(event.newStatus)}
                              <TooltipArrow />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell className="ui-banshee-text-left ui-banshee-px-4 ui-banshee-whitespace-nowrap">
                      <Text variant="medium" color="foreground">
                        {event.bansheeRequest?.name || 'N/A'}
                      </Text>
                    </TableCell>
                    <TableCell className="ui-banshee-text-left ui-banshee-px-4 ui-banshee-whitespace-nowrap">
                      <Text variant="medium" color="foreground">
                        {event.bansheeRequest?.site?.siteName || 'N/A'}
                      </Text>
                    </TableCell>
                    <TableCell className="ui-banshee-text-left ui-banshee-px-4 ui-banshee-whitespace-nowrap">
                      <Text variant="medium" color="foreground">
                        {event.bansheeRequest?.level?.levelName || 'N/A'}
                      </Text>
                    </TableCell>
                    <TableCell className="ui-banshee-text-left ui-banshee-px-4 ui-banshee-whitespace-nowrap">
                      <Text variant="medium" color="foreground">
                        {event.bansheeRequest?.drive?.driveName || 'N/A'}
                      </Text>
                    </TableCell>
                    <TableCell className="ui-banshee-text-left ui-banshee-px-4 ui-banshee-whitespace-nowrap">
                      <Text variant="medium" color="foreground">
                        {event.bansheeRequest?.location?.locationName || 'N/A'}
                      </Text>
                    </TableCell>
                    <TableCell className="ui-banshee-text-left ui-banshee-px-4 ui-banshee-whitespace-nowrap">
                      <Text variant="medium" color="foreground">
                        {new Date(event.createdAt).toLocaleDateString()}
                      </Text>
                    </TableCell>
                    <TableCell className="ui-banshee-text-left ui-banshee-whitespace-nowrap">
                      <Text
                        className="ui-banshee-px-4 ui-banshee-text-left"
                        variant="medium"
                        color="foreground"
                      >
                        {event.eventType === 'STATUS_CHANGE'
                          ? `Status changed from ${getStatusLabel(
                              event.previousStatus,
                            )} to ${getStatusLabel(event.newStatus)}`
                          : `Event: ${event.eventType}`}
                      </Text>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <EventDetailModal
        bansheeId={selectedEvent?.bansheeRequest?.id || null}
        dateOfEvent={selectedEvent?.createdAt || null}
        eventDescription={
          selectedEvent?.eventType === 'STATUS_CHANGE'
            ? `Status changed from ${getStatusLabel(
                selectedEvent?.previousStatus,
              )} to ${getStatusLabel(selectedEvent?.newStatus)}`
            : `Event: ${selectedEvent?.eventType}`
        }
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
};
