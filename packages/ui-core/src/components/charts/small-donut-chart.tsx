'use client';

import type { EChartsOption } from 'echarts';

import { Card, CardContent, CardFooter } from '../base/card';
import { ChartConfig, ChartContainer, EChart } from './chart';
import { escapeHtml } from '../../lib/utils';

type DonutChartProps = {
  footerText?: string;
  locationInfo?: string;
  chartData: { label: string; value: number; fill: string }[];
  chartConfig: ChartConfig;
  chartItems: {
    label: string;
    value: string;
    color: string;
  }[];
};

export function SmallChartPieDonut({
  footerText,
  chartData,
  chartConfig,
  locationInfo,
}: DonutChartProps) {
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      appendToBody: true,
      backgroundColor: '#000',
      borderColor: '#333',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (params) => {
        const p = Array.isArray(params) ? params[0] : params;
        const displayLocation = locationInfo ?? footerText ?? '';
        const statusKey = String(p.name ?? '');
        const materialLabel =
          (chartConfig[statusKey]?.label as string) || statusKey;
        return `
          <div style="padding:6px 8px;">
            <div style="font-weight:600;margin-bottom:8px;">
              ${escapeHtml(displayLocation)}
            </div>

            <div>
              <span style="color:#999;">Material:</span>
              <strong>${escapeHtml(materialLabel)}</strong>
            </div>

            <div>
              <span style="color:#999;">Quantity:</span>
              <strong>${escapeHtml(String(p.value ?? ''))}</strong>
            </div>
          </div>
        `;
      },
    },
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          text: `${total}`,
          fill: '#333',
          fontSize: 18,
          fontWeight: 500,
        },
      },
    ],
    series: [
      {
        type: 'pie',
        radius: ['60%', '85%'],
        center: ['50%', '50%'],
        data: chartData.map((d) => ({
          name: d.label,
          value: d.value,
          itemStyle: { color: d.fill },
        })),
        itemStyle: {
          borderWidth: 0,
        },
        label: { show: false },
        emphasis: { scale: false },
      },
    ],
  };

  return (
    <Card className="ds-flex ds-p-2 ds-flex-col ds-bg-neutral-1 ds-border-none ds-rounded-none ds-justify-center ds-items-center">
      <div className="ds-flex ds-flex-col ds-items-center ds-justify-center ds-w-full ds-h-full">
        <div className="ds-relative ds-flex ds-flex-col ds-items-center ds-justify-center ds-h-[165px] ds-w-[150px]">
          <CardContent className="!ds-p-0">
            <ChartContainer
              config={chartConfig}
              className="ds-mx-auto ds-aspect-square ds-max-h-[140px] ds-w-[140px]"
            >
              <EChart
                option={option}
                className="ds-w-full ds-h-full"
              />
            </ChartContainer>
          </CardContent>
          <div
            className="ds-w-full ds-text-center"
            title={footerText}
          >
            <CardFooter className="ds-pb-0 ds-min-h-[24px] ds-w-full ds-min-w-0">
              <span
                className="
                  ds-block
                  ds-w-full
                  ds-min-w-0
                  ds-overflow-hidden
                  ds-whitespace-nowrap
                  ds-text-ellipsis
                "
              >
                {footerText}
              </span>
            </CardFooter>
          </div>
        </div>
      </div>
    </Card>
  );
}
