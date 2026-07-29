'use client';

import * as React from 'react';
import * as echarts from 'echarts';
import type { ECharts as EChartsInstance, EChartsOption } from 'echarts';

import { cn } from '../../lib/utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ReactNode;
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          'ui-banshee-flex ui-banshee-justify-center ui-banshee-text-xs',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

type DataZoomState = { id?: string | number; start?: number; end?: number };

type EChartProps = {
  option: EChartsOption;
  className?: string;
  chartRef?: React.MutableRefObject<EChartsInstance | null>;
  onEvents?: Record<string, (params: unknown) => void>;
  /**
   * How subsequent option updates are merged. Defaults to `true` (replace the
   * whole option) which mirrors the historical re-init behaviour and is the
   * safe choice for charts whose element count changes (e.g. donuts).
   */
  notMerge?: boolean;
  /**
   * When true, the current x-axis `dataZoom` window is carried across option
   * updates so incoming data does not snap the chart back to the full range.
   */
  preserveDataZoom?: boolean;
};

function EChart({
  option,
  className,
  chartRef,
  onEvents,
  notMerge = true,
  preserveDataZoom = false,
}: EChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const instanceRef = React.useRef<EChartsInstance | null>(null);
  const onEventsRef = React.useRef(onEvents);
  React.useEffect(() => {
    onEventsRef.current = onEvents;
  }, [onEvents]);

  // Create the instance once; keep it alive for the component's lifetime so
  // zoom state, animations and hover interactions survive data updates.
  React.useEffect(() => {
    if (!containerRef.current) return;

    const instance = echarts.init(containerRef.current);
    instanceRef.current = instance;
    if (chartRef) {
      chartRef.current = instance;
    }

    const events = onEventsRef.current;
    if (events) {
      for (const [name, handler] of Object.entries(events)) {
        instance.on(name, handler);
      }
    }

    const handleResize = () => {
      instance.resize();
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      instance.dispose();
      instanceRef.current = null;
      if (chartRef) {
        chartRef.current = null;
      }
    };
  }, [chartRef]);

  // Push option changes into the persistent instance instead of recreating it.
  React.useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;

    let nextOption = option;

    if (preserveDataZoom && Array.isArray(option.dataZoom)) {
      const current = instance.getOption() as {
        dataZoom?: DataZoomState[];
      } | null;
      const currentZoom = current?.dataZoom;

      if (currentZoom?.length) {
        // Preserve each axis window independently by matching on the dataZoom
        // component id (falling back to positional index), so an incoming data
        // update never snaps X or Y back to the full range.
        const byId = new Map(
          currentZoom
            .filter((z) => z.id !== undefined && z.id !== null)
            .map((z) => [z.id, z] as const),
        );

        nextOption = {
          ...option,
          dataZoom: option.dataZoom.map((dz, index) => {
            const entry = dz as DataZoomState;
            const hasId = entry.id !== undefined && entry.id !== null;
            const prev =
              (hasId ? byId.get(entry.id) : undefined) ?? currentZoom[index];
            return prev
              ? { ...entry, start: prev.start, end: prev.end }
              : entry;
          }),
        };
      }
    }

    instance.setOption(nextOption, { notMerge, lazyUpdate: true });
  }, [option, notMerge, preserveDataZoom]);

  return (
    <div
      ref={containerRef}
      className={cn('ui-banshee-w-full ui-banshee-h-full', className)}
    />
  );
}

export { ChartContainer, EChart, useChart };
