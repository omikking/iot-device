'use client';

import { useMemo } from 'react';
import { ChartLineLinear, Headline, LoadingSpinner } from '@gsp/ui-banshee';
import type { StatusBand, ChartLineDatum } from '@gsp/ui-banshee';
import type { BansheeRequestsListQuery } from '@/gql/graphql';
import { sortReadingsAscending } from '@/libs/latest-measurement';

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
    );
  if (elongation <= HIGH_PLASTIC_MAP_UPPER)
    return (
      2 +
      (elongation - LOW_PLASTIC_UPPER) /
        (HIGH_PLASTIC_MAP_UPPER - LOW_PLASTIC_UPPER)
    );
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

  return (
    <div className="ui-banshee-col-span-1 lg:ui-banshee-col-span-2 ui-banshee-h-full ui-banshee-flex ui-banshee-flex-col">
      <Headline
        variant="small"
        color="foreground"
        as="h3"
        isBold
        className="ui-banshee-mb-2"
      >
        Status Overview
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
            bands={statusBands}
          />
        )}
      </div>
    </div>
  );
};
