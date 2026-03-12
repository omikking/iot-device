'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

import { cn } from '../../lib/utils';

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<'div'> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children'];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color,
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join('\n')}
}
`,
          )
          .join('\n'),
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<'div'> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: 'line' | 'dot' | 'dashed';
    nameKey?: string;
    labelKey?: string;
  }) {
  const { config } = useChart();

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null;
    }

    const [item] = payload;
    const key = `${labelKey || item?.dataKey || item?.name || 'value'}`;
    const itemConfig = getPayloadConfigFromPayload(config, item, key);
    const value =
      !labelKey && typeof label === 'string'
        ? config[label]?.label || label
        : itemConfig?.label;

    if (labelFormatter) {
      return (
        <div className={cn('font-medium', labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      );
    }

    if (!value) {
      return null;
    }

    return (
      <div className={cn('ui-banshee-font-medium', labelClassName)}>
        {value}
      </div>
    );
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ]);

  if (!active || !payload?.length) {
    return null;
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot';

  return (
    <div
      className={cn(
        'ui-banshee-border-border/50 ui-banshee-bg-background ui-banshee-grid ui-banshee-min-w-[8rem] ui-banshee-items-start ui-banshee-gap-1.5 ui-banshee-rounded-lg ui-banshee-border ui-banshee-px-2.5 ui-banshee-py-1.5 ui-banshee-text-xs ui-banshee-shadow-xl',
        className,
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== 'none')
          .map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const payloadFill =
              item.payload && typeof item.payload === 'object'
                ? (item.payload as { fill?: string }).fill
                : undefined;
            const indicatorColor = color || payloadFill || item.color;

            return (
              <div
                key={item.dataKey}
                className={cn(
                  '[&>svg]:ui-banshee-text-muted-foreground ui-banshee-flex w-full flex-wrap items-stretch gap-2 [&>svg]:ui-banshee-h-2.5 [&>svg]:ui-banshee-w-2.5',
                  indicator === 'dot' && 'items-center',
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            'ui-banshee-shrink-0 ui-banshee-rounded-[2px] ui-banshee-border-(--color-border) ui-banshee-bg-(--color-bg)',
                            {
                              'ui-banshee-h-2.5 ui-banshee-w-2.5':
                                indicator === 'dot',
                              'ui-banshee-w-1': indicator === 'line',
                              'ui-banshee-w-0 ui-banshee-border-[1.5px] ui-banshee-border-dashed ui-banshee-bg-transparent':
                                indicator === 'dashed',
                              'ui-banshee-my-0.5':
                                nestLabel && indicator === 'dashed',
                            },
                          )}
                          style={
                            {
                              '--color-bg': indicatorColor,
                              '--color-border': indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'ui-banshee-flex ui-banshee-flex-1 ui-banshee-justify-between ui-banshee-leading-none',
                        nestLabel
                          ? 'ui-banshee-items-end'
                          : 'ui-banshee-items-center',
                      )}
                    >
                      <div className="ui-banshee-grid ui-banshee-gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="ui-banshee-text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="ui-banshee-text-foreground ui-banshee-font-mono ui-banshee-font-medium ui-banshee-tabular-nums">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

function getIconElement(iconType: string, color: string) {
  if (iconType === 'line') {
    return (
      <div
        className="ui-banshee-h-1 ui-banshee-w-6 ui-banshee-shrink-0 ui-banshee-rounded-sm"
        style={{
          backgroundColor: color,
        }}
      />
    );
  }
  if (iconType === 'circle') {
    return (
      <div
        className="ui-banshee-h-2 ui-banshee-w-2 ui-banshee-shrink-0 ui-banshee-rounded-full"
        style={{
          backgroundColor: color,
        }}
      />
    );
  }
  return (
    <div
      className="ui-banshee-h-2 ui-banshee-w-2 ui-banshee-shrink-0 ui-banshee-rounded-[2px]"
      style={{
        backgroundColor: color,
      }}
    />
  );
}

const ChartLegend = RechartsPrimitive.Legend;

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
  iconType = 'square',
}: React.ComponentProps<'div'> &
  Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
    hideIcon?: boolean;
    nameKey?: string;
    iconType?: string;
  }) {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        'ui-banshee-flex ui-banshee-items-center ui-banshee-justify-center ui-banshee-gap-4',
        verticalAlign === 'top' ? 'ui-banshee-pb-3' : 'ui-banshee-pt-3',
        className,
      )}
    >
      {payload
        .filter((item) => item.type !== 'none')
        .map((item) => {
          const key = `${nameKey || String(item.dataKey) || 'value'}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);

          return (
            <div
              key={String(item.value)}
              className={cn(
                '[&>svg]:ui-banshee-text-muted-foreground ui-banshee-flex ui-banshee-items-center ui-banshee-gap-1.5 [&>svg]:ui-banshee-h-3 [&>svg]:ui-banshee-w-3',
              )}
            >
              {!hideIcon &&
                (itemConfig?.icon ? (
                  <itemConfig.icon />
                ) : (
                  getIconElement(iconType, item.color || '')
                ))}
              {itemConfig?.label}
            </div>
          );
        })}
    </div>
  );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key];
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
