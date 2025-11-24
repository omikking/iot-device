'use client';

import { Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../base/card';
import { Text } from '../base/text';
import { ChartConfig, ChartContainer, ChartTooltip } from './chart';

type DonutChartProps = {
  chartData: { label: string; value: number; fill: string }[];
  chartConfig: ChartConfig;
  chartItems: {
    label: string;
    value: string;
    color: string;
  }[];
};

const CustomChartTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { label: string } }[];
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="ui-banshee-bg-black ui-banshee-text-main-white ui-banshee-p-2 ui-banshee-border ui-banshee-border-gray-300 ui-banshee-rounded-lg">
      <p className="ui-banshee-font-sm">{payload[0].payload.label}</p>
      <p className="ui-banshee-font-sm">{payload[0].value}%</p>
    </div>
  );
};

export function ChartPieDonut({
  chartData,
  chartConfig,
  chartItems,
}: DonutChartProps) {
  return (
    <Card className="ui-banshee-flex ui-banshee-flex-col ui-banshee-bg-neutral-1 ui-banshee-border-none">
      <CardHeader className="ui-banshee-pb-0 ui-banshee-pl-8">
        <CardTitle className="ui-banshee-text-md">Pie Chart</CardTitle>
      </CardHeader>
      <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-items-center">
        <CardContent className="ui-banshee-flex- ui-banshee-pb-0 ui-banshee-px-0">
          <ChartContainer
            config={chartConfig}
            className="ui-banshee-mx-auto ui-banshee-aspect-square ui-banshee-max-h-[315px] ui-banshee-w-[315px]"
          >
            <PieChart>
              <ChartTooltip cursor={false} content={<CustomChartTooltip />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                innerRadius={90}
                stroke="none"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="ui-banshee-flex-col ui-banshee-gap-1 ui-banshee-py-0 ui-banshee-text-sm">
          {chartItems.map((item) => {
            return (
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
            );
          })}
        </CardFooter>
      </div>
    </Card>
  );
}
