'use client';
import type { TopLevelFormatterParams } from 'echarts/types/dist/shared';
import type { EChartsOption } from 'echarts';

import { Card, CardContent, CardFooter } from '../base/card';
import { Text } from '../base/text';
import { ChartConfig, ChartContainer, EChart } from './chart';
import { escapeHtml } from '../../lib/utils';

type DonutChartProps = {
  chartData: { label: string; value: number; fill: string; legend?: string }[];
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
          <div>${escapeHtml(String(p.name ?? ''))}: ${escapeHtml(value)}</div>
        </div>`;
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['55%', '85%'],
        center: ['50%', '50%'],
        data: chartData.map((d) => ({
          name: d.legend ?? d.label,
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
    <Card className="ds-w-min-[300px] ds-w-max-[900px] ds-w-auto ds-flex ds-flex-col ds-justify-center ds-bg-neutral-1 ds-border-none">
      <div className="ds-flex ds-flex-row ds-items-center ds-justify-center ds-gap-6">
        <CardContent className="ds-pb-0 ds-px-0">
          <ChartContainer
            config={chartConfig}
            className="ds-mx-auto ds-aspect-square ds-max-h-[375px] ds-w-[375px]"
          >
            <EChart
              option={option}
              className="ds-w-full ds-h-full"
            />
          </ChartContainer>
        </CardContent>
        <CardFooter className="ds-flex-col ds-gap-1 ds-py-0 ds-text-sm">
          {chartItems.map((item) => {
            return (
              <div
                key={item.label}
                className="ds-flex ds-flex-row ds-flex-1 ds-w-full ds-items-center ds-gap-4"
              >
                <div
                  style={{ backgroundColor: item.color }}
                  className="ds-w-fit ds-flex ds-items-center ds-justify-center ds-rounded-[2px] ds-h-[18px] ds-px-4"
                />
                <div className="ds-flex-1">
                  <Text
                    color="foreground"
                    variant="medium"
                    className="ds-font-medium"
                  >
                    {item.label}
                  </Text>
                </div>
                <div className="ds-w-5">
                  <Text
                    color="foreground"
                    variant="medium"
                    className="ds-text-left"
                  >
                    {item.value}
                  </Text>
                </div>
              </div>
            );
          })}
        </CardFooter>
      </div>
    </Card>
  );
}
