'use client';

import { useState } from 'react';
import { Button, Headline, Text } from '@gsp/ui-core';
import { Eye, EyeOff, Wifi } from 'lucide-react';
import { FormFieldLabel } from './FormFieldLabel';

const inputClassName =
  'flex w-full h-10 border-neutral-3 rounded border bg-main-white px-4 text-sm font-sandvik-text text-main-black placeholder:text-neutral-5 outline-none hover:border-blue-primary focus-visible:border-blue-primary transition ease-in-out duration-200';

const disabledInputClassName =
  'flex w-full h-10 border-transparent rounded border bg-neutral-2 px-4 text-sm font-sandvik-text text-neutral-5 placeholder:text-neutral-5 outline-none pointer-events-none';

const MAC_ADDRESS = '00:1A:2B:3C:4D:5E';

export function ProfessorLocalConfigurationPanel() {
  const [isPaired, setIsPaired] = useState(false);
  const [serialNumber, setSerialNumber] = useState('Hydra #1');
  const [wifiNetwork, setWifiNetwork] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function pairWithBluetooth() {
    if (!navigator.bluetooth) {
      console.warn('Web Bluetooth is not supported in this browser.');
      return;
    }

    try {
      await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
      });
      setIsPaired(true);
    } catch {
      // User cancelled the picker or Bluetooth is unavailable — no further action.
    }
  }

  return (
    <section className="flex flex-col gap-4 min-w-0">
      <Headline variant="medium" color="foreground" as="h2" isBold className = 'mb-6'>
        Local Configuration
      </Headline>

      <Button
        variant="primary"
        type="button"
        className="w-fit "
        onClick={pairWithBluetooth}
      >
        Pair with Bluetooth
      </Button>

      <FormFieldLabel label="Serial number">
        <input
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          placeholder="Serial number"
          className={inputClassName}
        />
      </FormFieldLabel>

      <FormFieldLabel label="Wifi Network">
        <div className="relative">
          <input
            value={wifiNetwork}
            onChange={(e) => setWifiNetwork(e.target.value)}
            placeholder="Wifi Network"
            disabled={!isPaired}
            className={`${isPaired ? inputClassName : disabledInputClassName} pr-10`}
          />
          <Wifi className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-5" />
        </div>
      </FormFieldLabel>

      <FormFieldLabel label="Wifi Password">
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={wifiPassword}
            onChange={(e) => setWifiPassword(e.target.value)}
            placeholder="Wifi Password"
            disabled={!isPaired}
            className={`${isPaired ? inputClassName : disabledInputClassName} pr-10`}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={!isPaired}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-5 disabled:pointer-events-none"
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

      <Text variant="small" color="foreground">
        MAC Address: {isPaired ? MAC_ADDRESS : '—'}
      </Text>
    </section>
  );
}
