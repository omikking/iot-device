'use client';

import type { EChartsOption, ECharts } from 'echarts';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { ChartContainer, EChart } from './chart';
import type { ChartConfig } from './chart';
import { escapeHtml } from '../../lib/utils';

export type DataLineChartProps = {
  yAxisLabel?: string;
  yAxisDomain?: [number, number];
  lines?: { dataKey: string; label: string; color: string }[];
  data: { date: string; [key: string]: string | number | undefined }[];
  enableZoom?: boolean;
  onResetZoom?: () => void;
  legendSelected?: Record<string, boolean>;
  onLegendChange?: (selected: Record<string, boolean>) => void;
};

export type DataLineChartHandle = {
  resetZoom: () => void;
};

const chartConfig = {
  line1: { label: 'Line 1', color: '#0066cc' },
  line2: { label: 'Line 2', color: '#ff6b6b' },
  line3: { label: 'Line 3', color: '#aaaaaa' },
  line4: { label: 'Line 4', color: '#00c853' },
} satisfies ChartConfig;

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
    legendSelected,
    onLegendChange,
  },
  ref,
) {
  const chartRef = useRef<ECharts | null>(null);

  useImperativeHandle(ref, () => ({
    resetZoom: () => {
      chartRef.current?.dispatchAction({
        type: 'dataZoom',
        start: 0,
        end: 100,
      });
    },
  }));
  const xAxisDates = data.map((d) => d.date);

  const markAreas: [{ xAxis: string | number }, { xAxis: string | number }][] =
    [];
  for (let i = 0; i < data.length; i += 2) {
    const start = data[i].date;
    const end = data[i + 1]?.date ?? start;
    markAreas.push([{ xAxis: start }, { xAxis: end }]);
  }

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

  const option: EChartsOption = {
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
    dataZoom: enableZoom
      ? [
          { type: 'inside', xAxisIndex: 0, start: 0, end: 100 },
          { type: 'inside', yAxisIndex: 0, start: 0, end: 100 },
        ]
      : undefined,
    toolbox: enableZoom
      ? {
          feature: {
            dataZoom: {
              title: { zoom: 'Zoom', back: 'Reset zoom' },
            },
            saveAsImage: { title: 'Save' },
          },
        }
      : undefined,
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
      })) ?? []),
    ],
  };

  return (
    <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-w-full ui-banshee-bg-neutral-1">
      <ChartContainer
        config={chartConfig}
        className="ui-banshee-w-full ui-banshee-h-[400px]"
      >
        <EChart
          chartRef={chartRef}
          option={option}
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
