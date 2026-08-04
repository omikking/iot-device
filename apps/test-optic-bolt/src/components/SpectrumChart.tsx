import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, SectionTitle } from './ui';
import type { SpectrumChartPoint } from '../types';
import { getChartDomains } from '../utils/spectrumChart';

interface SpectrumChartProps {
  title: string;
  points: SpectrumChartPoint[];
  loading?: boolean;
  emptyMessage?: string;
  strokeColor?: string;
}

export default function SpectrumChart({
  title,
  points,
  loading = false,
  emptyMessage = 'Select a serial number to view spectrum data.',
  strokeColor = '#1e3a8a',
}: SpectrumChartProps) {
  const domains = getChartDomains(points);

  return (
    <Card className="min-h-[320px] flex flex-col">
      <SectionTitle>{title}</SectionTitle>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[260px]">
          <span className="inline-block w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-[spin_0.8s_linear_infinite]" />
        </div>
      ) : points.length === 0 ? (
        <div className="flex-1 flex items-center justify-center min-h-[260px] text-sm text-text-muted text-center px-4">
          {emptyMessage}
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 12, right: 20, left: 4, bottom: 28 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="wavelength"
                type="number"
                domain={domains.x}
                tickCount={8}
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{
                  value: 'Wavelength (nm)',
                  position: 'insideBottom',
                  offset: -16,
                  style: { fontSize: 12, fill: '#64748b' },
                }}
              />
              <YAxis
                type="number"
                domain={domains.y}
                tickCount={7}
                tick={{ fontSize: 11, fill: '#64748b' }}
                label={{
                  value: 'Amplitude',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 6,
                  style: { fontSize: 11, fill: '#64748b' },
                }}
              />
              <Tooltip
                formatter={(value: number) => [value.toFixed(1), 'Amplitude']}
                labelFormatter={(wavelength) => `Wavelength: ${Number(wavelength).toFixed(2)} nm`}
              />
              <Line
                type="linear"
                dataKey="amplitude"
                stroke={strokeColor}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
