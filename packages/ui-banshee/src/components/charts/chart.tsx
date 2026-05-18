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
        className={cn('ui-banshee-flex ui-banshee-justify-center ui-banshee-text-xs', className)}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  );
}

type EChartProps = {
  option: EChartsOption;
  className?: string;
  chartRef?: React.MutableRefObject<EChartsInstance | null>;
  onEvents?: Record<string, (params: unknown) => void>;
};

function EChart({ option, className, chartRef, onEvents }: EChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const instanceRef = React.useRef<EChartsInstance | null>(null);
  const onEventsRef = React.useRef(onEvents);
  React.useEffect(() => {
    onEventsRef.current = onEvents;
  }, [onEvents]);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const instance = echarts.init(containerRef.current);
    instanceRef.current = instance;
    if (chartRef) {
      chartRef.current = instance;
    }

    instance.setOption(option);

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
  }, [chartRef, option]);

  return (
    <div
      ref={containerRef}
      className={cn('ui-banshee-w-full ui-banshee-h-full', className)}
    />
  );
}

export { ChartContainer, EChart, useChart };
