'use client';

import type { EChartsOption } from 'echarts';

import { Card, CardContent, CardFooter } from '../base/card';
import { ChartConfig, ChartContainer, EChart } from './chart';
import { escapeHtml } from '../../lib/utils';

type DonutChartProps = {
  footerText?: string;
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
}: DonutChartProps) {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#000',
      borderColor: '#333',
      textStyle: { color: '#fff', fontSize: 12 },
      formatter: (params) => {
        const p = Array.isArray(params) ? params[0] : params;
        return `<div style="padding:2px 4px">
          <div>${escapeHtml(String(p.name ?? ''))}</div>
          <div>${escapeHtml(String(p.value ?? ''))}</div>
        </div>`;
      },
    },
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
          <div>
            <CardFooter className="ui-banshee-pb-0 ui-banshee-min-h-[24px]">
              {footerText}
            </CardFooter>
          </div>
        </div>
      </div>
    </Card>
  );
}
