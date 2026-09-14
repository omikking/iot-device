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
        const statusLabel =
          (chartConfig[statusKey]?.label as string) || statusKey;
        return `
          <div style="min-width:180px; line-height:1.6;">
            <div style="
              font-size:15px;
              font-weight:600;
              color:#FFFFFF;
              margin-bottom:10px;
              border-bottom:1px solid #4B5563;
              padding-bottom:6px;
            ">
              ${escapeHtml(displayLocation)}
            </div>

            <div style="display:flex; justify-content:space-between; margin-bottom:6px; align-items:center">
              <span style="color:white;">Status</span>
              <span style="font-weight:600; color:#FFFFFF; font-size: 14px">
                ${escapeHtml(statusLabel)}
              </span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center">
              <span style="color:white;">Quantity</span>
              <span style="font-weight:600; color:#FFFFFF; font-size: 14px">
                ${escapeHtml(String(p.value ?? ''))}
              </span>
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
    <Card className="ui-banshee-flex ui-banshee-p-2 ui-banshee-flex-col ui-banshee-bg-neutral-1 ui-banshee-border-none ui-banshee-rounded-none ui-banshee-justify-center ui-banshee-items-center">
      <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-items-center ui-banshee-justify-center ui-banshee-w-full ui-banshee-h-full">
        <div className="ui-banshee-relative ui-banshee-flex ui-banshee-flex-col ui-banshee-items-center ui-banshee-justify-center ui-banshee-h-[165px] ui-banshee-w-[150px]">
          <CardContent className="!ui-banshee-p-0">
            <ChartContainer
              config={chartConfig}
              className="ui-banshee-mx-auto ui-banshee-aspect-square ui-banshee-max-h-[140px] ui-banshee-w-[140px]"
            >
              <EChart
                option={option}
                className="ui-banshee-w-full ui-banshee-h-full"
              />
            </ChartContainer>
          </CardContent>
          <div
            className="ui-banshee-w-full ui-banshee-text-center"
            title={footerText}
          >
            <CardFooter className="ui-banshee-pb-0 ui-banshee-min-h-[24px] ui-banshee-w-full ui-banshee-min-w-0">
              <span
                className="
                  ui-banshee-block
                  ui-banshee-w-full
                  ui-banshee-min-w-0
                  ui-banshee-overflow-hidden
                  ui-banshee-whitespace-nowrap
                  ui-banshee-text-ellipsis
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
