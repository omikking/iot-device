'use client';
import React from 'react';
import {
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
  reading: {
    label: 'Reading',
    color: 'var(--chart-1)',
  },
  desktop: {
    label: 'Peak Load',
    color: 'var(--chart-1)',
  },
  displacement: {
    label: 'Peak Displacement',
  },
} satisfies ChartConfig;

export const MultiBoltGraphView = ({
  peakLoad,
  peakDisplacement,
  boltNumber,
}: MultiBoltGraphViewProps) => {
  // Prepare chart data
  const chartData = peakDisplacement.map((displacement, index) => ({
    reading: index + 1,
    displacement: displacement,
    peakLoad: peakLoad[index]?.toString() || '0',
    desktop: peakLoad[index] || 0,
  }));

  // --- Y Axis (Peak Load) ---
  const yTickInterval = 10;
  const yMax = 50;
  const yAxisTicks = [];
  for (let i = 0; i <= yMax; i += yTickInterval) {
    yAxisTicks.push(i);
  }

  if (!yAxisTicks.includes(50)) {
    yAxisTicks.push(50);
  }

  // --- X Axis (Displacement) ---
  const maxDisplacement = Math.max(...peakDisplacement, 0);
  const xTickInterval = 5;
  const xMaxBase = 40;
  const xMax =
    maxDisplacement > xMaxBase
      ? Math.ceil((maxDisplacement + xTickInterval) / xTickInterval) *
        xTickInterval
      : xMaxBase;
  const xAxisTicks = [];
  for (let i = 0; i <= xMax; i += xTickInterval) {
    xAxisTicks.push(i);
  }

  return (
    <div className="bg-transparent">
      <div className="pt-12">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 15,
              right: 12,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="displacement"
              type="number"
              domain={[0, xMax]}
              ticks={xAxisTicks}
              tickFormatter={(value) => value.toString()}
              tickLine={{ strokeWidth: 0 }}
              axisLine={{ stroke: '#E6E6E6' }}
              tick={{ fill: '#E6E6E6', fontSize: 12 }}
              label={{
                value: 'Displacement at Peak Load (mm)',
                position: 'insideBottom',
                offset: -30,
                style: {
                  textAnchor: 'middle',
                  fill: '#000000',
                  fontSize: 18,
                  fontFamily: 'SandvikSansText',
                },
              }}
            />
            <YAxis
              tick={{ fill: '#E6E6E6', fontSize: 12 }}
              ticks={yAxisTicks}
              axisLine={{ stroke: '#E6E6E6' }}
              tickLine={{ strokeWidth: 0 }}
              domain={[0, yMax]}
              tickMargin={8}
              label={{
                value: 'Peak Load (tons)',
                angle: -90,
                position: 'insideLeft',
                offset: -6,
                style: {
                  textAnchor: 'middle',
                  fill: '#000000',
                  fontSize: 18,
                  fontFamily: 'SandvikSansText',
                },
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="reading"
              name="Reading"
              strokeWidth={0}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
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
              isAnimationActive={false}
            />

            <Line
              dataKey="displacement"
              type="linear"
              name="Peak Displacement"
              strokeWidth={0}
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
            <Legend
              align="left"
              iconType="rect"
              wrapperStyle={{ left: 65, top: 455 }}
              payload={[
                {
                  value: `Bolt ${boltNumber}`,
                  type: 'rect',
                  color: 'var(--color-desktop)',
                },
              ]}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};
