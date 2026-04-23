'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  SidebarInset,
  Headline,
  Text,
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  DropdownMultiSelectSearch,
} from '@gsp/ui-banshee';
import { Plus, Star, Check, ShoppingCart as CartIcon } from 'lucide-react';
import { useCompanyRouter } from '@/libs/hooks/useCompanyRouter';
import { BansheeDetailModal } from '@/components/BansheeDetailModal';
import { useQuery } from 'urql';
import { graphql } from '@/gql';
import { BansheeSchedulerListQuery, ProceqStatus } from '@/gql/graphql';

//TODO : need to change it measured true
const bansheeSchedulerList = graphql(`
  query bansheeSchedulerList($companyId: String) {
    bansheeRequests(measured: false, limit: 100, companyId: $companyId) {
      results {
        id
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
        period
        comment
        proceqData {
          status
          createdTimestamp
          updatedTimestamp
          dueDate
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

// Types for scheduler data
type BansheeStatus = 'red' | 'orange' | 'yellow' | 'green' | 'gray';

type SchedulerBanshee = {
  id: string;
  serialNumber: string;
  location: string;
  totalElongation: number | null;
  lastMeasured: string;
  period: number | null;
  dueDate: string;
  status: BansheeStatus;
  isOverdue: boolean;
  isSuggested: boolean;
  isSelected: boolean;
  isExpanded: boolean;
};

// Map ProceqStatus to BansheeStatus color
const mapProceqStatusToColor = (status?: string | null): BansheeStatus => {
  switch (status) {
    case ProceqStatus.Elastic:
      return 'green';
    case ProceqStatus.LowPlastic:
      return 'yellow';
    case ProceqStatus.HighPlastic:
      return 'orange';
    case ProceqStatus.Broken:
      return 'red';
    case ProceqStatus.NotMeasurable:
    case ProceqStatus.Unmeasured:
    default:
      return 'gray';
  }
};

const transformBansheeRequests = (
  requests: BansheeSchedulerListQuery['bansheeRequests']['results'],
): Omit<SchedulerBanshee, 'isSelected' | 'isExpanded'>[] => {
  return requests.map((request) => {
    const latestProceqData = request.proceqData?.[0];
    const latestReading = latestProceqData?.readings?.[0];

    const totalElongation = latestReading?.elongation ?? null;

    const proceqStatus = latestProceqData?.status;
    const status = mapProceqStatusToColor(proceqStatus);

    const lastMeasured = latestProceqData?.updatedTimestamp
      ? new Date(latestProceqData.updatedTimestamp).toLocaleDateString('en-GB')
      : '-';
    const dueDate = latestProceqData?.dueDate
      ? new Date(latestProceqData.dueDate).toLocaleDateString('en-GB')
      : '-';
    return {
      id: request.id,
      serialNumber: request.serialNumber ?? '-',
      location: request.location?.locationName ?? '-',
      totalElongation,
      period: request.period ?? null,
      lastMeasured,
      dueDate, // Not available in API
      status,
      isOverdue: false, // Not available in API
      isSuggested: false, // Not available in API
    };
  });
};

const STATUS_COLORS: Record<BansheeStatus, string> = {
  red: '#FF0000',
  orange: '#FF7938',
  yellow: '#FFD50C',
  green: '#62CE47',
  gray: '#9C9C9C',
};

type SelectOption =
  | 'suggested'
  | 'all'
  | 'due'
  | 'overdue'
  | 'others'
  | 'clear';

const SELECT_OPTIONS: { id: SelectOption; name: string }[] = [
  { id: 'suggested', name: 'Select suggested' },
  { id: 'all', name: 'Select all' },
  { id: 'due', name: 'Select due' },
  { id: 'overdue', name: 'Select overdue' },
  { id: 'others', name: 'Select others' },
  { id: 'clear', name: 'Clear' },
];

export default function SchedulerPage({ params }: { params: { companyId: string } }) {
  const { companyId } = params;
  const router = useCompanyRouter();
  // Form state
  const [quantity, setQuantity] = useState('20');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [period, setPeriod] = useState('3 Months');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedBansheeId, setSelectedBansheeId] = useState<string | null>(
    null,
  );

  const [banshees, setBanshees] = useState<SchedulerBanshee[]>([]);

  const selectedCount = useMemo(
    () => banshees.filter((b) => b.isSelected).length,
    [banshees],
  );

  const handleToggleSelect = (id: string) => {
    setBanshees((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isSelected: !b.isSelected } : b)),
    );
  };

  const handleAddNewBanshees = () => {
    console.log('Add new banshees:', { quantity, name, location, period });
  };

  const handleAddToCart = () => {
    const selectedBanshees = banshees.filter((b) => b.isSelected);
    // TODO: Implement API call to add to cart
    console.log('Add to cart:', selectedBanshees);
    router.push('/scheduler/cart');
  };

  const [{ data, fetching }] = useQuery({
    query: bansheeSchedulerList,
    variables: {
      companyId,
    },
  });
  const bansheeRequests = data?.bansheeRequests?.results || [];

  // Transform API data to scheduler format when data changes
  useEffect(() => {
    if (bansheeRequests.length > 0) {
      const transformedData = transformBansheeRequests(bansheeRequests);
      setBanshees(
        transformedData.map((b) => ({
          ...b,
          isSelected: false,
          isExpanded: false,
        })),
      );
    }
  }, [bansheeRequests]);

  if (fetching) {
    return (
      <div className="ui-banshee-p-8 ui-banshee-text-center ui-banshee-text-gray-500">
        Loading banshee list...
      </div>
    );
  }

  return (
    <>
      <SidebarInset>
        <main className="ui-banshee-flex ui-banshee-gap-5 ui-banshee-flex-col ui-banshee-min-h-screen ui-banshee-p-6">
          <div className="ui-banshee-flex ui-banshee-gap-3 ui-banshee-flex-col ui-banshee-bg-white ui-banshee-border-b">
            <Headline as="h1" variant="small" color="foreground">
              New Banshee
            </Headline>

            <div className="ui-banshee-flex ui-banshee-gap-4 ui-banshee-items-end ui-banshee-flex-wrap ui-banshee-bg-[#F8F8F8] ui-banshee-p-4 ui-banshee-border-t ui-banshee-border-b ui-banshee-border-[#DADADA]">
              <div className="ui-banshee-flex-shrink-0">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="20 (suggested quantity)"
                  className="ui-banshee-flex ui-banshee-h-10 ui-banshee-w-48 ui-banshee-rounded-md ui-banshee-border ui-banshee-border-input ui-banshee-bg-background ui-banshee-px-3 ui-banshee-py-2 ui-banshee-text-sm ui-banshee-ring-offset-background file:ui-banshee-border-0 file:ui-banshee-bg-transparent file:ui-banshee-text-sm file:ui-banshee-font-medium placeholder:ui-banshee-text-muted-foreground focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-ring focus-visible:ui-banshee-ring-offset-2 disabled:ui-banshee-cursor-not-allowed disabled:ui-banshee-opacity-50"
                />
              </div>

              <div className="ui-banshee-flex-1 ui-banshee-min-w-[200px]">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name (optional)"
                  className="ui-banshee-flex ui-banshee-h-10 ui-banshee-w-full ui-banshee-rounded-md ui-banshee-border ui-banshee-border-input ui-banshee-bg-background ui-banshee-px-3 ui-banshee-py-2 ui-banshee-text-sm ui-banshee-ring-offset-background file:ui-banshee-border-0 file:ui-banshee-bg-transparent file:ui-banshee-text-sm file:ui-banshee-font-medium placeholder:ui-banshee-text-muted-foreground focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-ring focus-visible:ui-banshee-ring-offset-2 disabled:ui-banshee-cursor-not-allowed disabled:ui-banshee-opacity-50"
                />
              </div>

              <div className="ui-banshee-flex-1 ui-banshee-min-w-[200px]">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (optional)"
                  className="ui-banshee-flex ui-banshee-h-10 ui-banshee-w-full ui-banshee-rounded-md ui-banshee-border ui-banshee-border-input ui-banshee-bg-background ui-banshee-px-3 ui-banshee-py-2 ui-banshee-text-sm ui-banshee-ring-offset-background file:ui-banshee-border-0 file:ui-banshee-bg-transparent file:ui-banshee-text-sm file:ui-banshee-font-medium placeholder:ui-banshee-text-muted-foreground focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-ring focus-visible:ui-banshee-ring-offset-2 disabled:ui-banshee-cursor-not-allowed disabled:ui-banshee-opacity-50"
                />
              </div>

              <div className="ui-banshee-flex-shrink-0">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="ui-banshee-flex ui-banshee-h-10 ui-banshee-rounded-md ui-banshee-border ui-banshee-border-input ui-banshee-bg-background ui-banshee-px-3 ui-banshee-py-2 ui-banshee-text-sm ui-banshee-ring-offset-background focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-ring ui-banshee-w-32"
                >
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months</option>
                </select>
              </div>

              <Button
                onClick={handleAddNewBanshees}
                className="ui-banshee-flex-shrink-0"
              >
                Add New Banshees
              </Button>
            </div>
          </div>

          <div>
            <div className="ui-banshee-flex ui-banshee-h-[50vh] ui-banshee-flex-col ui-banshee-w-full">
              <div className="ui-banshee-bg-neutral-1 ui-banshee-overflow-y-auto ui-banshee-flex-1 ui-banshee-min-h-0">
                <Table variant="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="ui-banshee-px-3 ui-banshee-whitespace-nowrap">
                        <Text variant="small" color="foreground">
                          Details
                        </Text>
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <Text
                          variant="small"
                          color="foreground"
                          className="ui-banshee-w-24"
                        >
                          Status
                        </Text>
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <Text
                          variant="small"
                          color="foreground"
                          className="ui-banshee-w-32"
                        >
                          Banshee
                        </Text>
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <Text
                          variant="small"
                          color="foreground"
                          className="ui-banshee-w-40"
                        >
                          Location
                        </Text>
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <Text
                          variant="small"
                          color="foreground"
                          className="ui-banshee-w-48 ui-banshee-text-left"
                        >
                          Total Elongation (mm)
                        </Text>
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <Text
                          variant="small"
                          color="foreground"
                          className="ui-banshee-w-32"
                        >
                          Last Measured
                        </Text>
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <Text
                          variant="small"
                          color="foreground"
                          className="ui-banshee-w-24"
                        >
                          Period
                        </Text>
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <Text
                          variant="small"
                          color="foreground"
                          className="ui-banshee-w-24"
                        >
                          Due Date
                        </Text>
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap ui-banshee-px-3">
                        <Text variant="small" color="foreground">
                          Suggested
                        </Text>
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <DropdownMultiSelectSearch
                          id="site-filter"
                          placeholder="Site"
                          searchPlaceholder="Search site..."
                          variant="compact"
                          options={SELECT_OPTIONS}
                          selectedIds={selectedFilters}
                          onSelect={(ids) => setSelectedFilters(ids)}
                          className="ui-banshee-w-full"
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banshees.map((banshee) => (
                      <TableRow key={banshee.id}>
                        <TableCell>
                          <button
                            onClick={() => setSelectedBansheeId(banshee.id)}
                            className="ui-banshee-p-1 hover:ui-banshee-bg-neutral-100 ui-banshee-rounded ui-banshee-w-full ui-banshee-h-full ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center"
                          >
                            <Plus size={16} />
                          </button>
                        </TableCell>

                        <TableCell>
                          <div
                            className="ui-banshee-w-4 ui-banshee-h-4 ui-banshee-rounded-full ui-banshee-m-auto"
                            style={{
                              backgroundColor: STATUS_COLORS[banshee.status],
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Text variant="small" color="foreground">
                            {banshee.serialNumber}
                          </Text>
                        </TableCell>

                        <TableCell>
                          <Text variant="small" color="foreground">
                            {banshee.location}
                          </Text>
                        </TableCell>

                        <TableCell>
                          <Text variant="small" color="foreground">
                            {banshee.totalElongation ?? '-'}
                          </Text>
                        </TableCell>

                        <TableCell>
                          <Text variant="small" color="foreground">
                            {banshee.lastMeasured}
                          </Text>
                        </TableCell>

                        <TableCell>
                          <Text variant="small" color="foreground">
                            {banshee.period}
                          </Text>
                        </TableCell>

                        <TableCell>
                          <Text
                            variant="small"
                            color="foreground"
                            className={
                              banshee.isOverdue ? 'ui-banshee-text-red-500' : ''
                            }
                          >
                            {banshee.dueDate}
                          </Text>
                        </TableCell>

                        <TableCell>
                          {banshee.isSuggested && (
                            <Star
                              size={16}
                              className="ui-banshee-text-yellow-500 ui-banshee-m-auto"
                              fill="currentColor"
                            />
                          )}
                        </TableCell>

                        <TableCell>
                          <button
                            onClick={() => handleToggleSelect(banshee.id)}
                            className={`ui-banshee-m-auto ui-banshee-w-5 ui-banshee-h-5 ui-banshee-rounded ui-banshee-border-2 ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ${
                              banshee.isSelected
                                ? 'ui-banshee-bg-blue-600 ui-banshee-border-blue-600'
                                : 'ui-banshee-border-neutral-300'
                            }`}
                          >
                            {banshee.isSelected && (
                              <Check
                                size={14}
                                className="ui-banshee-text-white"
                              />
                            )}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="ui-banshee-flex ui-banshee-justify-end ui-banshee-mt-6">
              <Button
                onClick={handleAddToCart}
                disabled={selectedCount === 0}
                className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-2"
              >
                <CartIcon size={18} />
                Add to cart ({selectedCount})
              </Button>
            </div>
          </div>
        </main>
      </SidebarInset>
      <BansheeDetailModal
        bansheeId={selectedBansheeId}
        onClose={() => setSelectedBansheeId(null)}
      />
    </>
  );
}
