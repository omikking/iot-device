'use client';
import React from 'react';
import {
  Card,
  CardContent,
  ChartConfig,
  ChartTooltip,
  ChartContainer,
  ChartTooltipContent,
} from '@gsp/ui';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

type MultiBoltGraphViewProps = {
  peakLoad: number[];
  peakDisplacement: number[];
  boltNumber?: number;
};

const chartConfig = {
  desktop: {
    label: 'Peak Load',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export const MultiBoltGraphView = ({
  peakLoad,
  peakDisplacement,
  boltNumber,
}: MultiBoltGraphViewProps) => {
  const chartData = peakDisplacement.map((displacement, index) => ({
    displacement: displacement.toString(),
    kilonewton: peakLoad[index]?.toString() || '0',
    desktop: peakLoad[index] || 0,
  }));

  const maxLoad = Math.max(...peakLoad);
  const tickInterval = 50;
  const maxTick = Math.ceil(maxLoad / tickInterval) * tickInterval;
  const yAxisTicks = [];
  for (let i = 0; i <= maxTick; i += tickInterval) {
    yAxisTicks.push(i);
  }
  return (
    //TODO Fix why I need to use !important
    <Card className="!bg-transparent border-none !shadow-none">
      <CardContent className="!p-0 !pt-12">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 15,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="displacement"
              tickFormatter={(value) => value.slice(0, 3)}
              tickLine={{ strokeWidth: 0 }}
              axisLine={{ stroke: '#E6E6E6' }}
              tick={{ fill: '#E6E6E6', fontSize: 12 }}
              domain={[0, 'dataMax']}
              label={{
                value: 'Displacement (mm)',
                position: 'insideBottom',
                offset: -10,
                style: {
                  textAnchor: 'middle',
                  fill: '#000000',
                  fontSize: 20,
                  fontFamily: 'SandvikSansText',
                },
              }}
            />
            <YAxis
              tick={{ fill: '#E6E6E6', fontSize: 12 }}
              ticks={yAxisTicks}
              axisLine={{ stroke: '#E6E6E6' }}
              tickLine={{ strokeWidth: 0 }}
              domain={[0, maxTick]}
              tickMargin={8}
              label={{
                value: 'Kilonewton',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
                style: {
                  textAnchor: 'middle',
                  fill: '#000000',
                  fontSize: 20,
                  fontFamily: 'SandvikSansText',
                },
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="linear"
              stroke="var(--color-desktop)"
              name="Peak Load"
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
              wrapperStyle={{ left: 65, top: 455 }}
              formatter={() => `Bolt ${boltNumber}`}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
