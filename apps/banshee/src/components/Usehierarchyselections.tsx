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

interface HierarchySelectionOptions {
  /**
   * Whether a dropdown stays usable while the one above it is still empty.
   *
   * `false` (default) offers nothing until the parent is picked — the right
   * shape when every field is required, since an unparented selection could
   * never be completed anyway.
   *
   * `true` falls back to everything under the nearest selected ancestor, so
   * optional fields can be filled in any order and each selection still
   * narrows the ones below it.
   */
  allowUnparentedSelection?: boolean;
}

/**
 * The options each hierarchy dropdown should offer for a given selection. Use
 * this directly when the selected ids live in plain state; see
 * {@link useHierarchySelections} for a react-hook-form.
 */
export function useHierarchyOptions(
  sites: Site[],
  { siteId, levelId, driveId }: HierarchyFields,
  { allowUnparentedSelection = false }: HierarchySelectionOptions = {},
) {
  const levels = useMemo(() => {
    if (siteId) return sites.find((s) => s.id === siteId)?.levels ?? [];
    return allowUnparentedSelection ? sites.flatMap((s) => s.levels ?? []) : [];
  }, [sites, siteId, allowUnparentedSelection]);

  const drives = useMemo(() => {
    if (levelId) return levels.find((l) => l.id === levelId)?.drives ?? [];
    return allowUnparentedSelection ? levels.flatMap((l) => l.drives ?? []) : [];
  }, [levels, levelId, allowUnparentedSelection]);

  const locations = useMemo(() => {
    if (driveId) return drives.find((d) => d.id === driveId)?.locations ?? [];
    return allowUnparentedSelection
      ? drives.flatMap((d) => d.locations ?? [])
      : [];
  }, [drives, driveId, allowUnparentedSelection]);

  return { levels, drives, locations };
}

/** {@link useHierarchyOptions} for a form whose hierarchy ids are watched. */
export function useHierarchySelections<T extends HierarchyFields>(
  sites: Site[],
  watch: UseFormWatch<T>,
  options: HierarchySelectionOptions = {},
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = watch as UseFormWatch<any>;

  return useHierarchyOptions(
    sites,
    {
      siteId: w('siteId') as string | null | undefined,
      levelId: w('levelId') as string | null | undefined,
      driveId: w('driveId') as string | null | undefined,
    },
    options,
  );
}
