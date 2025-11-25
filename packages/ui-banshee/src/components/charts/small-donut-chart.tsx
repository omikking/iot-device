'use client';

import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardFooter } from '../base/card';
import { Text } from '../base/text';
import { ChartConfig, ChartContainer, ChartTooltip } from './chart';

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

const CustomChartTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { label: string } }[];
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="ui-banshee-bg-black ui-banshee-text-main-white ui-banshee-p-2 ui-banshee-rounded-sm">
      <p className="ui-banshee-font-sm">{payload[0].payload.label}</p>
      <p className="ui-banshee-font-sm">{payload[0].value}%</p>
    </div>
  );
};

export function SmallChartPieDonut({
  footerText,
  chartData,
  chartConfig,
}: DonutChartProps) {
  return (
    <Card className="ui-banshee-flex ui-banshee-flex-col ui-banshee-bg-neutral-2 ui-banshee-border-none ui-banshee-rounded-none ui-banshee-justify-center ui-banshee-items-center">
      <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-items-center ui-banshee-justify-center ui-banshee-w-full ui-banshee-h-full">
        <div className="ui-banshee-relative ui-banshee-flex ui-banshee-flex-col ui-banshee-items-center ui-banshee-justify-center ui-banshee-h-[180px] ui-banshee-w-[150px]">
          <CardContent className="!ui-banshee-p-0">
            <ChartContainer
              config={chartConfig}
              className="ui-banshee-mx-auto ui-banshee-aspect-square ui-banshee-max-h-[150px] ui-banshee-w-[150px]"
            >
              <PieChart>
                <ChartTooltip cursor={false} content={<CustomChartTooltip />} />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={40}
                  stroke="none"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <div className="ui-banshee-pb-4">
            <Text
              color="foreground"
              variant="large"
              className="ui-banshee-absolute ui-banshee-inset-0 ui-banshee-bottom-9 ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-pointer-events-none"
            >
              Total
            </Text>
            <CardFooter className="ui-banshee-pb-0 ui-banshee-min-h-[24px]">
              {footerText}
            </CardFooter>
          </div>
        </div>
      </div>
    </Card>
  );
}
