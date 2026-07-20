'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { EChartsOption, ECharts } from 'echarts';
import type { TopLevelFormatterParams } from 'echarts/types/dist/shared';

import { ChartConfig, ChartContainer, EChart } from './chart';
import { Text } from '../base/text';
import { escapeHtml } from '../../lib/utils';

export type StatusBand = {
  from: number;
  to: number;
  label: string;
  color: string;
};

export type ChartLineLinearProps = {
  showAxis?: boolean;
  hideXAxisLabel?: boolean;
  chartLabel?: string;
  showLegend?: boolean;
  data?: { time: string; [key: string]: string | number }[];
  lines?: { dataKey: string; label: string; color: string }[];
  bands?: StatusBand[];
};

export type ChartLineLinearHandle = {
  resetZoom: () => void;
  getPngDataUrl: () => string | undefined;
};

export const description = 'A status plot chart';

const defaultChartData = [
  { time: 'T1', line1: 2.5, line2: 2.3, line3: 3.0 },
  { time: 'T2', line1: 3.5, line2: 2.4, line3: 3.1 },
  { time: 'T3', line1: 0.2, line2: 1.5, line3: 1.0 },
  { time: 'T4', line1: 3.5, line2: 2.2, line3: 3.4 },
  { time: 'T5', line1: 2.5, line2: 3.1, line3: 2.5 },
  { time: 'T6', line1: 3.5, line2: 2.5, line3: 3.6 },
  { time: 'T7', line1: 3.5, line2: 3.4, line3: 3.5 },
  { time: 'T8', line1: 3.5, line2: 2.2, line3: 3.7 },
  { time: 'T9', line1: 4.5, line2: 4.0, line3: 4.9 },
];

const defaultLineConfig = [
  { dataKey: 'line1', label: 'Line 1', color: '#0066cc' },
  { dataKey: 'line2', label: 'Line 2', color: '#ff6b6b' },
  { dataKey: 'line3', label: 'Line 3', color: '#aaaaaa' },
];

const chartConfig = {
  line1: {
    label: 'Line 1',
    color: '#0066cc',
  },
  line2: {
    label: 'Line 2',
    color: '#ff6b6b',
  },
  line3: {
    label: 'Line 3',
    color: '#ffd93d',
  },
} satisfies ChartConfig;

const defaultBands: StatusBand[] = [
  { from: 5, to: 4, label: 'Broken', color: '#ff9999' },
  { from: 4, to: 3, label: 'High Plastic', color: '#ffcc99' },
  { from: 3, to: 2, label: 'Low Plastic', color: '#ffff99' },
  { from: 2, to: 1, label: 'Elastic', color: '#99ff99' },
  { from: 1, to: 0, label: 'Not Measurable', color: '#cccccc' },
];

export const ChartLineLinear = forwardRef<
  ChartLineLinearHandle,
  ChartLineLinearProps
>(function ChartLineLinear(
  {
    showAxis,
    hideXAxisLabel,
    chartLabel,
    showLegend,
    data = defaultChartData,
    lines = defaultLineConfig,
    bands = defaultBands,
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
    getPngDataUrl: () =>
      chartRef.current?.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      }),
  }));

  const xAxisData = data.map((d) => d.time);

  const hasBands = bands.length > 0;

  // Compute Y-axis range from bands (guard against empty array)
  const yMin = hasBands ? Math.min(...bands.map((b) => b.to)) : undefined;
  const yMax = hasBands ? Math.max(...bands.map((b) => b.from)) : undefined;

  // Build markArea data from bands
  const markAreaData: [Record<string, unknown>, Record<string, unknown>][] =
    bands.map((band) => [
      { yAxis: band.to, itemStyle: { color: band.color, opacity: 0.95 } },
      { yAxis: band.from },
    ]);

  // const boundaryValues = hasBands
  //   ? [...new Set(([] as number[]).concat(...bands.map((b) => [b.from, b.to])))]
  //       .filter((v): v is number => v > (yMin ?? 0) && v < (yMax ?? 0))
  //       .sort((a: number, b: number) => a - b)
  //   : [];

  const boundaryValues = hasBands
    ? Array.from(
        new Set(([] as number[]).concat(...bands.map((b) => [b.from, b.to]))),
      )
        .filter((v): v is number => v > (yMin ?? 0) && v < (yMax ?? 0))
        .sort((a, b) => a - b)
    : [];
  const bandMidpoints = new Map<number, string>();
  for (const band of bands) {
    const mid = (band.from + band.to) / 2;
    bandMidpoints.set(mid, band.label);
  }

  const minBandHeight = hasBands
    ? Math.min(...bands.map((b) => b.from - b.to))
    : 1;
  const yAxisInterval = minBandHeight / 2;
  const getStatusLabel = (value: number) =>
    bands.find((band) => value >= band.to && value <= band.from)?.label ?? '';

  const option: EChartsOption = {
    grid: {
      top: 10,
      right: 30,
      bottom: showLegend ? 60 : 40,
      left: showAxis ? 100 : 40,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      show: !hideXAxisLabel,
      axisLabel: { fontSize: 12, color: '#000000' },
      axisTick: { alignWithLabel: true },
      axisLine: { show: false },
    },
    yAxis: {
      type: 'value',
      min: yMin,
      max: yMax,
      interval: yAxisInterval,
      axisLabel: {
        show: showAxis,
        formatter: (value: number) => {
          const rounded = Math.round(value * 1000) / 1000;
          const label = bandMidpoints.get(rounded) ?? '';

          const words = label.split(' ');
          if (words.length >= 2) {
            return words.join('\n');
          }

          return label;
        },
        fontSize: 14,
        color: '#000000',
      },
      axisTick: { show: false },
      axisLine: { show: false },
      splitLine: { show: false },
    },
    tooltip: {
      trigger: 'axis',
      confine: true,
      axisPointer: {
        type: 'line',
        snap: true,
      },
      formatter: (params: TopLevelFormatterParams) => {
        const paramArray = Array.isArray(params) ? params : [params];

        if (!paramArray.length) return '';

        const validPoints = paramArray.filter(
          (p) => p.value !== null && p.value !== undefined,
        );

        if (!validPoints.length) return '';

        const header = `<strong>${escapeHtml(String(validPoints[0].name ?? ''))}</strong><br/>`;

        const body = validPoints
          .map((p) => {
            const marker = (p.marker as string) || '';
            const name = escapeHtml(p.seriesName ?? '');
            const status = escapeHtml(getStatusLabel(Number(p.value)));

            return `${marker} ${name}: ${status}`;
          })
          .join('<br/>');

        return header + body;
      },
    },
    legend: showLegend
      ? {
          type: 'scroll',
          bottom: 0,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 20,
          width: '90%',
          textStyle: { fontSize: 11, color: '#666' },
          data: lines.map((l) => ({
            name: l.label,
            itemStyle: { color: l.color },
          })),
        }
      : undefined,
    dataZoom: [{ type: 'inside', xAxisIndex: 0, start: 0, end: 100 }],
    series: [
      // Status band areas
      {
        type: 'line',
        data: [],
        silent: true,
        markArea: {
          silent: true,
          data: markAreaData,
        },
      },
      {
        type: 'line',
        data: [],
        silent: true,
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { color: 'rgba(0, 0, 0, 0.15)', width: 1, type: 'solid' },
          label: { show: false },
          data: boundaryValues.map((v: number) => ({ yAxis: v })),
        },
      },
      // Data lines
      ...lines.map((line) => ({
        type: 'line' as const,
        name: line.label,
        data: data.map((d) => {
          const value = d[line.dataKey as keyof typeof d];
          return value ?? null;
        }),
        smooth: false,
        lineStyle: { color: line.color, width: 2 },
        itemStyle: { color: line.color },
        symbol: 'circle',
        symbolSize: 6,
      })),
    ],
  };

  return (
    <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-w-full ui-banshee-items-center ui-banshee-h-full">
      <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-w-full ui-banshee-h-full">
        <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-w-full">
          <ChartContainer
            config={chartConfig}
            className="ui-banshee-w-full ui-banshee-relative ui-banshee-z-10 ui-banshee-h-[42vh]"
          >
            <EChart
              chartRef={chartRef}
              option={option}
              className="ui-banshee-w-full ui-banshee-h-full"
            />
          </ChartContainer>
        </div>
      </div>
      {chartLabel && (
        <div>
          <Text variant="small" color="foreground">
            {chartLabel}
          </Text>
        </div>
      )}
    </div>
  );
});
