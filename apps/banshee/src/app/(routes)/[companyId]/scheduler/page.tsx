'use client';

import React, { useState, useMemo, useEffect, ComponentProps } from 'react';
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
  Dropdown,
  showAlertToast,
  LoadingSpinner,
  TableHeadWithSorting,
} from '@gsp/ui-banshee';
import { Plus, Star, Check, ShoppingCart as CartIcon } from 'lucide-react';
import { useCompanyRouter } from '@/libs/hooks/useCompanyRouter';
import { BansheeDetailModal } from '@/components/BansheeDetailModal';
import { ConfirmAddToCartModal } from '@/components/ConfirmAddToCartModal';
import { ConfirmAddNewBansheeModal } from '@/components/ConfirmAddNewBansheeModal';
import { HierarchyDropdown } from '@/components/HierarchyDropdown';
import { useQuery, useMutation } from 'urql';
import { graphql } from '@/gql';
import {
  BansheeSchedulerListQuery,
  BansheeCartItemType,
  BansheeOrderItemStatus,
  ProceqStatus,
} from '@/gql/graphql';
import { handleGraphQLErrors } from '@/libs/utils';

const schedulerHierarchyQuery = graphql(`
  query TemplateHierarchy($companyId: String!) {
    company(id: $companyId) {
      id
      sites {
        id
        siteName
        levels {
          id
          levelName
          drives {
            id
            driveName
            locations {
              id
              locationName
            }
          }
        }
      }
    }
  }
`);

const schedulerCartItemsQuery = graphql(`
  query cartItems($companyId: String!) {
    cartItems(companyId: $companyId) {
      id
      itemType
      name
      quantity
      bansheeRequestId
      location {
        locationName
      }
      bansheeRequest {
        serialNumber
        location {
          locationName
        }
      }
    }
  }
`);

const schedulerOrdersQuery = graphql(`
  query schedulerOrders($filter: OrderFilterInput, $limit: Int) {
    orders(filter: $filter, limit: $limit) {
      results {
        id
        orderItems {
          id
          status
          bansheeRequestId
        }
      }
    }
  }
`);

const addCartItemsMutation = graphql(`
  mutation addCartItems($input: [AddCartItemInput!]!) {
    addCartItems(input: $input) {
      added {
        id
        itemType
      }
      skipped {
        bansheeRequestId
        serialNumber
        reason
      }
    }
  }
`);

//TODO : need to change it measured true
const bansheeSchedulerList = graphql(`
  query bansheeSchedulerList($companyId: String) {
    bansheeRequests(limit: 100, companyId: $companyId) {
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

type ColumnProp = ComponentProps<typeof TableHeadWithSorting>['column'];

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
];

const PERIOD_OPTIONS = [
  { id: '1', name: '1 Month' },
  { id: '3', name: '3 Months' },
  { id: '6', name: '6 Months' },
  { id: '12', name: '12 Months' },
];

type SortConfig = {
  key: keyof SchedulerBanshee;
  direction: 'asc' | 'desc';
} | null;

export default function SchedulerPage({
  params,
}: {
  params: { companyId: string };
}) {
  const { companyId } = params;
  const router = useCompanyRouter();
  // Form state
  const [quantity, setQuantity] = useState('20');
  const [name, setName] = useState('');
  const [siteId, setSiteId] = useState<string | null>(null);
  const [levelId, setLevelId] = useState<string | null>(null);
  const [driveId, setDriveId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [period, setPeriod] = useState('3');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedBansheeId, setSelectedBansheeId] = useState<string | null>(
    null,
  );

  const [banshees, setBanshees] = useState<SchedulerBanshee[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNewBansheeModal, setShowNewBansheeModal] = useState(false);
  const [isSubmittingCart, setIsSubmittingCart] = useState(false);
  const [isSubmittingNewBanshee, setIsSubmittingNewBanshee] = useState(false);

  const [, executeAddCartItems] = useMutation(addCartItemsMutation);

  const [{ data: cartData, error: cartItemsError }, reexecuteCartItems] =
    useQuery({
      query: schedulerCartItemsQuery,
      variables: { companyId },
      requestPolicy: 'cache-and-network',
    });

  useEffect(() => {
    handleGraphQLErrors(cartItemsError);
  }, [cartItemsError]);

  const cartBansheeRequestIds = useMemo(
    () =>
      new Set(
        (cartData?.cartItems ?? [])
          .map((item) => item.bansheeRequestId)
          .filter((id): id is string => Boolean(id)),
      ),
    [cartData?.cartItems],
  );

  const [{ data: ordersData, error: ordersError }] = useQuery({
    query: schedulerOrdersQuery,
    variables: { filter: { companyId }, limit: 1000 },
    requestPolicy: 'cache-and-network',
  });

  useEffect(() => {
    handleGraphQLErrors(ordersError);
  }, [ordersError]);

  // Banshees already committed to a PENDING order item should not reappear
  // in the scheduler (their cart entry is deleted once the order is submitted).
  const pendingOrderBansheeRequestIds = useMemo(
    () =>
      new Set(
        (ordersData?.orders?.results ?? [])
          .flatMap((order) => order.orderItems ?? [])
          .filter((item) => item.status === BansheeOrderItemStatus.Pending)
          .map((item) => item.bansheeRequestId)
          .filter((id): id is string => Boolean(id)),
      ),
    [ordersData?.orders?.results],
  );

  const [{ data: hierarchyData, error: hierarchyError }] = useQuery({
    query: schedulerHierarchyQuery,
    variables: { companyId },
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const sortedEntries = useMemo(() => {
    const sortable = [...banshees];

    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        let aValue: string | number =
          a[sortConfig.key] == null
            ? ''
            : (a[sortConfig.key] as string | number);

        let bValue: string | number =
          b[sortConfig.key] == null
            ? ''
            : (b[sortConfig.key] as string | number);

        if (sortConfig.key === 'dueDate' || sortConfig.key === 'lastMeasured') {
          aValue =
            aValue && typeof aValue !== 'boolean'
              ? new Date(aValue).getTime()
              : 0;

          bValue =
            bValue && typeof bValue !== 'boolean'
              ? new Date(bValue).getTime()
              : 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;

        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;

        return 0;
      });
    }

    return sortable;
  }, [banshees, sortConfig]);

  const requestSort = (key: keyof SchedulerBanshee) => {
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

  const createMockColumn = (key: keyof SchedulerBanshee) =>
    ({
      getIsSorted: () =>
        sortConfig?.key === key ? sortConfig.direction : false,
      toggleSorting: () => requestSort(key),
    }) as ColumnProp;

  useEffect(() => {
    handleGraphQLErrors(hierarchyError);
  }, [hierarchyError]);

  const sites = useMemo(
    () => hierarchyData?.company?.sites ?? [],
    [hierarchyData?.company?.sites],
  );
  const levels = useMemo(() => {
    if (siteId) return sites.find((s) => s.id === siteId)?.levels ?? [];
    return sites.flatMap((s) => s.levels ?? []);
  }, [sites, siteId]);
  const drives = useMemo(() => {
    if (levelId) return levels.find((l) => l.id === levelId)?.drives ?? [];
    return levels.flatMap((l) => l.drives ?? []);
  }, [levels, levelId]);
  const locations = useMemo(() => {
    if (driveId) return drives.find((d) => d.id === driveId)?.locations ?? [];
    return drives.flatMap((d) => d.locations ?? []);
  }, [drives, driveId]);

  const handleSiteChange = (id: string) => {
    setSiteId(id || null);
    setLevelId(null);
    setDriveId(null);
    setLocationId(null);
  };
  const handleLevelChange = (id: string) => {
    setLevelId(id || null);
    setDriveId(null);
    setLocationId(null);
  };
  const handleDriveChange = (id: string) => {
    setDriveId(id || null);
    setLocationId(null);
  };
  const handleLocationChange = (id: string) => {
    setLocationId(id || null);
  };

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
    setShowNewBansheeModal(true);
  };

  const handleConfirmAddNewBanshees = async () => {
    const qty = parseInt(quantity, 10) || 1;
    setIsSubmittingNewBanshee(true);

    try {
      const result = await executeAddCartItems({
        input: [
          {
            itemType: BansheeCartItemType.NewBanshee,
            name: name || undefined,
            siteId: siteId ?? undefined,
            levelId: levelId ?? undefined,
            driveId: driveId ?? undefined,
            locationId: locationId ?? undefined,
            quantity: qty,
            period: period ? parseInt(period, 10) || undefined : undefined,
            companyId,
          },
        ],
      });

      if (handleGraphQLErrors(result.error)) return false;

      if (result.error) {
        showAlertToast({
          title: 'Failed to add new banshees',
          description: 'Please try again or contact support.',
          variant: 'error',
        });
        return false;
      }

      showAlertToast({
        title: `${qty} new banshee${qty > 1 ? 's' : ''} added to cart`,
        variant: 'success',
      });

      reexecuteCartItems({ requestPolicy: 'network-only' });
      return true;
    } finally {
      setIsSubmittingNewBanshee(false);
      setQuantity('2');
      setName('');
      setSiteId(null);
      setLevelId(null);
      setDriveId(null);
      setLocationId(null);
      setQuantity('20');
    }
  };

  const handleAddToCart = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmAddToCart = async () => {
    setIsSubmittingCart(true);

    try {
      const selectedBanshees = banshees.filter((b) => b.isSelected);

      const result = await executeAddCartItems({
        input: selectedBanshees.map((b) => ({
          itemType: BansheeCartItemType.ServiceExisting,
          bansheeRequestId: b.id,
          companyId,
        })),
      });

      if (handleGraphQLErrors(result.error)) {
        return false;
      }

      const response = result.data?.addCartItems;

      const skipped = response?.skipped ?? [];
      const added = response?.added ?? [];

      if (skipped.length > 0) {
        showAlertToast({
          title: `${skipped.length} item(s) could not be added`,
          description: skipped
            .slice(0, 3)
            .map((s) => `${s.serialNumber} — ${s.reason}`)
            .join('\n'),
          variant: 'warning',
        });
      }

      if (added.length === 0) {
        return false;
      }

      showAlertToast({
        title: `${added.length} item${added.length > 1 ? 's' : ''} added to cart`,
        variant: 'success',
      });

      setShowConfirmModal(false);
      reexecuteCartItems({ requestPolicy: 'network-only' });
      router.push('/cart');

      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);

      showAlertToast({
        title: 'Failed to add items to cart',
        variant: 'error',
      });

      return false;
    } finally {
      setIsSubmittingCart(false);
    }
  };

  const [{ data, fetching, error: schedulerListError }] = useQuery({
    query: bansheeSchedulerList,
    variables: {
      companyId,
    },
  });

  useEffect(() => {
    handleGraphQLErrors(schedulerListError);
  }, [schedulerListError]);
  const bansheeRequests = useMemo(
    () =>
      (data?.bansheeRequests?.results ?? []).filter(
        (r) =>
          !cartBansheeRequestIds.has(r.id) &&
          !pendingOrderBansheeRequestIds.has(r.id),
      ),
    [
      data?.bansheeRequests?.results,
      cartBansheeRequestIds,
      pendingOrderBansheeRequestIds,
    ],
  );

  // Transform API data to scheduler format when data changes
  useEffect(() => {
    const transformedData = transformBansheeRequests(bansheeRequests);
    setBanshees(
      transformedData.map((b) => ({
        ...b,
        isSelected: false,
        isExpanded: false,
      })),
    );
  }, [bansheeRequests]);

  if (fetching) {
    return (
      <div className="ui-banshee-w-full ui-banshee-p-8 ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-3 ui-banshee-text-gray-500">
        <LoadingSpinner />
        <Text variant="medium" color="muted">
          Loading banshee list...
        </Text>
      </div>
    );
  }

  return (
    <>
      <SidebarInset>
        <main className="ui-banshee-flex ui-banshee-gap-5 ui-banshee-flex-col ui-banshee-min-h-screen ui-banshee-p-7 ui-banshee-pr-0">
          <div className="ui-banshee-flex ui-banshee-gap-3 ui-banshee-flex-col ui-banshee-bg-white ui-banshee-border-b">
            <Headline as="h1" variant="small" color="foreground">
              New Banshee
            </Headline>

            <div className="ui-banshee-flex ui-banshee-gap-4 ui-banshee-items-end ui-banshee-flex-wrap ui-banshee-bg-[#F8F8F8] ui-banshee-p-4 ui-banshee-border-t ui-banshee-border-b ui-banshee-border-[#DADADA]">
              <div className="ui-banshee-flex-shrink-0">
                <p className="ui-banshee-mb-2 ui-banshee-font-sandvik-text ui-banshee-text-sm ui-banshee-tracking-wide ui-banshee-text-neutral-5 ui-banshee-font-medium">
                  Quantity
                </p>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="20 (suggested quantity)"
                  className="ui-banshee-flex ui-banshee-h-12 ui-banshee-w-48 ui-banshee-rounded-md ui-banshee-border ui-banshee-border-[#DADADA] ui-banshee-bg-background ui-banshee-px-3 ui-banshee-py-2 ui-banshee-text-sm ui-banshee-ring-offset-background file:ui-banshee-border-0 file:ui-banshee-bg-transparent file:ui-banshee-text-sm file:ui-banshee-font-medium placeholder:ui-banshee-text-muted-foreground focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-ring focus-visible:ui-banshee-ring-offset-2 disabled:ui-banshee-cursor-not-allowed disabled:ui-banshee-opacity-50"
                />
              </div>

              <div className="ui-banshee-flex-1 ui-banshee-min-w-[200px]">
                <p className="ui-banshee-mb-2 ui-banshee-font-sandvik-text ui-banshee-text-sm ui-banshee-tracking-wide ui-banshee-text-neutral-5 ui-banshee-font-medium">
                  Name
                </p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name (optional)"
                  className="ui-banshee-flex ui-banshee-h-12 ui-banshee-w-full ui-banshee-rounded-md ui-banshee-border ui-banshee-border-[#DADADA] ui-banshee-bg-background ui-banshee-px-3 ui-banshee-py-2 ui-banshee-text-sm ui-banshee-ring-offset-background file:ui-banshee-border-0 file:ui-banshee-bg-transparent file:ui-banshee-text-sm file:ui-banshee-font-medium placeholder:ui-banshee-text-muted-foreground focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-ring focus-visible:ui-banshee-ring-offset-2 disabled:ui-banshee-cursor-not-allowed disabled:ui-banshee-opacity-50"
                />
              </div>

              <div className="ui-banshee-flex-1 ui-banshee-min-w-[160px]">
                <HierarchyDropdown
                  id="scheduler-site-dropdown"
                  label="Site"
                  placeholder="Select site"
                  options={sites.map((s) => ({
                    id: s.id,
                    name: s.siteName,
                  }))}
                  selectedId={siteId ?? ''}
                  onSelect={handleSiteChange}
                />
              </div>

              <div className="ui-banshee-flex-1 ui-banshee-min-w-[160px]">
                <HierarchyDropdown
                  id="scheduler-level-dropdown"
                  label="Level"
                  placeholder="Select level"
                  options={levels.map((l) => ({
                    id: l.id,
                    name: l.levelName,
                  }))}
                  selectedId={levelId ?? ''}
                  onSelect={handleLevelChange}
                />
              </div>

              <div className="ui-banshee-flex-1 ui-banshee-min-w-[160px]">
                <HierarchyDropdown
                  id="scheduler-drive-dropdown"
                  label="Drive"
                  placeholder="Select drive"
                  options={drives.map((d) => ({
                    id: d.id,
                    name: d.driveName,
                  }))}
                  selectedId={driveId ?? ''}
                  onSelect={handleDriveChange}
                />
              </div>

              <div className="ui-banshee-flex-1 ui-banshee-min-w-[160px]">
                <HierarchyDropdown
                  id="scheduler-location-dropdown"
                  label="Location"
                  placeholder="Select location"
                  options={locations.map((l) => ({
                    id: l.id,
                    name: l.locationName,
                  }))}
                  selectedId={locationId ?? ''}
                  onSelect={handleLocationChange}
                />
              </div>

              <div className="ui-banshee-flex-shrink-0 ui-banshee-w-40">
                <p className="ui-banshee-mb-2 ui-banshee-font-sandvik-text ui-banshee-text-sm ui-banshee-tracking-wide ui-banshee-text-neutral-5 ui-banshee-font-medium">
                  Duration
                </p>
                <Dropdown
                  id="scheduler-period-dropdown"
                  placeholder="Select period"
                  options={PERIOD_OPTIONS}
                  selectedId={period}
                  onSelect={(id) => setPeriod(id ?? '')}
                  className="ui-banshee-border ui-banshee-border-neutral-3 ui-banshee-rounded ui-banshee-h-12"
                />
              </div>

              <Button
                onClick={handleAddNewBanshees}
                className="ui-banshee-flex-shrink-0 ui-banshee-h-12"
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
                        <TableHeadWithSorting
                          header="Status"
                          className="ui-banshee-w-24"
                          column={createMockColumn('status')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Banshee"
                          className="ui-banshee-w-32 !ui-banshee-justify-start"
                          column={createMockColumn('serialNumber')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Location"
                          className="ui-banshee-w-40 !ui-banshee-justify-start"
                          column={createMockColumn('location')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Total Elongation (mm)"
                          className="ui-banshee-w-48 !ui-banshee-justify-start"
                          column={createMockColumn('totalElongation')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Last Measured"
                          className="ui-banshee-w-32 !ui-banshee-justify-start"
                          column={createMockColumn('lastMeasured')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Period"
                          className="ui-banshee-w-24 !ui-banshee-justify-start"
                          column={createMockColumn('period')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Due Date"
                          className="ui-banshee-w-24 !ui-banshee-justify-start"
                          column={createMockColumn('dueDate')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap ui-banshee-px-3">
                        <TableHeadWithSorting
                          header="Suggested"
                          className="!ui-banshee-justify-start"
                          column={createMockColumn('isSuggested')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <DropdownMultiSelectSearch
                          id="site-filter"
                          placeholder="Select"
                          searchPlaceholder="Search filter..."
                          variant="compact"
                          options={SELECT_OPTIONS}
                          selectedIds={selectedFilters}
                          onSelect={(ids) => setSelectedFilters(ids)}
                          className="ui-banshee-w-full !ui-banshee-bg-white !hover:ui-banshee-bg-main-white/50"
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedEntries.map((banshee) => (
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
                variant="primary"
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
      <ConfirmAddToCartModal
        isOpen={showConfirmModal}
        selectedBanshees={banshees
          .filter((b) => b.isSelected)
          .map((b) => ({
            id: b.id,
            serialNumber: b.serialNumber,
            location: b.location,
          }))}
        isLoading={isSubmittingCart}
        onClose={() => setShowConfirmModal(false)}
        onOpenChange={setShowConfirmModal}
        onConfirm={handleConfirmAddToCart}
      />
      <ConfirmAddNewBansheeModal
        isOpen={showNewBansheeModal}
        name={name}
        quantity={parseInt(quantity, 10) || 1}
        isLoading={isSubmittingNewBanshee}
        onClose={() => setShowNewBansheeModal(false)}
        onOpenChange={setShowNewBansheeModal}
        onConfirm={handleConfirmAddNewBanshees}
      />
      <BansheeDetailModal
        bansheeId={selectedBansheeId}
        onClose={() => setSelectedBansheeId(null)}
      />
    </>
  );
}
