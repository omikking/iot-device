/**
 * A banshee request holds many ProceqData (measurement sessions), and each
 * ProceqData holds many ProceqReading. Everything the UI presents as the
 * bolt's *current* state — status, elongation, due date, last measured — must
 * come from the latest of each, and the API gives no ordering guarantee on
 * either list. These helpers are the single place that rule lives: sort here,
 * never index into `proceqData` or `readings` directly at a call site.
 */

/** The reading fields used for ranking; queries may select more. */
export interface RankableReading {
  readingIndex?: number | null;
  elongation?: number | null;
}

/** The measurement fields used for ranking; queries may select more. */
export interface RankableProceqData {
  updatedTimestamp?: unknown;
  createdTimestamp?: unknown;
  createdAt?: unknown;
  readings?: readonly RankableReading[] | null;
}

/** Parses any DateTime scalar shape (ISO string, epoch, Date) to millis. */
const toTime = (value: unknown): number | null => {
  if (value == null) return null;
  const time =
    value instanceof Date
      ? value.getTime()
      : new Date(value as string | number).getTime();
  return Number.isNaN(time) ? null : time;
};

const measurementRank = (proceqData: RankableProceqData): (number | null)[] => [
  toTime(proceqData.updatedTimestamp),
  toTime(proceqData.createdTimestamp),
  toTime(proceqData.createdAt),
];

/** Unranked entries sort oldest so a ranked entry always wins. */
const compareKey = (a: number | null, b: number | null): number => {
  if (a === b) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  return a - b;
};

/**
 * Compares rank keys lexicographically — the first key decides and the rest only
 * break ties, so an earlier key's presence outranks any later key's value.
 */
const compareRank = (
  a: readonly (number | null)[],
  b: readonly (number | null)[],
): number => {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const result = compareKey(a[i] ?? null, b[i] ?? null);
    if (result !== 0) return result;
  }
  return 0;
};

/** Ascending sort that keeps the original order of equally ranked entries. */
const sortByRank = <T>(
  items: readonly T[] | null | undefined,
  rank: (item: T) => readonly (number | null)[],
): T[] =>
  (items ?? [])
    .map((item, index) => ({ item, index, rank: rank(item) }))
    .sort((a, b) => compareRank(a.rank, b.rank) || a.index - b.index)
    .map((entry) => entry.item);

/** Measurement sessions oldest to newest — the order charts plot in. */
export function sortProceqDataAscending<T extends RankableProceqData>(
  proceqData: readonly T[] | null | undefined,
): T[] {
  return sortByRank(proceqData, measurementRank);
}

/** Readings in acquisition order within one measurement session. */
export function sortReadingsAscending<T extends RankableReading>(
  readings: readonly T[] | null | undefined,
): T[] {
  return sortByRank(readings, (reading) => [reading.readingIndex ?? null]);
}

/** The most recent measurement session, or null when the bolt is unmeasured. */
export function getLatestProceqData<T extends RankableProceqData>(
  proceqData: readonly T[] | null | undefined,
): T | null {
  return sortProceqDataAscending(proceqData).at(-1) ?? null;
}

/** The final reading of a single measurement session. */
export function getLatestReading<T extends RankableReading>(
  readings: readonly T[] | null | undefined,
): T | null {
  return sortReadingsAscending(readings).at(-1) ?? null;
}

/**
 * The latest measurement session together with its latest reading — the pair
 * every detail view, list row and table cell should read its values from.
 */
export function getLatestMeasurement<
  TReading extends RankableReading,
  TProceqData extends RankableProceqData & {
    readings?: readonly TReading[] | null;
  },
>(
  proceqData: readonly TProceqData[] | null | undefined,
): { measurement: TProceqData | null; reading: TReading | null } {
  const measurement = getLatestProceqData(proceqData);
  return { measurement, reading: getLatestReading(measurement?.readings) };
}

/** Elongation to one decimal, or null when there is nothing to show. */
export function formatElongation(
  reading: RankableReading | null | undefined,
): string | null {
  return reading?.elongation != null ? reading.elongation.toFixed(1) : null;
}
