'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ECharts } from 'echarts';
import type { EChartsOption } from 'echarts';

import { ChartContainer, EChart } from './chart';

export type StrainChartReading = {
  elongation?: number | null;
};

export type StrainChartMeasurement = {
  createdTimestamp?: number | string | null;
  readings?: ReadonlyArray<StrainChartReading | null> | null;
};

export type StrainChartRequest = {
  serialNumber?: string | null;
  proceqData?: ReadonlyArray<StrainChartMeasurement | null> | null;
};

export type StrainChartSeries = {
  name: string;
  label: string;
  timestamp: number;
  color: string;
  points: Array<[number, number | null]>;
};

export type StrainChartModel = {
  series: StrainChartSeries[];
  measurementPositions: number[];
};

export type StrainMeasurementDot = {
  mm: number;
  active: boolean;
};

export interface HydraSensorReading {
  id: string;
  position?: number;
  mm?: number;
  timeLabel: string;
  seconds: number;
  value?: number;
}

export interface HydraBoltVisualiserProps {
  sensors: HydraSensorReading[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  height?: number;
}

export type StrainChartProps = {
  series: StrainChartSeries[];
  legendSelected?: Record<string, boolean>;
  focusedPointIndex?: number | null;
  className?: string;
  onLegendToggle?: (label: string) => void;
  measurementDots?: StrainMeasurementDot[];
  onMeasurementHover?: (index: number) => void;
  onMeasurementLeave?: () => void;
  onMeasurementSelect?: (index: number) => void;
};

export type StrainChartHandle = {
  resetZoom: () => void;
  getPngDataUrl: () => string | undefined;
};

const PLOT_RANGE = {
  xMinMm: 0,
  xMaxMm: 2000,
  xTickStepMm: 500,
  yMinStrain: 0,
  yDefaultMaxStrain: 16,
  yStepStrain: 4,
};

const GRID_PADDING = {
  leftPx: 68,
  rightPx: 20,
  topPx: 14,
  bottomPx: 58,
};

const HYDRA_ROD_HEIGHT = 16;
const HYDRA_PLATE_WIDTH = 8;
const HYDRA_PLATE_HEIGHT = 44;
const HYDRA_NUT_WIDTH = 32;
const HYDRA_NUT_HEIGHT = 28;
const HYDRA_TOE_LENGTH = 40;
const HYDRA_TOE_HEIGHT = 22;
const HYDRA_SENSOR_SIZE = 14;
const HYDRA_GLOW_RADIUS = 35;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const DEFAULT_PALETTE = [
  '#5B9BD5',
  '#ED7D31',
  '#A5A5A5',
  '#FFC000',
  '#4472C4',
  '#70AD47',
  '#255E91',
  '#9E480E',
  '#636363',
];

const DUMMY_SERIES_PROFILES = [
  [0, 0, 0, 0.2, 0.6, 1.1, 2.0, 0.8, 0.1],
  [0, 0, 0, 0.4, 1.1, 2.6, 4.8, 1.2, 0.1],
  [0, 0, 0, 0.8, 2.0, 3.8, 6.4, 1.5, 0.1],
  [0, 0, 0, 0.1, 0.3, 0.6, 0.8, 0.3, 0.1],
  [0, 0, 0, 0.3, 0.8, 1.5, 3.8, 1.0, 0.1],
  [0, 0, 0, 0.5, 1.4, 3.0, 5.6, 1.4, 0.1],
  [0, 0, 0, 0.7, 1.8, 4.2, 8.0, 1.6, 0.1],
  [0, 0, 0, 1.0, 2.8, 5.8, 10.2, 1.8, 0.1],
  [0, 0, 0, 1.2, 3.8, 7.8, 12.6, 2.0, 0.1],
];

const stringToColor = (value: string): string => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colorInt = Math.floor(
    Math.abs((Math.sin(hash) * 10000) % 1) * 16777215,
  );
  const hex = colorInt.toString(16);

  return `#${'000000'.substring(0, 6 - hex.length)}${hex}`;
};

const isSeriesVisible = (
  legendSelected: Record<string, boolean> | undefined,
  label: string,
) => legendSelected?.[label] !== false;

const toTimestampNumber = (
  value: number | string | null | undefined,
  fallback: number,
) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
};

const buildMeasurementPositions = (count: number): number[] => {
  if (count <= 0) return [];
  if (count === 1) return [1000];

  const start = 250;
  const end = 1750;
  const step = (end - start) / (count - 1);
  return Array.from({ length: count }, (_, index) =>
    Math.round(start + step * index),
  );
};

const createFallbackSeries = (): StrainChartSeries[] => {
  const positions = buildMeasurementPositions(9);
  const startDate = new Date('2026-03-01T00:00:00Z');

  return DUMMY_SERIES_PROFILES.map((profile, index) => {
    const timestamp = new Date(startDate);
    timestamp.setDate(startDate.getDate() + index);

    const label = timestamp.toLocaleDateString('en-GB');

    return {
      name: `dummy_${index}`,
      label,
      timestamp: timestamp.getTime(),
      color:
        DEFAULT_PALETTE[index % DEFAULT_PALETTE.length] ?? stringToColor(label),
      points: positions.map((x, pointIndex) => [x, profile[pointIndex] ?? 0]),
    };
  });
};

const createSeriesFromRequests = (
  requests: ReadonlyArray<StrainChartRequest>,
): StrainChartSeries[] => {
  const result: StrainChartSeries[] = [];
  const labelCounts = new Map<string, number>();

  requests.forEach((request) => {
    const serialLabel = request.serialNumber?.trim() || 'Banshee';

    (request.proceqData || []).forEach((measurement, measurementIndex) => {
      if (!measurement) return;

      const readings = (measurement.readings || []).filter(
        (reading) => reading?.elongation != null,
      );
      if (!readings.length) return;

      const baseLabel = measurement.createdTimestamp
        ? new Date(measurement.createdTimestamp).toLocaleDateString('en-GB')
        : `Measurement ${measurementIndex + 1}`;

      const count = labelCounts.get(baseLabel) ?? 0;
      labelCounts.set(baseLabel, count + 1);

      const label = count === 0 ? baseLabel : `${baseLabel} (${serialLabel})`;
      const positions = buildMeasurementPositions(readings.length);

      const points = positions.map(
        (x, pointIndex) =>
          [x, readings[pointIndex]?.elongation ?? null] as [
            number,
            number | null,
          ],
      );

      result.push({
        name: `${serialLabel}_${baseLabel}_${measurementIndex}`,
        label,
        timestamp: toTimestampNumber(
          measurement.createdTimestamp,
          measurementIndex,
        ),
        color:
          DEFAULT_PALETTE[result.length % DEFAULT_PALETTE.length] ??
          stringToColor(label),
        points,
      });
    });
  });

  return result;
};

export const buildStrainChartModel = (
  requests: ReadonlyArray<StrainChartRequest>,
): StrainChartModel => {
  const built = createSeriesFromRequests(requests);
  const series = built.length ? built : createFallbackSeries();

  series.sort((a, b) => a.timestamp - b.timestamp);

  const maxPointCount = Math.max(...series.map((entry) => entry.points.length));

  return {
    series,
    measurementPositions: buildMeasurementPositions(maxPointCount),
  };
};

const StrainLegend = ({
  series,
  legendSelected,
  onToggle,
}: {
  series: StrainChartSeries[];
  legendSelected?: Record<string, boolean>;
  onToggle?: (label: string) => void;
}) => {
  return (
    <div className="ui-banshee-flex ui-banshee-flex-wrap ui-banshee-justify-center ui-banshee-gap-x-8 ui-banshee-gap-y-3 ui-banshee-px-4 ui-banshee-py-3">
      {series.map((item) => {
        const visible = isSeriesVisible(legendSelected, item.label);

        return (
          <button
            key={item.name}
            type="button"
            onClick={onToggle ? () => onToggle(item.label) : undefined}
            className="ui-banshee-flex ui-banshee-items-center ui-banshee-gap-2 ui-banshee-text-sm ui-banshee-text-neutral-800"
          >
            <span className="ui-banshee-relative ui-banshee-inline-block ui-banshee-w-5 ui-banshee-h-2.5">
              <span
                className="ui-banshee-absolute ui-banshee-left-0 ui-banshee-right-0 ui-banshee-top-1/2 -ui-banshee-translate-y-1/2"
                style={{
                  borderTop: `2px solid ${item.color}`,
                  opacity: visible ? 1 : 0.28,
                }}
              />
              <span
                className="ui-banshee-absolute ui-banshee-left-1/2 ui-banshee-top-1/2 -ui-banshee-translate-x-1/2 -ui-banshee-translate-y-1/2 ui-banshee-w-2.5 ui-banshee-h-2.5 ui-banshee-rounded-full"
                style={{
                  backgroundColor: item.color,
                  opacity: visible ? 1 : 0.28,
                }}
              />
            </span>
            <span style={{ opacity: visible ? 1 : 0.5 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

function HydraSensorMarker({
  x,
  y,
  indicatorX,
}: {
  x: number;
  y: number;
  indicatorX: number;
}) {
  const dist = Math.abs(indicatorX - x);
  const proximity = Math.max(0, Math.min(1, 1 - dist / HYDRA_GLOW_RADIUS));

  const scale = 1 + proximity * 0.8;
  const glowSize = HYDRA_SENSOR_SIZE * scale;
  const opacity = 0.5 + proximity * 0.5;
  const glowOpacity = proximity * 0.7;

  return (
    <g>
      <rect
        x={x - glowSize / 2}
        y={y - glowSize / 2}
        width={glowSize}
        height={glowSize}
        rx={3}
        fill="#FFAA00"
        opacity={glowOpacity}
        style={{ transition: 'all 0.1s ease-out' }}
      />
      <rect
        x={x - HYDRA_SENSOR_SIZE / 2}
        y={y - HYDRA_SENSOR_SIZE / 2}
        width={HYDRA_SENSOR_SIZE}
        height={HYDRA_SENSOR_SIZE}
        rx={2.5}
        fill="url(#hydraSensorGradient)"
        stroke="#5C3A00"
        strokeWidth={1}
        opacity={opacity}
        style={{ transition: 'opacity 0.1s ease-out' }}
      />
    </g>
  );
}

export function HydraBoltVisualiser({
  sensors,
  activeIndex: controlledIndex,
  onActiveIndexChange,
  height = 110,
}: HydraBoltVisualiserProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [internalIndex, setInternalIndex] = useState(0);
  const [indicatorX, setIndicatorX] = useState(0);

  const isControlled = controlledIndex !== undefined;
  const activeIndex = isControlled ? controlledIndex : internalIndex;

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const trackLeft = GRID_PADDING.leftPx;
  const trackRight = GRID_PADDING.rightPx;
  const trackWidth = Math.max(containerWidth - trackLeft - trackRight, 1);
  const midY = height / 2 + 10;
  const minMm = PLOT_RANGE.xMinMm;
  const maxMm = PLOT_RANGE.xMaxMm;
  const xRange = maxMm - minMm;

  const resolveSensorMm = useCallback(
    (sensor?: HydraSensorReading) => {
      if (!sensor) return minMm;

      if (typeof sensor.mm === 'number' && Number.isFinite(sensor.mm)) {
        return clamp(sensor.mm, minMm, maxMm);
      }

      const ratio = clamp(sensor.position ?? 0, 0, 1);
      return minMm + ratio * xRange;
    },
    [maxMm, minMm, xRange],
  );

  const mmToX = useCallback(
    (mm: number) => {
      const clampedMm = clamp(mm, minMm, maxMm);
      const ratio = (clampedMm - minMm) / xRange;

      return trackLeft + ratio * trackWidth;
    },
    [maxMm, minMm, trackLeft, trackWidth, xRange],
  );

  const commitIndex = useCallback(
    (index: number) => {
      if (!isControlled) setInternalIndex(index);
      onActiveIndexChange?.(index);
    },
    [isControlled, onActiveIndexChange],
  );

  useEffect(() => {
    if (!sensors.length || containerWidth === 0) return;

    const activeSensor = sensors[activeIndex];
    const target = mmToX(resolveSensorMm(activeSensor));
    setIndicatorX(target);
  }, [activeIndex, containerWidth, sensors, resolveSensorMm, mmToX]);

  useEffect(() => {
    if (!isControlled) onActiveIndexChange?.(internalIndex);
  }, [internalIndex, isControlled, onActiveIndexChange]);

  const handleScrub = useCallback(
    (clientX: number) => {
      if (!sensors.length || trackWidth === 0 || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const pointerX = clientX - rect.left;
      const offsetX = clamp(pointerX - trackLeft, 0, trackWidth);
      const mmAtPointer = minMm + (offsetX / trackWidth) * xRange;

      let nearest = 0;
      let minDist = Infinity;

      sensors.forEach((sensor, index) => {
        const distance = Math.abs(resolveSensorMm(sensor) - mmAtPointer);
        if (distance < minDist) {
          minDist = distance;
          nearest = index;
        }
      });

      if (nearest !== activeIndex) commitIndex(nearest);
    },
    [
      sensors,
      trackLeft,
      trackWidth,
      activeIndex,
      commitIndex,
      maxMm,
      minMm,
      resolveSensorMm,
      xRange,
    ],
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      handleScrub(event.clientX);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        handleScrub(moveEvent.clientX);
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [handleScrub],
  );

  const activeSensor = sensors[activeIndex];
  const plateX = trackLeft - HYDRA_PLATE_WIDTH;
  const nutX = plateX - HYDRA_NUT_WIDTH + 2;
  const toeStartX = trackLeft + trackWidth;

  return (
    <div style={{ padding: '16px 0', width: '100%', userSelect: 'none' }}>
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        style={{ width: '100%', position: 'relative', cursor: 'pointer' }}
      >
        {containerWidth > 0 && (
          <div style={{ position: 'relative' }}>
            <svg width={containerWidth} height={height}>
              <defs>
                <linearGradient
                  id="hydraSteelSheen"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#6C7A89" />
                  <stop offset="15%" stopColor="#95A5A6" />
                  <stop offset="35%" stopColor="#E2E8F0" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="70%" stopColor="#B0BEC5" />
                  <stop offset="88%" stopColor="#78909C" />
                  <stop offset="100%" stopColor="#37474F" />
                </linearGradient>

                <linearGradient
                  id="hydraSteelFacet"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#455A64" />
                  <stop offset="30%" stopColor="#90A4AE" />
                  <stop offset="60%" stopColor="#ECEFF1" />
                  <stop offset="85%" stopColor="#78909C" />
                  <stop offset="100%" stopColor="#37474F" />
                </linearGradient>

                <linearGradient
                  id="hydraSteelShadow"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#263238" />
                  <stop offset="50%" stopColor="#455A64" />
                  <stop offset="100%" stopColor="#1A252C" />
                </linearGradient>

                <linearGradient
                  id="hydraSensorGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#FFE082" />
                  <stop offset="40%" stopColor="#FFB300" />
                  <stop offset="100%" stopColor="#FF6F00" />
                </linearGradient>
              </defs>

              <g>
                <rect
                  x={trackLeft}
                  y={midY - HYDRA_ROD_HEIGHT / 2}
                  width={trackWidth}
                  height={HYDRA_ROD_HEIGHT}
                  fill="url(#hydraSteelSheen)"
                />
                <line
                  x1={trackLeft}
                  y1={midY - HYDRA_ROD_HEIGHT / 2 + 2}
                  x2={trackLeft + trackWidth}
                  y2={midY - HYDRA_ROD_HEIGHT / 2 + 2}
                  stroke="#FFFFFF"
                  strokeWidth={0.75}
                  opacity={0.5}
                />
                <line
                  x1={trackLeft}
                  y1={midY + HYDRA_ROD_HEIGHT / 2 - 2}
                  x2={trackLeft + trackWidth}
                  y2={midY + HYDRA_ROD_HEIGHT / 2 - 2}
                  stroke="#263238"
                  strokeWidth={0.75}
                  opacity={0.4}
                />
              </g>

              <g
                transform={`translate(${toeStartX}, ${midY - HYDRA_TOE_HEIGHT / 2})`}
              >
                <rect
                  x={0}
                  y={0}
                  width={HYDRA_TOE_LENGTH - 6}
                  height={HYDRA_TOE_HEIGHT}
                  rx={2}
                  fill="url(#hydraSteelSheen)"
                  stroke="#37474F"
                  strokeWidth={0.5}
                />
                <line
                  x1={8}
                  y1={2}
                  x2={8}
                  y2={HYDRA_TOE_HEIGHT - 2}
                  stroke="#37474F"
                  opacity={0.3}
                  strokeWidth={1}
                />
                <line
                  x1={14}
                  y1={2}
                  x2={14}
                  y2={HYDRA_TOE_HEIGHT - 2}
                  stroke="#FFFFFF"
                  opacity={0.3}
                  strokeWidth={1}
                />
                <line
                  x1={20}
                  y1={2}
                  x2={20}
                  y2={HYDRA_TOE_HEIGHT - 2}
                  stroke="#37474F"
                  opacity={0.3}
                  strokeWidth={1}
                />
                <line
                  x1={26}
                  y1={2}
                  x2={26}
                  y2={HYDRA_TOE_HEIGHT - 2}
                  stroke="#FFFFFF"
                  opacity={0.3}
                  strokeWidth={1}
                />
                <polygon
                  points={`${HYDRA_TOE_LENGTH - 6},0 ${HYDRA_TOE_LENGTH},4 ${HYDRA_TOE_LENGTH},${HYDRA_TOE_HEIGHT - 4} ${HYDRA_TOE_LENGTH - 6},${HYDRA_TOE_HEIGHT}`}
                  fill="url(#hydraSteelFacet)"
                  stroke="#263238"
                  strokeWidth={0.5}
                />
              </g>

              <g>
                <rect
                  x={plateX}
                  y={midY - HYDRA_PLATE_HEIGHT / 2}
                  width={HYDRA_PLATE_WIDTH}
                  height={HYDRA_PLATE_HEIGHT}
                  rx={1.5}
                  fill="url(#hydraSteelSheen)"
                  stroke="#37474F"
                  strokeWidth={0.75}
                />
                <rect
                  x={plateX + 1}
                  y={midY - HYDRA_PLATE_HEIGHT / 2 + 2}
                  width={HYDRA_PLATE_WIDTH - 2}
                  height={HYDRA_PLATE_HEIGHT - 4}
                  rx={1}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  opacity={0.4}
                />
                <rect
                  x={plateX + HYDRA_PLATE_WIDTH - 2}
                  y={midY - HYDRA_ROD_HEIGHT / 2 - 4}
                  width={2}
                  height={HYDRA_ROD_HEIGHT + 8}
                  fill="url(#hydraSteelShadow)"
                />
              </g>

              <g>
                <rect
                  x={nutX + HYDRA_NUT_WIDTH - 3}
                  y={midY - HYDRA_NUT_HEIGHT / 2 + 2}
                  width={3}
                  height={HYDRA_NUT_HEIGHT - 4}
                  rx={1}
                  fill="url(#hydraSteelShadow)"
                />
                <rect
                  x={nutX}
                  y={midY - HYDRA_NUT_HEIGHT / 2}
                  width={HYDRA_NUT_WIDTH - 3}
                  height={HYDRA_NUT_HEIGHT}
                  rx={3}
                  fill="url(#hydraSteelSheen)"
                  stroke="#263238"
                  strokeWidth={0.75}
                />
                <rect
                  x={nutX + 5}
                  y={midY - HYDRA_NUT_HEIGHT / 2 + 1}
                  width={HYDRA_NUT_WIDTH - 13}
                  height={HYDRA_NUT_HEIGHT - 2}
                  rx={1.5}
                  fill="url(#hydraSteelFacet)"
                  opacity={0.85}
                />
                <rect
                  x={nutX - 5}
                  y={midY - HYDRA_ROD_HEIGHT / 2 + 1}
                  width={5}
                  height={HYDRA_ROD_HEIGHT - 2}
                  rx={1.5}
                  fill="url(#hydraSteelSheen)"
                  stroke="#37474F"
                  strokeWidth={0.5}
                />
              </g>

              {sensors.map((sensor) => (
                <HydraSensorMarker
                  key={sensor.id}
                  x={mmToX(resolveSensorMm(sensor))}
                  y={midY}
                  indicatorX={indicatorX}
                />
              ))}

              <g
                style={{
                  transform: `translateX(${indicatorX}px)`,
                  transformBox: 'fill-box',
                  transition: 'transform 280ms cubic-bezier(0.2, 0.9, 0.2, 1)',
                }}
              >
                <rect
                  x={-48}
                  y={midY - HYDRA_ROD_HEIGHT / 2 - 38}
                  width={96}
                  height={24}
                  rx={6}
                  fill="#1E2022"
                />
                <polygon points="0,-14 -4,-15 4,-15" fill="#1E2022" />
                <text
                  x={0}
                  y={midY - HYDRA_ROD_HEIGHT / 2 - 22}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="700"
                  fill="#FFFFFF"
                  letterSpacing={0.2}
                >
                  {activeSensor
                    ? `${activeSensor.timeLabel}(mm)=${activeSensor.seconds}`
                    : ''}
                </text>
                <rect
                  x={-1}
                  y={midY - HYDRA_ROD_HEIGHT / 2 - 10}
                  width={2}
                  height={10}
                  fill="#1E2022"
                  opacity={0.4}
                />
              </g>
            </svg>

            <span
              style={{
                position: 'absolute',
                left: 4,
                top: midY + HYDRA_PLATE_HEIGHT / 2 + 8,
                fontSize: 12,
                fontWeight: 600,
                color: 'inherit',
              }}
            >
              Nut
            </span>
            <span
              style={{
                position: 'absolute',
                right: 0,
                top: midY + HYDRA_PLATE_HEIGHT / 2 + 8,
                textAlign: 'right',
                fontSize: 12,
                fontWeight: 600,
                color: 'inherit',
              }}
            >
              Toe Anchor
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export const StrainChart = forwardRef<StrainChartHandle, StrainChartProps>(
  function StrainChart(
    {
      series,
      legendSelected,
      focusedPointIndex = null,
      className,
      onLegendToggle,
      measurementDots = [],
      onMeasurementHover,
      onMeasurementSelect,
    },
    ref,
  ) {
    const chartRef = useRef<ECharts | null>(null);

    const hydraSensors = useMemo<HydraSensorReading[]>(() => {
      if (!measurementDots.length) return [];

      return measurementDots.map((dot, index) => ({
        id: `dot-${dot.mm}-${index}`,
        mm: Math.min(Math.max(dot.mm, PLOT_RANGE.xMinMm), PLOT_RANGE.xMaxMm),
        timeLabel: `MP${index + 1}`,
        seconds: dot.mm,
      }));
    }, [measurementDots]);

    const hydraActiveIndex = useMemo(() => {
      if (!measurementDots.length) return undefined;

      if (focusedPointIndex != null) {
        return Math.min(
          Math.max(focusedPointIndex, 0),
          measurementDots.length - 1,
        );
      }

      const activeDotIndex = measurementDots.findIndex((dot) => dot.active);
      return activeDotIndex >= 0 ? activeDotIndex : undefined;
    }, [focusedPointIndex, measurementDots]);

    useImperativeHandle(ref, () => ({
      resetZoom: () => {
        chartRef.current?.dispatchAction({
          type: 'dataZoom',
          start: 0,
          end: 100,
        });
        chartRef.current?.dispatchAction({
          type: 'dataZoom',
          yAxisIndex: 0,
          start: 0,
          end: 100,
        });
      },
      getPngDataUrl: () =>
        chartRef.current?.getDataURL({
          type: 'png',
          pixelRatio: 2,
          backgroundColor: '#ffffff',
        }),
    }));

    const option = useMemo<EChartsOption>(() => {
      const visibleSeries = series.filter(
        (entry) =>
          isSeriesVisible(legendSelected, entry.label) && entry.points.length,
      );

      let max = 0;
      visibleSeries.forEach((entry) => {
        entry.points.forEach((point) => {
          const value = point[1];
          if (value != null && value > max) max = value;
        });
      });

      const yMax =
        max <= 0
          ? PLOT_RANGE.yDefaultMaxStrain
          : Math.max(
              PLOT_RANGE.yDefaultMaxStrain,
              Math.ceil(max / PLOT_RANGE.yStepStrain) * PLOT_RANGE.yStepStrain,
            );

      const lines = visibleSeries.map((entry) => {
        const hasFocusedPoint =
          focusedPointIndex != null && focusedPointIndex < entry.points.length;

        return {
          name: entry.label,
          type: 'line' as const,
          smooth: true,
          symbol: 'circle',
          symbolSize: (_value: unknown, params: { dataIndex: number }) => {
            if (!hasFocusedPoint) return 8;
            return params.dataIndex === focusedPointIndex ? 12 : 8;
          },
          lineStyle: {
            width: 3,
            color: entry.color,
          },
          itemStyle: {
            color: entry.color,
            borderColor: entry.color,
            borderWidth: 1,
          },
          data: entry.points,
          z: 6,
        };
      });

      return {
        animation: false,
        grid: {
          top: GRID_PADDING.topPx,
          right: GRID_PADDING.rightPx,
          bottom: GRID_PADDING.bottomPx,
          left: GRID_PADDING.leftPx,
        },
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: (params: any) => {
            if (!params?.value || !Array.isArray(params.value)) return '';
            const x = params.value[0];
            const y = params.value[1];
            return `${params.seriesName}<br/>Position: ${x} mm<br/>Strain: ${y}`;
          },
        },
        xAxis: {
          type: 'value',
          min: PLOT_RANGE.xMinMm,
          max: PLOT_RANGE.xMaxMm,
          interval: PLOT_RANGE.xTickStepMm,
          name: 'Position along the bolt (mm)',
          nameLocation: 'middle',
          nameGap: 60,
          axisLine: { lineStyle: { color: '#9ca3af' } },
          axisLabel: { color: '#111827', fontSize: 11 },
          splitLine: { show: false },
        },
        yAxis: {
          type: 'value',
          min: PLOT_RANGE.yMinStrain,
          max: yMax,
          interval: PLOT_RANGE.yStepStrain,
          name: 'Strain (%)',
          nameLocation: 'middle',
          nameGap: 50,
          axisLine: { lineStyle: { color: '#9ca3af' } },
          axisLabel: { color: '#111827', fontSize: 11 },
          splitLine: {
            show: true,
            lineStyle: { color: '#E5E7EB', width: 1, type: 'dashed' },
          },
        },
        dataZoom: [
          { type: 'inside', xAxisIndex: 0, start: 0, end: 100 },
          { type: 'inside', yAxisIndex: 0, start: 0, end: 100 },
        ],
        series: lines,
      };
    }, [focusedPointIndex, legendSelected, series]);

    return (
      <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-6">
        <ChartContainer
          config={{
            strain: {
              label: 'Strain',
              color: '#5B9BD5',
            },
          }}
          className={className ?? 'ui-banshee-w-full ui-banshee-h-[430px]'}
        >
          <EChart
            chartRef={chartRef}
            option={option}
            className="ui-banshee-w-full ui-banshee-h-full"
          />
        </ChartContainer>

        <StrainLegend
          series={series}
          legendSelected={legendSelected}
          onToggle={onLegendToggle}
        />

        <HydraBoltVisualiser
          sensors={hydraSensors}
          activeIndex={hydraActiveIndex}
          onActiveIndexChange={(index) => {
            onMeasurementHover?.(index);
            onMeasurementSelect?.(index);
          }}
        />
      </div>
    );
  },
);
