'use client';

import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { ChartLineLinear, LoadingSpinner } from '@gsp/ui-banshee';
import type {
  StatusBand,
  ChartLineLinearHandle,
  ChartLineDatum,
} from '@gsp/ui-banshee';
import type { BansheeRequestsListQuery } from '@/gql/graphql';
import { sortReadingsAscending } from '@/libs/latest-measurement';
import { downloadDataUrl, dataUrlToFile } from '@/libs/utils';

type BansheeRequestResult =
  BansheeRequestsListQuery['bansheeRequests']['results'][number];

// Export the handle type so page.tsx can use it
export type BansheeStatusPlotHandle = {
  resetZoom: () => void;
  zoomToRange: (start: number, end: number) => void;
  getCurrentZoom: () => { start: number; end: number };
  downloadPng: (filename?: string) => void;
  getPngFile: (filename?: string) => Promise<File | undefined>;
};

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(
    Math.abs((Math.sin(hash) * 10000) % 1) * 16777215,
  ).toString(16);
  return '#' + '000000'.substring(0, 6 - color.length) + color;
};
//TODO : Need to replace these with BoltTypeConstant Query values once they are available in the backend.
const ELASTIC_LOWER = 0;
const ELASTIC_UPPER = 10;
const LOW_PLASTIC_UPPER = 100;
const HIGH_PLASTIC_MAP_UPPER = 150;
const convertToStatusPlotValue = (
  elongation: number,
  status: string,
): number => {
  if (status === 'NOT_MEASURABLE') return -0.5;
  if (status === 'BROKEN') return 3.5;
  if (elongation <= ELASTIC_LOWER) return 0;
  if (elongation < ELASTIC_UPPER) return elongation / ELASTIC_UPPER;
  if (elongation < LOW_PLASTIC_UPPER)
    return (
      1 + (elongation - ELASTIC_UPPER) / (LOW_PLASTIC_UPPER - ELASTIC_UPPER)
    ); // 1 → 2
  if (elongation <= HIGH_PLASTIC_MAP_UPPER)
    return (
      2 +
      (elongation - LOW_PLASTIC_UPPER) /
        (HIGH_PLASTIC_MAP_UPPER - LOW_PLASTIC_UPPER)
    ); // 2 → 3
  return 3;
};

// Maps the raw proceq status to the band label shown in the tooltip. Using the
// actual status avoids mis-labelling points that land on a band boundary value.
const STATUS_TO_BAND_LABEL: Record<string, string> = {
  NOT_MEASURABLE: 'Not Measurable',
  BROKEN: 'Broken',
  HIGH_PLASTIC: 'High Plastic',
  LOW_PLASTIC: 'Low Plastic',
  ELASTIC: 'Elastic',
};

const statusBands: StatusBand[] = [
  { from: 4, to: 3, label: 'Broken', color: '#fb9596' },
  { from: 3, to: 2, label: 'High Plastic', color: '#fbc5ab' },
  { from: 2, to: 1, label: 'Low Plastic', color: '#fbea9a' },
  { from: 1, to: 0, label: 'Elastic', color: '#bce7b1' },
  { from: 0, to: -1, label: 'Not Measurable', color: '#9C9C9C' },
];

export const BansheeStatusPlot = forwardRef<
  BansheeStatusPlotHandle,
  {
    bansheeRequests: BansheeRequestResult[];
    fetching: boolean;
  }
>(function BansheeStatusPlot({ bansheeRequests, fetching }, ref) {
  const chartRef = useRef<ChartLineLinearHandle>(null);

  // Expose resetZoom and PNG download to parent component
  useImperativeHandle(ref, () => ({
    resetZoom: () => {
      chartRef.current?.resetZoom();
    },
    zoomToRange: (start: number, end: number) => {
      chartRef.current?.zoomToRange(start, end);
    },
    getCurrentZoom: () =>
      chartRef.current?.getCurrentZoom() ?? { start: 0, end: 100 },
    downloadPng: (filename = 'banshee_status_plot.png') => {
      const dataUrl = chartRef.current?.getPngDataUrl();
      if (dataUrl) downloadDataUrl(dataUrl, filename);
    },
    getPngFile: async (filename = 'banshee_status_plot.png') => {
      // wait for chart layers (bands + series + markers) to fully paint
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const dataUrl = chartRef.current?.getPngDataUrl();

      return dataUrl ? dataUrlToFile(dataUrl, filename) : undefined;
    },
  }));

  const { lineConfig, chartData } = useMemo(() => {
    const config: { dataKey: string; label: string; color: string }[] = [];

    bansheeRequests.forEach((br) => {
      if (!br.serialNumber) return;
      const dataKey = `banshee_${br.serialNumber.replace(/\s/g, '_')}`;
      config.push({
        dataKey,
        label: br.serialNumber,
        color: stringToColor(br.serialNumber),
      });
    });

    const xEntries: {
      time: string;
      ts: number;
      readingIdx: number;
      bansheeId: string;
      dataKey: string;
      value: number;
      statusLabel?: string;
    }[] = [];

    bansheeRequests.forEach((br) => {
      if (!br.serialNumber) return;
      const dataKey = `banshee_${br.serialNumber.replace(/\s/g, '_')}`;

      (br.proceqData || []).forEach((pd) => {
        if (!pd.createdTimestamp) return;
        const readings = sortReadingsAscending(pd.readings);
        const dateStr = new Date(pd.createdTimestamp)
          .toISOString()
          .split('T')[0];

        readings.forEach((r, idx) => {
          if (r.elongation == null) return;
          const status = r.status ?? '';
          const value = convertToStatusPlotValue(r.elongation, status);
          const timeLabel =
            readings.length > 1 ? `${dateStr} R${idx + 1}` : dateStr;

          xEntries.push({
            time: timeLabel,
            ts: pd.createdTimestamp,
            readingIdx: idx,
            bansheeId: br.id,
            dataKey,
            value,
            statusLabel: STATUS_TO_BAND_LABEL[status],
          });
        });
      });
    });

    xEntries.sort((a, b) => a.ts - b.ts || a.readingIdx - b.readingIdx);

    const uniqueTimes: string[] = [];
    const seen = new Set<string>();
    xEntries.forEach((e) => {
      if (!seen.has(e.time)) {
        seen.add(e.time);
        uniqueTimes.push(e.time);
      }
    });

    const data = uniqueTimes.map((time) => {
      const row: ChartLineDatum = { time };
      xEntries
        .filter((e) => e.time === time)
        .forEach((e) => {
          row[e.dataKey] = { value: e.value, status: e.statusLabel };
        });
      return row;
    });

    return { lineConfig: config, chartData: data };
  }, [bansheeRequests]);

  if (fetching) {
    return (
      <div className="ui-banshee-h-[400px] ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-2 ui-banshee-text-neutral-500">
        <LoadingSpinner />
        Loading plot...
      </div>
    );
  }

  return (
    <div className="ui-banshee-px-4 ui-banshee-pb-8 ui-banshee-flex-1">
      <ChartLineLinear
        ref={chartRef}
        showAxis
        hideXAxisLabel={false}
        showLegend={true}
        lines={lineConfig}
        data={chartData}
        bands={statusBands}
      />
    </div>
  );
});
