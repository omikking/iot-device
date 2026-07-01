import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, SectionTitle } from './ui';
import type { TimeWavelengthChartData } from '../utils/timeWavelengthChart';

interface TimeVsWavelengthChartProps {
  chartData: TimeWavelengthChartData;
  loading?: boolean;
  emptyMessage?: string;
}

export default function TimeVsWavelengthChart({
  chartData,
  loading = false,
  emptyMessage = 'Select a serial number to view time vs wavelength.',
}: TimeVsWavelengthChartProps) {
  const { rows, lines, xDomain, yDomain } = chartData;

  return (
    <Card className="min-h-[360px] flex flex-col sm:col-span-2">
      <SectionTitle>Time vs Wavelength (all 9 FBGs)</SectionTitle>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px]">
          <span className="inline-block w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-[spin_0.8s_linear_infinite]" />
        </div>
      ) : rows.length === 0 || lines.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[300px] text-sm text-text-muted text-center px-4">
          {emptyMessage}
        </div>
      ) : (
        <div className="h-[320px] w-full rounded-lg bg-[#faf8f3] px-2 py-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 12, right: 120, left: 8, bottom: 28 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d8" />
              <XAxis
                dataKey="time"
                type="number"
                domain={xDomain}
                tickCount={7}
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{
                  value: 'Time (s)',
                  position: 'insideBottom',
                  offset: -16,
                  style: { fontSize: 12, fill: '#64748b' },
                }}
              />
              <YAxis
                type="number"
                domain={yDomain}
                tickCount={6}
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{
                  value: 'Wavelength (nm)',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 12,
                  style: { fontSize: 11, fill: '#64748b' },
                }}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  const label = lines.find((line) => line.key === name)?.label ?? name;
                  return [`${value.toFixed(4)} nm`, label];
                }}
                labelFormatter={(time) => `Time: ${Number(time).toFixed(2)} s`}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ fontSize: 11, paddingLeft: 12 }}
              />
              {lines.map((line) => (
                <Line
                  key={line.key}
                  type="linear"
                  dataKey={line.key}
                  name={line.label}
                  stroke={line.color}
                  strokeWidth={1.5}
                  dot={{ r: 3, fill: line.color, strokeWidth: 0 }}
                  connectNulls
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
