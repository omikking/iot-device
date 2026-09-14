'use client';

import { DataLineChart, LoadingSpinner } from '@gsp/ui-banshee';
import type { DataLineChartHandle } from '@gsp/ui-banshee';
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { BansheeRequestsListQuery } from '@/gql/graphql';
import {
  buildReadingChartRows,
  buildReadingTimeline,
} from '@/libs/reading-timeline';
import type { TimelineSeries } from '@/libs/reading-timeline';
import { downloadDataUrl, dataUrlToFile } from '@/libs/utils';

type BansheeRequestResult =
  BansheeRequestsListQuery['bansheeRequests']['results'][number];

type BansheeProceqData = NonNullable<
  BansheeRequestResult['proceqData']
>[number];

// Export the handle type so page.tsx can use it
export type BansheeDataPlotHandle = {
  resetZoom: () => void;
  downloadPng: (filename?: string) => void;
  getPngFile: (filename?: string) => Promise<File | undefined>;
};

// TODO: replace these constants with values fetched from BoltTypeConstant DB
const ELONGATION_MIN = 0;
const ELONGATION_MAX = 300;
const Y_AXIS_FALLBACK = 10;
const Y_AXIS_STEP = 10;

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

const BansheeDataPlot = forwardRef<
  BansheeDataPlotHandle,
  {
    bansheeRequests: BansheeRequestResult[];
    fetching: boolean;
  }
>(function BansheeDataPlot({ bansheeRequests, fetching }, ref) {
  const chartRef = useRef<DataLineChartHandle>(null);

  // Expose resetZoom and PNG download to parent component
  useImperativeHandle(ref, () => ({
    resetZoom: () => {
      chartRef.current?.resetZoom();
    },
    downloadPng: (filename = 'banshee_data_plot.png') => {
      const dataUrl = chartRef.current?.getPngDataUrl();
      if (dataUrl) downloadDataUrl(dataUrl, filename);
    },
    getPngFile: async (filename = 'banshee_data_plot.png') => {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const dataUrl = chartRef.current?.getPngDataUrl();

      return dataUrl ? dataUrlToFile(dataUrl, filename) : undefined;
    },
  }));

  const [legendSelected, setLegendSelected] = useState<Record<string, boolean>>(
    {},
  );

  const { lineConfig, chartData, seriesMax } = useMemo(() => {
    const config: { dataKey: string; label: string; color: string }[] = [];
    const maxByKey: Record<string, number> = {};
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
      (date): { date: string; [key: string]: string | number } => ({ date }),
      ({ dataKey, reading }) => {
        if (reading.elongation == null) return undefined;

        const elongation = Math.max(
          ELONGATION_MIN,
          Math.min(reading.elongation, ELONGATION_MAX),
        );
        // Same single pass feeds the y-axis domain below.
        if (elongation > (maxByKey[dataKey] ?? 0)) {
          maxByKey[dataKey] = elongation;
        }

        return elongation;
      },
    );

    return { lineConfig: config, chartData: data, seriesMax: maxByKey };
  }, [bansheeRequests]);

  const yMax = useMemo(() => {
    let max = 0;
    for (const cfg of lineConfig) {
      if (legendSelected[cfg.label] === false) continue;
      const m = seriesMax[cfg.dataKey] ?? 0;
      if (m > max) max = m;
    }
    if (max <= 0) return Y_AXIS_FALLBACK;
    const rounded = Math.ceil(max / Y_AXIS_STEP) * Y_AXIS_STEP;
    return Math.min(rounded, ELONGATION_MAX);
  }, [lineConfig, seriesMax, legendSelected]);

  if (fetching) {
    return (
      <div className="ui-banshee-h-[400px] ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-2 ui-banshee-text-neutral-500">
        <LoadingSpinner />
        Loading plot...
      </div>
    );
  }

  return (
    <DataLineChart
      ref={chartRef}
      data={chartData}
      lines={lineConfig}
      yAxisLabel="Total elongation (mm)"
      yAxisDomain={[0, yMax]}
      enableZoom
      showToolbox={false}
      legendSelected={legendSelected}
      onLegendChange={setLegendSelected}
      connectNulls
    />
  );
});

export default BansheeDataPlot;
