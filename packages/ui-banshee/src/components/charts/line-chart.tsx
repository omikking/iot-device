'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from './chart';
import { Text } from '../base/text';

export const description = 'A status plot chart';

const chartData = [
  { time: 'T1', status: 2.5 },
  { time: 'T2', status: 3.5 },
  { time: 'T3', status: 0.5 },
  { time: 'T4', status: 3.5 },
  { time: 'T5', status: 2.5 },
  { time: 'T6', status: 3.5 },
  { time: 'T7', status: 3.5 },
  { time: 'T8', status: 3.5 },
  { time: 'T9', status: 4.5 },
];

const chartConfig = {
  status: {
    label: 'Status',
    color: '#0066cc',
  },
} satisfies ChartConfig;

// Status bands mapping (from top to bottom)
const bands = [
  { from: 5, to: 4, label: 'Broken', color: '#ff9999' },
  { from: 4, to: 3, label: 'High Plastic', color: '#ffcc99' },
  { from: 3, to: 2, label: 'Low Plastic', color: '#ffff99' },
  {
    from: 2,
    to: 1,
    label: 'Elastic',
    color: '#99ff99',
  },
  {
    from: 1,
    to: 0,
    label: 'Not Measurable',
    color: '#cccccc',
  },
];

export function ChartLineLinear() {
  return (
    <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-w-full ui-banshee-h-full">
      {/* <ResponsiveContainer className="ui-banshee-w-full ui-banshee-h-full"> */}
      <div className="ui-banshee-h-[360px] ui-banshee-flex ui-banshee-flex-col ui-banshee-items-end ui-banshee-pb-5 ui-banshee-pointer-events-none ">
        <div className="ui-banshee-flex-1 ui-banshee-flex ui-banshee-items-center ui-banshee-text-right">
          {/* <Text variant="small" color="foreground">
            Place holder
          </Text> */}
        </div>
        <div className="ui-banshee-flex-1 ui-banshee-flex ui-banshee-items-center ui-banshee-text-right">
          <Text variant="small" color="foreground">
            Broken
          </Text>
        </div>
        <div className="ui-banshee-flex-1 ui-banshee-flex ui-banshee-items-center ui-banshee-text-right">
          <Text variant="small" color="foreground">
            High Plastic
          </Text>
        </div>
        <div className="ui-banshee-flex-1 ui-banshee-flex ui-banshee-items-center ui-banshee-text-right">
          <Text variant="small" color="foreground">
            Low Plastic
          </Text>
        </div>
        <div className="ui-banshee-flex-1 ui-banshee-flex ui-banshee-items-center ui-banshee-text-right">
          <Text variant="small" color="foreground">
            Elastic
          </Text>
        </div>
        <div className="ui-banshee-flex-1 ui-banshee-flex ui-banshee-items-center ui-banshee-text-right">
          <Text variant="small" color="foreground">
            Not Measurable
          </Text>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="ui-banshee-h-[360px] ui-banshee-w-full ui-banshee-relative ui-banshee-z-10"
      >
        <LineChart
          data={chartData}
          className="ui-banshee-mb-50"
          margin={{ right: 30, left: -40, bottom: 20, top: 0 }}
        >
          {/* Perfectly aligned horizontal bands */}
          {bands.map((band) => (
            <ReferenceArea
              key={band.label}
              y1={band.to}
              y2={band.from}
              fill={band.color}
              fillOpacity={0.95}
              stroke="none"
            />
          ))}

          {/* Top and bottom borders for each band */}
          {bands.map((band) => (
            <ReferenceLine
              key={`${band.label}-top`}
              y={band.from}
              x={band.to}
              stroke="#EEE"
              strokeWidth={1}
            />
          ))}

          <CartesianGrid vertical={false} horizontal={false} stroke="#e0e0e0" />
          <XAxis dataKey="time" hide />

          <YAxis
            type="number"
            domain={[0, 6]}
            ticks={[0, 1, 2, 3, 4, 5, 6]}
            padding={{ top: 0, bottom: 0 }}
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          <Line
            dataKey="status"
            type="monotone"
            stroke="#0066cc"
            strokeWidth={2}
            dot={{ fill: '#0066cc', r: 3 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
