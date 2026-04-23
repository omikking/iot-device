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
} from '@gsp/ui-banshee';
import { gql, useQuery } from 'urql';
import { ComponentProps, useMemo, useState } from 'react';
import { getStatusColorHex, getStatusLabel } from '@/libs/status-color-utils';
import { Plus } from 'lucide-react';
import { EventDetailModal } from './EventDetailModal';
import { BansheeEventLog } from '@/gql/graphql';

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
          id
          location {
            locationName
          }
        }
      }
    }
  }
`;

export const EventsPageTable = ({ params }: { params: { companyId: string } }) => {
  const { companyId } = params;
  const [{ data, fetching }] = useQuery({
    query: eventsPageTableQuery,
    variables: { companyId },
  });

  const flattenedEvents = data?.bansheeEventLogs?.results || [];

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<BansheeEventLog | null>(
    null,
  );

  console.log('selectedEvent', selectedEvent);
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
      sortable.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'banshee') {
          aValue = a.bansheeRequest?.serialNumber;
          bValue = b.bansheeRequest?.serialNumber;
        } else if (sortConfig.key === 'location') {
          aValue = a.bansheeRequest?.location?.locationName;
          bValue = b.bansheeRequest?.location?.locationName;
        }

        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortable;
  }, [flattenedEvents, sortConfig]);

  return (
    <>
      <div className="ui-banshee-flex ui-banshee-p-6 ui-banshee-flex-col ui-banshee-w-full ui-banshee-h-[50vh]">
        <div className="ui-banshee-bg-neutral-1 ui-banshee-overflow-y-auto ui-banshee-flex-1 ui-banshee-min-h-0">
          <Table variant="noBorder">
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Text
                    variant="small"
                    color="foreground"
                    className="ui-banshee-font-bold"
                  >
                    Details
                  </Text>
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <TableHeadWithSorting
                    header="Status"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-center"
                    column={createMockColumn('newStatus')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <TableHeadWithSorting
                    header="Banshee"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-start"
                    column={createMockColumn('banshee')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <TableHeadWithSorting
                    header="Location"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-center"
                    column={createMockColumn('location')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <TableHeadWithSorting
                    header="Created on"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-center"
                    column={createMockColumn('createdAt')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <TableHeadWithSorting
                    header="Description"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-start"
                    column={createMockColumn('eventType')}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetching ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="ui-banshee-text-center ui-banshee-py-8"
                  >
                    <Text variant="small" color="foreground">
                      Loading events...
                    </Text>
                  </TableCell>
                </TableRow>
              ) : flattenedEvents.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="!ui-banshee-text-center ui-banshee-py-8"
                  >
                    <Text variant="small" color="foreground">
                      No recent events tracked.
                    </Text>
                  </TableCell>
                </TableRow>
              ) : (
                sortedEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="ui-banshee-p-1 hover:ui-banshee-bg-neutral-100 ui-banshee-rounded ui-banshee-w-full ui-banshee-h-full ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center">
                        <div
                          style={{
                            backgroundColor: getStatusColorHex(event.newStatus),
                          }}
                          className={`ui-banshee-w-3 ui-banshee-h-3 ui-banshee-rounded-full`}
                          title={getStatusLabel(event.newStatus)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="ui-banshee-text-left">
                      <Text variant="small" color="foreground">
                        {event.bansheeRequest?.serialNumber || 'N/A'}
                      </Text>
                    </TableCell>
                    <TableCell className="ui-banshee-text-center">
                      <Text variant="small" color="foreground">
                        {event.bansheeRequest?.location?.locationName || 'N/A'}
                      </Text>
                    </TableCell>
                    <TableCell className="ui-banshee-text-center">
                      <Text variant="small" color="foreground">
                        {new Date(event.createdAt).toLocaleDateString()}
                      </Text>
                    </TableCell>
                    <TableCell className="ui-banshee-text-left">
                      <Text variant="small" color="foreground">
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
