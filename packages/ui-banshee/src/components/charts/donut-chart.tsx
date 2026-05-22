'use client';
import type { TopLevelFormatterParams } from 'echarts/types/dist/shared';
import type { EChartsOption } from 'echarts';

import { Card, CardContent, CardFooter } from '../base/card';
import { Text } from '../base/text';
import { ChartConfig, ChartContainer, EChart } from './chart';
import { escapeHtml } from '../../lib/utils';

type DonutChartProps = {
  chartData: { label: string; value: number; fill: string }[];
  chartConfig: ChartConfig;
  chartItems: {
    label: string;
    value: string;
    color: string;
  }[];
};

export function ChartPieDonut({
  chartData,
  chartConfig,
  chartItems,
}: DonutChartProps) {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: '#000',
      borderColor: '#000',
      textStyle: { color: '#fff', fontSize: 12 },
      // formatter: (params: { name: string; value: number }) =>
      //   `<div style="padding:2px 4px">
      //     <div>${escapeHtml(String(params.name ?? ''))}</div>
      //     <div>${escapeHtml(String(params.value ?? ''))}</div>
      //   </div>`,
      formatter: (params: TopLevelFormatterParams) => {
        const p = Array.isArray(params) ? params[0] : params;
    
        const value = Array.isArray(p.value)
          ? p.value.join(', ')
          : String(p.value ?? '');
    
        return `<div style="padding:2px 4px">
          <div>${escapeHtml(String(p.name ?? ''))}</div>
          <div>${escapeHtml(value)}</div>
        </div>`;
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['55%', '85%'],
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
    <Card className="ui-banshee-w-min-[300px] ui-banshee-w-max-[900px] ui-banshee-w-auto ui-banshee-flex ui-banshee-flex-col ui-banshee-justify-center ui-banshee-bg-neutral-1 ui-banshee-border-none">
      <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-items-center ui-banshee-justify-center">
        <CardContent className="ui-banshee-pb-0 ui-banshee-px-0">
          <ChartContainer
            config={chartConfig}
            className="ui-banshee-mx-auto ui-banshee-aspect-square ui-banshee-max-h-[375px] ui-banshee-w-[375px]"
          >
            <EChart
              option={option}
              className="ui-banshee-w-full ui-banshee-h-full"
            />
          </ChartContainer>
        </CardContent>
        <CardFooter className="ui-banshee-flex-col ui-banshee-gap-1 ui-banshee-py-0 ui-banshee-text-sm">
          {chartItems.map((item) => (
            <div
              key={item.label}
              className="ui-banshee-flex ui-banshee-flex-row ui-banshee-flex-1 ui-banshee-w-full ui-banshee-items-center ui-banshee-gap-4"
            >
              <div
                style={{ backgroundColor: item.color }}
                className="ui-banshee-w-fit ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-rounded-[2px] ui-banshee-h-[18px] ui-banshee-px-4"
              />
              <div className="ui-banshee-flex-1">
                <Text
                  color="foreground"
                  variant="small"
                  className="ui-banshee-font-medium"
                >
                  {item.label}
                </Text>
              </div>
              <div className="ui-banshee-w-5">
                <Text
                  color="foreground"
                  variant="small"
                  className="ui-banshee-text-left"
                >
                  {item.value}
                </Text>
              </div>
            </div>
          ))}
        </CardFooter>
      </div>
    </Card>
  );
}
