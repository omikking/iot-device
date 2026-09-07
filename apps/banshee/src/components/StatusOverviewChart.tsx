'use client';

import { useMemo } from 'react';
import { ChartLineLinear, Headline, LoadingSpinner } from '@gsp/ui-banshee';
import type { ChartLineDatum } from '@gsp/ui-banshee';
import type { BansheeRequestsListQuery } from '@/gql/graphql';
import { sortReadingsAscending } from '@/libs/latest-measurement';
import { getStatusPlotPoint, statusPlotBands } from '@/libs/status-plot';

type BansheeRequestResult =
  BansheeRequestsListQuery['bansheeRequests']['results'][number];

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

export const StatusOverviewChart = ({
  bansheeRequests = [],
  fetching = false,
}: {
  bansheeRequests?: BansheeRequestResult[];
  fetching?: boolean;
}) => {
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
          // Position comes straight from the status the API assigned; readings
          // the API has not classified are not plotted.
          const point = getStatusPlotPoint(r, pd);
          if (!point) return;

          const timeLabel =
            readings.length > 1 ? `${dateStr} R${idx + 1}` : dateStr;

          xEntries.push({
            time: timeLabel,
            ts: pd.createdTimestamp,
            readingIdx: idx,
            bansheeId: br.id,
            dataKey,
            value: point.value,
            statusLabel: point.statusLabel,
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

  return (
    <div className="ui-banshee-col-span-1 lg:ui-banshee-col-span-2 ui-banshee-h-full ui-banshee-flex ui-banshee-flex-col">
      <Headline
        variant="small"
        color="foreground"
        as="h3"
        isBold
        className="ui-banshee-mb-2"
      >
        Status overview
      </Headline>

      <div className="ui-banshee-bg-neutral-1 ui-banshee-p-4 ui-banshee-h-full">
        {fetching ? (
          <div className="ui-banshee-h-full ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-2 ui-banshee-text-neutral-500">
            <LoadingSpinner />
            Loading plot...
          </div>
        ) : (
          <ChartLineLinear
            showAxis={false}
            hideXAxisLabel={true}
            showLegend={false}
            lines={lineConfig}
            data={chartData}
            bands={statusPlotBands}
          />
        )}
      </div>
    </div>
  );
};
