/**
 * The status plot's y-axis is a status axis, not a numeric one: a reading is
 * drawn in the band of the status the API assigned to it. The backend
 * classifies every measured reading itself, using per-bolt-type constants
 * (elastic / low-plastic limits) the frontend does not have, so the frontend
 * must never re-derive a status from elongation — doing so makes the plot
 * disagree with the status shown everywhere else in the app. Elongation over
 * time is what the data plot is for.
 */
import type { StatusBand } from '@gsp/ui-banshee';
import { ProceqStatus } from '@/gql/graphql';

/** A y-axis band together with the statuses it renders. */
export type StatusPlotBand = StatusBand & { statuses: ProceqStatus[] };

/**
 * Single source of truth for the plot: every status belongs to exactly one
 * band, so a point's position, the band it lands in, its colour and its tooltip
 * label can never drift apart.
 */
export const statusPlotBands: StatusPlotBand[] = [
  {
    statuses: [ProceqStatus.Broken],
    from: 4,
    to: 3,
    label: 'Broken',
    color: '#fb9596',
  },
  {
    statuses: [ProceqStatus.HighPlastic],
    from: 3,
    to: 2,
    label: 'High plastic',
    color: '#fbc5ab',
  },
  {
    statuses: [ProceqStatus.LowPlastic],
    from: 2,
    to: 1,
    label: 'Low plastic',
    color: '#fbea9a',
  },
  {
    statuses: [ProceqStatus.Elastic],
    from: 1,
    to: 0,
    label: 'Elastic',
    color: '#bce7b1',
  },
  {
    // The last band takes every reading without a usable measurement. Such a
    // reading belongs here rather than being dropped: a bolt that silently
    // loses its point and its legend entry reads as "no data exists".
    statuses: [ProceqStatus.NotMeasurable],
    from: 0,
    to: -1,
    label: 'Not measurable',
    color: '#9C9C9C',
  },
];

const bandByStatus = new Map<string, StatusPlotBand>(
  statusPlotBands.flatMap((band) =>
    band.statuses.map((status) => [status, band] as const),
  ),
);

/**
 * Statuses the API records on the measurement as a whole (they come from the
 * operator's comment) instead of per reading. Such a measurement's readings are
 * stored as NOT_MEASURABLE with no elongation, so their status has to be read
 * from the parent measurement or the point would be lost.
 */
const MEASUREMENT_LEVEL_STATUSES = new Set<string>([
  ProceqStatus.Broken,
  ProceqStatus.NotMeasurable,
]);

/** Only the status field is needed; queries may select more. */
export interface PlottableStatus {
  status?: string | null;
}

/**
 * The status to plot a single reading at. Every reading resolves to a band, so
 * none is ever hidden: a reading the API left unclassified — NOT_MEASURABLE, or
 * with nothing recorded at all — plots in the "Not measurable" band, unless the
 * parent measurement carries a status of its own to lift it out.
 */
export const resolvePlotStatus = (
  reading: PlottableStatus,
  measurement: PlottableStatus,
): string => {
  if (reading.status && reading.status !== ProceqStatus.NotMeasurable) {
    return reading.status;
  }

  const measurementStatus = measurement.status ?? null;

  return measurementStatus && MEASUREMENT_LEVEL_STATUSES.has(measurementStatus)
    ? measurementStatus
    : ProceqStatus.NotMeasurable;
};

/**
 * The plotted point for a reading: the centre of its status' band, plus the
 * band label the tooltip shows. Null only for a status the plot has no band for
 * — every ProceqStatus has one, so this is the guard for an unknown value.
 */
export const getStatusPlotPoint = (
  reading: PlottableStatus,
  measurement: PlottableStatus,
): { value: number; statusLabel: string } | null => {
  const status = resolvePlotStatus(reading, measurement);
  const band = bandByStatus.get(status);

  if (!band) return null;

  return { value: (band.from + band.to) / 2, statusLabel: band.label };
};
