'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from 'urql';
import { graphql } from '@/gql';
import { showAlertToast } from '@gsp/ui-core';
import { HydraBLE } from '@/ble/hydraBle';
import {
  CONFIG_LIMITS,
  EMPTY_LOCAL_CONFIG,
  HYDRA_COMMAND,
  HYDRA_CONFIG_ID,
  SAMPLING_MODE,
  currentEpochSeconds,
  decodeCommandResult,
  decodeConfigFlag,
  decodeConfigValue,
  decodeMacAddress,
  encodeConfigValue,
  getEditedFields,
  hzToMilliHertz,
  milliHertzToHz,
  minutesToSeconds,
  parseConfigNotification,
  secondsToMinutes,
  validateLocalConfig,
  type ConfigValueType,
  type LocalConfigErrors,
  type LocalConfigField,
  type LocalConfigValues,
} from '@/ble/hydraLocalConfig';
import {
  DEFAULT_SAMPLE_FREQUENCY_HZ,
  DEFAULT_WINDOW_HALF_WIDTH_NM,
  INTERROGATOR_BLOCK_INDEX_ONE_BASED,
  INTERROGATOR_CONFIG_IDS,
  encodeInterrogatorInitString,
  decodeInterrogatorInitString,
  buildInterrogatorInitStrings,
  interrogatorBlockCount,
  interrogatorByteLength,
  validateInterrogatorConfig,
} from '@/ble/hydraInterrogatorConfig';
import {
  EMPTY_CHANNEL_ROWS,
  applyChannelRowChange,
  channelRowsEqual,
  channelRowsToInterrogatorChannels,
  type ChannelRow,
  type ChannelRowField,
} from '@/hydra-component/channelRows';
import {
  ascii,
  hex,
  logConfigRead,
  logConfigWrite,
  logError,
  logGroup,
  logInfo,
  logTable,
  logWarn,
} from '@/ble/hydraLog';
import { handleGraphQLErrors } from '@/libs/utils';

const RecordHydraDataLoggerPairingMutation = graphql(`
  mutation recordHydraDataLoggerPairing(
    $input: RecordHydraDataLoggerPairingInput!
  ) {
    recordHydraDataLoggerPairing(input: $input) {
      id
      pairedAt
    }
  }
`);

const errorMessage = (e: unknown): string => (e instanceof Error ? e.message : String(e));

/**
 * Command 11 — pushes this machine's UTC clock to the device.
 *
 * Runs before anything else on connect: the device stamps each configuration
 * item with its own clock (§4.1.1), and measurement records are timestamped
 * from it too, so a stale RTC would misdate everything written this session.
 */
async function syncDeviceTime(ble: HydraBLE): Promise<void> {
  const epochSeconds = currentEpochSeconds();
  logInfo(
    `Command 11 Set device time -> ${epochSeconds} (${new Date(
      epochSeconds * 1000,
    ).toISOString()})`,
  );
  const result = decodeCommandResult(
    await ble.sendCommand(HYDRA_COMMAND.SET_DEVICE_TIME, epochSeconds),
  );
  logInfo(`Command 11 result: ${result.code} ${result.label}`);
  if (!result.success) {
    throw new Error(result.label);
  }
}

/**
 * Reads one config item. Web Bluetooth serialises GATT operations and the
 * Configuration characteristic (0013) is shared by every item, so these must
 * be awaited one at a time — never batched with Promise.all.
 */
async function readField(
  ble: HydraBLE,
  id: number,
  type: ConfigValueType,
): Promise<string | null> {
  const view = await ble.readConfig(id);
  const notification = parseConfigNotification(view);
  const decoded = decodeConfigValue(type, notification);
  logConfigRead(id, decoded, notification.bytes);
  return decoded;
}

/** Reads every config item backing the Local Configuration panel, in order. */
async function readAllConfig(ble: HydraBLE): Promise<LocalConfigValues> {
  const endGroup = logGroup('Reading configuration from device');
  const name = await readField(ble, HYDRA_CONFIG_ID.BLE_ADVERTISING_NAME, 'string');
  const ssid = await readField(ble, HYDRA_CONFIG_ID.WIFI_SSID, 'string');
  const uploadPeriod = await readField(ble, HYDRA_CONFIG_ID.WIFI_UPLOAD_PERIOD_MIN, 'uint16');
  const wifiEnable = await readField(ble, HYDRA_CONFIG_ID.WIFI_UPLOAD_ENABLE, 'uint8');
  const samplePeriod = await readField(ble, HYDRA_CONFIG_ID.STATIC_SAMPLE_PERIOD_S, 'uint32');
  const samplingMode = await readField(ble, HYDRA_CONFIG_ID.SAMPLING_MODE, 'uint8');
  const sampleFrequency = await readField(
    ble,
    HYDRA_CONFIG_ID.DYNAMIC_SAMPLE_FREQUENCY_MHZ,
    'uint32',
  );

  endGroup();

  const values: LocalConfigValues = {
    name: name ?? '',
    wifiNetwork: ssid ?? '',
    // ID 4 is write-only (§4 config table) — it can never be read back, so a
    // blank field means "leave the stored password alone".
    wifiPassword: '',
    uploadRateMinutes: uploadPeriod ?? '',
    sampleRateMinutes: samplePeriod === null ? '' : secondsToMinutes(Number(samplePeriod)),
    wifiEnabled: decodeConfigFlag(wifiEnable, true),
    dynamicModeEnabled: Number(samplingMode) === SAMPLING_MODE.DYNAMIC,
    dynamicSampleRateHz:
      sampleFrequency === null ? '' : milliHertzToHz(Number(sampleFrequency)),
  };

  // What the form is about to show, next to the device value it came from —
  // ID 27 is stored in seconds but displayed in minutes, so the two differ by
  // design and seeing both together is what makes that obvious.
  logTable('Values loaded into the form', [
    { Field: 'name', 'Config ID': 130, 'On device': name, 'In form': values.name },
    { Field: 'wifiNetwork', 'Config ID': 3, 'On device': ssid, 'In form': values.wifiNetwork },
    { Field: 'wifiPassword', 'Config ID': 4, 'On device': '(write-only)', 'In form': '' },
    { Field: 'uploadRateMinutes', 'Config ID': 6, 'On device': uploadPeriod, 'In form': values.uploadRateMinutes },
    { Field: 'sampleRateMinutes', 'Config ID': 27, 'On device': `${samplePeriod} s`, 'In form': `${values.sampleRateMinutes} min` },
    { Field: 'wifiEnabled', 'Config ID': 2, 'On device': wifiEnable, 'In form': values.wifiEnabled },
    { Field: 'dynamicModeEnabled', 'Config ID': 23, 'On device': samplingMode, 'In form': values.dynamicModeEnabled },
    { Field: 'dynamicSampleRateHz', 'Config ID': 26, 'On device': `${sampleFrequency} mHz`, 'In form': `${values.dynamicSampleRateHz} Hz` },
  ]);

  return values;
}

/**
 * Reads the three interrogator init strings (configs 28–30) off the device.
 *
 * These are Long Configuration items, so each arrives as a block transfer
 * (§2.4). A read that fails yields null rather than throwing: the strings are
 * only ever used to decide whether save can skip a write, so an unknown value
 * simply means the config gets rewritten. Losing the whole pairing over it
 * would be a much worse trade.
 */
async function readInterrogatorStrings(
  ble: HydraBLE,
): Promise<(string | null)[]> {
  const endGroup = logGroup('Reading interrogator configuration (28-30)');
  const strings: (string | null)[] = [];
  for (const id of INTERROGATOR_CONFIG_IDS) {
    try {
      const { data } = await ble.readLongConfig(id);
      const decoded = decodeInterrogatorInitString(data);
      logInfo(
        `READ  config ${id}: ${data.length} bytes\n` +
          `        on wire: ${ascii(data)}\n` +
          `        decoded:\n${decoded}`,
      );
      strings.push(decoded);
    } catch (e: unknown) {
      logWarn(`READ  config ${id} failed — treated as unknown, so save will rewrite it`, e);
      strings.push(null);
    }
  }
  endGroup();
  return strings;
}

/**
 * `AO,<hz>` in the init strings. Config 26 only governs dynamic-mode capture,
 * so a device sampling statically is initialised at the interrogator's default
 * rate no matter what sits in the (then unused) field.
 */
function resolveSampleFrequencyHz(values: LocalConfigValues): number {
  if (!values.dynamicModeEnabled) return DEFAULT_SAMPLE_FREQUENCY_HZ;
  const hz = Number(values.dynamicSampleRateHz.trim());
  return Number.isInteger(hz) && hz > 0 ? hz : DEFAULT_SAMPLE_FREQUENCY_HZ;
}

/**
 * Writes one config item, tracing the human value and the exact bytes together.
 * §4.1.1 rejects a write whose encoded length or range is wrong, so the byte
 * view is the half that explains a rejection.
 */
async function writeConfigLogged(
  ble: HydraBLE,
  id: number,
  displayValue: unknown,
  encoded: string | Uint8Array,
): Promise<void> {
  logConfigWrite(id, displayValue, encoded);
  await ble.writeConfig(id, encoded);
}

const NO_DEVICE_INTERROGATOR_STRINGS: (string | null)[] =
  INTERROGATOR_CONFIG_IDS.map(() => null);

/**
 * Owns the BLE link to a Hydra data logger, the Local Configuration form and
 * the channel assignments behind the interrogator init strings.
 *
 * On pair it reads every backing config item, including the three interrogator
 * strings. On save it writes back the form items the user edited plus any of
 * configs 28–30 whose generated string differs from what the device holds, then
 * re-reads so the page always shows what the device really accepted.
 */
export function useHydraLocalConfig() {
  const bleRef = useRef<HydraBLE | null>(null);

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [macAddress, setMacAddress] = useState<string | null>(null);
  const [deviceTimeSynced, setDeviceTimeSynced] = useState(false);
  const [values, setValues] = useState<LocalConfigValues>(EMPTY_LOCAL_CONFIG);
  const [errors, setErrors] = useState<LocalConfigErrors>({});
  /** What the device reported, so save can diff against it. */
  const [baseline, setBaseline] = useState<LocalConfigValues>(EMPTY_LOCAL_CONFIG);
  const [channelRows, setChannelRows] = useState<ChannelRow[]>(EMPTY_CHANNEL_ROWS);
  /**
   * Channel assignment is cloud state: the device cannot report which bolt is
   * on which fibre, so this baseline is what the rows were last loaded or saved
   * as, and it is what Cancel restores.
   */
  const [channelBaseline, setChannelBaseline] =
    useState<ChannelRow[]>(EMPTY_CHANNEL_ROWS);
  /** Configs 28–30 as last read off the device; null where the read failed. */
  const [deviceInterrogatorStrings, setDeviceInterrogatorStrings] = useState<
    (string | null)[]
  >(NO_DEVICE_INTERROGATOR_STRINGS);

  const [, executeRecordPairing] = useMutation(RecordHydraDataLoggerPairingMutation);

  const setField = useCallback(
    <F extends LocalConfigField>(field: F, value: LocalConfigValues[F]) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    },
    [],
  );

  const setChannelRow = useCallback(
    (channel: number, field: ChannelRowField, value: string) => {
      setChannelRows((prev) => applyChannelRowChange(prev, channel, field, value));
    },
    [],
  );

  // ── Interrogator configuration (configs 28–30) ──────────────────────────
  //
  // Derived, never edited: the strings are a pure function of the channel
  // assignments and the sample rate, so there is no separate state to keep in
  // step with the table.

  const interrogatorChannels = useMemo(
    () => channelRowsToInterrogatorChannels(channelRows),
    [channelRows],
  );

  const sampleFrequencyHz = resolveSampleFrequencyHz(values);

  const interrogatorStrings = useMemo(
    () =>
      buildInterrogatorInitStrings(interrogatorChannels, {
        sampleFrequencyHz,
        windowHalfWidthNm: DEFAULT_WINDOW_HALF_WIDTH_NM,
      }),
    [interrogatorChannels, sampleFrequencyHz],
  );

  const interrogatorValidation = useMemo(
    () =>
      validateInterrogatorConfig(interrogatorChannels, interrogatorStrings, {
        windowHalfWidthNm: DEFAULT_WINDOW_HALF_WIDTH_NM,
      }),
    [interrogatorChannels, interrogatorStrings],
  );

  /**
   * Which configs save has to write. A device string we could not read counts
   * as pending — rewriting a config that already matched is harmless, silently
   * skipping one that did not is not.
   */
  const pendingInterrogators = useMemo(
    () =>
      interrogatorStrings
        .map((initString, index) => ({
          index,
          id: INTERROGATOR_CONFIG_IDS[index],
          initString,
        }))
        .filter(({ index, initString }) => deviceInterrogatorStrings[index] !== initString),
    [interrogatorStrings, deviceInterrogatorStrings],
  );

  const teardown = useCallback(() => {
    bleRef.current?.disconnect();
    bleRef.current = null;
    setConnected(false);
    setDeviceName(null);
    setMacAddress(null);
    setDeviceTimeSynced(false);
    setValues(EMPTY_LOCAL_CONFIG);
    setBaseline(EMPTY_LOCAL_CONFIG);
    setErrors({});
    setDeviceInterrogatorStrings(NO_DEVICE_INTERROGATOR_STRINGS);
    // Channel rows are deliberately kept: they are cloud state that survives
    // the device going away, not something the logger told us.
  }, []);

  // Drop the BLE link when the page unmounts, otherwise the device stays
  // connected and unreachable from anywhere else.
  useEffect(() => () => teardown(), [teardown]);

  const pairWithBluetooth = useCallback(async () => {
    setConnecting(true);
    setErrors({});
    const ble = new HydraBLE();

    try {
      logInfo('Pairing: opening Web Bluetooth device picker…');
      await ble.connect();
      bleRef.current = ble;
      setConnected(true);
      setDeviceName(ble.getDeviceName());
      logInfo(`Connected to "${ble.getDeviceName()}"`);

      ble.onDisconnected(() => {
        teardown();
        showAlertToast({
          title: 'Device disconnected',
          description: 'The Hydra data logger dropped the Bluetooth connection.',
          variant: 'warning',
        });
      });

      // Record the pairing before reading config: pairing already happened, so
      // a slow or failed read must not lose the audit record.
      const result = await executeRecordPairing({
        input: {
          deviceName: ble.getDeviceName() || null,
          pairedAt: new Date().toISOString(),
        },
      });
      handleGraphQLErrors(result.error);

      // A wrong device clock misdates config and samples but does not stop the
      // form being usable, so a failure here warns rather than aborting.
      let timeSynced = true;
      try {
        await syncDeviceTime(ble);
      } catch (e: unknown) {
        timeSynced = false;
        showAlertToast({
          title: 'Could not set device time',
          description: `${errorMessage(e)} — the device clock may be wrong.`,
          variant: 'warning',
        });
      }
      setDeviceTimeSynced(timeSynced);

      const deviceValues = await readAllConfig(ble);
      setValues(deviceValues);
      setBaseline(deviceValues);

      const mac = decodeMacAddress(await ble.sendCommand(HYDRA_COMMAND.GET_WIFI_MAC));
      logInfo(`Command 13 Wi-Fi MAC: ${mac ?? '(not returned)'}`);
      setMacAddress(mac);

      // Read last: three Long Configuration block transfers are the slowest
      // part of pairing, and every visible form field is already populated.
      setDeviceInterrogatorStrings(await readInterrogatorStrings(ble));

      showAlertToast({
        title: 'Device paired',
        description: timeSynced
          ? 'Device time set from this computer (UTC) and configuration loaded.'
          : 'Configuration loaded from the Hydra data logger.',
        variant: 'success',
      });
    } catch (e: unknown) {
      logError('Pairing failed', e);
      teardown();
      showAlertToast({
        title: 'Pairing failed',
        description: errorMessage(e),
        variant: 'error',
      });
    } finally {
      setConnecting(false);
    }
  }, [executeRecordPairing, teardown]);

  const save = useCallback(async () => {
    const ble = bleRef.current;
    if (!ble || !ble.isConnected()) {
      showAlertToast({
        title: 'Not connected',
        description: 'Pair with the Hydra data logger before saving.',
        variant: 'error',
      });
      return;
    }

    const edited = getEditedFields(values, baseline);
    if (edited.size === 0 && pendingInterrogators.length === 0) {
      showAlertToast({
        title: 'Nothing to save',
        description: 'No configuration items have been changed.',
        variant: 'info',
      });
      return;
    }

    const validationErrors = validateLocalConfig(values, edited);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showAlertToast({
        title: 'Check the highlighted fields',
        description: 'Some values are outside the range the device accepts.',
        variant: 'error',
      });
      return;
    }

    // A string the device would reject, or one that would mis-assign peaks to
    // the wrong depth in a bolt, must not be written at all — and neither must
    // the local items, or the device would be left half-configured.
    if (pendingInterrogators.length > 0 && !interrogatorValidation.ok) {
      showAlertToast({
        title: 'Interrogator configuration is not valid',
        description: interrogatorValidation.errors[0],
        variant: 'error',
      });
      return;
    }

    setErrors({});
    setSaving(true);

    // Everything this save will change, before a single byte goes out: the
    // value the device reported against the value replacing it.
    const editedRows: Record<string, unknown>[] = [];
    edited.forEach((field) => {
      editedRows.push({
        Field: field,
        'Was (device)': baseline[field],
        'Now (writing)': field === 'wifiPassword' ? '(hidden)' : values[field],
      });
    });
    logTable('SAVE — local config items being written', editedRows);
    logTable(
      'SAVE — interrogator configs being written',
      pendingInterrogators.map(({ id, index, initString }) => ({
        'Config ID': id,
        Chars: interrogatorByteLength(initString),
        'On device now':
          deviceInterrogatorStrings[index] === null
            ? '(unread)'
            : `${deviceInterrogatorStrings[index]?.length} chars`,
      })),
    );

    try {
      // Identity and Wi-Fi credentials go before the Wi-Fi enable flag, so the
      // device never has upload switched on against a half-written network.
      if (edited.has('name')) {
        await writeConfigLogged(
          ble,
          HYDRA_CONFIG_ID.BLE_ADVERTISING_NAME,
          values.name,
          encodeConfigValue('string', values.name),
        );
      }
      if (edited.has('wifiNetwork')) {
        await writeConfigLogged(
          ble,
          HYDRA_CONFIG_ID.WIFI_SSID,
          values.wifiNetwork,
          encodeConfigValue('string', values.wifiNetwork),
        );
      }
      if (edited.has('wifiPassword')) {
        await writeConfigLogged(
          ble,
          HYDRA_CONFIG_ID.WIFI_PASSWORD,
          // Never traced in clear — only its length is diagnostic.
          `(${values.wifiPassword.length} characters)`,
          encodeConfigValue('string', values.wifiPassword),
        );
      }
      if (edited.has('uploadRateMinutes')) {
        await writeConfigLogged(
          ble,
          HYDRA_CONFIG_ID.WIFI_UPLOAD_PERIOD_MIN,
          `${values.uploadRateMinutes} minutes`,
          encodeConfigValue('uint16', values.uploadRateMinutes),
        );
      }
      if (edited.has('wifiEnabled')) {
        await writeConfigLogged(
          ble,
          HYDRA_CONFIG_ID.WIFI_UPLOAD_ENABLE,
          values.wifiEnabled,
          encodeConfigValue('uint8', values.wifiEnabled ? 1 : 0),
        );
      }
      if (edited.has('sampleRateMinutes')) {
        // Validation above guarantees this parses.
        await writeConfigLogged(
          ble,
          HYDRA_CONFIG_ID.STATIC_SAMPLE_PERIOD_S,
          `${values.sampleRateMinutes} min -> ${minutesToSeconds(values.sampleRateMinutes)!} s`,
          encodeConfigValue('uint32', minutesToSeconds(values.sampleRateMinutes)!),
        );
      }
      if (edited.has('dynamicSampleRateHz')) {
        // Validation above guarantees this parses.
        await writeConfigLogged(
          ble,
          HYDRA_CONFIG_ID.DYNAMIC_SAMPLE_FREQUENCY_MHZ,
          `${values.dynamicSampleRateHz} Hz -> ${hzToMilliHertz(values.dynamicSampleRateHz)!} mHz`,
          encodeConfigValue('uint32', hzToMilliHertz(values.dynamicSampleRateHz)!),
        );
      }
      if (edited.has('dynamicModeEnabled')) {
        await writeConfigLogged(
          ble,
          HYDRA_CONFIG_ID.SAMPLING_MODE,
          values.dynamicModeEnabled ? 'Dynamic (2)' : 'Static (1)',
          encodeConfigValue(
            'uint8',
            values.dynamicModeEnabled ? SAMPLING_MODE.DYNAMIC : SAMPLING_MODE.STATIC,
          ),
        );
      }

      // Interrogator init strings go last. They are the largest writes on the
      // link (§2.4 block transfers) and they encode the sampling rate written
      // just above, so the device is never initialised against a rate it has
      // not been given yet.
      for (const { id, initString } of pendingInterrogators) {
        const payload = encodeInterrogatorInitString(initString);
        const endGroup = logGroup(
          `WRITE config ${id} — ${payload.length} bytes, ${interrogatorBlockCount(
            initString,
          )} block(s)`,
        );
        // The string as typed, then as encoded: configs 28-30 send every space
        // as CR (0x0d), so these two deliberately do not match byte for byte.
        logInfo(`init string:\n${initString}`);
        logInfo(`on wire: ${ascii(payload)}`);
        logInfo(`first 32 bytes: ${hex(payload.slice(0, 32))}`);
        await ble.writeLongConfig(
          id,
          payload,
          0,
          INTERROGATOR_BLOCK_INDEX_ONE_BASED,
        );
        endGroup();
      }

      // Read back so the form reflects what the device accepted rather than
      // what we hoped it would accept.
      const deviceValues = await readAllConfig(ble);
      setValues(deviceValues);
      setBaseline(deviceValues);
      setChannelBaseline(channelRows);

      const writtenStrings = await readInterrogatorStrings(ble);
      setDeviceInterrogatorStrings(writtenStrings);

      // A write the device rejected leaves the previous value in place (§2.4:
      // "If an error is detected, no response will be returned"), so the
      // read-back is the only thing that proves configs 28-30 landed. An empty
      // or unreadable value is inconclusive rather than a failure — the panel
      // keeps showing those as pending instead of claiming a save went wrong.
      const rejected = pendingInterrogators.filter(({ index, initString }) => {
        const written = writtenStrings[index];
        return written !== null && written !== '' && written !== initString;
      });

      logTable(
        'SAVE — read-back check (configs 28-30)',
        pendingInterrogators.map(({ id, index, initString }) => ({
          'Config ID': id,
          Wrote: interrogatorByteLength(initString),
          'Read back':
            writtenStrings[index] === null
              ? '(unreadable)'
              : writtenStrings[index] === ''
                ? '(empty)'
                : interrogatorByteLength(writtenStrings[index] as string),
          Match: writtenStrings[index] === initString ? 'yes' : 'NO',
        })),
      );
      if (rejected.length > 0) {
        logWarn(
          `Device still reports a different value for config ${rejected
            .map(({ id }) => id)
            .join(', ')} — the write did not stick`,
        );
      } else {
        logInfo('Save complete — all writes confirmed by read-back');
      }

      if (rejected.length > 0) {
        showAlertToast({
          title: 'Interrogator configuration did not stick',
          description: `The device is still reporting a different value for config ${rejected
            .map(({ id }) => id)
            .join(', ')}. Nothing else about this save failed — try again in range of the logger.`,
          variant: 'error',
        });
      } else {
        showAlertToast({
          title: 'Configuration saved',
          description:
            'Values are written to flash when the Bluetooth connection closes — stay in range until then.',
          variant: 'success',
        });
      }
    } catch (e: unknown) {
      logError('Save failed', e);
      showAlertToast({
        title: 'Save failed',
        description: errorMessage(e),
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  }, [values, baseline, channelRows, pendingInterrogators, interrogatorValidation]);

  /** Discards edits and restores the values last read from the device. */
  const reset = useCallback(() => {
    setValues(baseline);
    setChannelRows(channelBaseline);
    setErrors({});
  }, [baseline, channelBaseline]);

  const editedCount = getEditedFields(values, baseline).size;
  const channelsEdited = !channelRowsEqual(channelRows, channelBaseline);

  return {
    connected,
    connecting,
    saving,
    deviceName,
    macAddress,
    deviceTimeSynced,
    values,
    errors,
    setField,
    pairWithBluetooth,
    save,
    reset,
    isDirty: editedCount > 0 || channelsEdited,
    passwordMaxChars: CONFIG_LIMITS.PASSWORD_MAX_CHARS,
    channelRows,
    setChannelRow,
    interrogatorStrings,
    interrogatorByteLengths: interrogatorStrings.map(interrogatorByteLength),
    interrogatorValidation,
    deviceInterrogatorStrings,
    /** Config IDs save would write right now, for the pending/in-sync badges. */
    pendingInterrogatorIds: pendingInterrogators.map(({ id }) => id),
    windowHalfWidthNm: DEFAULT_WINDOW_HALF_WIDTH_NM,
    sampleFrequencyHz,
  };
}

export type HydraLocalConfig = ReturnType<typeof useHydraLocalConfig>;
