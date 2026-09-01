'use client';

import { useState } from 'react';
import { Headline, Button, Switch, Text } from '@gsp/ui-core';
import { Eye, EyeOff, Wifi } from 'lucide-react';
import { FormFieldLabel } from './FormFieldLabel';
import { ChannelConfigTable } from './ChannelConfigTable';
import type { HydraLocalConfig } from './hooks/useHydraLocalConfig';

const inputClassName =
  'flex w-full h-10 border-neutral-3 rounded border bg-main-white px-4 text-sm font-sandvik-text text-main-black placeholder:text-neutral-5 outline-none hover:border-blue-primary focus-visible:border-blue-primary transition ease-in-out duration-200';

const disabledInputClassName =
  'flex w-full h-10 border-transparent rounded border bg-neutral-2 px-4 text-sm font-sandvik-text text-neutral-5 placeholder:text-neutral-5 outline-none pointer-events-none';

const errorInputClassName =
  'flex w-full h-10 rounded border border-error bg-main-white px-4 text-sm font-sandvik-text text-main-black placeholder:text-neutral-5 outline-none transition ease-in-out duration-200';

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <Text variant="xs" color="destructive" className="mt-1">
      {message}
    </Text>
  );
}

interface LocalConfigurationPanelProps {
  config: HydraLocalConfig;
}

export function LocalConfigurationPanel({ config }: LocalConfigurationPanelProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    connected,
    connecting,
    saving,
    deviceName,
    macAddress,
    values,
    errors,
    setField,
    pairWithBluetooth,
    channelRows,
    setChannelRow,
  } = config;

  const fieldClass = (field: keyof typeof errors) => {
    if (!connected) return disabledInputClassName;
    return errors[field] ? errorInputClassName : inputClassName;
  };

  return (
    <section className="flex flex-col gap-4 min-w-0">
      <div className="flex items-start justify-between gap-4">
        <Headline variant="medium" color="foreground" as="h2" isBold>
          Local Configuration
        </Headline>
        {connected && deviceName && (
          <Text variant="small" color="foreground">
            Connected: {deviceName}
          </Text>
        )}
      </div>

      <Button
        variant="primary"
        type="button"
        className="w-fit"
        disabled={connecting || saving}
        onClick={pairWithBluetooth}
      >
        {connecting ? 'Pairing…' : connected ? 'Re-pair with Bluetooth' : 'Pair with Bluetooth'}
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormFieldLabel label="Name">
          <input
            value={values.name}
            onChange={(e) => setField('name', e.target.value)}
            placeholder="Name"
            disabled={!connected}
            className={fieldClass('name')}
          />
          <FieldError message={errors.name} />
        </FormFieldLabel>

        <FormFieldLabel label="Sample Rate (minutes)">
          <input
            value={values.sampleRateMinutes}
            onChange={(e) => setField('sampleRateMinutes', e.target.value)}
            placeholder="Sample Rate"
            inputMode="decimal"
            disabled={!connected}
            className={fieldClass('sampleRateMinutes')}
          />
          <FieldError message={errors.sampleRateMinutes} />
        </FormFieldLabel>

        <FormFieldLabel label="Wifi Network">
          <div className="relative">
            <input
              value={values.wifiNetwork}
              onChange={(e) => setField('wifiNetwork', e.target.value)}
              placeholder="Wifi Network"
              disabled={!connected}
              className={`${fieldClass('wifiNetwork')} pr-10`}
            />
            <Wifi className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-5" />
          </div>
          <FieldError message={errors.wifiNetwork} />
        </FormFieldLabel>

        <FormFieldLabel label="Upload Rate (minutes)">
          <input
            value={values.uploadRateMinutes}
            onChange={(e) => setField('uploadRateMinutes', e.target.value)}
            placeholder="Upload Rate"
            inputMode="numeric"
            disabled={!connected}
            className={fieldClass('uploadRateMinutes')}
          />
          <FieldError message={errors.uploadRateMinutes} />
        </FormFieldLabel>

        <FormFieldLabel label="Wifi Password">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={values.wifiPassword}
              onChange={(e) => setField('wifiPassword', e.target.value)}
              placeholder={connected ? 'Leave blank to keep current' : 'Wifi Password'}
              disabled={!connected}
              className={`${fieldClass('wifiPassword')} pr-10`}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={!connected}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-5 disabled:pointer-events-none"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <FieldError message={errors.wifiPassword} />
        </FormFieldLabel>

        <div className="space-y-2">
          <Text variant="small" color="foreground" className="font-medium">
            Wifi
          </Text>
          <div className="flex items-end pb-2">
            <div className="flex items-center gap-3">
              <Switch
                checked={values.wifiEnabled}
                onCheckedChange={(checked) => setField('wifiEnabled', checked)}
                disabled={!connected}
              />
              <Text variant="small" color="foreground">
                Wifi Enabled
              </Text>
            </div>
          </div>
        </div>

        <Text variant="small" color="foreground">
          MAC Address: {macAddress ?? '—'}
        </Text>

        <div className="space-y-2">
          <Text variant="small" color="foreground" className="font-medium">
            Dynamic mode
          </Text>
          <div className="flex items-center gap-3">
            <Switch
              checked={values.dynamicModeEnabled}
              onCheckedChange={(checked) => setField('dynamicModeEnabled', checked)}
              disabled={!connected}
            />
            <Text variant="small" color="foreground">
              Dynamic Mode Enabled
            </Text>
          </div>
        </div>

        {values.dynamicModeEnabled && (
          <FormFieldLabel label="Dynamic Sample Rate (Hz)">
            <input
              value={values.dynamicSampleRateHz}
              onChange={(e) => setField('dynamicSampleRateHz', e.target.value)}
              placeholder="Dynamic Sample Rate"
              inputMode="numeric"
              disabled={!connected}
              className={fieldClass('dynamicSampleRateHz')}
            />
            <FieldError message={errors.dynamicSampleRateHz} />
            <Text variant="xs" color="muted" className="mt-1">
              Config 26. Also sets the AO rate in every interrogator init string.
            </Text>
          </FormFieldLabel>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <Headline variant="small" color="foreground" as="h3" isBold>
          Channels
        </Headline>
        {/* <Text variant="small" color="muted">
          Nine channels are three interrogator modules of three fibres each. One
          fibre carries one Hydra bolt, and the assignments below are what
          generate the interrogator configuration.
        </Text> */}
      </div>

      <ChannelConfigTable
        rows={channelRows}
        onChange={setChannelRow}
        disabled={!connected}
      />
    </section>
  );
}
