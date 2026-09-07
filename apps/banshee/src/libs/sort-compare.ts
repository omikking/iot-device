/** A cell value a table can be sorted by. */
export type SortableValue = string | number | null | undefined;

/** Placeholders the tables render for an absent value. */
const isMissing = (value: SortableValue) =>
  value == null || value === '' || value === '-';

/**
 * Compares two cell values for table sorting.
 *
 * Strings compare *naturally*, so `CH5` precedes `CH12`: hierarchy names embed
 * numbers of varying width, and plain lexicographic order scrambles them
 * (`CH12`, `CH300`, `CH5`). Locations show this worst — `CH<chainage>` ranges
 * over one to three digits — while level and drive names happen to be
 * fixed-width and so look correct under either comparison.
 *
 * Missing values sort last in both directions, so rows with nothing to show
 * never displace real data at the top of the table.
 */
export const compareValues = (
  a: SortableValue,
  b: SortableValue,
  direction: 'asc' | 'desc',
): number => {
  const aMissing = isMissing(a);
  const bMissing = isMissing(b);
  if (aMissing || bMissing) {
    if (aMissing && bMissing) return 0;
    return aMissing ? 1 : -1;
  }

  const order = direction === 'asc' ? 1 : -1;

  if (typeof a === 'number' && typeof b === 'number') {
    return (a - b) * order;
  }

  return (
    String(a).localeCompare(String(b), undefined, { numeric: true }) * order
  );
};
