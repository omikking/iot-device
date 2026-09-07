'use client';

import { ChartPieDonut, LoadingSpinner } from '@gsp/ui-banshee';
import { useMemo } from 'react';
import { getStatusColorHex, getStatusLabel } from '@/libs/status-color-utils';

type StatusCount = {
  status: string;
  count: number;
};

type ChartDataItem = {
  legend: string;
  label: string;
  value: number;
  fill: string;
};

type ChartItem = {
  label: string;
  value: string;
  color: string;
};

type ChartConfigItem = {
  label: string;
  color?: string;
};

type ChartConfig = Record<string, ChartConfigItem>;

export const StatusDistributionChart = ({
  statusCounts,
  fetching = false,
}: {
  statusCounts: StatusCount[];
  fetching?: boolean;
}) => {
  const filteredCounts = useMemo(
    () =>
      (statusCounts || []).filter(
        (item: StatusCount) =>
          item.status && item.status.toLowerCase() !== 'not_measurable',
      ),
    [statusCounts],
  );

  const chartData = useMemo(
    () =>
      filteredCounts.map((item: StatusCount): ChartDataItem => {
        return {
          legend: getStatusLabel(item.status),
          label: item.status,
          value: item.count,
          fill: getStatusColorHex(item.status),
        };
      }),
    [filteredCounts],
  );

  const chartItems = useMemo(
    () =>
      filteredCounts.map((item: StatusCount): ChartItem => {
        return {
          label: getStatusLabel(item.status),
          value: item.count.toString(),
          color: getStatusColorHex(item.status),
        };
      }),
    [filteredCounts],
  );

  const chartConfigDynamic = useMemo(
    (): ChartConfig => ({
      status: { label: 'status' },
      ...Object.fromEntries(
        filteredCounts.map((item: StatusCount) => [
          item.status,
          {
            label: getStatusLabel(item.status),
            color: getStatusColorHex(item.status),
          },
        ]),
      ),
    }),
    [filteredCounts],
  );

  return (
    <div className="ui-banshee-col-span-1 lg:ui-banshee-col-span-3 ui-banshee-bg-neutral-1 ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-p-10">
      {fetching ? (
        <div className="ui-banshee-h-full ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-2 ui-banshee-text-neutral-500">
          <LoadingSpinner />
          Loading distribution...
        </div>
      ) : (
        <ChartPieDonut
          chartData={chartData}
          chartConfig={chartConfigDynamic}
          chartItems={chartItems}
        />
      )}
    </div>
  );
};
