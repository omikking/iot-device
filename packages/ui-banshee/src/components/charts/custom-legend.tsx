import { Legend } from 'recharts';
import type { Payload } from 'recharts/types/component/DefaultLegendContent';

interface CustomLegendProps {
  payload?: Payload[];
  layout?: 'vertical' | 'horizontal';
  align?: 'center' | 'left' | 'right';
  verticalAlign?: 'top' | 'bottom' | 'middle';
  iconSize?: number;
  inactiveColor?: string;
  className?: string;
}

// Custom Legend Component
export const CustomLegend = ({ payload, className }: CustomLegendProps) => {
  return (
    <div className={className || 'custom-legend-class'}>
      {payload?.map((entry: Payload) => (
        <div key={`legend-${entry.value}`} className="legend-item">
          <span style={{ color: entry.color }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Usage in your chart
<Legend content={<CustomLegend className="my-custom-legend" />} />;
