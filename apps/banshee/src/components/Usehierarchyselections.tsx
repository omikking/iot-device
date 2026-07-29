import { useMemo } from 'react';
import { UseFormWatch } from 'react-hook-form';

interface Site {
  id: string;
  siteName: string;
  levels?: Level[] | null;
}

interface Level {
  id: string;
  levelName: string;
  drives?: Drive[] | null;
}

interface Drive {
  id: string;
  driveName: string;
  locations?: Location[] | null;
}

interface Location {
  id: string;
  locationName: string;
}

interface HierarchyFields {
  siteId?: string | null;
  levelId?: string | null;
  driveId?: string | null;
}

export function useHierarchySelections<T extends HierarchyFields>(
  sites: Site[],
  watch: UseFormWatch<T>,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = watch as UseFormWatch<any>;
  const siteId = w('siteId') as string | null | undefined;
  const levelId = w('levelId') as string | null | undefined;
  const driveId = w('driveId') as string | null | undefined;

  const levels = useMemo(
    () => sites.find((s) => s.id === siteId)?.levels ?? [],
    [sites, siteId],
  );

  const drives = useMemo(
    () => levels.find((l) => l.id === levelId)?.drives ?? [],
    [levels, levelId],
  );

  const locations = useMemo(
    () => drives.find((d) => d.id === driveId)?.locations ?? [],
    [drives, driveId],
  );

  return { levels, drives, locations };
}
