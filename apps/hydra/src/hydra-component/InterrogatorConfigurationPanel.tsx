'use client';

/* eslint-disable @typescript-eslint/no-unused-vars --
   The panel body is intentionally commented out for now. Its imports, helpers
   and derived values are kept verbatim so the display can be brought back by
   uncommenting the two marked regions, rather than rebuilt from scratch. */

import { Headline, Text } from '@gsp/ui-core';
import {
  INTERROGATOR_CONFIG_IDS,
  INTERROGATOR_INIT_MAX_CHARS,
  interrogatorBlockCount,
} from '@/ble/hydraInterrogatorConfig';
import type { HydraLocalConfig } from './hooks/useHydraLocalConfig';

type StatusTone = 'ok' | 'warning' | 'error' | 'info' | 'idle';

const TONE_CLASS: Record<StatusTone, string> = {
  ok: 'bg-success-3 text-main-black',
  warning: 'bg-warning-3 text-main-black',
  error: 'bg-main-white text-error border border-error',
  info: 'bg-neutral-1 text-main-black',
  idle: 'bg-neutral-2 text-neutral-5',
};

function StatusPill({ tone, children }: { tone: StatusTone; children: string }) {
  return (
    <span
      className={`inline-flex h-6 w-fit shrink-0 items-center rounded-sm px-2 text-xs font-sandvik-text tracking-wide ${TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}

function ValidationRow({ tone, label, detail }: { tone: StatusTone; label: string; detail: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-neutral-3 py-2 sm:flex-row sm:items-start sm:gap-3">
      <StatusPill tone={tone}>{label}</StatusPill>
      <Text variant="xs" color="muted" className="min-w-0">
        {detail}
      </Text>
    </div>
  );
}

interface InterrogatorConfigurationPanelProps {
  config: HydraLocalConfig;
}

/**
 * Shows the three interrogator init strings that save will write to configs
 * 28–30. Read-only by design: the strings are generated from the channel
 * assignments, so the editable surface is the Channels table above.
 */
export function InterrogatorConfigurationPanel({
  config,
}: InterrogatorConfigurationPanelProps) {
  // The panel body below is intentionally commented out, so everything it fed
  // on is commented out with it — uncomment both regions together to bring the
  // Interrogator Configuration display back.
  //
  // const {
  //   connected,
  //   interrogatorStrings,
  //   interrogatorByteLengths,
  //   interrogatorValidation,
  //   deviceInterrogatorStrings,
  //   pendingInterrogatorIds,
  //   windowHalfWidthNm,
  //   sampleFrequencyHz,
  // } = config;
  //
  // const pending = new Set(pendingInterrogatorIds);
  // const { errors, warnings, assignedChannels, longestByteLength, guardBandNm } =
  //   interrogatorValidation;
  //
  // const headerPill = (): { tone: StatusTone; label: string } => {
  //   if (!connected) return { tone: 'idle', label: 'Pair to write' };
  //   if (errors.length > 0) return { tone: 'error', label: 'Not writable' };
  //   if (pending.size > 0)
  //     return { tone: 'warning', label: `${pending.size} pending write` };
  //   return { tone: 'ok', label: 'In sync with device' };
  // };
  // const header = headerPill();

  return (
    <section className="flex flex-col gap-4 min-w-0">
      {/* <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Headline variant="small" color="foreground" as="h2" isBold>
            Interrogator Configuration
          </Headline>
          <Text variant="small" color="muted">
            Generated from the channel assignments and written to configs{' '}
            {INTERROGATOR_CONFIG_IDS.join(', ')} on save. Read-only — edit the
            channel rows to change it.
          </Text>
        </div>
        <StatusPill tone={header.tone}>{header.label}</StatusPill>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {interrogatorStrings.map((initString, index) => {
          const id = INTERROGATOR_CONFIG_IDS[index];
          const bytes = interrogatorByteLengths[index];
          const over = bytes > INTERROGATOR_INIT_MAX_CHARS;
          const fill = Math.min(100, (bytes / INTERROGATOR_INIT_MAX_CHARS) * 100);
          const isPending = pending.has(id);
          const deviceString = deviceInterrogatorStrings[index];

          return (
            <div
              key={id}
              className="flex min-w-0 flex-col gap-2 rounded border border-neutral-3 bg-main-white p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Text variant="small" color="foreground" isBold as="span">
                  Interrogator {index + 1}
                </Text>
                <StatusPill tone={over ? 'error' : 'info'}>{`config ${id}`}</StatusPill>
                {connected && (
                  <StatusPill tone={isPending ? 'warning' : 'ok'}>
                    {isPending
                      ? deviceString === null
                        ? 'Unread — will write'
                        : 'Pending write'
                      : 'Matches device'}
                  </StatusPill>
                )}
              </div>

              <Text variant="xs" color={over ? 'destructive' : 'muted'}>
                {bytes} / {INTERROGATOR_INIT_MAX_CHARS} ch ·{' '}
                {initString.split('\n').length} lines ·{' '}
                {interrogatorBlockCount(initString)} block
                {interrogatorBlockCount(initString) === 1 ? '' : 's'}
              </Text>

              <div className="h-1 w-full overflow-hidden rounded-sm bg-neutral-2">
                <div
                  className={`h-full ${over ? 'bg-error' : 'bg-blue-primary'}`}
                  style={{ width: `${fill}%` }}
                />
              </div>

              <pre className="max-h-64 overflow-auto whitespace-pre rounded bg-neutral-1 p-2 text-xs leading-relaxed text-main-black">
                {initString}
              </pre>
            </div>
          );
        })}
      </div> */}

     
    </section>
  );
}
