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
  ChartLegend,
} from './chart';
import { Text } from '../base/text';

export type ChartLineLinearProps = {
  showAxis?: boolean;
  hideXAxisLabel?: boolean;
  chartLabel?: string;
  showLegend?: boolean;
  data?: { time: string; [key: string]: string | number }[];
  lines?: { dataKey: string; label: string; color: string }[];
};

export const description = 'A status plot chart';

// Something that checks if its bellow 1, It gets gray
const defaultChartData = [
  { time: 'T1', line1: 2.5, line2: 2.3, line3: 3.0 },
  { time: 'T2', line1: 3.5, line2: 2.4, line3: 3.1 },
  { time: 'T3', line1: 0.2, line2: 1.5, line3: 1.0 },
  { time: 'T4', line1: 3.5, line2: 2.2, line3: 3.4 },
  { time: 'T5', line1: 2.5, line2: 3.1, line3: 2.5 },
  { time: 'T6', line1: 3.5, line2: 2.5, line3: 3.6 },
  { time: 'T7', line1: 3.5, line2: 3.4, line3: 3.5 },
  { time: 'T8', line1: 3.5, line2: 2.2, line3: 3.7 },
  { time: 'T9', line1: 4.5, line2: 4.0, line3: 4.9 },
];

// TODO Fix propps
const defaultLineConfig = [
  { dataKey: 'line1', label: 'Line 1', color: '#0066cc' },
  { dataKey: 'line2', label: 'Line 2', color: '#ff6b6b' },
  { dataKey: 'line3', label: 'Line 3', color: '#aaaaaa' },
];

const chartConfig = {
  line1: {
    label: 'Line 1',
    color: '#0066cc',
  },
  line2: {
    label: 'Line 2',
    color: '#ff6b6b',
  },
  line3: {
    label: 'Line 3',
    color: '#ffd93d',
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

export function ChartLineLinear({
  showAxis,
  hideXAxisLabel,
  chartLabel,
  showLegend,
  data = defaultChartData,
  lines = defaultLineConfig,
}: ChartLineLinearProps) {
  const CustomChartHeight = () => {
    if (!hideXAxisLabel && showLegend) {
      return 'ui-banshee-h-[296px] ui-banshee-flex ui-banshee-flex-col ui-banshee-items-end ui-banshee-pb-5 ui-banshee-pointer-events-none ';
    } else if (hideXAxisLabel && showLegend) {
      return 'ui-banshee-h-[324px] ui-banshee-flex ui-banshee-flex-col ui-banshee-items-end ui-banshee-pb-5 ui-banshee-pointer-events-none ';
    } else if (!hideXAxisLabel && !showLegend) {
      return 'ui-banshee-h-[331px] ui-banshee-flex ui-banshee-flex-col ui-banshee-items-end ui-banshee-pb-5 ui-banshee-pointer-events-none ';
    }
    // else {
    //   return 'ui-banshee-h-[360px] ui-banshee-flex ui-banshee-flex-col ui-banshee-items-end ui-banshee-pb-5 ui-banshee-pointer-events-none ';
    // }
  };

  return (
    <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-w-full ui-banshee-items-center">
      <div className="ui-banshee-flex ui-banshee-flex-row ui-banshee-w-full ui-banshee-h-full">
        {showAxis && (
          <div className={CustomChartHeight()}>
            <div className="ui-banshee-flex-1 ui-banshee-flex ui-banshee-items-center ui-banshee-text-right" />
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
        )}
        <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-w-full">
          <ChartContainer
            config={chartConfig}
            className="ui-banshee-h-[360px] ui-banshee-w-full ui-banshee-relative ui-banshee-z-10"
          >
            <LineChart
              data={data}
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

              <CartesianGrid
                vertical={false}
                horizontal={false}
                stroke="#e0e0e0"
              />
              <XAxis dataKey="time" hide={hideXAxisLabel} />

              <YAxis
                type="number"
                domain={[0, 6]}
                ticks={[0, 1, 2, 3, 4, 5, 6]}
                // ticks={['', '', '', '', '', '', '']}
                padding={{ top: 0, bottom: 0 }}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              {lines.map((line) => (
                <Line
                  key={line.dataKey}
                  name={line.label}
                  dataKey={line.dataKey}
                  type="linear"
                  stroke={line.color}
                  strokeWidth={2}
                  dot={{ fill: line.color, r: 3 }}
                />
              ))}

              {showLegend && (
                <ChartLegend
                  verticalAlign="bottom"
                  align="center"
                  margin={{ left: -40, right: 40 }}
                  height={36}
                />
              )}
            </LineChart>
          </ChartContainer>
        </div>
      </div>
      {/* LABEL */}
      <div>
        <Text variant="small" color="foreground">
          {chartLabel}
        </Text>
      </div>
    </div>
  );
}
