'use client';

import { useEffect, type MutableRefObject } from 'react';
import type {
  ECharts,
  DataZoomComponentOption,
  ToolboxComponentOption,
} from 'echarts';

/**
 * Reusable ECharts zoom/pan behaviour, shared by every chart in the app so the
 * interaction stays consistent:
 *
 *   - drag           → rubber-band zoom (translucent selection rectangle)
 *   - wheel          → zoom centred on the cursor
 *   - Ctrl + drag    → pan the zoomed view
 *   - pinch / touch  → zoom / pan
 *   - double-click   → reset to the full range
 *
 * `buildZoomOption` produces the `dataZoom` + `toolbox` fragments to merge into
 * an EChartsOption; `useChartZoomInteractions` wires the instance-level actions
 * (rubber-band cursor + double-click reset) that cannot be expressed as options.
 */

export type ZoomAxis = 'x' | 'y' | 'both';
export type ZoomRange = { start: number; end: number };

export type ChartZoomConfig = {
  /** Turn the whole behaviour on/off. Defaults to `true`. */
  enabled?: boolean;
  /** Which axes may be zoomed. Defaults to `'both'`. */
  axis?: ZoomAxis;
  /** Render the native toolbox icons instead of hiding them off-canvas. */
  showToolbox?: boolean;
};

// filterMode is per-axis and MUST be chosen by axis kind, otherwise the
// pixel <-> data coordinate transform desyncs after a zoom:
//
//   X (category axis) -> 'filter'
//     A category axis only maps pixels to the correct band when the visible
//     window is an INTEGER range of category indices. 'filter' slices the data
//     to the window, so indices recompute to the visible subset and the
//     axisPointer/tooltip stay exact. 'none' leaves the extent FRACTIONAL,
//     which makes the pointer snap to a neighbouring category (the reported
//     "2025-04-29 shows as 2025-03-18 R1 with extra series" bug).
//
//   Y (value axis) -> 'none'
//     A value axis converts continuously, so it has no index-rounding problem.
//     Using 'filter' here would drop points whose VALUE is outside the window
//     (breaking lines mid-series), so we only move the viewport instead.
const X_FILTER_MODE = 'filter' as const;
const Y_FILTER_MODE = 'none' as const;

const insideDefaults = {
  type: 'inside',
  zoomOnMouseWheel: true,
  // Plain drag is reserved for rubber-band zoom-select; Ctrl-drag pans.
  moveOnMouseMove: 'ctrl',
  moveOnMouseWheel: false,
  preventDefaultMouseMove: true,
  start: 0,
  end: 100,
} as const;

export type ZoomOptionFragment = {
  dataZoom?: DataZoomComponentOption[];
  toolbox?: ToolboxComponentOption;
};

export function buildZoomOption(
  config: ChartZoomConfig = {},
): ZoomOptionFragment {
  const { enabled = true, axis = 'both', showToolbox = false } = config;
  if (!enabled) return {};

  const zoomX = axis === 'x' || axis === 'both';
  const zoomY = axis === 'y' || axis === 'both';

  const dataZoom: DataZoomComponentOption[] = [];
  if (zoomX) {
    dataZoom.push({
      ...insideDefaults,
      id: 'insideX',
      xAxisIndex: 0,
      filterMode: X_FILTER_MODE,
    });
  }
  if (zoomY) {
    dataZoom.push({
      ...insideDefaults,
      id: 'insideY',
      yAxisIndex: 0,
      filterMode: Y_FILTER_MODE,
    });
  }

  const toolbox: ToolboxComponentOption = {
    show: true,
    // The built-in dataZoom feature powers the rubber-band selection. When the
    // caller does not want visible icons we keep the feature registered but push
    // it off-canvas rather than disabling it.
    ...(showToolbox ? { right: 10, top: 10 } : { right: -9999 }),
    feature: {
      dataZoom: {
        // Match the axes the rubber-band may select to the axes we zoom. The
        // rubber-band reuses the inside components above, so each axis keeps its
        // own filterMode (category = 'filter', value = 'none'). filterMode here
        // only governs auto-created components and is aligned with the X axis.
        xAxisIndex: zoomX ? 0 : false,
        yAxisIndex: zoomY ? 0 : false,
        filterMode: X_FILTER_MODE,
        title: { zoom: 'Zoom', back: 'Reset' },
      },
    },
  };

  return { dataZoom, toolbox };
}

/** Reset every dataZoom component on the instance back to the full range. */
export function resetChartZoom(chart?: ECharts | null): void {
  chart?.dispatchAction({ type: 'dataZoom', start: 0, end: 100 });
}

/** Zoom the x-axis to a window expressed as percentages (0–100). */
export function zoomChartToRange(
  chart: ECharts | null | undefined,
  start: number,
  end: number,
): void {
  const from = Math.max(0, Math.min(100, start));
  const to = Math.max(from, Math.min(100, end));
  chart?.dispatchAction({
    type: 'dataZoom',
    dataZoomIndex: 0,
    start: from,
    end: to,
  });
}

/** Read the current x-axis window as percentages (0–100). */
export function getChartZoom(chart?: ECharts | null): ZoomRange {
  const opt = chart?.getOption() as
    | { dataZoom?: { start?: number; end?: number }[] }
    | undefined;
  const dz = opt?.dataZoom?.[0];
  return { start: dz?.start ?? 0, end: dz?.end ?? 100 };
}

/**
 * Read the current window (as percentages 0–100) of a specific dataZoom
 * component by id, e.g. `getAxisZoomWindow(chart, 'insideY')`. Defaults to the
 * full range when the component is absent.
 */
export function getAxisZoomWindow(
  chart: ECharts | null | undefined,
  id: string,
): ZoomRange {
  const opt = chart?.getOption() as
    | { dataZoom?: { id?: string | number; start?: number; end?: number }[] }
    | undefined;
  const dz = (opt?.dataZoom ?? []).find((d) => d.id === id);
  return { start: dz?.start ?? 0, end: dz?.end ?? 100 };
}

type UseChartZoomInteractionsOptions = {
  enabled?: boolean;
  /**
   * A value that changes whenever the chart option is rebuilt. Re-activating the
   * rubber-band cursor is required after a `setOption` because merging resets the
   * global cursor state.
   */
  optionKey?: unknown;
};

/**
 * Wire the instance-level zoom interactions (rubber-band cursor + double-click
 * reset) onto a persistent ECharts instance held in `chartRef`.
 */
export function useChartZoomInteractions(
  chartRef: MutableRefObject<ECharts | null>,
  { enabled = true, optionKey }: UseChartZoomInteractionsOptions = {},
): void {
  // (Re)activate the rubber-band "zoom select" cursor after every option build.
  useEffect(() => {
    if (!enabled) return;
    chartRef.current?.dispatchAction({
      type: 'takeGlobalCursor',
      key: 'dataZoomSelect',
      dataZoomSelectActive: true,
    });
  }, [chartRef, enabled, optionKey]);

  // Double-click anywhere on the canvas resets to the full range.
  useEffect(() => {
    if (!enabled) return;
    const chart = chartRef.current;
    if (!chart) return;
    const zr = chart.getZr();
    const handleDblClick = () => {
      resetChartZoom(chart);
    };
    zr.on('dblclick', handleDblClick);
    return () => {
      zr.off('dblclick', handleDblClick);
    };
  }, [chartRef, enabled]);
}
