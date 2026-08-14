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
  TooltipTrigger,
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipArrow,
} from '@gsp/ui-banshee';
import { Plus, Check, ShoppingCart as CartIcon } from 'lucide-react';
import { useCompanyRouter } from '@/libs/hooks/useCompanyRouter';
import { BansheeDetailModal } from '@/components/BansheeDetailModal';
import { ConfirmAddToCartModal } from '@/components/ConfirmAddToCartModal';
import { ConfirmAddNewBansheeModal } from '@/components/ConfirmAddNewBansheeModal';
import { HierarchyDropdown } from '@/components/HierarchyDropdown';
import { useHierarchyOptions } from '@/components/Usehierarchyselections';
import { useQuery, useMutation } from 'urql';
import { graphql } from '@/gql';
import {
  BansheeSchedulerListQuery,
  BansheeCartItemType,
  BansheeOrderItemStatus,
} from '@/gql/graphql';
import { handleGraphQLErrors } from '@/libs/utils';
import {
  formatElongation,
  getLatestMeasurement,
} from '@/libs/latest-measurement';
import { getStatusColorHex } from '@/libs/status-color-utils';
import { compareValues, SortableValue } from '@/libs/sort-compare';

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
        name
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
            readingIndex
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

/**
 * Where a banshee already sits in the ordering flow. Anything already in the
 * cart or on a pending order is listed for visibility only — it cannot be
 * ticked, and the bulk-select filters skip it.
 */
type SchedulerStatus =
  | 'IN_CART'
  | 'ORDERED'
  | 'SERVICE_DUE'
  | 'SERVICE_OVERDUE';

const mapSchedulerStatusToMessage = (
  schedulerStatus: SchedulerStatus,
): string => {
  if (schedulerStatus === 'IN_CART') {
    return 'In the Cart';
  } else if (schedulerStatus === 'ORDERED') {
    return 'Scheduled';
  }
  return '';
};
/**
 * Only rows that are not already spoken for can be selected for a new order.
 * Stated as an exclusion so any further service state stays selectable.
 */
const isSelectable = (banshee: Pick<SchedulerBanshee, 'schedulerStatus'>) =>
  banshee.schedulerStatus !== 'IN_CART' &&
  banshee.schedulerStatus !== 'ORDERED';

type SchedulerBanshee = {
  id: string;
  serialNumber: string;
  name: string;
  site: string;
  level: string;
  drive: string;
  location: string;
  totalElongation: string | null;
  lastMeasured: string;
  lastMeasuredTs: number | null;
  period: number | null;
  dueDate: string;
  dueDateTs: number | null;
  status: string | null | undefined;
  schedulerStatus: SchedulerStatus;
  /** Due date has arrived: today or earlier. Overdue rows are also due. */
  isDue: boolean;
  isOverdue: boolean;
  isSelected: boolean;
  isExpanded: boolean;
};

/** Midnight today — anything dated before this is overdue. */
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const transformBansheeRequests = (
  requests: BansheeSchedulerListQuery['bansheeRequests']['results'],
  cartRequestIds: Set<string>,
  pendingOrderRequestIds: Set<string>,
): Omit<SchedulerBanshee, 'isSelected' | 'isExpanded'>[] => {
  const todayStart = startOfToday();
  // A bolt is due once its due date lands on today or earlier, so the cut-off
  // is the start four weeks later.
  const fourWeeksLater = todayStart + 4 * 7 * 24 * 60 * 60 * 1000;

  return requests
    .map((request) => ({
      request,
      ...getLatestMeasurement(request.proceqData),
    }))
    .filter(({ measurement }) => measurement?.status != 'BROKEN')
    .map(
      ({ request, measurement: latestProceqData, reading: latestReading }) => {
        const totalElongation = formatElongation(latestReading);

        const status = latestProceqData?.status;

        const lastMeasuredTs = latestProceqData?.updatedTimestamp
          ? new Date(latestProceqData.updatedTimestamp).getTime()
          : null;
        const lastMeasured =
          lastMeasuredTs != null
            ? new Date(lastMeasuredTs).toLocaleDateString('en-GB')
            : '-';
        const dueDateTs = latestProceqData?.dueDate
          ? new Date(latestProceqData.dueDate).getTime()
          : null;
        const dueDate =
          dueDateTs != null
            ? new Date(dueDateTs).toLocaleDateString('en-GB')
            : '-';
        const isOverdue = dueDateTs != null && dueDateTs < todayStart;
        return {
          id: request.id,
          serialNumber: request.serialNumber ?? '-',
          name: request.name ?? '-',
          site: request.site?.siteName ?? '-',
          level: request.level?.levelName ?? '-',
          drive: request.drive?.driveName ?? '-',
          location: request.location?.locationName ?? '-',
          totalElongation,
          period: request.period ?? null,
          lastMeasured,
          lastMeasuredTs,
          dueDate, // Not available in API
          dueDateTs,
          status,
          schedulerStatus: cartRequestIds.has(request.id)
            ? 'IN_CART'
            : pendingOrderRequestIds.has(request.id)
              ? 'ORDERED'
              : isOverdue
                ? 'SERVICE_OVERDUE'
                : 'SERVICE_DUE',
          isDue: dueDateTs != null && dueDateTs < fourWeeksLater,
          isOverdue,
        };
      },
    );
};

// 'Select suggested' is intentionally absent: the API exposes no suggestion
// signal, so there is nothing to match on. Re-add it once it does.
type SelectOption = 'all' | 'due' | 'overdue' | 'others';

const SELECT_OPTIONS: { id: SelectOption; name: string }[] = [
  { id: 'all', name: 'Select all' },
  { id: 'due', name: 'Select due (4 Weeks)' },
  { id: 'overdue', name: 'Select overdue' },
  { id: 'others', name: 'Select others' },
];

/**
 * Which rows the header's bulk-select dropdown should tick. Chosen options are
 * OR-ed together; an empty list selects nothing (so confirming with everything
 * cleared deselects the table).
 */
const matchesSelectFilters = (
  banshee: Pick<SchedulerBanshee, 'isDue' | 'isOverdue'>,
  filters: string[],
): boolean => {
  if (filters.length === 0) return false;
  if (filters.includes('all')) return true;

  return filters.some((filter) => {
    switch (filter as SelectOption) {
      case 'due':
        return banshee.isDue;
      case 'overdue':
        return banshee.isOverdue;
      // Everything the due cut-off leaves out: no due date, or due in future.
      case 'others':
        return !banshee.isDue;
      default:
        return false;
    }
  });
};

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
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    'overdue',
    'due',
  ]);
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

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'dueDate',
    direction: 'desc',
  });

  const sortedEntries = useMemo(() => {
    const sortable = [...banshees];

    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        // For date columns sort by the raw timestamp, not the localized
        // display string (DD/MM/YYYY is not parseable by `new Date`).
        const sortKey: keyof SchedulerBanshee =
          sortConfig.key === 'dueDate'
            ? 'dueDateTs'
            : sortConfig.key === 'lastMeasured'
              ? 'lastMeasuredTs'
              : sortConfig.key;

        return compareValues(
          a[sortKey] as SortableValue,
          b[sortKey] as SortableValue,
          sortConfig.direction,
        );
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
  // Only the site is required here, so the lower dropdowns list everything
  // under the nearest selected ancestor instead of waiting on their parent.
  const { levels, drives, locations } = useHierarchyOptions(
    sites,
    { siteId, levelId, driveId },
    { allowUnparentedSelection: true },
  );

  const handleSiteChange = (id: string | null) => {
    setSiteId(id || null);
    setLevelId(null);
    setDriveId(null);
    setLocationId(null);
  };
  const handleLevelChange = (id: string | null) => {
    setLevelId(id || null);
    setDriveId(null);
    setLocationId(null);
  };
  const handleDriveChange = (id: string | null) => {
    setDriveId(id || null);
    setLocationId(null);
  };
  const handleLocationChange = (id: string | null) => {
    setLocationId(id || null);
  };

  const selectedCount = useMemo(
    () => banshees.filter((b) => b.isSelected).length,
    [banshees],
  );

  const handleToggleSelect = (id: string) => {
    setBanshees((prev) =>
      prev.map((b) =>
        b.id === id && isSelectable(b)
          ? { ...b, isSelected: !b.isSelected }
          : b,
      ),
    );
  };

  const handleAddNewBanshees = () => {
    if (!siteId) {
      return;
    }
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
  // Every banshee is listed; the ones already in the cart or on a pending order
  // are marked by their status tag rather than hidden.
  const bansheeRequests = useMemo(
    () => data?.bansheeRequests?.results ?? [],
    [data?.bansheeRequests?.results],
  );

  // Transform API data to scheduler format when data changes. Also re-runs when
  // the header's bulk-select changes, applying it as a fresh selection (which
  // discards any per-row ticks — that is what picking "Select due" means).
  useEffect(() => {
    const transformedData = transformBansheeRequests(
      bansheeRequests,
      cartBansheeRequestIds,
      pendingOrderBansheeRequestIds,
    );
    setBanshees(
      transformedData.map((b) => ({
        ...b,
        // Rows already in the cart or on a pending order stay untouched by the
        // due/overdue bulk-select.
        isSelected: isSelectable(b) && matchesSelectFilters(b, selectedFilters),
        isExpanded: false,
      })),
    );
  }, [
    bansheeRequests,
    selectedFilters,
    cartBansheeRequestIds,
    pendingOrderBansheeRequestIds,
  ]);

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

            <div className="ui-banshee-flex ui-banshee-gap-4 ui-banshee-items-end ui-banshee-flex-wrap ui-banshee-bg-neutral-1 ui-banshee-p-4 ui-banshee-border-t ui-banshee-border-b ui-banshee-border-neutral-3">
              <div className="ui-banshee-flex-shrink-0">
                <p className="ui-banshee-mb-2 ui-banshee-font-sandvik-text ui-banshee-text-md ui-banshee-tracking-wide ui-banshee-main-black ui-banshee-font-medium">
                  Quantity
                </p>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="20 (suggested quantity)"
                  className="ui-banshee-flex ui-banshee-h-12 ui-banshee-w-48 ui-banshee-rounded-md ui-banshee-border ui-banshee-border-neutral-3 ui-banshee-bg-background ui-banshee-px-3 ui-banshee-py-2 ui-banshee-text-md ui-banshee-ring-offset-background file:ui-banshee-border-0 file:ui-banshee-bg-transparent file:ui-banshee-text-sm file:ui-banshee-font-medium placeholder:ui-banshee-text-muted-foreground focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-ring focus-visible:ui-banshee-ring-offset-2 disabled:ui-banshee-cursor-not-allowed disabled:ui-banshee-opacity-50"
                />
              </div>

              <div className="ui-banshee-flex-1 ui-banshee-min-w-[200px]">
                <p className="ui-banshee-mb-2 ui-banshee-font-sandvik-text ui-banshee-text-md ui-banshee-tracking-wide ui-banshee-text-main-black ui-banshee-font-medium">
                  Name
                </p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name (optional)"
                  className="ui-banshee-flex ui-banshee-h-12 ui-banshee-w-full ui-banshee-rounded-md ui-banshee-border ui-banshee-border-neutral-3 ui-banshee-bg-background ui-banshee-px-3 ui-banshee-py-2 ui-banshee-text-md ui-banshee-ring-offset-background file:ui-banshee-border-0 file:ui-banshee-bg-transparent file:ui-banshee-text-sm file:ui-banshee-font-medium placeholder:ui-banshee-text-muted-foreground focus-visible:ui-banshee-outline-none focus-visible:ui-banshee-ring-2 focus-visible:ui-banshee-ring-ring focus-visible:ui-banshee-ring-offset-2 disabled:ui-banshee-cursor-not-allowed disabled:ui-banshee-opacity-50"
                />
              </div>

              <div className="ui-banshee-flex-1 ui-banshee-min-w-[160px]">
                <HierarchyDropdown
                  id="scheduler-site-dropdown"
                  label="Site *"
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
                <p className="ui-banshee-mb-2 ui-banshee-font-sandvik-text ui-banshee-text-md ui-banshee-tracking-wide ui-banshee-text-main-black ui-banshee-font-medium">
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
                disabled={!siteId}
                onClick={handleAddNewBanshees}
                className="ui-banshee-flex-shrink-0 ui-banshee-h-12"
              >
                Add New Banshees
              </Button>
            </div>
          </div>

          <div>
            <div className="ui-banshee-flex ui-banshee-h-[65vh] ui-banshee-flex-col ui-banshee-w-full">
              <div className="ui-banshee-bg-neutral-1 ui-banshee-overflow-y-auto ui-banshee-flex-1 ui-banshee-min-h-0">
                <Table variant="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="ui-banshee-px-3 ui-banshee-whitespace-nowrap">
                        <Text variant="medium" color="foreground">
                          Details
                        </Text>
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Status"
                          className="ui-banshee-w-32 ui-banshee-text-md ui-banshee-m-auto"
                          column={createMockColumn('status')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Banshee"
                          className="ui-banshee-w-56 !ui-banshee-justify-start ui-banshee-text-md"
                          column={createMockColumn('name')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Site"
                          className="ui-banshee-w-40 !ui-banshee-justify-start ui-banshee-text-md"
                          column={createMockColumn('site')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Level"
                          className="ui-banshee-w-40 !ui-banshee-justify-start ui-banshee-text-md"
                          column={createMockColumn('level')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Drive"
                          className="ui-banshee-w-40 !ui-banshee-justify-start ui-banshee-text-md"
                          column={createMockColumn('drive')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Location"
                          className="ui-banshee-w-40 !ui-banshee-justify-start ui-banshee-text-md"
                          column={createMockColumn('location')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Total Elongation (mm)"
                          className="ui-banshee-w-56 !ui-banshee-justify-start ui-banshee-text-md"
                          column={createMockColumn('totalElongation')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Last Measured"
                          className="ui-banshee-w-48 !ui-banshee-justify-start ui-banshee-text-md"
                          column={createMockColumn('lastMeasured')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Period (Months)"
                          className="ui-banshee-w-48 !ui-banshee-justify-start ui-banshee-text-md"
                          column={createMockColumn('period')}
                        />
                      </TableHead>
                      <TableHead className="ui-banshee-whitespace-nowrap">
                        <TableHeadWithSorting
                          header="Due Date"
                          className="ui-banshee-w-24 !ui-banshee-justify-start ui-banshee-text-md"
                          column={createMockColumn('dueDate')}
                        />
                      </TableHead>
                      {/* `flex` used to come from TableHead's last-child rule;
                          the Status column now holds that slot. */}
                      <TableHead className="ui-banshee-whitespace-nowrap ui-banshee-flex ui-banshee-justify-center">
                        <DropdownMultiSelectSearch
                          id="site-filter"
                          placeholder="Select"
                          searchPlaceholder="Search filter..."
                          variant="compact"
                          options={SELECT_OPTIONS}
                          selectedIds={selectedFilters}
                          onSelect={(ids) => setSelectedFilters(ids)}
                          className="ui-banshee-gap-1 !ui-banshee-bg-white !hover:ui-banshee-bg-main-white/50"
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedEntries.map((banshee) => (
                      <TableRow key={banshee.id}>
                        <TableCell className="ui-banshee-bg-neutral-2">
                          <button
                            onClick={() => setSelectedBansheeId(banshee.id)}
                            className="ui-banshee-p-1 hover:ui-banshee-bg-neutral-100 ui-banshee-rounded ui-banshee-w-full ui-banshee-h-full ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center"
                          >
                            <Plus size={16} />
                          </button>
                        </TableCell>

                        <TableCell
                          className={
                            !isSelectable(banshee)
                              ? 'ui-banshee-bg-neutral-1-5'
                              : ''
                          }
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="ui-banshee-inline-block ui-banshee-w-4 ui-banshee-h-4 ui-banshee-rounded-full ui-banshee-cursor-pointer"
                                  style={{
                                    backgroundColor: getStatusColorHex(
                                      banshee.status,
                                    ),
                                  }}
                                />
                              </TooltipTrigger>

                              <TooltipContent>
                                {banshee?.status
                                  ?.toLowerCase()
                                  .split('_')
                                  .map(
                                    (word) =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1),
                                  )
                                  .join(' ')}
                                <TooltipArrow />
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>

                        <TableCell
                          className={
                            !isSelectable(banshee)
                              ? 'ui-banshee-bg-neutral-1-5'
                              : ''
                          }
                        >
                          <Text
                            variant="medium"
                            color={
                              isSelectable(banshee) ? 'foreground' : 'muted'
                            }
                          >
                            {banshee.name}
                          </Text>
                        </TableCell>

                        <TableCell
                          className={
                            !isSelectable(banshee)
                              ? 'ui-banshee-bg-neutral-1-5'
                              : ''
                          }
                        >
                          <Text
                            variant="medium"
                            color={
                              isSelectable(banshee) ? 'foreground' : 'muted'
                            }
                          >
                            {banshee.site}
                          </Text>
                        </TableCell>
                        <TableCell
                          className={
                            !isSelectable(banshee)
                              ? 'ui-banshee-bg-neutral-1-5'
                              : ''
                          }
                        >
                          <Text
                            variant="medium"
                            color={
                              isSelectable(banshee) ? 'foreground' : 'muted'
                            }
                          >
                            {banshee.level}
                          </Text>
                        </TableCell>
                        <TableCell
                          className={
                            !isSelectable(banshee)
                              ? 'ui-banshee-bg-neutral-1-5'
                              : ''
                          }
                        >
                          <Text
                            variant="medium"
                            color={
                              isSelectable(banshee) ? 'foreground' : 'muted'
                            }
                          >
                            {banshee.drive}
                          </Text>
                        </TableCell>
                        <TableCell
                          className={
                            !isSelectable(banshee)
                              ? 'ui-banshee-bg-neutral-1-5'
                              : ''
                          }
                        >
                          <Text
                            variant="medium"
                            color={
                              isSelectable(banshee) ? 'foreground' : 'muted'
                            }
                          >
                            {banshee.location}
                          </Text>
                        </TableCell>

                        <TableCell
                          className={
                            !isSelectable(banshee)
                              ? 'ui-banshee-bg-neutral-1-5'
                              : ''
                          }
                        >
                          <Text
                            variant="medium"
                            color={
                              isSelectable(banshee) ? 'foreground' : 'muted'
                            }
                          >
                            {banshee.totalElongation ?? '-'}
                          </Text>
                        </TableCell>

                        <TableCell
                          className={
                            !isSelectable(banshee)
                              ? 'ui-banshee-bg-neutral-1-5'
                              : ''
                          }
                        >
                          <Text
                            variant="medium"
                            color={
                              isSelectable(banshee) ? 'foreground' : 'muted'
                            }
                          >
                            {banshee.lastMeasured}
                          </Text>
                        </TableCell>

                        <TableCell
                          className={
                            !isSelectable(banshee)
                              ? 'ui-banshee-bg-neutral-1-5'
                              : ''
                          }
                        >
                          <Text
                            variant="medium"
                            color={
                              isSelectable(banshee) ? 'foreground' : 'muted'
                            }
                          >
                            {banshee.period}
                          </Text>
                        </TableCell>

                        <TableCell
                          className={
                            !isSelectable(banshee)
                              ? 'ui-banshee-bg-neutral-1-5'
                              : ''
                          }
                        >
                          {/* Overdue is only worth flagging while the row still
                              needs action — once it is in the cart or on a
                              pending order, its status tag says so instead. */}
                          <Text
                            variant="medium"
                            color={
                              !isSelectable(banshee)
                                ? 'muted'
                                : banshee.isOverdue
                                  ? 'destructive'
                                  : 'foreground'
                            }
                          >
                            {banshee.dueDate}
                          </Text>
                        </TableCell>

                        <TableCell
                          className={
                            !isSelectable(banshee)
                              ? 'ui-banshee-bg-neutral-1-5'
                              : ''
                          }
                        >
                          {isSelectable(banshee) ? (
                            <button
                              onClick={() => handleToggleSelect(banshee.id)}
                              className={`ui-banshee-m-auto ui-banshee-w-5 ui-banshee-h-5 ui-banshee-rounded ui-banshee-border-2 ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center disabled:ui-banshee-cursor-not-allowed ${
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
                          ) : (
                            <Text
                              variant="medium"
                              color={
                                isSelectable(banshee) ? 'foreground' : 'muted'
                              }
                              className="ui-banshee-text-center"
                            >
                              {mapSchedulerStatusToMessage(
                                banshee.schedulerStatus,
                              )}
                            </Text>
                          )}
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
