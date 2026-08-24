'use client';

import * as React from 'react';
import { ChartContainer, EChart } from './chart';

const BOTTOM_BLUE = '#2563EB';

const GRID_PADDING = {
  leftPx: 48,
  rightPx: 32,
};

const BOLT_DOT_POSITIONS = [
  240, 420, 600, 780, 960, 1140, 1320, 1500, 1680,
] as const;

const isLegendVisible = (
  legendSelected: Record<string, boolean>,
  label: string,
) => legendSelected[label] !== false;

const LineDotLegend = ({
  items,
  selected,
  onToggle,
  className,
}: {
  items: Array<{ label: string; color: string }>;
  selected?: Record<string, boolean>;
  onToggle?: (label: string) => void;
  className?: string;
}) => {
  return (
    <div
      className={`ui-banshee-flex ui-banshee-flex-wrap ui-banshee-justify-center ui-banshee-gap-x-8 ui-banshee-gap-y-2 ui-banshee-px-4 ui-banshee-py-1 ${className ?? ''}`}
    >
      {items.map((item) => {
        const visible = selected ? isLegendVisible(selected, item.label) : true;

        return (
          <button
            key={item.label}
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

export type TimePlotHydraSensor = {
  id: string;
  mm: number;
  label: string;
  value?: number;
};

export type TimePlotHydraBoltVisualiserProps = {
  sensors: TimePlotHydraSensor[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  onPointerLeave?: () => void;
  height?: number;
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
const SENSOR_DOMAIN_MAX_MM = 2000;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function TimePlotHydraSensorMarker({
  x,
  y,
  indicatorX,
}: {
  x: number;
  y: number;
  indicatorX: number;
}) {
  const distance = Math.abs(indicatorX - x);
  const proximity = clamp(1 - distance / HYDRA_GLOW_RADIUS, 0, 1);

  const scale = 1 + proximity * 0.8;
  const glowSize = HYDRA_SENSOR_SIZE * scale;

  return (
    <g>
      <rect
        x={x - glowSize / 2}
        y={y - glowSize / 2}
        width={glowSize}
        height={glowSize}
        rx={3}
        fill={BOTTOM_BLUE}
        opacity={proximity * 0.35}
        style={{ transition: 'all 0.12s ease-out' }}
      />
      <rect
        x={x - HYDRA_SENSOR_SIZE / 2}
        y={y - HYDRA_SENSOR_SIZE / 2}
        width={HYDRA_SENSOR_SIZE}
        height={HYDRA_SENSOR_SIZE}
        rx={2.5}
        fill="url(#timePlotHydraSensorGradient)"
        stroke="#1E3A8A"
        strokeWidth={1}
        opacity={0.55 + proximity * 0.45}
        style={{ transition: 'opacity 0.12s ease-out' }}
      />
    </g>
  );
}

export function TimePlotHydraBoltVisualiser({
  sensors,
  activeIndex: controlledIndex,
  onActiveIndexChange,
  onPointerLeave,
  height = 110,
}: TimePlotHydraBoltVisualiserProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [internalIndex, setInternalIndex] = React.useState(0);
  const [indicatorX, setIndicatorX] = React.useState(0);

  const isControlled = controlledIndex !== undefined;
  const activeIndex = isControlled ? controlledIndex : internalIndex;

  React.useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setContainerWidth(entry.contentRect.width);
      });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const trackLeft = GRID_PADDING.leftPx;
  const trackRight = GRID_PADDING.rightPx;
  const trackWidth = Math.max(containerWidth - trackLeft - trackRight, 1);
  const midY = height / 2 + 10;

  const mmToX = React.useCallback(
    (mm: number) => {
      const boundedMm = clamp(mm, 0, SENSOR_DOMAIN_MAX_MM);
      const ratio = boundedMm / SENSOR_DOMAIN_MAX_MM;
      return trackLeft + ratio * trackWidth;
    },
    [trackLeft, trackWidth],
  );

  const commitIndex = React.useCallback(
    (nextIndex: number) => {
      if (!isControlled) setInternalIndex(nextIndex);
      onActiveIndexChange?.(nextIndex);
    },
    [isControlled, onActiveIndexChange],
  );

  React.useEffect(() => {
    if (!sensors.length || containerWidth === 0) return;

    const activeSensor = sensors[activeIndex] ?? sensors[0];
    setIndicatorX(mmToX(activeSensor.mm));
  }, [activeIndex, sensors, containerWidth, mmToX]);

  React.useEffect(() => {
    if (!isControlled) onActiveIndexChange?.(internalIndex);
  }, [internalIndex, isControlled, onActiveIndexChange]);

  const handleScrub = React.useCallback(
    (clientX: number) => {
      if (!sensors.length || !containerRef.current || trackWidth <= 0) return;

      const rect = containerRef.current.getBoundingClientRect();
      const pointerX = clientX - rect.left;
      const offsetX = clamp(pointerX - trackLeft, 0, trackWidth);
      const mmAtPointer = (offsetX / trackWidth) * SENSOR_DOMAIN_MAX_MM;

      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      sensors.forEach((sensor, index) => {
        const distance = Math.abs(
          clamp(sensor.mm, 0, SENSOR_DOMAIN_MAX_MM) - mmAtPointer,
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      if (nearestIndex !== activeIndex) {
        commitIndex(nearestIndex);
      }
    },
    [activeIndex, commitIndex, sensors, trackLeft, trackWidth],
  );

  const onMouseDown = React.useCallback(
    (event: React.MouseEvent) => {
      handleScrub(event.clientX);

      const onMouseMove = (moveEvent: MouseEvent) => {
        handleScrub(moveEvent.clientX);
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [handleScrub],
  );

  const activeSensor = sensors[activeIndex] ?? sensors[0];
  const plateX = trackLeft - HYDRA_PLATE_WIDTH;
  const nutX = plateX - HYDRA_NUT_WIDTH + 2;
  const toeStartX = trackLeft + trackWidth;

  return (
    <div style={{ width: '100%', padding: '16px 0', userSelect: 'none' }}>
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onPointerLeave}
        style={{ width: '100%', position: 'relative', cursor: 'pointer' }}
      >
        {containerWidth > 0 && (
          <div style={{ position: 'relative' }}>
            <svg width={containerWidth} height={height}>
              <defs>
                <linearGradient
                  id="timePlotHydraSteelSheen"
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
                  id="timePlotHydraSteelFacet"
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
                  id="timePlotHydraSteelShadow"
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
                  id="timePlotHydraSensorGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#93C5FD" />
                  <stop offset="40%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
              </defs>

              <g>
                <rect
                  x={trackLeft}
                  y={midY - HYDRA_ROD_HEIGHT / 2}
                  width={trackWidth}
                  height={HYDRA_ROD_HEIGHT}
                  fill="url(#timePlotHydraSteelSheen)"
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
                  fill="url(#timePlotHydraSteelSheen)"
                  stroke="#37474F"
                  strokeWidth={0.5}
                />
                <polygon
                  points={`${HYDRA_TOE_LENGTH - 6},0 ${HYDRA_TOE_LENGTH},4 ${HYDRA_TOE_LENGTH},${HYDRA_TOE_HEIGHT - 4} ${HYDRA_TOE_LENGTH - 6},${HYDRA_TOE_HEIGHT}`}
                  fill="url(#timePlotHydraSteelFacet)"
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
                  fill="url(#timePlotHydraSteelSheen)"
                  stroke="#37474F"
                  strokeWidth={0.75}
                />
                <rect
                  x={plateX + HYDRA_PLATE_WIDTH - 2}
                  y={midY - HYDRA_ROD_HEIGHT / 2 - 4}
                  width={2}
                  height={HYDRA_ROD_HEIGHT + 8}
                  fill="url(#timePlotHydraSteelShadow)"
                />
              </g>

              <g>
                <rect
                  x={nutX + HYDRA_NUT_WIDTH - 3}
                  y={midY - HYDRA_NUT_HEIGHT / 2 + 2}
                  width={3}
                  height={HYDRA_NUT_HEIGHT - 4}
                  rx={1}
                  fill="url(#timePlotHydraSteelShadow)"
                />
                <rect
                  x={nutX}
                  y={midY - HYDRA_NUT_HEIGHT / 2}
                  width={HYDRA_NUT_WIDTH - 3}
                  height={HYDRA_NUT_HEIGHT}
                  rx={3}
                  fill="url(#timePlotHydraSteelSheen)"
                  stroke="#263238"
                  strokeWidth={0.75}
                />
              </g>

              {sensors.map((sensor) => (
                <TimePlotHydraSensorMarker
                  key={sensor.id}
                  x={mmToX(sensor.mm)}
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
                    ? `${activeSensor.label}(mm)=${activeSensor.mm}`
                    : ''}
                </text>
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

export type TimePlotChartProps = {
  timePlotStressRef: React.MutableRefObject<any>;
  topOption: any;
  onTopLineClick: (params: unknown) => void;
  topLegendItems: Array<{ label: string; color: string }>;
  legendSelected: Record<string, boolean>;
  onLegendToggle: (label: string) => void;
  showBottomChart: boolean;
  timePlotStrainRef: React.MutableRefObject<any>;
  bottomOption: any;
  bottomLegendLabel: string;
  onBottomPointHover: (params: unknown) => void;
  onBottomPointLeave: () => void;
  onBottomPointSelect: (params: unknown) => void;
  activeBoltDotIndex: number | null;
  onBoltDotHover: (index: number) => void;
  onBoltDotLeave: () => void;
  onBoltDotSelect: (index: number) => void;
};

export const TimePlotChart = ({
  timePlotStressRef,
  topOption,
  onTopLineClick,
  topLegendItems,
  legendSelected,
  onLegendToggle,
  showBottomChart,
  timePlotStrainRef,
  bottomOption,
  bottomLegendLabel,
  onBottomPointHover,
  onBottomPointLeave,
  onBottomPointSelect,
  activeBoltDotIndex,
  onBoltDotHover,
  onBoltDotLeave,
  onBoltDotSelect,
}: TimePlotChartProps) => {
  let bottomSection: React.ReactNode = null;

  if (showBottomChart) {
    bottomSection = (
      <>
        <ChartContainer
          config={{
            profile: {
              label: 'Selected Sensor',
              color: BOTTOM_BLUE,
            },
          }}
          className="ui-banshee-w-full ui-banshee-relative ui-banshee-z-10 ui-banshee-h-[320px]"
        >
          <EChart
            chartRef={timePlotStrainRef}
            option={bottomOption}
            className="ui-banshee-w-full ui-banshee-h-full"
            onEvents={{
              mouseover: onBottomPointHover,
              mouseout: onBottomPointLeave,
              click: onBottomPointSelect,
            }}
          />
        </ChartContainer>

        <LineDotLegend
          items={[{ label: bottomLegendLabel, color: BOTTOM_BLUE }]}
          className="-ui-banshee-mt-1"
        />

        <TimePlotHydraBoltVisualiser
          sensors={BOLT_DOT_POSITIONS.map((mm, index) => ({
            id: `time-plot-sensor-${index + 1}`,
            mm,
            label: `MP${index + 1}`,
          }))}
          activeIndex={activeBoltDotIndex ?? undefined}
          onActiveIndexChange={(index) => {
            onBoltDotHover(index);
            onBoltDotSelect(index);
          }}
          onPointerLeave={onBoltDotLeave}
        />
      </>
    );
  }

  return (
    <div className="ui-banshee-flex ui-banshee-flex-col ui-banshee-gap-2">
      <ChartContainer
        config={{
          timePlot: {
            label: 'Time Plot',
            color: '#5B9BD5',
          },
        }}
        className="ui-banshee-w-full ui-banshee-relative ui-banshee-z-10 ui-banshee-h-[430px]"
      >
        <EChart
          chartRef={timePlotStressRef}
          option={topOption}
          className="ui-banshee-w-full ui-banshee-h-full"
          onEvents={{ click: onTopLineClick }}
        />
      </ChartContainer>

      <LineDotLegend
        items={topLegendItems}
        selected={legendSelected}
        className="ui-banshee-mt-1"
        onToggle={onLegendToggle}
      />
      {bottomSection}
    </div>
  );
};
