/**
 * Shared x-axis preparation for the reading-level plots (status plot, data
 * plot).
 *
 * A point on those charts is one ProceqReading, so its x position must come
 * from the reading's own `createdTimestamp` — the instant that shot was
 * acquired — rather than from the parent measurement's, which is the same value
 * for every reading in the session and collapses them onto one category.
 *
 * The axis label is chosen per calendar day so it stays readable, using the
 * shared UTC formatters the tables date their cells with:
 *   - a day holding a single instant  → `18 Mar 2025`
 *   - a day holding several instants  → `18 Mar 2025 10:41:31.879`
 * Readings that resolve to the exact same instant cannot occupy two categories,
 * so they collapse to one point, the highest `readingIndex` winning as the
 * latest reading. `readingIndex` is only ever a tie-breaker.
 *
 * Everything is done in linear passes over the readings: collect + dedupe,
 * sort, count instants per day, then fill rows.
 */
import { sortReadingsAscending } from './latest-measurement';
import {
  formatMeasurementDay,
  formatMeasurementInstant,
} from './measurement-date';

/** Only the fields the timeline reads; queries may select more. */
export interface TimelineReading {
  readingIndex?: number | null;
  createdTimestamp?: unknown;
}

/** Only the fields the timeline reads; queries may select more. */
export interface TimelineMeasurement {
  createdTimestamp?: unknown;
  readings?: readonly TimelineReading[] | null;
}

/** One series of the chart: a bolt, and the measurement sessions it holds. */
export interface TimelineSeries<TMeasurement> {
  dataKey: string;
  measurements: readonly TMeasurement[] | null | undefined;
}

/**
 * The reading element type of a measurement, so a point keeps whatever type the
 * caller's query produced instead of being widened to {@link TimelineReading}.
 */
type ReadingOf<TMeasurement> = TMeasurement extends {
  readings?: readonly (infer TReading)[] | null;
}
  ? TReading
  : TimelineReading;

/** A reading resolved to an absolute instant and the axis category it sits in. */
export interface TimelinePoint<TReading, TMeasurement> {
  dataKey: string;
  /** X-axis category: a date, or a full timestamp when the day holds several. */
  label: string;
  ts: number;
  readingIndex: number;
  reading: TReading;
  measurement: TMeasurement;
}

/**
 * Parses a DateTime scalar (epoch millis, ISO string or Date) to millis, or
 * null when there is nothing usable. Mirrors the parser in
 * `latest-measurement.ts`, kept separate so the ranking rules there stay
 * untouched.
 */
const toMillis = (value: unknown): number | null => {
  if (value == null || (typeof value === 'string' && !value.trim()))
    return null;

  const time =
    value instanceof Date
      ? value.getTime()
      : new Date(value as string | number).getTime();

  return Number.isNaN(time) ? null : time;
};

/**
 * Flattens every series' readings into deduped, chronologically sorted points
 * carrying their axis label.
 *
 * A reading with no `createdTimestamp` of its own falls back to its
 * measurement's, so sessions synced before reading-level timestamps existed
 * keep plotting exactly where they used to.
 */
export function buildReadingTimeline<TMeasurement extends TimelineMeasurement>(
  series: readonly TimelineSeries<TMeasurement>[],
): TimelinePoint<ReadingOf<TMeasurement>, TMeasurement>[] {
  type Point = TimelinePoint<ReadingOf<TMeasurement>, TMeasurement>;

  // Dedupe as we collect: one point per (series, instant).
  const byInstant = new Map<string, Point>();

  for (const { dataKey, measurements } of series) {
    for (const measurement of measurements ?? []) {
      for (const reading of sortReadingsAscending(measurement.readings)) {
        const ts =
          toMillis(reading.createdTimestamp) ??
          toMillis(measurement.createdTimestamp);
        if (ts == null) continue;

        const readingIndex = reading.readingIndex ?? 0;
        const key = `${dataKey}\0${ts}`;
        const existing = byInstant.get(key);
        // Same instant: the highest readingIndex is the latest reading.
        if (existing && existing.readingIndex >= readingIndex) continue;

        byInstant.set(key, {
          dataKey,
          label: '',
          ts,
          readingIndex,
          // Widened to TimelineReading by the loop; it is an element of
          // measurement.readings, so the caller's reading type is the real one.
          reading: reading as ReadingOf<TMeasurement>,
          measurement,
        });
      }
    }
  }

  const points = Array.from(byInstant.values()).sort(
    (a, b) => a.ts - b.ts || a.readingIndex - b.readingIndex,
  );

  // How many distinct instants each day holds decides that day's label form.
  // Equal instants are adjacent after the sort, so one pass counts them.
  const instantsPerDay = new Map<string, number>();
  let previousTs: number | null = null;
  for (const point of points) {
    if (point.ts === previousTs) continue;
    previousTs = point.ts;
    const day = formatMeasurementDay(point.ts);
    instantsPerDay.set(day, (instantsPerDay.get(day) ?? 0) + 1);
  }

  for (const point of points) {
    const day = formatMeasurementDay(point.ts);
    point.label =
      instantsPerDay.get(day) === 1 ? day : formatMeasurementInstant(point.ts);
  }

  return points;
}

/**
 * Turns timeline points into chart rows in a single pass — one row per axis
 * category, each series' value written into its own column.
 *
 * `cell` is called exactly once per point; returning `undefined` leaves that
 * series out of the row (and creates no row if nothing else fills it).
 */
export function buildReadingChartRows<
  TRow extends object,
  TReading extends TimelineReading,
  TMeasurement extends TimelineMeasurement,
>(
  points: readonly TimelinePoint<TReading, TMeasurement>[],
  createRow: (label: string) => TRow,
  cell: (point: TimelinePoint<TReading, TMeasurement>) => unknown,
): TRow[] {
  const rowByLabel = new Map<string, TRow>();
  const rows: TRow[] = [];

  for (const point of points) {
    const value = cell(point);
    if (value === undefined) continue;

    let row = rowByLabel.get(point.label);
    if (!row) {
      row = createRow(point.label);
      rowByLabel.set(point.label, row);
      rows.push(row);
    }

    (row as Record<string, unknown>)[point.dataKey] = value;
  }

  return rows;
}
