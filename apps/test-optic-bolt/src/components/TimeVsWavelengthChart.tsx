import { useState } from 'react';
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
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

  const handleLegendClick = (entry: any) => {
    const key = String(entry.dataKey);
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <Card className="min-h-[360px] flex flex-col sm:col-span-2">
      <SectionTitle>Time vs Wavelength</SectionTitle>

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
                dataKey="step"
                type="number"
                domain={[1, 3]}
                ticks={[1, 2, 3]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{
                  value: 'Step (1: Initial, 2: 20 PSI, 3: 100 PSI)',
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
                  offset: 10,
                  style: { fontSize: 11, fill: '#64748b' },
                }}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  const label = lines.find((line) => line.key === name)?.label ?? name;
                  return [`${value.toFixed(4)} nm`, label];
                }}
                labelFormatter={(step) => {
                  const stepNames: Record<number, string> = {
                    1: '1 (Initial)',
                    2: '2 (20 PSI)',
                    3: '3 (100 PSI)',
                  };
                  return `Step: ${stepNames[Number(step)] || step}`;
                }}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ fontSize: 11, paddingLeft: 12, cursor: 'pointer' }}
                onClick={handleLegendClick}
                formatter={(value, entry) => {
                  const key = String((entry as { dataKey?: string | number }).dataKey);
                  const isHidden = hiddenKeys.has(key);
                  return (
                    <span
                      style={{
                        color: isHidden ? '#94a3b8' : undefined,
                        textDecoration: isHidden ? 'line-through' : 'none',
                      }}
                    >
                      {value}
                    </span>
                  );
                }}
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
                  hide={hiddenKeys.has(line.key)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}