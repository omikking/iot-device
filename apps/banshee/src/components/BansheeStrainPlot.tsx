'use client';

import {
  LoadingSpinner,
  StrainChart,
  buildStrainChartModel,
} from '@gsp/ui-banshee';
import type {
  StrainChartHandle,
  StrainMeasurementDot,
  StrainChartRequest,
} from '@gsp/ui-banshee';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { BansheeRequestsListQuery } from '@/gql/graphql';
import {
  buildBansheeCsvFile,
  downloadDataUrl,
  dataUrlToFile,
} from '@/libs/utils';
import { BansheeExportMenu } from '@/components/BansheeExportMenu';

type BansheeRequestResult =
  BansheeRequestsListQuery['bansheeRequests']['results'][number];

type LegendSelection = Record<string, boolean>;

type PlotProps = {
  bansheeRequests: BansheeRequestResult[];
  fetching: boolean;
};

export type BansheeStrainPlotHandle = {
  resetZoom: () => void;
  downloadPng: (filename?: string) => void;
  getPngFile: (filename?: string) => Promise<File | undefined>;
};

const isSeriesVisible = (legendSelected: LegendSelection, label: string) =>
  legendSelected[label] !== false;

const StrainPlotToolbar = ({
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

const BansheeStrainPlot = forwardRef<BansheeStrainPlotHandle, PlotProps>(
  function BansheeStrainPlot({ bansheeRequests, fetching }, ref) {
    const chartRef = useRef<StrainChartHandle>(null);

    const [legendSelected, setLegendSelected] = useState<LegendSelection>({});
    const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(
      null,
    );
    const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(
      null,
    );

    const { series, measurementPositions } = useMemo(
      () => buildStrainChartModel(bansheeRequests as StrainChartRequest[]),
      [bansheeRequests],
    );

    const focusedPointIndex = selectedPointIndex ?? hoveredPointIndex;

    const measurementDots = useMemo<StrainMeasurementDot[]>(
      () =>
        measurementPositions.map((mm, index) => ({
          mm,
          active: index === focusedPointIndex,
        })),
      [focusedPointIndex, measurementPositions],
    );

    const resetChartZoom = useCallback(() => {
      chartRef.current?.resetZoom();
    }, []);

    const getPngDataUrl = useCallback(() => {
      return chartRef.current?.getPngDataUrl();
    }, []);

    const downloadPlotPng = useCallback(
      (filename = 'banshee_strain_plot.png') => {
        const dataUrl = getPngDataUrl();
        if (dataUrl) downloadDataUrl(dataUrl, filename);
      },
      [getPngDataUrl],
    );

    const exportToCsv = useCallback(
      (filename = 'banshee_strain_plot.csv') => {
        if (!bansheeRequests.length) return;

        const csvFile = buildBansheeCsvFile(bansheeRequests, filename);
        const link = document.createElement('a');
        const url = URL.createObjectURL(csvFile);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      [bansheeRequests],
    );

    const toggleLegend = useCallback((label: string) => {
      setLegendSelected((current) => ({
        ...current,
        [label]: !isSeriesVisible(current, label),
      }));
    }, []);

    const toggleMeasurementSelection = useCallback((index: number) => {
      setSelectedPointIndex((current) => (current === index ? null : index));
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        resetZoom: resetChartZoom,
        downloadPng: (filename = 'banshee_strain_plot.png') => {
          const dataUrl = getPngDataUrl();
          if (dataUrl) downloadDataUrl(dataUrl, filename);
        },
        getPngFile: async (filename = 'banshee_strain_plot.png') => {
          await new Promise((resolve) => requestAnimationFrame(resolve));
          await new Promise((resolve) => requestAnimationFrame(resolve));

          const dataUrl = getPngDataUrl();
          return dataUrl ? dataUrlToFile(dataUrl, filename) : undefined;
        },
      }),
      [getPngDataUrl, ref, resetChartZoom],
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
        <StrainPlotToolbar
          onResetZoom={resetChartZoom}
          onDownloadCsv={() => exportToCsv()}
          onDownloadPng={() => downloadPlotPng()}
        />

        <StrainChart
          ref={chartRef}
          series={series}
          legendSelected={legendSelected}
          focusedPointIndex={focusedPointIndex}
          onLegendToggle={toggleLegend}
          measurementDots={measurementDots}
          onMeasurementHover={setHoveredPointIndex}
          onMeasurementLeave={() => setHoveredPointIndex(null)}
          onMeasurementSelect={toggleMeasurementSelection}
          className="ui-banshee-w-full ui-banshee-relative ui-banshee-z-10 ui-banshee-h-[430px]"
        />
      </div>
    );
  },
);

export default BansheeStrainPlot;
