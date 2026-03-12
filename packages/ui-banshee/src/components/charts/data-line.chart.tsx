import {
  Line,
  XAxis,
  YAxis,
  LineChart,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import {
  ChartConfig,
  ChartLegend,
  ChartTooltip,
  ChartContainer,
  ChartLegendContent,
} from './chart';

import { Text } from '../base/text';

export type DataLineChartProps = {
  yAxisLabel?: string;
  yAxisDomain?: [number, number];
  lines?: { dataKey: string; label: string; color: string }[];
  data: { date: string; [key: string]: string | number | undefined }[];
};

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
    color: '#aaaaaa',
  },
  line4: {
    label: 'Line 4',
    color: '#00c853',
  },
} satisfies ChartConfig;

const CustomChartTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="ui-banshee-bg-black ui-banshee-text-main-white ui-banshee-p-2 ui-banshee-rounded-sm">
      {payload.map((item) => (
        <div key={item.name}>
          <Text color="background" variant="small">
            {item.name}: {item.value}%
          </Text>
        </div>
      ))}
    </div>
  );
};

export function DataLineChart({
  data,
  lines,
  yAxisLabel = 'Elongation (mm)',
  yAxisDomain = [0, 12],
}: DataLineChartProps) {
  // Generate vertical alternating stripes
  const stripes = [];
  for (let i = 0; i < data.length; i += 2) {
    stripes.push({
      x1: data[i]?.date,
      x2: data[i + 1]?.date || data[i]?.date,
    });
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="ui-banshee-w-full ui-banshee-h-[400px]"
    >
      <LineChart
        style={{
          width: '100%',
          height: '100%',
        }}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 10,
          bottom: 20,
        }}
      >
        <ChartTooltip cursor={false} content={<CustomChartTooltip />} />
        {/* Vertical alternating stripes */}
        {stripes.map((stripe) => (
          <ReferenceArea
            key={`${stripe.x1}-${stripe.x2}`}
            x1={stripe.x1}
            x2={stripe.x2}
            fill="#EAEAEA"
            fillOpacity={1}
          />
        ))}

        {/* Horizontal grid lines at 3, 6, 9, 12 */}
        <ReferenceLine y={3} stroke="#E4E4E4" strokeWidth={1} />
        <ReferenceLine y={6} stroke="#E4E4E4" strokeWidth={1} />
        <ReferenceLine y={9} stroke="#E4E4E4" strokeWidth={1} />
        <ReferenceLine y={12} stroke="#E4E4E4" strokeWidth={1} />

        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={10} />
        <YAxis
          label={{
            value: yAxisLabel,
            angle: -90,
            position: 'center',
          }}
          tick={{ fontSize: 12 }}
          domain={yAxisDomain}
        />
        <ChartLegend
          verticalAlign="bottom"
          height={36}
          content={
            <ChartLegendContent className="ui-banshee-gap-10" iconType="line" />
          }
          wrapperStyle={{ paddingTop: '20px' }}
        />
        {lines?.map((line) => (
          <Line
            key={line.dataKey}
            name={line.label}
            type="linear"
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            dot={{ fill: line.color, r: 3 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
