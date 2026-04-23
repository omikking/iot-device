'use client';
import {
  Text,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableHeadWithSorting,
  DropdownMultiSelectSearch,
} from '@gsp/ui-banshee';
import { Settings, BarChart2, MessageSquare } from 'lucide-react';
import { BansheeDetailModal } from './BansheeDetailModal';
import { useState, useMemo, ComponentProps } from 'react';
import { useCompanyRouter } from '@/libs/hooks/useCompanyRouter';
import { BansheeListCommentModal } from './BansheeListCommentModal';
import { getStatusColorHex } from '@/libs/status-color-utils';

type ColumnProp = ComponentProps<typeof TableHeadWithSorting>['column'];

type EventLog = {
  createdAt?: string | null;
  eventType?: string | null;
  previousStatus?: string | null;
  newStatus?: string | null;
};

type ProceqReading = {
  elongation?: number | null;
  status?: string | null;
};

type ProceqData = {
  status?: string | null;
  createdTimestamp?: string | null;
  updatedTimestamp?: string | null;
  readings?: ProceqReading[] | null;
};

type BansheeRequestEntry = {
  id: string;
  serialNumber?: string | null;
  site?: { siteName?: string | null } | null;
  drive?: { driveName?: string | null } | null;
  level?: { levelName?: string | null } | null;
  location?: { locationName?: string | null } | null;
  comment?: string | null;
  proceqData?: ProceqData[] | null;
  eventLogs?: EventLog[] | null;
};

type BansheeRow = {
  id: string;
  banshee: string | null | undefined;
  site: string;
  drive: string;
  level: string;
  location: string;
  status: string;
  elongation: string;
  lastMeasured: string;
  statusChange: 'Yes' | 'No';
  comment: 'icon' | 'N/A';
  fullComment: string | null;
};

type FilterState = {
  banshee: string[];
  site: string[];
  level: string[];
  drive: string[];
  location: string[];
};

const applyFilter = (
  entries: BansheeRequestEntry[],
  ids: string[],
  getValue: (e: BansheeRequestEntry) => string | null | undefined,
): BansheeRequestEntry[] =>
  ids.length === 0
    ? entries
    : entries.filter((e) => ids.includes(getValue(e) ?? ''));

export const BansheeListView = ({
  entries,
  loading,
}: {
  entries?: BansheeRequestEntry[];
  loading?: boolean;
}) => {
  const router = useCompanyRouter();
  const [selectedBansheeId, setSelectedBansheeId] = useState<string | null>(
    null,
  );
  const [selectedComment, setSelectedComment] = useState<{
    banshee: string | null;
    comment: string | null;
  } | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    banshee: [],
    site: [],
    level: [],
    drive: [],
    location: [],
  });
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const requestSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const createMockColumn = (key: string): ColumnProp =>
    ({
      getIsSorted: () =>
        sortConfig?.key === key ? sortConfig.direction : false,
      toggleSorting: () => requestSort(key),
    }) as ColumnProp;

  const buildOptions = (
    getValue: (e: BansheeRequestEntry) => string | null | undefined,
  ) =>
    Array.from(
      new Set((entries || []).map(getValue).filter(Boolean)),
    ) as string[];

  const bansheeOptions = useMemo(
    () => buildOptions((e) => e.serialNumber).map((n) => ({ id: n, name: n })),
    [entries],
  );
  const siteOptions = useMemo(
    () =>
      buildOptions((e) => e.site?.siteName).map((n) => ({ id: n, name: n })),
    [entries],
  );
  const levelOptions = useMemo(
    () =>
      buildOptions((e) => e.level?.levelName).map((n) => ({ id: n, name: n })),
    [entries],
  );
  const driveOptions = useMemo(
    () =>
      buildOptions((e) => e.drive?.driveName).map((n) => ({ id: n, name: n })),
    [entries],
  );
  const locationOptions = useMemo(
    () =>
      buildOptions((e) => e.location?.locationName).map((n) => ({
        id: n,
        name: n,
      })),
    [entries],
  );

  const rows = useMemo((): BansheeRow[] => {
    let filtered = entries || [];
    filtered = applyFilter(
      filtered,
      selectedFilters.banshee,
      (e) => e.serialNumber,
    );
    filtered = applyFilter(
      filtered,
      selectedFilters.site,
      (e) => e.site?.siteName,
    );
    filtered = applyFilter(
      filtered,
      selectedFilters.level,
      (e) => e.level?.levelName,
    );
    filtered = applyFilter(
      filtered,
      selectedFilters.drive,
      (e) => e.drive?.driveName,
    );
    filtered = applyFilter(
      filtered,
      selectedFilters.location,
      (e) => e.location?.locationName,
    );

    const generatedRows: BansheeRow[] = filtered.map((entry) => {
      const measurements = entry.proceqData || [];
      const latestMeasurement = measurements.at(-1) ?? null;
      const lastReading = latestMeasurement?.readings?.at(-1) ?? null;

      return {
        id: entry.id,
        banshee: entry.serialNumber,
        site: entry.site?.siteName || 'N/A',
        drive: entry.drive?.driveName || 'N/A',
        level: entry.level?.levelName || 'N/A',
        location: entry.location?.locationName || 'N/A',
        status: latestMeasurement?.status || 'Not Measurable',
        elongation:
          lastReading?.elongation != null
            ? lastReading.elongation.toFixed(1)
            : '-',
        lastMeasured: latestMeasurement?.updatedTimestamp
          ? new Date(latestMeasurement.updatedTimestamp).toLocaleDateString()
          : 'N/A',
        statusChange: (entry.eventLogs || []).some(
          (log) => log.eventType === 'STATUS_CHANGE',
        )
          ? 'Yes'
          : 'No',
        comment: entry.comment ? 'icon' : 'N/A',
        fullComment: entry.comment || null,
      };
    });

    if (sortConfig) {
      generatedRows.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof BansheeRow];
        const bValue = b[sortConfig.key as keyof BansheeRow];
        if (aValue == null) return 1;
        if (bValue == null) return -1;
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return generatedRows;
  }, [entries, sortConfig, selectedFilters]);

  if (loading) {
    return (
      <div className="ui-banshee-p-8 ui-banshee-text-center ui-banshee-text-gray-500">
        Loading banshee list...
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="ui-banshee-p-8 ui-banshee-text-center ui-banshee-text-gray-500">
        No banshee requests found.
      </div>
    );
  }

  const updateFilter = (key: keyof FilterState) => (ids: string[]) =>
    setSelectedFilters((prev) => ({ ...prev, [key]: ids }));

  return (
    <>
      <div className="ui-banshee-flex ui-banshee-h-[50vh] ui-banshee-flex-col ui-banshee-w-full">
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
                    className="ui-banshee-w-full ui-banshee-p-0 ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-center"
                    column={createMockColumn('status')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-text-left ui-banshee-p-0 ui-banshee-border-0">
                  <DropdownMultiSelectSearch
                    id="banshee-filter"
                    placeholder="Banshee"
                    searchPlaceholder="Search banshee..."
                    variant="compact"
                    options={bansheeOptions}
                    selectedIds={selectedFilters.banshee}
                    onSelect={updateFilter('banshee')}
                    className="ui-banshee-w-full"
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <DropdownMultiSelectSearch
                    id="site-filter"
                    placeholder="Site"
                    searchPlaceholder="Search site..."
                    variant="compact"
                    options={siteOptions}
                    selectedIds={selectedFilters.site}
                    onSelect={updateFilter('site')}
                    className="ui-banshee-w-full"
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <DropdownMultiSelectSearch
                    id="level-filter"
                    placeholder="Level"
                    searchPlaceholder="Search level..."
                    variant="compact"
                    options={levelOptions}
                    selectedIds={selectedFilters.level}
                    onSelect={updateFilter('level')}
                    className="ui-banshee-w-full"
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <DropdownMultiSelectSearch
                    id="drive-filter"
                    placeholder="Drive"
                    searchPlaceholder="Search drive..."
                    variant="compact"
                    options={driveOptions}
                    selectedIds={selectedFilters.drive}
                    onSelect={updateFilter('drive')}
                    className="ui-banshee-w-full"
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <DropdownMultiSelectSearch
                    id="location-filter"
                    placeholder="Location"
                    searchPlaceholder="Search location..."
                    variant="compact"
                    options={locationOptions}
                    selectedIds={selectedFilters.location}
                    onSelect={updateFilter('location')}
                    className="ui-banshee-w-full"
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <TableHeadWithSorting
                    header="Elongation"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-center"
                    column={createMockColumn('elongation')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <TableHeadWithSorting
                    header="Last Measured"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-center"
                    column={createMockColumn('lastMeasured')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <TableHeadWithSorting
                    header="Status Change"
                    className="ui-banshee-w-full ui-banshee-p-0 ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-center"
                    column={createMockColumn('status')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-p-0">
                  <TableHeadWithSorting
                    header="Comment"
                    className="ui-banshee-w-full ui-banshee-h-full ui-banshee-px-4 ui-banshee-justify-center"
                    column={createMockColumn('comment')}
                  />
                </TableHead>
                <TableHead className="ui-banshee-text-right">
                  <Text
                    variant="small"
                    color="foreground"
                    className="ui-banshee-font-bold"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell
                    className="ui-banshee-text-gray-500 ui-banshee-bg-neutral-2 ui-banshee-font-mono ui-banshee-cursor-pointer hover:ui-banshee-text-neutral-800"
                    onClick={() => setSelectedBansheeId(row.id)}
                  >
                    +
                  </TableCell>
                  <TableCell>
                    <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center">
                      <span
                        className="ui-banshee-w-3 ui-banshee-h-3 ui-banshee-rounded-full"
                        style={{
                          backgroundColor: getStatusColorHex(row.status),
                        }}
                        title={row.status}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="ui-banshee-text-left">
                    <Text variant="small" color="foreground">
                      {row.banshee}
                    </Text>
                  </TableCell>
                  <TableCell className="ui-banshee-text-center">
                    <Text variant="small" color="foreground">
                      {row.site}
                    </Text>
                  </TableCell>
                  <TableCell className="ui-banshee-text-center">
                    <Text variant="small" color="foreground">
                      {row.level}
                    </Text>
                  </TableCell>
                  <TableCell className="ui-banshee-text-center">
                    <Text variant="small" color="foreground">
                      {row.drive}
                    </Text>
                  </TableCell>
                  <TableCell className="ui-banshee-text-center">
                    <Text variant="small" color="foreground">
                      {row.location}
                    </Text>
                  </TableCell>
                  <TableCell className="ui-banshee-text-center">
                    <Text variant="small" color="foreground">
                      {row.elongation}
                    </Text>
                  </TableCell>
                  <TableCell className="ui-banshee-text-center">
                    <Text variant="small" color="foreground">
                      {row.lastMeasured}
                    </Text>
                  </TableCell>
                  <TableCell className="ui-banshee-text-center">
                    <Text
                      variant="small"
                      color="foreground"
                      className={
                        row.statusChange === 'Yes'
                          ? 'ui-banshee-text-blue-500'
                          : 'ui-banshee-text-gray-600'
                      }
                    >
                      {row.statusChange}
                    </Text>
                  </TableCell>
                  <TableCell className="ui-banshee-text-center">
                    {row.comment === 'icon' ? (
                      <MessageSquare
                        size={16}
                        className="ui-banshee-text-gray-500 ui-banshee-mx-auto ui-banshee-cursor-pointer hover:ui-banshee-text-gray-700"
                        onClick={() =>
                          setSelectedComment({
                            banshee: row.banshee || 'Unknown',
                            comment: row.fullComment,
                          })
                        }
                      />
                    ) : (
                      <Text variant="small" color="foreground">
                        {row.comment}
                      </Text>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="ui-banshee-flex ui-banshee-px-8 ui-banshee-justify-end ui-banshee-gap-2 ui-banshee-text-gray-400">
                      <Settings
                        size={16}
                        className="ui-banshee-cursor-pointer ui-banshee-text-gray-500 hover:ui-banshee-text-[#101010]"
                        onClick={() => router.push(`/banshee/${row.id}`)}
                      />
                      <BarChart2
                        size={16}
                        className="ui-banshee-cursor-pointer ui-banshee-text-gray-500 hover:ui-banshee-text-[#101010]"
                        onClick={() =>
                          router.push(`/banshee/dashboard/${row.id}`)
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <BansheeDetailModal
        bansheeId={selectedBansheeId}
        onClose={() => setSelectedBansheeId(null)}
      />
      <BansheeListCommentModal
        isOpen={!!selectedComment}
        bansheeName={selectedComment?.banshee || null}
        comment={selectedComment?.comment || null}
        onClose={() => setSelectedComment(null)}
      />
    </>
  );
};
