'use client';

import { ChartContainer, EChart } from '@gsp/ui-banshee';
import { useCallback, useMemo, useRef } from 'react';
import { BansheeExportMenu } from '@/components/BansheeExportMenu';
import { downloadDataUrl } from '@/libs/utils';

type HeatmapChartRef = {
  dispatchAction: (action: Record<string, unknown>) => void;
  getDataURL: (options: Record<string, unknown>) => string;
};

type HeatmapTooltipParam = {
  value: [number, number, number];
};

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: '2-digit',
});

const buildLastMonthLabels = (count: number) => {
  const today = new Date();

  return Array.from({ length: count }, (_, index) => {
    const monthOffset = count - 1 - index;
    const monthDate = new Date(
      today.getFullYear(),
      today.getMonth() - monthOffset,
      1,
    );

    return MONTH_LABEL_FORMATTER.format(monthDate);
  });
};

const DATE_LABELS = buildLastMonthLabels(6);

const STRAIN_LABELS = Array.from({ length: 7 }, (_, index) => index * 3);

const buildHeatLevel = (x: number, y: number) => {
  const hotspotA = Math.exp(-((x - 4.2) ** 2) / 1.2 - (y - 6.2) ** 2 / 5.2);
  const hotspotB = Math.exp(-((x - 5.7) ** 2) / 2.8 - (y - 5.0) ** 2 / 7.5);
  const background = 0.5 + y * 0.02;
  const value = background + hotspotA * 8.5 + hotspotB * 7.8;

  return Math.max(0, Math.min(15, Number(value.toFixed(2))));
};

const HeatmapToolbar = ({
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

export default function BansheeHeatmapPlot() {
  const chartRef = useRef<any>(null);

  const { heatmapData, blockedData } = useMemo(() => {
    const values: Array<[number, number, number]> = [];
    const blocked: Array<[number, number, number]> = [];

    for (let x = 0; x < DATE_LABELS.length; x += 1) {
      for (let y = 0; y < STRAIN_LABELS.length; y += 1) {
        const strainValue = STRAIN_LABELS[y];
        const isBlockedZone = x === DATE_LABELS.length - 1 && strainValue <= 3;

        if (isBlockedZone) {
          blocked.push([x, y, 1]);
        } else {
          values.push([x, y, buildHeatLevel(x, strainValue)]);
        }
      }
    }

    return { heatmapData: values, blockedData: blocked };
  }, []);

  const chartOption = useMemo<any>(
    () => ({
      grid: {
        left: 120,
        right: 50,
        top: 30,
        bottom: 50,
      },

      xAxis: {
        type: 'category',
        data: DATE_LABELS,
        axisLine: { show: true },
        axisTick: {
          show: true,
          length: 12,
          alignWithLabel: false,
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#f7f9fc', '#ffffff'],
          },
        },
        name: 'Position along the bolt (mm)',
        nameLocation: 'center',
        nameGap: 55,
      },
      yAxis: {
        type: 'category',
        data: STRAIN_LABELS,
        axisLine: { show: true },
        axisLabel: {
          interval: 0,
          hideOverlap: true,
          margin: 10,
          formatter: (value: number | string) => `${value}`,
        },
        axisTick: {
          show: true,
          length: 8,
          alignWithLabel: true,
        },
        splitLine: {
          show: true,
        },
      },
      tooltip: {
        position: 'top',
        formatter: (params: unknown) => {
          const point = (params as HeatmapTooltipParam).value;
          const [xIndex, strainIndex, level] = point;
          const date = DATE_LABELS[xIndex] ?? '-';
          const strain = STRAIN_LABELS[strainIndex] ?? strainIndex;
          return `${date}<br/>Strain: ${strain}%<br/>Level: ${level}%`;
        },
      },
      visualMap: {
        min: 0,
        max: 15,
        splitNumber: 3,
        precision: 0,
        orient: 'vertical',
        left: 0,
        top: 'middle',
        itemWidth: 25,
        itemHeight: 200,
        text: ['15', '0'],
        textGap: 8,
        calculable: true,
        showLabel: true,
        formatter: (value: number) => `${Math.round(value)}`,
        axisTick: {
          show: false,
          length: 16,
          interval: 5,
        },
        inRange: {
          color: ['#fff100', '#ffb000', '#ff6e00', '#f11c1f'],
        },
      },
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          moveOnMouseWheel: false,
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          moveOnMouseWheel: false,
        },
      ],
      series: [
        {
          name: 'Strain Heat',
          type: 'heatmap',
          data: heatmapData,
          progressive: 0,
          emphasis: {
            itemStyle: {
              shadowBlur: 8,
              shadowColor: 'rgba(0, 0, 0, 0.25)',
            },
          },
        },
        {
          name: 'Unavailable Zone',
          type: 'heatmap',
          data: blockedData,
          silent: true,
          tooltip: { show: false },
          itemStyle: {
            color: '#000',
          },
          emphasis: {
            disabled: true,
          },
        },
      ],
    }),
    [blockedData, heatmapData],
  );

  const resetZoom = useCallback(() => {
    chartRef.current?.dispatchAction({
      type: 'dataZoom',
      start: 0,
      end: 100,
    });
    chartRef.current?.dispatchAction({
      type: 'dataZoom',
      yAxisIndex: 0,
      start: 0,
      end: 100,
    });
  }, []);

  const downloadPng = useCallback(() => {
    const dataUrl = chartRef.current?.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    });
    if (dataUrl) {
      downloadDataUrl(dataUrl, 'banshee_heatmap_plot.png');
    }
  }, []);

  const downloadCsv = useCallback(() => {
    const rows = ['Date,Strain(%),Level(%)'];

    heatmapData.forEach(([xIndex, yIndex, level]) => {
      rows.push(`${DATE_LABELS[xIndex]},${yIndex},${level}`);
    });

    const blob = new Blob([rows.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'banshee_heatmap_plot.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, [heatmapData]);

  return (
    <div className="ui-banshee-px-4 ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-6 ui-banshee-w-full">
      <HeatmapToolbar
        onResetZoom={resetZoom}
        onDownloadCsv={downloadCsv}
        onDownloadPng={downloadPng}
      />

      <div className="ui-banshee-px-2 ui-banshee-pb-2">
        <ChartContainer
          config={{
            heatmap: {
              label: 'Heatmap',
              color: '#f97316',
            },
          }}
          className="ui-banshee-w-full ui-banshee-relative ui-banshee-z-10 ui-banshee-h-[430px]"
        >
          <EChart
            chartRef={chartRef}
            option={chartOption}
            className="ui-banshee-w-full ui-banshee-h-full"
          />
        </ChartContainer>
      </div>
    </div>
  );
}
