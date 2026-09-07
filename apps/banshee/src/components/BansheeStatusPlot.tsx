'use client';

import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { ChartLineLinear, LoadingSpinner } from '@gsp/ui-banshee';
import type { ChartLineLinearHandle, ChartLineDatum } from '@gsp/ui-banshee';
import type { BansheeRequestsListQuery } from '@/gql/graphql';
import {
  buildReadingChartRows,
  buildReadingTimeline,
} from '@/libs/reading-timeline';
import type { TimelineSeries } from '@/libs/reading-timeline';
import { getStatusPlotPoint, statusPlotBands } from '@/libs/status-plot';
import { downloadDataUrl, dataUrlToFile } from '@/libs/utils';

type BansheeRequestResult =
  BansheeRequestsListQuery['bansheeRequests']['results'][number];

type BansheeProceqData = NonNullable<
  BansheeRequestResult['proceqData']
>[number];

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
    const series: TimelineSeries<BansheeProceqData>[] = [];

    bansheeRequests.forEach((br) => {
      if (!br.serialNumber) return;
      const dataKey = `banshee_${br.serialNumber.replace(/\s/g, '_')}`;
      config.push({
        dataKey,
        label: br.serialNumber,
        color: stringToColor(br.serialNumber),
      });
      series.push({ dataKey, measurements: br.proceqData });
    });

    // Reading-level timestamps, deduped and labelled once for the whole chart.
    const points = buildReadingTimeline(series);

    const data = buildReadingChartRows(
      points,
      (time): ChartLineDatum => ({ time }),
      // Position comes straight from the status the API assigned; readings the
      // API has not classified are not plotted.
      ({ reading, measurement }) => {
        const plotted = getStatusPlotPoint(reading, measurement);

        return plotted
          ? { value: plotted.value, status: plotted.statusLabel }
          : undefined;
      },
    );

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
        bands={statusPlotBands}
        connectNulls
      />
    </div>
  );
});
