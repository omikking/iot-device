'use client';

import { useState } from 'react';
import {
  Button,
  Headline,
  Switch,
  Text,
} from '@gsp/ui-core';
import { Eye, EyeOff, Wifi } from 'lucide-react';
import { FormFieldLabel } from './FormFieldLabel';
import { ChannelConfigTable } from './ChannelConfigTable';

const inputClassName =
  'flex w-full h-10 border-neutral-3 rounded border bg-main-white px-4 text-sm font-sandvik-text text-main-black placeholder:text-neutral-5 outline-none hover:border-blue-primary focus-visible:border-blue-primary transition ease-in-out duration-200';

export function LocalConfigurationPanel() {
  const [name, setName] = useState('');
  const [wifiNetwork, setWifiNetwork] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sampleRate, setSampleRate] = useState('');
  const [uploadRate, setUploadRate] = useState('');
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [dynamicModeEnabled, setDynamicModeEnabled] = useState(false);

  async function pairWithBluetooth() {
    if (!navigator.bluetooth) {
      console.warn('Web Bluetooth is not supported in this browser.');
      return;
    }

    try {
      await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });
    } catch {
      // User cancelled the picker or Bluetooth is unavailable — no further action.
    }
  }

  return (
    <section className="flex flex-col gap-4 min-w-0">
      <div className="flex items-start justify-between gap-4">
        <Headline variant="medium" color="foreground" as="h2" isBold>
          Local Configuration
        </Headline>
      </div>

      <Button
        variant="primary"
        type="button"
        className="w-fit"
        onClick={pairWithBluetooth}
      >
        Pair with Bluetooth
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormFieldLabel label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={inputClassName}
          />
        </FormFieldLabel>

        <FormFieldLabel label="Sample Rate (minutes)">
          <input
            value={sampleRate}
            onChange={(e) => setSampleRate(e.target.value)}
            placeholder="Sample Rate"
            className={inputClassName}
          />
        </FormFieldLabel>

        <FormFieldLabel label="Wifi Network">
          <div className="relative">
            <input
              value={wifiNetwork}
              onChange={(e) => setWifiNetwork(e.target.value)}
              placeholder="Wifi Network"
              className={`${inputClassName} pr-10`}
            />
            <Wifi className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-5" />
          </div>
        </FormFieldLabel>

        <FormFieldLabel label="Upload Rate (minutes)">
          <input
            value={uploadRate}
            onChange={(e) => setUploadRate(e.target.value)}
            placeholder="Upload Rate"
            className={inputClassName}
          />
        </FormFieldLabel>

        <FormFieldLabel label="Wifi Password">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={wifiPassword}
              onChange={(e) => setWifiPassword(e.target.value)}
              placeholder="Wifi Password"
              className={`${inputClassName} pr-10`}
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-5"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </FormFieldLabel>
        <div className="space-y-2">
          <Text variant="small" color="foreground" className="font-medium">
            Wifi
          </Text>
          <div className="flex items-end pb-2">
            <div className="flex items-center gap-3">
              <Switch checked={wifiEnabled} onCheckedChange={setWifiEnabled} />
              <Text variant="small" color="foreground">
                Wifi Enabled
              </Text>
            </div>
          </div>
        </div>
        <Text variant="small" color="foreground">
          MAC Address:
        </Text>
        <div className="space-y-2">
          <Text variant="small" color="foreground" className="font-medium">
            Dynamic mode
          </Text>
          <div className="flex items-center gap-3">
            <Switch
              checked={dynamicModeEnabled}
              onCheckedChange={setDynamicModeEnabled}
            />
            <Text variant="small" color="foreground">
              Dynamic Mode Enabled
            </Text>
          </div>
        </div>
      </div>

      <ChannelConfigTable />
    </section>
  );
}
