'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useQuery } from 'urql';
import { LucideArrowDownUp, LucideArrowUpDown } from 'lucide-react';
import { graphql } from '@/gql';
import { Application } from '@/gql/graphql';
import { handleGraphQLErrors } from '@/libs/utils';
import { formatDate } from '@/libs/measurement-date';
import {
  DropdownMultiSelectSearch,
  SidebarInset,
  Headline,
  Text,
  LoadingSpinner,
} from '@gsp/ui-banshee';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@gsp/ui-banshee';

const companyHierarchyQuery = graphql(`
  query siteInfoHierarchy($companyId: String!) {
    company(id: $companyId) {
      id
      name
      plans {
        id
        applicationName
        planLevel
        expiringDate
      }
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

const usersQuery = graphql(`
  query siteInfoUsers {
    users {
      id
      email
      fullName
      userPermissions {
        id
        role
        appsAccess
      }
    }
  }
`);
interface LocationRow {
  rowKey: string;
  siteName: string;
  locationName: string;
  levelName: string;
  driveName: string;
}

type SortableColumn = Exclude<keyof LocationRow, 'rowKey'>;

type SortConfig = { key: SortableColumn; direction: 'asc' | 'desc' };

function SortButton({
  label,
  sortKey,
  sortConfig,
  onSort,
}: {
  label: string;
  sortKey: SortableColumn;
  sortConfig: SortConfig | null;
  onSort: (key: SortableColumn) => void;
}) {
  const direction = sortConfig?.key === sortKey ? sortConfig.direction : null;

  return (
    <button
      type="button"
      aria-label={`Sort by ${label}`}
      onClick={() => onSort(sortKey)}
      className="ui-banshee-flex-1 ui-banshee-flex ui-banshee-items-center ui-banshee-justify-start ui-banshee-h-9 ui-banshee-px-2 ui-banshee-cursor-pointer hover:ui-banshee-bg-main-white/50"
    >
      {direction === 'desc' ? (
        <LucideArrowDownUp size="16" />
      ) : (
        <LucideArrowUpDown
          size="16"
          className={direction ? undefined : 'ui-banshee-text-neutral-4'}
        />
      )}
    </button>
  );
}

function getFlatLocations(
  sites: {
    id: string;
    siteName: string;
    levels?:
      | {
          id: string;
          levelName: string;
          drives?:
            | {
                id: string;
                driveName: string;
                locations?: { id: string; locationName: string }[] | null;
              }[]
            | null;
        }[]
      | null;
  }[],
): LocationRow[] {
  const rows: LocationRow[] = [];
  for (const site of sites) {
    for (const level of site.levels ?? []) {
      for (const drive of level.drives ?? []) {
        for (const location of drive.locations ?? []) {
          rows.push({
            rowKey: `${site.id}-${level.id}-${drive.id}-${location.id}`,
            siteName: site.siteName,
            locationName: location.locationName,
            levelName: level.levelName,
            driveName: drive.driveName,
          });
        }
      }
    }
  }
  return rows;
}

export default function SiteInformationPage({
  params,
}: {
  params: { companyId: string };
}) {
  const { companyId } = params;

  const [
    { data: hierarchyData, fetching: hierarchyFetching, error: hierarchyError },
  ] = useQuery({
    query: companyHierarchyQuery,
    variables: { companyId },
  });

  useEffect(() => {
    handleGraphQLErrors(hierarchyError);
  }, [hierarchyError]);

  const [{ data: usersData, fetching: usersFetching, error: usersError }] =
    useQuery({
      query: usersQuery,
    });

  useEffect(() => {
    handleGraphQLErrors(usersError);
  }, [usersError]);
  const companyName = hierarchyData?.company?.name ?? 'Company name';

  const sites = hierarchyData?.company?.sites ?? [];

  const allRows = useMemo(() => getFlatLocations(sites), [sites]);

  const siteOptions = useMemo(
    () =>
      Array.from(new Set(allRows.map((r) => r.siteName))).map((name) => ({
        id: name,
        name,
      })),
    [allRows],
  );

  const locationOptions = useMemo(
    () =>
      Array.from(new Set(allRows.map((r) => r.locationName))).map((name) => ({
        id: name,
        name,
      })),
    [allRows],
  );

  const levelOptions = useMemo(
    () =>
      Array.from(new Set(allRows.map((r) => r.levelName))).map((name) => ({
        id: name,
        name,
      })),
    [allRows],
  );

  const driveOptions = useMemo(
    () =>
      Array.from(new Set(allRows.map((r) => r.driveName))).map((name) => ({
        id: name,
        name,
      })),
    [allRows],
  );
  const bansheePlans = useMemo(
    () =>
      hierarchyData?.company?.plans?.filter(
        (plan) => plan.applicationName === Application.Banshee,
      ) ?? [],
    [hierarchyData],
  );
  const bansheeUsers = useMemo(
    () =>
      (usersData?.users ?? []).filter((user) =>
        user.userPermissions?.some((perm) =>
          perm.appsAccess?.includes(Application.Banshee),
        ),
      ),
    [usersData],
  );
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedDrives, setSelectedDrives] = useState<string[]>([]);

  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const requestSort = (key: SortableColumn) =>
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));

  const filteredRows = useMemo(
    () =>
      allRows.filter(
        (r) =>
          (selectedSites.length === 0 || selectedSites.includes(r.siteName)) &&
          (selectedLocations.length === 0 ||
            selectedLocations.includes(r.locationName)) &&
          (selectedLevels.length === 0 ||
            selectedLevels.includes(r.levelName)) &&
          (selectedDrives.length === 0 || selectedDrives.includes(r.driveName)),
      ),
    [allRows, selectedSites, selectedLocations, selectedLevels, selectedDrives],
  );

  const visibleRows = useMemo(() => {
    if (!sortConfig) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const comparison = a[sortConfig.key].localeCompare(
        b[sortConfig.key],
        undefined,
        {
          numeric: true,
          sensitivity: 'base',
        },
      );
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredRows, sortConfig]);

  const isFetching = hierarchyFetching || usersFetching;

  if (isFetching) {
    return (
      <SidebarInset>
        <main className="ui-banshee-bg-main-white ui-banshee-box-border">
          <div className="ui-banshee-p-8 ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-3 ui-banshee-text-neutral-500">
            <LoadingSpinner />
            <Text variant="medium" color="muted">
              Loading site information...
            </Text>
          </div>
        </main>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <main className="ui-banshee-bg-main-white ui-banshee-box-border">
        <div className="ui-banshee-p-3 md:ui-banshee-p-4 lg:ui-banshee-p-6 ui-banshee-border-b ui-banshee-border-neutral-3">
          <Headline
            as="h1"
            variant="large"
            color="foreground"
            className="ui-banshee-m-0 ui-banshee-mb-1"
          >
            {companyName}
          </Headline>
        </div>

        <div className="ui-banshee-p-3 md:ui-banshee-p-4 lg:ui-banshee-p-7 lg:ui-banshee-pr-0 ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-6">
          <div className="ui-banshee-max-h-[57vh] ui-banshee-overflow-auto">
            <Table variant="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="ui-banshee-p-0">
                    <div className="ui-banshee-flex ui-banshee-items-center">
                      <DropdownMultiSelectSearch
                        id="site-multi"
                        placeholder="Site"
                        searchPlaceholder="..."
                        variant="compact"
                        options={siteOptions}
                        selectedIds={selectedSites}
                        onSelect={(ids) => setSelectedSites(ids)}
                      />
                      <SortButton
                        label="Site"
                        sortKey="siteName"
                        sortConfig={sortConfig}
                        onSort={requestSort}
                      />
                    </div>
                  </TableHead>
                  <TableHead className="ui-banshee-p-0">
                    <div className="ui-banshee-flex ui-banshee-items-center">
                      <DropdownMultiSelectSearch
                        id="level-multi"
                        placeholder="Level"
                        searchPlaceholder="..."
                        variant="compact"
                        options={levelOptions}
                        selectedIds={selectedLevels}
                        onSelect={(ids) => setSelectedLevels(ids)}
                      />
                      <SortButton
                        label="Level"
                        sortKey="levelName"
                        sortConfig={sortConfig}
                        onSort={requestSort}
                      />
                    </div>
                  </TableHead>
                  <TableHead className="ui-banshee-p-0 [&:nth-child(3)]:ui-banshee-text-left">
                    <div className="ui-banshee-flex ui-banshee-items-center">
                      <DropdownMultiSelectSearch
                        id="drive-multi"
                        placeholder="Drive"
                        searchPlaceholder="..."
                        variant="compact"
                        options={driveOptions}
                        selectedIds={selectedDrives}
                        onSelect={(ids) => setSelectedDrives(ids)}
                      />
                      <SortButton
                        label="Drive"
                        sortKey="driveName"
                        sortConfig={sortConfig}
                        onSort={requestSort}
                      />
                    </div>
                  </TableHead>
                  <TableHead className="ui-banshee-p-0">
                    <div className="ui-banshee-flex ui-banshee-items-center">
                      <DropdownMultiSelectSearch
                        id="location-multi"
                        placeholder="Location"
                        searchPlaceholder="..."
                        variant="compact"
                        options={locationOptions}
                        selectedIds={selectedLocations}
                        onSelect={(ids) => setSelectedLocations(ids)}
                      />
                      <SortButton
                        label="Location"
                        sortKey="locationName"
                        sortConfig={sortConfig}
                        onSort={requestSort}
                      />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow key={row.rowKey}>
                    <TableCell className="!ui-banshee-text-left ui-banshee-px-3">
                      <Text variant="medium" color="foreground">
                        {row.siteName}
                      </Text>
                    </TableCell>
                    <TableCell className="!ui-banshee-text-left ui-banshee-px-3">
                      <Text variant="medium" color="foreground">
                        {row.levelName}
                      </Text>
                    </TableCell>
                    <TableCell className="!ui-banshee-text-left ui-banshee-px-3">
                      <Text variant="medium" color="foreground">
                        {row.driveName}
                      </Text>
                    </TableCell>
                    <TableCell className="!ui-banshee-text-left ui-banshee-px-3">
                      <Text variant="medium" color="foreground">
                        {row.locationName}
                      </Text>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Table variant="border">
            <TableHeader>
              <TableRow>
                <TableHead
                  colSpan={2}
                  className="ui-banshee-px-3 ui-banshee-py-2"
                >
                  <Text
                    variant="medium"
                    color="foreground"
                    className="ui-banshee-font-bold"
                  >
                    Banshee users
                  </Text>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bansheeUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="[&:first-child]:ui-banshee-bg-transparent !ui-banshee-text-left ui-banshee-px-3">
                    <Text variant="medium" color="foreground">
                      {user.fullName ?? user.email}
                      {' - '}
                      {user.userPermissions
                        ?.filter((perm) =>
                          perm.appsAccess?.includes(Application.Banshee),
                        )
                        .map((perm) => perm.role)
                        .join(', ') ?? ''}
                    </Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Table variant="border">
            <TableHeader>
              <TableRow>
                <TableHead className="[&:first-child]:ui-banshee-bg-transparent !ui-banshee-text-left ui-banshee-px-3">
                  <Text
                    variant="medium"
                    color="foreground"
                    className="ui-banshee-font-bold"
                  >
                    Banshee subscription
                  </Text>
                </TableHead>
                <TableHead className="[&:last-child]:ui-banshee-text-left ui-banshee-flex-none ui-banshee-px-3 ui-banshee-py-2">
                  <Text
                    variant="medium"
                    color="foreground"
                    className="ui-banshee-font-bold"
                  >
                    Expiry
                  </Text>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bansheePlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="[&:first-child]:ui-banshee-bg-neutral-1 !ui-banshee-text-left ui-banshee-px-3">
                    <Text variant="medium" color="foreground">
                      {plan.planLevel}
                    </Text>
                  </TableCell>
                  <TableCell className="[&:first-child]:ui-banshee-bg-neutral-2 !ui-banshee-text-left ui-banshee-px-3">
                    <Text variant="medium" color="foreground">
                      {formatDate(plan.expiringDate) ?? '-'}
                    </Text>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </SidebarInset>
  );
}
