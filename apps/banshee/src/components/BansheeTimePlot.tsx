'use client';

import { LoadingSpinner, TimePlotChart } from '@gsp/ui-banshee';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { BansheeRequestsListQuery } from '@/gql/graphql';
import { downloadDataUrl, dataUrlToFile } from '@/libs/utils';
import { BansheeExportMenu } from '@/components/BansheeExportMenu';

type BansheeRequestResult =
  BansheeRequestsListQuery['bansheeRequests']['results'][number];

type PlotProps = {
  bansheeRequests: BansheeRequestResult[];
  fetching: boolean;
};

export type BansheeTimePlotHandle = {
  resetZoom: () => void;
  downloadPng: (filename?: string) => void;
  getPngFile: (filename?: string) => Promise<File | undefined>;
};

type DummySensorSeries = {
  name: string;
  color: string;
  values: number[];
  profile: Array<[number, number]>;
};

type ChartRefLike = {
  dispatchAction: (action: Record<string, unknown>) => void;
  getDataURL: (options: Record<string, unknown>) => string;
};

type LegendSelection = Record<string, boolean>;

const DATE_LABELS = [
  'Jan 24',
  'Mar 24',
  'May 24',
  'Jul 24',
  'Sep 24',
  'Nov 24',
  'Jan 25',
  'Mar 25',
  'May 25',
];

const BOTTOM_BLUE = '#2563EB';
const MEASURING_POINTS = [284, 500, 726, 945, 1200, 1390, 1615, 1835, 2060];

const buildSensorLegend = (index: number) =>
  `S${index + 1}_${MEASURING_POINTS[index]}`;

const buildBottomLegend = (index: number) =>
  `T${index + 1}(s)=${MEASURING_POINTS[index]}`;

const isLegendVisible = (
  legendSelected: Record<string, boolean>,
  label: string,
) => legendSelected[label] !== false;

const withStartFromZero = (values: number[]) =>
  values.map((value, index) => (index === 0 ? 0 : value));

function generateRandomHexcolorcode() {
  const hexcode = Math.floor(Math.random() * 16777215).toString(16);
  return '#' + hexcode.padStart(6, '0');
}

const DUMMY_SERIES: DummySensorSeries[] = [
  {
    name: buildSensorLegend(0),
    color: generateRandomHexcolorcode(),
    values: [2.8, 4.6, 5.9, 7.3, 8.5, 9.8, 11.0, 12.3, 13.9],
    profile: [
      [0, 0.0],
      [220, 0.0],
      [420, 0.1],
      [620, 0.1],
      [820, 0.2],
      [1020, 0.5],
      [1220, 1.0],
      [1420, 1.8],
      [1620, 1.2],
    ],
  },
  {
    name: buildSensorLegend(1),
    color: generateRandomHexcolorcode(),
    values: [0.1, 0.7, 1.9, 3.2, 4.1, 5.3, 6.4, 7.2, 7.9],
    profile: [
      [0, 0.0],
      [220, 0.0],
      [420, 0.0],
      [620, 0.1],
      [820, 0.3],
      [1020, 0.8],
      [1220, 1.6],
      [1420, 3.2],
      [1620, 1.4],
    ],
  },
  {
    name: buildSensorLegend(2),
    color: generateRandomHexcolorcode(),
    values: [0.0, 0.1, 0.9, 1.6, 2.8, 4.1, 5.6, 6.8, 7.5],
    profile: [
      [0, 0.0],
      [220, 0.0],
      [420, 0.0],
      [620, 0.0],
      [820, 0.1],
      [1020, 0.6],
      [1220, 2.8],
      [1420, 6.2],
      [1620, 2.0],
    ],
  },
  {
    name: buildSensorLegend(3),
    color: generateRandomHexcolorcode(),
    values: [0.0, 0.0, 0.2, 0.6, 1.4, 2.3, 3.0, 3.7, 4.6],
    profile: [
      [0, 0.0],
      [220, 0.0],
      [420, 0.0],
      [620, 0.0],
      [820, 0.2],
      [1020, 1.5],
      [1220, 4.8],
      [1420, 10.2],
      [1620, 2.1],
    ],
  },
  {
    name: buildSensorLegend(4),
    color: generateRandomHexcolorcode(),
    values: [0.0, 0.0, 0.1, 0.4, 0.9, 1.3, 1.8, 2.6, 3.1],
    profile: [
      [0, 0.0],
      [220, 0.0],
      [420, 0.0],
      [620, 0.1],
      [820, 0.3],
      [1020, 0.9],
      [1220, 2.1],
      [1420, 4.0],
      [1620, 1.0],
    ],
  },
  {
    name: buildSensorLegend(5),
    color: generateRandomHexcolorcode(),
    values: [0.0, 0.0, 0.0, 0.3, 0.6, 1.1, 1.9, 2.4, 2.8],
    profile: [
      [0, 0.0],
      [220, 0.0],
      [420, 0.0],
      [620, 0.0],
      [820, 0.2],
      [1020, 0.7],
      [1220, 1.8],
      [1420, 3.5],
      [1620, 1.1],
    ],
  },
  {
    name: buildSensorLegend(6),
    color: generateRandomHexcolorcode(),
    values: [0.0, 0.0, 0.0, 0.2, 0.5, 0.8, 1.3, 1.9, 2.2],
    profile: [
      [0, 0.0],
      [220, 0.0],
      [420, 0.0],
      [620, 0.0],
      [820, 0.1],
      [1020, 0.5],
      [1220, 1.4],
      [1420, 2.8],
      [1620, 0.8],
    ],
  },
  {
    name: buildSensorLegend(7),
    color: generateRandomHexcolorcode(),
    values: [0.0, 0.0, 0.0, 0.1, 0.4, 0.6, 1.1, 1.4, 1.7],
    profile: [
      [0, 0.0],
      [220, 0.0],
      [420, 0.0],
      [620, 0.0],
      [820, 0.1],
      [1020, 0.4],
      [1220, 1.0],
      [1420, 2.1],
      [1620, 0.7],
    ],
  },
  {
    name: buildSensorLegend(8),
    color: generateRandomHexcolorcode(),
    values: [0.0, 0.0, 0.0, 0.1, 0.3, 0.4, 0.8, 1.0, 1.2],
    profile: [
      [0, 0.0],
      [220, 0.0],
      [420, 0.0],
      [620, 0.0],
      [820, 0.1],
      [1020, 0.3],
      [1220, 0.8],
      [1420, 1.8],
      [1620, 0.5],
    ],
  },
];

const TimePlotToolbar = ({
  onResetZoom,
  onDownloadCsv,
  onDownloadPng,
}: {
  onResetZoom: () => void;
  onDownloadCsv: () => void;
  onDownloadPng: () => void;
}) => {
  return (
    <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-justify-between ui-banshee-px-6 ui-banshee-py-4 ui-banshee-border-b ui-banshee-bg-neutral-1">
      <p className="ui-banshee-text-sm ui-banshee-text-neutral-700">
        Click and drag in the plot area to zoom in. Hold CTRL and drag to pan
      </p>
      <div className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-2">
        <button
          type="button"
          className="ui-banshee-px-4 ui-banshee-py-1 ui-banshee-text-sm ui-banshee-bg-white ui-banshee-border ui-banshee-border-neutral-300 ui-banshee-rounded"
          onClick={onResetZoom}
        >
          Reset zoom
        </button>
        <BansheeExportMenu
          onDownloadCsv={onDownloadCsv}
          onDownloadPng={onDownloadPng}
        />
      </div>
    </div>
  );
};

const BansheeTimePlot = forwardRef<BansheeTimePlotHandle, PlotProps>(
  function BansheeTimePlot({ fetching }, ref) {
    const timePlotStressRef = useRef<ChartRefLike | null>(null);
    const timePlotStrainRef = useRef<ChartRefLike | null>(null);

    const [legendSelected, setLegendSelected] = useState<LegendSelection>({});
    const [selectedSensorIndex, setSelectedSensorIndex] = useState<
      number | null
    >(null);
    const [hoveredBottomPointIndex, setHoveredBottomPointIndex] = useState<
      number | null
    >(null);
    const [selectedBottomPointIndex, setSelectedBottomPointIndex] = useState<
      number | null
    >(null);

    const selectedSensor = useMemo(() => {
      if (selectedSensorIndex == null) return null;
      return DUMMY_SERIES[selectedSensorIndex] ?? null;
    }, [selectedSensorIndex]);

    const topLegendItems = useMemo(
      () =>
        DUMMY_SERIES.map((entry) => ({
          label: entry.name,
          color: entry.color,
        })),
      [],
    );

    const bottomLegendLabel = useMemo(() => {
      if (selectedSensorIndex == null) return '';
      return buildBottomLegend(selectedSensorIndex);
    }, [selectedSensorIndex]);

    const handleTopLineClick = useCallback((params: unknown) => {
      const eventParams = params as {
        componentType?: string;
        seriesType?: string;
        seriesIndex?: number;
      };

      // componentType - series, xAxis, yAxis, legend, markLine
      // seriesType - line, bar, scatter, pie, radar, map, etc.

      if (
        eventParams.componentType !== 'series' ||
        eventParams.seriesType !== 'line'
      ) {
        return;
      }

      const seriesIndex = eventParams.seriesIndex;
      if (typeof seriesIndex !== 'number') {
        return;
      }

      setSelectedSensorIndex((current) =>
        current === seriesIndex ? null : seriesIndex,
      );
      setSelectedBottomPointIndex(null);
      setHoveredBottomPointIndex(null);
    }, []);

    const handleLegendToggle = useCallback((label: string) => {
      setLegendSelected((current) => ({
        ...current,
        [label]: !isLegendVisible(current, label),
      }));
    }, []);

    const handleBottomPointHover = useCallback((params: unknown) => {
      const dataIndex = (params as { dataIndex?: number }).dataIndex;
      if (typeof dataIndex === 'number') {
        setHoveredBottomPointIndex(dataIndex);
      }
    }, []);

    const handleBottomPointSelect = useCallback((params: unknown) => {
      const dataIndex = (params as { dataIndex?: number }).dataIndex;
      if (typeof dataIndex === 'number') {
        setSelectedBottomPointIndex((current) =>
          current === dataIndex ? null : dataIndex,
        );
      }
    }, []);

    const handleBoltDotHover = useCallback((index: number) => {
      setHoveredBottomPointIndex(index);
    }, []);

    const handleBoltDotSelect = useCallback((index: number) => {
      setSelectedBottomPointIndex((current) =>
        current === index ? null : index,
      );
    }, []);

    const topOption = useMemo<any>(() => {
      return {
        animation: true,
        grid: {
          top: 12,
          right: 18,
          bottom: 48,
          left: 64,
        },
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: (params: any) => {
            if (params?.value == null) return '';
            return `${params.seriesName}<br/>Date: ${params.name}<br/>Stress: ${params.value} MPa`;
          },
        },
        legend: {
          show: false,
        },
        xAxis: {
          type: 'category',
          data: DATE_LABELS,
          axisLabel: { color: '#111827', fontSize: 11 },
          axisTick: {
            show: true,
            alignWithLabel: true,
            length: 5,
            lineStyle: { color: '#9CA3AF' },
          },
          axisLine: { lineStyle: { color: '#9CA3AF' } },
          splitLine: { show: false },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(17,24,39,0.03)', 'rgba(17,24,39,0.08)'],
            },
          },
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 16,
          interval: 4,
          name: 'Stress (MPa)',
          nameLocation: 'middle',
          nameGap: 48,
          axisLabel: { color: '#111827', fontSize: 11 },
          axisTick: { show: true, length: 5, lineStyle: { color: '#9CA3AF' } },
          axisLine: { lineStyle: { color: '#9CA3AF' } },
          splitLine: {
            show: true,
            lineStyle: { color: '#E5E7EB', width: 1, type: 'solid' },
          },
        },
        dataZoom: [
          { type: 'inside', xAxisIndex: 0, start: 0, end: 100 },
          { type: 'inside', yAxisIndex: 0, start: 0, end: 100 },
        ],
        series: DUMMY_SERIES.map((entry) => {
          const normalizedValues = withStartFromZero(entry.values);

          return {
            type: 'line',
            name: entry.name,
            data: isLegendVisible(legendSelected, entry.name)
              ? normalizedValues
              : normalizedValues.map(() => null),
            smooth: true,
            symbol: 'none',
            showSymbol: false,
            triggerLineEvent: true,
            lineStyle: { width: 2, color: entry.color },
            connectNulls: false,
          };
        }),
      };
    }, [legendSelected]);

    const bottomOption = useMemo<any>(() => {
      if (!selectedSensor) return {};

      return {
        animation: false,
        grid: {
          top: 12,
          right: 18,
          bottom: 44,
          left: 64,
        },
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: (params: any) => {
            if (!Array.isArray(params?.value)) return '';
            const [x, y] = params.value as [number, number];
            return `${selectedSensor.name}<br/>Position: ${x} mm<br/>Strain: ${y} %`;
          },
        },
        legend: {
          show: false,
        },
        xAxis: {
          type: 'value',
          min: 0,
          max: 2000,
          interval: 500,
          name: 'Position along the bolt (mm)',
          nameLocation: 'middle',
          nameGap: 36,
          axisLine: { lineStyle: { color: '#9CA3AF' } },
          axisLabel: { color: '#111827', fontSize: 11 },
          axisTick: { show: true, length: 5, lineStyle: { color: '#9CA3AF' } },
          splitLine: { show: false },
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 20,
          interval: 5,
          name: 'Strain (%)',
          nameLocation: 'middle',
          nameGap: 42,
          axisLine: { lineStyle: { color: '#9CA3AF' } },
          axisLabel: { color: '#111827', fontSize: 11 },
          axisTick: { show: true, length: 5, lineStyle: { color: '#9CA3AF' } },
          splitLine: {
            show: true,
            lineStyle: { color: '#E5E7EB', width: 1, type: 'solid' },
          },
        },
        dataZoom: [
          { type: 'inside', xAxisIndex: 0, start: 0, end: 100 },
          { type: 'inside', yAxisIndex: 0, start: 0, end: 100 },
        ],
        series: [
          {
            type: 'line',
            name: bottomLegendLabel,
            data: selectedSensor.profile,
            smooth: true,
            symbol: 'circle',
            symbolSize: (_value: unknown, params: { dataIndex: number }) => {
              const activeIndex =
                selectedBottomPointIndex ?? hoveredBottomPointIndex;
              return params.dataIndex === activeIndex ? 11 : 7;
            },
            lineStyle: { width: 3, color: BOTTOM_BLUE },
            itemStyle: {
              color: BOTTOM_BLUE,
              borderColor: BOTTOM_BLUE,
              borderWidth: 2,
            },
          },
        ],
      };
    }, [
      bottomLegendLabel,
      hoveredBottomPointIndex,
      selectedBottomPointIndex,
      selectedSensor,
    ]);

    const resetChartZoom = useCallback(() => {
      timePlotStressRef.current?.dispatchAction({
        type: 'dataZoom',
        xAxisIndex: 0,
        start: 0,
        end: 100,
      });
      timePlotStressRef.current?.dispatchAction({
        type: 'dataZoom',
        yAxisIndex: 0,
        start: 0,
        end: 100,
      });
      timePlotStrainRef.current?.dispatchAction({
        type: 'dataZoom',
        xAxisIndex: 0,
        start: 0,
        end: 100,
      });
      timePlotStrainRef.current?.dispatchAction({
        type: 'dataZoom',
        yAxisIndex: 0,
        start: 0,
        end: 100,
      });
    }, []);

    const getPngDataUrl = useCallback(() => {
      return timePlotStressRef.current?.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
    }, []);

    const downloadPlotPng = useCallback(
      (filename = 'banshee_time_plot.png') => {
        const dataUrl = getPngDataUrl();
        if (dataUrl) downloadDataUrl(dataUrl, filename);
      },
      [getPngDataUrl],
    );

    const exportToCsv = useCallback((filename = 'banshee_time_plot.csv') => {
      const headers = ['Date', ...DUMMY_SERIES.map((entry) => entry.name)];
      const rows = DATE_LABELS.map((dateLabel, idx) => [
        dateLabel,
        ...DUMMY_SERIES.map((entry) => String(entry.values[idx] ?? '')),
      ]);
      const csvText = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
      ].join('\n');

      const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        resetZoom: resetChartZoom,
        downloadPng: (filename = 'banshee_time_plot.png') => {
          const dataUrl = getPngDataUrl();
          if (dataUrl) downloadDataUrl(dataUrl, filename);
        },
        getPngFile: async (filename = 'banshee_time_plot.png') => {
          await new Promise((resolve) => requestAnimationFrame(resolve));
          await new Promise((resolve) => requestAnimationFrame(resolve));

          const dataUrl = getPngDataUrl();
          return dataUrl ? dataUrlToFile(dataUrl, filename) : undefined;
        },
      }),
      [getPngDataUrl, resetChartZoom],
    );

    if (fetching) {
      return (
        <div className="ui-banshee-h-[400px] ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-2 ui-banshee-text-neutral-500">
          <LoadingSpinner />
          Loading plot...
        </div>
      );
    }

    return (
      <div className="ui-banshee-px-4 ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-6">
        <TimePlotToolbar
          onResetZoom={resetChartZoom}
          onDownloadCsv={() => exportToCsv()}
          onDownloadPng={() => downloadPlotPng()}
        />
        <TimePlotChart
          timePlotStressRef={timePlotStressRef}
          topOption={topOption}
          onTopLineClick={handleTopLineClick}
          topLegendItems={topLegendItems}
          legendSelected={legendSelected}
          onLegendToggle={handleLegendToggle}
          showBottomChart={selectedSensor != null}
          timePlotStrainRef={timePlotStrainRef}
          bottomOption={bottomOption}
          bottomLegendLabel={bottomLegendLabel}
          onBottomPointHover={handleBottomPointHover}
          onBottomPointLeave={() => setHoveredBottomPointIndex(null)}
          onBottomPointSelect={handleBottomPointSelect}
          activeBoltDotIndex={
            selectedBottomPointIndex ?? hoveredBottomPointIndex
          }
          onBoltDotHover={handleBoltDotHover}
          onBoltDotLeave={() => setHoveredBottomPointIndex(null)}
          onBoltDotSelect={handleBoltDotSelect}
        />
      </div>
    );
  },
);

export default BansheeTimePlot;
