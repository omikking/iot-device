// Maps the "Local Configuration" panel fields to the Hydra Configuration
// Service (0001) config IDs and Command characteristic (0033) codes.
// Every limit below is taken from D0010553 (1.06) §4 — the device rejects a
// write that falls outside them, so they are enforced before we hit the wire.

export const HYDRA_CONFIG_ID = {
  /** uint8 — BLE Upload Enable (distinct from WIFI_UPLOAD_ENABLE) */
  BLE_UPLOAD_ENABLE: 1,
  /** uint8 — "Wifi Enabled" switch */
  WIFI_UPLOAD_ENABLE: 2,
  /** string, max 31 — "Wifi Network" */
  WIFI_SSID: 3,
  /** string, max 31, write-only — "Wifi Password" */
  WIFI_PASSWORD: 4,
  /** uint16 minutes, 0–65535 — "Upload Rate (minutes)" */
  WIFI_UPLOAD_PERIOD_MIN: 6,
  /** uint8 0=Config/1=Static/2=Dynamic — "Dynamic Mode Enabled" switch */
  SAMPLING_MODE: 23,
  /**
   * uint32 millihertz — "Dynamic Sample Rate (Hz)". Also drives `AO,<hz>` in
   * the interrogator init strings, so a change here rewrites configs 28–30.
   */
  DYNAMIC_SAMPLE_FREQUENCY_MHZ: 26,
  /** uint32 seconds, 10–604800 — "Sample Rate (minutes)" */
  STATIC_SAMPLE_PERIOD_S: 27,
  /** string, max 13 — "Name" (BLE advertising name) */
  BLE_ADVERTISING_NAME: 130,
} as const;

export const HYDRA_COMMAND = {
  /** §4.3.6 — parameter is the current time in Linux epoch format */
  SET_DEVICE_TIME: 11,
  /** §4.3.6 — MAC returned little-endian in the result payload */
  GET_WIFI_MAC: 13,
} as const;

/** §4.1 — config notification header: id(2) + length(1) + timestamp(4) */
export const CONFIG_HEADER_BYTES = 7;

/** §4.3.6 — empirical command-result layout, matching the test-hydra client */
const COMMAND_RESULT_OFFSET = 5;
const COMMAND_PAYLOAD_OFFSET = 7;

export const SAMPLING_MODE = {
  CONFIG: 0,
  STATIC: 1,
  DYNAMIC: 2,
} as const;

/** §4 config table — max lengths and ranges enforced by the firmware. */
export const CONFIG_LIMITS = {
  /** ID 130 — "max 13 characters" */
  NAME_MAX_CHARS: 13,
  /** ID 3 — "max 31 characters" */
  SSID_MAX_CHARS: 31,
  /** ID 4 — "max 31 characters" */
  PASSWORD_MAX_CHARS: 31,
  /** ID 6 — uint16 minutes */
  UPLOAD_PERIOD_MIN: 0,
  UPLOAD_PERIOD_MAX: 65535,
  /** ID 27 — "in seconds (10-604800)" */
  SAMPLE_PERIOD_MIN_S: 10,
  SAMPLE_PERIOD_MAX_S: 604800,
  /**
   * ID 26 is a uint32 in millihertz. The panel works in whole Hz, and the range
   * below is the interrogator's usable acquisition rate rather than the full
   * uint32 the config item would accept.
   */
  DYNAMIC_SAMPLE_RATE_MIN_HZ: 1,
  DYNAMIC_SAMPLE_RATE_MAX_HZ: 1000,
} as const;

export type ConfigValueType = 'string' | 'uint8' | 'uint16' | 'uint32';

// ─── Notification decoding ──────────────────────────────────────────────────

export interface ConfigNotification {
  id: number;
  /** Declared value length; 0 for write-only or long-configuration items. */
  length: number;
  timestamp: number;
  bytes: Uint8Array;
}

/**
 * Splits a Configuration characteristic (0013) notification into its header
 * and value. §4.1.2: write-only items still notify, but carry no value — that
 * arrives here as a zero-length `bytes`.
 */
export function parseConfigNotification(view: DataView): ConfigNotification {
  if (view.byteLength < CONFIG_HEADER_BYTES) {
    throw new Error(
      `Malformed config notification: expected at least ${CONFIG_HEADER_BYTES} bytes, got ${view.byteLength}`,
    );
  }
  const declared = view.getUint8(2);
  // Trust the smaller of declared vs. actually-received, so a truncated
  // notification can never read past the view into unrelated buffer memory.
  const available = view.byteLength - CONFIG_HEADER_BYTES;
  const length = Math.max(0, Math.min(declared, available));

  return {
    id: view.getUint16(0, true),
    length,
    timestamp: view.getUint32(3, true),
    bytes: new Uint8Array(
      view.buffer.slice(
        view.byteOffset + CONFIG_HEADER_BYTES,
        view.byteOffset + CONFIG_HEADER_BYTES + length,
      ),
    ),
  };
}

/** Decodes a notification's value, or null when no value was included. */
export function decodeConfigValue(
  type: ConfigValueType,
  notification: ConfigNotification,
): string | null {
  const { bytes } = notification;
  if (bytes.length === 0) return null;

  if (type === 'string') {
    return new TextDecoder().decode(bytes).replace(/\0/g, '');
  }

  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (type === 'uint8') return String(dv.getUint8(0));
  if (type === 'uint16') return bytes.length >= 2 ? String(dv.getUint16(0, true)) : null;
  return bytes.length >= 4 ? String(dv.getUint32(0, true)) : null;
}

/**
 * §4 config table — booleans are "0: Disabled, otherwise Enabled", so any
 * non-zero value counts as enabled (not just 1).
 */
export function decodeConfigFlag(raw: string | null, fallback: boolean): boolean {
  if (raw === null) return fallback;
  return Number(raw) !== 0;
}

/** §4.3.6 — 0 and positive codes are successes, negatives are failures. */
const COMMAND_RESULT_LABELS: Record<string, string> = {
  '1': 'Success, with additional data',
  '0': 'Success',
  '-1': 'General failure',
  '-2': 'Hydra busy handling a previous command',
  '-3': 'Invalid parameter provided',
  '-4': 'Invalid command',
  '-10': 'Server details invalid',
  '-11': 'Wi-Fi powerup failure',
  '-12': 'Wi-Fi connection failure',
  '-13': 'TCP connection failure',
  '-14': 'Server test endpoint connection failure',
};

export interface CommandResult {
  code: number | null;
  success: boolean;
  label: string;
}

/** Reads the result code out of a Command characteristic (0033) notification. */
export function decodeCommandResult(view: DataView | null): CommandResult {
  if (!view || view.byteLength <= COMMAND_RESULT_OFFSET) {
    return { code: null, success: false, label: 'No result returned by the device' };
  }
  const code = view.getInt8(COMMAND_RESULT_OFFSET);
  return {
    code,
    success: code >= 0,
    label: COMMAND_RESULT_LABELS[String(code)] ?? `Unknown result code (${code})`,
  };
}

/**
 * Current time as Linux epoch seconds for Command 11.
 *
 * Epoch seconds are UTC by definition and `Date.now()` is already measured
 * from the UTC epoch, so the machine's local timezone never enters into it —
 * no offset must be added, or the device clock would be skewed by it.
 */
export function currentEpochSeconds(now: number = Date.now()): number {
  const seconds = Math.floor(now / 1000);
  if (!Number.isInteger(seconds) || seconds < 0 || seconds > 0xffffffff) {
    throw new Error(`Current time (${seconds}s) does not fit the uint32 epoch parameter`);
  }
  return seconds;
}

/**
 * Decodes a Command 13 result into "aa:bb:cc:dd:ee:ff", or null when the
 * device reported a failure or the payload was short.
 *
 * §4.3.6 states the MAC is "returned in Little Endian", so the six payload
 * bytes are reversed to render conventional MAC order.
 */
export function decodeMacAddress(view: DataView | null): string | null {
  if (!view || view.byteLength < COMMAND_PAYLOAD_OFFSET + 6) return null;
  if (!decodeCommandResult(view).success) return null;

  const bytes: number[] = [];
  for (let i = 0; i < 6; i++) bytes.push(view.getUint8(COMMAND_PAYLOAD_OFFSET + i));
  return bytes
    .reverse()
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(':');
}

// ─── Value encoding ─────────────────────────────────────────────────────────

const TYPE_MAX: Record<Exclude<ConfigValueType, 'string'>, number> = {
  uint8: 0xff,
  uint16: 0xffff,
  uint32: 0xffffffff,
};

/**
 * Encodes a value for writeConfig(). Throws rather than silently truncating —
 * an out-of-range number would otherwise wrap and write a wrong value.
 */
export function encodeConfigValue(
  type: ConfigValueType,
  value: string | number,
): string | Uint8Array {
  if (type === 'string') return String(value);

  const n = typeof value === 'number' ? value : Number(value.trim());
  if (!Number.isInteger(n) || n < 0 || n > TYPE_MAX[type]) {
    throw new Error(`Value ${String(value)} is out of range for ${type}`);
  }

  if (type === 'uint8') return new Uint8Array([n]);
  const bytes = new Uint8Array(type === 'uint16' ? 2 : 4);
  const dv = new DataView(bytes.buffer);
  if (type === 'uint16') dv.setUint16(0, n, true);
  else dv.setUint32(0, n, true);
  return bytes;
}

// ─── Form values & validation ───────────────────────────────────────────────

export interface LocalConfigValues {
  name: string;
  wifiNetwork: string;
  /** Write-only on the device, so this is always blank until the user types. */
  wifiPassword: string;
  sampleRateMinutes: string;
  uploadRateMinutes: string;
  wifiEnabled: boolean;
  dynamicModeEnabled: boolean;
  /** Only meaningful while dynamicModeEnabled; whole Hz, stored as ID 26 mHz. */
  dynamicSampleRateHz: string;
}

export type LocalConfigField = keyof LocalConfigValues;
export type LocalConfigErrors = Partial<Record<LocalConfigField, string>>;

export const EMPTY_LOCAL_CONFIG: LocalConfigValues = {
  name: '',
  wifiNetwork: '',
  wifiPassword: '',
  sampleRateMinutes: '',
  uploadRateMinutes: '',
  wifiEnabled: true,
  dynamicModeEnabled: false,
  dynamicSampleRateHz: '',
};

/** Minutes are what the UI shows; the device (ID 27) stores whole seconds. */
export function minutesToSeconds(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
  const seconds = Number(trimmed) * 60;
  return Number.isInteger(seconds) ? seconds : null;
}

export function secondsToMinutes(seconds: number): string {
  // Keep the exact value rather than rounding — a device holding 90 s must not
  // display as "2" and then get silently rewritten to 120 s on the next save.
  return String(seconds / 60);
}

/** ID 26 stores millihertz; the panel and `AO,<hz>` both speak whole Hz. */
export function hzToMilliHertz(raw: string): number | null {
  const hz = parseWholeNumber(raw);
  if (hz === null) return null;
  const milliHertz = hz * 1000;
  return milliHertz <= 0xffffffff ? milliHertz : null;
}

export function milliHertzToHz(milliHertz: number): string {
  // Keep the exact value rather than rounding, so a device holding 500 mHz is
  // not displayed as 1 Hz and then silently rewritten to 1000 mHz on save.
  return String(milliHertz / 1000);
}

function parseWholeNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const n = Number(trimmed);
  return Number.isSafeInteger(n) ? n : null;
}

/**
 * Validates only the fields the user actually edited, since save writes just
 * those. Messages name the device's own limits so a rejection is explainable.
 */
export function validateLocalConfig(
  values: LocalConfigValues,
  edited: ReadonlySet<LocalConfigField>,
): LocalConfigErrors {
  const errors: LocalConfigErrors = {};

  if (edited.has('name')) {
    const name = values.name;
    if (name.length === 0) {
      errors.name = 'Name is required.';
    } else if (name.length > CONFIG_LIMITS.NAME_MAX_CHARS) {
      errors.name = `Name must be at most ${CONFIG_LIMITS.NAME_MAX_CHARS} characters.`;
    }
  }

  if (edited.has('wifiNetwork') && values.wifiNetwork.length > CONFIG_LIMITS.SSID_MAX_CHARS) {
    errors.wifiNetwork = `Wifi network must be at most ${CONFIG_LIMITS.SSID_MAX_CHARS} characters.`;
  }

  if (edited.has('wifiPassword') && values.wifiPassword.length > CONFIG_LIMITS.PASSWORD_MAX_CHARS) {
    errors.wifiPassword = `Wifi password must be at most ${CONFIG_LIMITS.PASSWORD_MAX_CHARS} characters.`;
  }

  if (edited.has('uploadRateMinutes')) {
    const minutes = parseWholeNumber(values.uploadRateMinutes);
    if (minutes === null) {
      errors.uploadRateMinutes = 'Upload rate must be a whole number of minutes.';
    } else if (
      minutes < CONFIG_LIMITS.UPLOAD_PERIOD_MIN ||
      minutes > CONFIG_LIMITS.UPLOAD_PERIOD_MAX
    ) {
      errors.uploadRateMinutes = `Upload rate must be between ${CONFIG_LIMITS.UPLOAD_PERIOD_MIN} and ${CONFIG_LIMITS.UPLOAD_PERIOD_MAX} minutes.`;
    }
  }

  if (edited.has('sampleRateMinutes')) {
    const seconds = minutesToSeconds(values.sampleRateMinutes);
    if (seconds === null) {
      errors.sampleRateMinutes = 'Sample rate must be a number of minutes resolving to whole seconds.';
    } else if (
      seconds < CONFIG_LIMITS.SAMPLE_PERIOD_MIN_S ||
      seconds > CONFIG_LIMITS.SAMPLE_PERIOD_MAX_S
    ) {
      errors.sampleRateMinutes = `Sample rate must be between ${
        CONFIG_LIMITS.SAMPLE_PERIOD_MIN_S / 60
      } and ${CONFIG_LIMITS.SAMPLE_PERIOD_MAX_S / 60} minutes.`;
    }
  }

  if (edited.has('dynamicSampleRateHz')) {
    const hz = parseWholeNumber(values.dynamicSampleRateHz);
    if (hz === null) {
      errors.dynamicSampleRateHz = 'Dynamic sample rate must be a whole number of Hz.';
    } else if (
      hz < CONFIG_LIMITS.DYNAMIC_SAMPLE_RATE_MIN_HZ ||
      hz > CONFIG_LIMITS.DYNAMIC_SAMPLE_RATE_MAX_HZ
    ) {
      errors.dynamicSampleRateHz = `Dynamic sample rate must be between ${CONFIG_LIMITS.DYNAMIC_SAMPLE_RATE_MIN_HZ} and ${CONFIG_LIMITS.DYNAMIC_SAMPLE_RATE_MAX_HZ} Hz.`;
    }
  }

  return errors;
}

/** Which fields differ from what the device reported — save writes only these. */
export function getEditedFields(
  values: LocalConfigValues,
  baseline: LocalConfigValues,
): Set<LocalConfigField> {
  const edited = new Set<LocalConfigField>();
  (Object.keys(values) as LocalConfigField[]).forEach((field) => {
    if (values[field] !== baseline[field]) edited.add(field);
  });
  return edited;
}
