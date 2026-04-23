'use client';

import { DataLineChart } from '@gsp/ui-banshee';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import type { BansheeRequestsListQuery } from '@/gql/graphql';

type BansheeRequestResult =
  BansheeRequestsListQuery['bansheeRequests']['results'][number];

// Export the handle type so page.tsx can use it
export type BansheeDataPlotHandle = {
  resetZoom: () => void;
};

// TODO: replace these constants with values fetched from BoltTypeConstant DB
const ELONGATION_MIN = 0;
const ELONGATION_MAX = 150;

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
  const chartRef = useRef<{ resetZoom: () => void }>(null);

  // Expose resetZoom to parent component
  useImperativeHandle(ref, () => ({
    resetZoom: () => {
      chartRef.current?.resetZoom();
    },
  }));

  const { lineConfig, chartData, yMax } = useMemo(() => {
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
    }[] = [];

    let maxElongation = 0;

    bansheeRequests.forEach((br) => {
      if (!br.serialNumber) return;
      const dataKey = `banshee_${br.serialNumber.replace(/\s/g, '_')}`;

      (br.proceqData || []).forEach((pd) => {
        if (!pd.createdTimestamp) return;
        const readings = pd.readings || [];
        const dateStr = new Date(pd.createdTimestamp)
          .toISOString()
          .split('T')[0];

        readings.forEach((r, idx) => {
          if (r.elongation == null) return;
          const elongation = Math.max(
            ELONGATION_MIN,
            Math.min(r.elongation, ELONGATION_MAX),
          );
          if (elongation > maxElongation) maxElongation = elongation;
          const timeLabel =
            readings.length > 1 ? `${dateStr} R${idx + 1}` : dateStr;

          xEntries.push({
            time: timeLabel,
            ts: pd.createdTimestamp,
            readingIdx: idx,
            bansheeId: br.id,
            dataKey,
            value: elongation,
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
      const row: { date: string; [key: string]: string | number } = {
        date: time,
      };
      xEntries
        .filter((e) => e.time === time)
        .forEach((e) => {
          row[e.dataKey] = e.value;
        });
      return row;
    });

    const computedYMax = ELONGATION_MAX;

    return { lineConfig: config, chartData: data, yMax: computedYMax };
  }, [bansheeRequests]);

  if (fetching) {
    return (
      <div className="ui-banshee-h-[400px] ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-text-neutral-500">
        Loading plot...
      </div>
    );
  }

  return (
    <DataLineChart
      ref={chartRef}
      data={chartData}
      lines={lineConfig}
      yAxisLabel="Elongation (µm)"
      yAxisDomain={[0, yMax]}
      enableZoom
    />
  );
});

export default BansheeDataPlot;
