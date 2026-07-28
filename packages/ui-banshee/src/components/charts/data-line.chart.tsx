'use client';

import type { EChartsOption, ECharts } from 'echarts';
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { ChartContainer, EChart } from './chart';
import type { ChartConfig } from './chart';
import { escapeHtml } from '../../lib/utils';
import {
  buildZoomOption,
  resetChartZoom,
  useChartZoomInteractions,
} from './use-chart-zoom';

export type DataLineChartProps = {
  yAxisLabel?: string;
  yAxisDomain?: [number, number];
  lines?: { dataKey: string; label: string; color: string }[];
  data: { date: string; [key: string]: string | number | undefined }[];
  enableZoom?: boolean;
  showToolbox?: boolean;
  onResetZoom?: () => void;
  legendSelected?: Record<string, boolean>;
  onLegendChange?: (selected: Record<string, boolean>) => void;
};

export type DataLineChartHandle = {
  resetZoom: () => void;
  getPngDataUrl: () => string | undefined;
};

const chartConfig = {
  line1: { label: 'Line 1', color: '#0066cc' },
  line2: { label: 'Line 2', color: '#ff6b6b' },
  line3: { label: 'Line 3', color: '#aaaaaa' },
  line4: { label: 'Line 4', color: '#00c853' },
} satisfies ChartConfig;

const normalizeValue = (value: unknown): string => {
  if (value === null) return '';

  if (Array.isArray(value)) {
    return String(value[1] ?? value[0] ?? '');
  }

  if (typeof value === 'object') {
    return String((value as Record<string, unknown>).value ?? '');
  }

  return String(value);
};

export const DataLineChart = forwardRef<
  DataLineChartHandle,
  DataLineChartProps
>(function DataLineChart(
  {
    data,
    lines,
    yAxisLabel = 'Elongation (mm)',
    yAxisDomain = [0, 12],
    enableZoom = false,
    showToolbox = true,
    legendSelected,
    onLegendChange,
  },
  ref,
) {
  const chartRef = useRef<ECharts | null>(null);

  useImperativeHandle(ref, () => ({
    resetZoom: () => {
      resetChartZoom(chartRef.current);
    },
    getPngDataUrl: () =>
      chartRef.current?.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      }),
  }));
  // Memoize so unrelated parent re-renders don't rebuild the option / re-run
  // setOption; only data/config/zoom/legend changes trigger an update.
  const option = useMemo<EChartsOption>(() => {
    const xAxisDates = data.map((d) => d.date);

    const markAreas: [
      { xAxis: string | number },
      { xAxis: string | number },
    ][] = [];
    for (let i = 0; i < data.length; i += 2) {
      const start = data[i].date;
      const end = data[i + 1]?.date ?? start;
      markAreas.push([{ xAxis: start }, { xAxis: end }]);
    }

    return {
      animation: true,
      animationDurationUpdate: 300,
      grid: {
        top: 20,
        right: 30,
        bottom: 60,
        left: 60,
      },
      xAxis: {
        type: 'category',
        data: xAxisDates,
        axisLabel: { fontSize: 12 },
        axisTick: { alignWithLabel: true },
        axisLine: { show: false },
      },
      yAxis: {
        type: 'value',
        min: yAxisDomain[0],
        max: yAxisDomain[1],
        axisLabel: { fontSize: 12 },
        axisLine: { show: false },
        splitLine: { show: false },
        name: yAxisLabel,
        nameLocation: 'middle',
        nameGap: 45,
        nameTextStyle: { fontSize: 12 },
      },
      tooltip: {
        trigger: 'axis',
        confine: true,
        backgroundColor: '#000',
        borderColor: '#000',
        textStyle: { color: '#fff', fontSize: 12 },
        formatter: (params) => {
          const items = Array.isArray(params) ? params : [params];

          return items
            .filter((p) => p.value !== null)
            .map((p) => {
              const value = Array.isArray(p.value) ? p.value[1] : p.value;

              return `<div>${escapeHtml(String(p.seriesName ?? ''))}: ${normalizeValue(value)}</div>`;
            })
            .join('');
        },
      },
      legend: {
        type: 'scroll',
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 20,
        width: '90%',
        textStyle: { fontSize: 11, color: '#666' },
        data:
          lines?.map((l) => ({
            name: l.label,
            itemStyle: { color: l.color },
          })) ?? [],
        selected: legendSelected,
      },
      // Shared, reusable zoom/pan behaviour on both axes.
      ...buildZoomOption({ enabled: enableZoom, axis: 'both', showToolbox }),
      series: [
        ...(markAreas.length > 0
          ? [
              {
                type: 'line' as const,
                data: [],
                silent: true,
                markArea: {
                  silent: true,
                  itemStyle: { color: '#EAEAEA', opacity: 1 },
                  data: markAreas,
                },
              },
            ]
          : []),
        {
          type: 'line' as const,
          data: [],
          silent: true,
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { color: '#E4E4E4', width: 1 },
            label: { show: false },
            data: [{ yAxis: 3 }, { yAxis: 6 }, { yAxis: 9 }, { yAxis: 12 }],
          },
        },
        ...(lines?.map((line) => ({
          type: 'line' as const,
          name: line.label,
          data: data.map((d) => ({
            value: d[line.dataKey] ?? null,
          })),
          smooth: false,
          lineStyle: { color: line.color, width: 2 },
          itemStyle: { color: line.color },
          symbol: 'circle',
          symbolSize: 6,
          connectNulls: false,
          sampling: 'lttb' as const,
          large: true,
        })) ?? []),
      ],
    };
  }, [
    data,
    lines,
    yAxisLabel,
    yAxisDomain,
    enableZoom,
    showToolbox,
    legendSelected,
  ]);

  // Rubber-band cursor + double-click reset (only when zoom is enabled).
  useChartZoomInteractions(chartRef, {
    enabled: enableZoom,
    optionKey: option,
  });

  return (
    <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-w-full ui-banshee-bg-neutral-1">
      <ChartContainer
        config={chartConfig}
        className="ui-banshee-w-full ui-banshee-h-[400px]"
      >
        <EChart
          chartRef={chartRef}
          option={option}
          preserveDataZoom={enableZoom}
          className="ui-banshee-w-full ui-banshee-h-full"
          onEvents={
            onLegendChange
              ? {
                  legendselectchanged: (params) => {
                    const selected = (
                      params as { selected?: Record<string, boolean> }
                    ).selected;
                    if (selected) onLegendChange(selected);
                  },
                }
              : undefined
          }
        />
      </ChartContainer>
    </div>
  );
});
