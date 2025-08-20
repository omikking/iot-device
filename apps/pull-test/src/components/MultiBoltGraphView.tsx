'use client';
import React from 'react';
import {
  Card,
  CardContent,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  CardFooter,
} from '@gsp/ui';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

const chartData = [
  { displacement: '0', kilonewton: '0', desktop: 186, mobile: 80 },
  { displacement: '10', kilonewton: '50', desktop: 350, mobile: 200 },
  { displacement: '20', kilonewton: '100', desktop: 237, mobile: 120 },
  { displacement: '30', kilonewton: '150', desktop: 73, mobile: 190 },
  { displacement: '40', kilonewton: '200', desktop: 209, mobile: 130 },
  { displacement: '50', kilonewton: '250', desktop: 214, mobile: 140 },
  { displacement: '60', kilonewton: '300', desktop: 150, mobile: 90 },
  { displacement: '70', kilonewton: '350', desktop: 300, mobile: 200 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

type MultiBoltGraphViewProps = {
  peakLoad: number[];
  peakDisplacement: number[];
};

export const MultiBoltGraphView = ({
  peakLoad,
  peakDisplacement,
}: MultiBoltGraphViewProps) => {
  return (
    //TODO Fix why I need to use !important
    <Card className="!bg-transparent border-none !shadow-none">
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 25,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="displacement"
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              // dataKey="kilonewton"
              tick={{ fill: '#666', fontSize: 12 }} // Style the tick text
              ticks={chartData.map((item) => item.kilonewton)}
              axisLine={{ stroke: '#999' }} // Style the axis line
              tickLine={{ stroke: '#999' }} // Style the tick lines
              tickMargin={8}
              label={{
                value: 'Kilonewton',
                angle: -90,
                position: 'insideLeft',
                offset: -5,
                style: {
                  textAnchor: 'middle',
                  fill: '#000000',
                  fontSize: 20,
                  //   fontWeight: 'bold',
                },
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              name="Bolt name"
              strokeWidth={2}
              dot={{
                fill: 'var(--color-desktop)',
              }}
              activeDot={{
                r: 6,
              }}
            />

            <Legend
              align="left"
              iconType="rect"
              wrapperStyle={{ left: 65, top: 420 }}
            />
          </LineChart>
        </ChartContainer>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex leading-none font-medium">Displacement (mm)</div>
        </CardFooter>
      </CardContent>
    </Card>
  );
};
