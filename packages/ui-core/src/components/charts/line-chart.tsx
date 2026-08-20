'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import type { EChartsOption, ECharts } from 'echarts';
import type { TopLevelFormatterParams } from 'echarts/types/dist/shared';

import { ChartConfig, ChartContainer, EChart } from './chart';
import { Text } from '../base/text';
import { escapeHtml } from '../../lib/utils';
import {
  buildZoomOption,
  getAxisZoomWindow,
  getChartZoom,
  resetChartZoom,
  useChartZoomInteractions,
  zoomChartToRange,
  type ZoomRange,
} from './use-chart-zoom';

export type StatusBand = {
  from: number;
  to: number;
  label: string;
  color: string;
};

/**
 * Y-values at which to render band labels for a given visible y-window: one per
 * band that has ANY portion inside the window, placed at the centre of its
 * *visible* slice. This keeps a band's label on the axis as long as any part of
 * the band is on screen (instead of only when its midpoint is visible).
 */
function visibleBandLabelValues(
  bands: StatusBand[],
  viewMin: number,
  viewMax: number,
): number[] {
  const values: number[] = [];
  for (const band of bands) {
    const lo = Math.min(band.from, band.to);
    const hi = Math.max(band.from, band.to);
    if (hi <= viewMin || lo >= viewMax) continue; // no overlap with viewport
    const visLo = Math.max(lo, viewMin);
    const visHi = Math.min(hi, viewMax);
    values.push((visLo + visHi) / 2);
  }
  return values;
}

/**
 * A single plotted point. Use the object form to attach the *actual* status
 * label (from the source data) so the tooltip shows it verbatim instead of
 * re-deriving a band from the numeric value — the numeric value is lossy at
 * band boundaries and can report the wrong status.
 */
export type ChartLinePoint = { value: number | null; status?: string };

export type ChartLineDatum = {
  time: string;
  [key: string]: string | number | ChartLinePoint | null;
};

export type ChartLineLinearProps = {
  showAxis?: boolean;
  hideXAxisLabel?: boolean;
  chartLabel?: string;
  showLegend?: boolean;
  data?: ChartLineDatum[];
  lines?: { dataKey: string; label: string; color: string }[];
  bands?: StatusBand[];
};

export type { ZoomRange };

export type ChartLineLinearHandle = {
  /** Restore the full x-axis range. */
  resetZoom: () => void;
  /** Zoom to an x-axis window expressed as percentages (0–100). */
  zoomToRange: (start: number, end: number) => void;
  /** Read the current x-axis window as percentages (0–100). */
  getCurrentZoom: () => ZoomRange;
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
      resetChartZoom(chartRef.current);
    },
    zoomToRange: (start: number, end: number) => {
      zoomChartToRange(chartRef.current, start, end);
    },
    getCurrentZoom: () => getChartZoom(chartRef.current),
    getPngDataUrl: () =>
      chartRef.current?.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      }),
  }));

  // Recompute the ECharts option only when the inputs that shape it change.
  // This keeps the memoized object reference stable across unrelated parent
  // re-renders so <EChart> does not run a redundant setOption on every render.
  const option = useMemo<EChartsOption>(() => {
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
    // Pin the y-axis labels to the band midpoints explicitly. Without this the
    // labels rely on ECharts' auto-generated ticks landing exactly on a
    // midpoint; once the y-axis is zoomed the auto-ticks shift off the
    // midpoints and every label resolves to '' (the axis appears to vanish).
    const midpointValues = Array.from(bandMidpoints.keys());

    const minBandHeight = hasBands
      ? Math.min(...bands.map((b) => b.from - b.to))
      : 1;
    const yAxisInterval = minBandHeight / 2;
    const getStatusLabel = (value: number) =>
      bands.find((band) => value >= band.to && value <= band.from)?.label ?? '';

    return {
      // Keep zoom transitions smooth without re-animating on every data patch.
      animation: true,
      animationDurationUpdate: 300,
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
        // Full-range bounds encode the Elastic/Plastic/Broken bands. The y-axis
        // dataZoom narrows the *view* within this range; labels are kept visible
        // via axisLabel.customValues below rather than by pinning the axis.
        min: yMin,
        max: yMax,
        interval: yAxisInterval,
        axisLabel: {
          show: showAxis,
          // Render labels only at the band midpoints, no matter where the zoom
          // window falls, so the y-axis stays visible after zooming.
          customValues: midpointValues,
          // Resolve by the band that contains the value (range lookup) instead
          // of an exact-midpoint match, so float precision never blanks a label.
          formatter: (value: number) => {
            const label = getStatusLabel(value);

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
              // Prefer the actual status carried on the point; only fall back to
              // deriving it from the value when no status was provided.
              const carried = (p.data as { statusLabel?: string } | null)
                ?.statusLabel;
              const status = escapeHtml(
                carried ?? getStatusLabel(Number(p.value)),
              );

              return `${marker} ${name}: ${status}`;
            })
            .join('<br/>');

          return header + body;
        },
      },
      // Shared, reusable zoom/pan behaviour (inside + rubber-band toolbox) on
      // both axes. Injects `dataZoom` + `toolbox` fragments.
      ...buildZoomOption({ axis: 'both' }),
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
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.15)',
              width: 1,
              type: 'solid',
            },
            label: { show: false },
            data: boundaryValues.map((v: number) => ({ yAxis: v })),
          },
        },
        // Data lines
        ...lines.map((line) => ({
          type: 'line' as const,
          name: line.label,
          data: data.map((d) => {
            const raw = d[line.dataKey as keyof typeof d];
            // Object form carries the actual status; plain form is value-only.
            if (typeof raw === 'object' && raw !== null) {
              return { value: raw.value, statusLabel: raw.status };
            }
            return { value: typeof raw === 'number' ? raw : null };
          }),
          smooth: false,
          lineStyle: { color: line.color, width: 2 },
          itemStyle: { color: line.color },
          symbol: 'circle',
          symbolSize: 6,
          // Downsample dense series so tens of thousands of points stay smooth.
          sampling: 'lttb' as const,
          large: true,
        })),
      ],
    };
  }, [data, lines, bands, showAxis, hideXAxisLabel, showLegend]);

  // Rubber-band cursor + double-click reset, kept active across option rebuilds.
  useChartZoomInteractions(chartRef, { optionKey: option });

  // Keep every visible band's label on the y-axis while zooming. On each zoom we
  // reposition each label to the centre of its band's visible slice, so a label
  // stays as long as any part of its band is in view. Re-runs on `option`
  // changes (data updates keep their zoom via preserveDataZoom).
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || bands.length === 0) return;

    const yMin = Math.min(...bands.map((b) => b.to));
    const yMax = Math.max(...bands.map((b) => b.from));
    const range = yMax - yMin;

    const updateBandLabels = () => {
      const { start, end } = getAxisZoomWindow(chart, 'insideY');
      const viewMin = yMin + (start / 100) * range;
      const viewMax = yMin + (end / 100) * range;
      chart.setOption(
        {
          yAxis: {
            axisLabel: {
              customValues: visibleBandLabelValues(bands, viewMin, viewMax),
            },
          },
        },
        { lazyUpdate: true },
      );
    };

    updateBandLabels();
    chart.on('datazoom', updateBandLabels);
    return () => {
      chart.off('datazoom', updateBandLabels);
    };
  }, [option, bands]);

  return (
    <div className="ds-flex ds-flex-col ds-w-full ds-items-center ds-h-full">
      <div className="ds-flex ds-flex-row ds-w-full ds-h-full">
        <div className="ds-flex ds-flex-col ds-w-full">
          <ChartContainer
            config={chartConfig}
            className="ds-w-full ds-relative ds-z-10 ds-h-[42vh]"
          >
            <EChart
              chartRef={chartRef}
              option={option}
              preserveDataZoom
              className="ds-w-full ds-h-full"
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
