// Console tracing for the Hydra BLE session.
//
// The point of this module is to answer two questions while a logger is on the
// bench: what did the device just tell us, and what exactly are we about to
// write back to it. Every value is shown decoded *and* as the bytes that go on
// the wire, because a value that looks right and encodes wrong is the failure
// mode worth catching (§4.1.1 rejects a write whose length or range is off, and
// §2.4 rejects a bad block silently).
//
// Self-contained on purpose: no imports from the other ble modules, so any of
// them can log without risking an import cycle.

/**
 * On in development, off in production. Override either way from the browser
 * console with `localStorage['hydra:debug'] = '1'` (or `'0'`), then reload.
 */
function resolveEnabled(): boolean {
  try {
    const override = globalThis.localStorage?.getItem('hydra:debug');
    if (override === '1') return true;
    if (override === '0') return false;
  } catch {
    // Private mode / blocked storage — fall through to the build default.
  }
  return process.env.NODE_ENV !== 'production';
}

const ENABLED = resolveEnabled();

const PREFIX = '[Hydra]';

/** Human names for the config items this app touches, for readable output. */
export const CONFIG_LABELS: Record<number, string> = {
  1: 'BLE Upload Enable',
  2: 'Wifi Enabled',
  3: 'Wifi Network (SSID)',
  4: 'Wifi Password (write-only)',
  6: 'Upload Rate (minutes)',
  23: 'Sampling Mode',
  26: 'Dynamic Sample Rate (mHz)',
  27: 'Sample Rate (seconds)',
  28: 'Interrogator 1 init',
  29: 'Interrogator 2 init',
  30: 'Interrogator 3 init',
  130: 'Name (BLE advertising)',
};

export const configLabel = (id: number): string =>
  `${id} ${CONFIG_LABELS[id] ?? 'Unknown config'}`;

/** `0a 1b 2c` — the bytes as they sit on the wire. */
export function hex(bytes: Uint8Array | ArrayBuffer | DataView | null): string {
  if (!bytes) return '—';
  const view =
    bytes instanceof Uint8Array
      ? bytes
      : bytes instanceof DataView
        ? new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength)
        : new Uint8Array(bytes);
  return Array.from(view)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
}

/**
 * Printable rendering of a byte run. Control bytes are shown by name because
 * the ones that matter here are invisible otherwise — configs 28–30 carry a
 * space as CR (0x0d), and telling that apart from a real newline is the whole
 * point of looking.
 */
export function ascii(bytes: Uint8Array | null): string {
  if (!bytes) return '—';
  return Array.from(bytes)
    .map((b) => {
      if (b === 0x0d) return '␍';
      if (b === 0x0a) return '␊';
      if (b === 0x20) return '␠';
      return b >= 0x21 && b <= 0x7e ? String.fromCharCode(b) : '·';
    })
    .join('');
}

export function logInfo(message: string, detail?: unknown): void {
  if (!ENABLED) return;
  if (detail === undefined) console.log(`${PREFIX} ${message}`);
  else console.log(`${PREFIX} ${message}`, detail);
}

export function logWarn(message: string, detail?: unknown): void {
  if (!ENABLED) return;
  if (detail === undefined) console.warn(`${PREFIX} ${message}`);
  else console.warn(`${PREFIX} ${message}`, detail);
}

export function logError(message: string, detail?: unknown): void {
  if (!ENABLED) return;
  console.error(`${PREFIX} ${message}`, detail);
}

/** One config item read back off the device. */
export function logConfigRead(
  id: number,
  decoded: string | null,
  raw: Uint8Array | DataView | null,
): void {
  if (!ENABLED) return;
  console.log(
    `${PREFIX} READ  ${configLabel(id)} =`,
    decoded === null ? '(no value returned)' : decoded,
    `\n        raw: ${hex(raw)}`,
  );
}

/** One config item about to be written to the device. */
export function logConfigWrite(
  id: number,
  value: unknown,
  encoded: Uint8Array | string,
): void {
  if (!ENABLED) return;
  const bytes =
    typeof encoded === 'string' ? new TextEncoder().encode(encoded) : encoded;
  console.log(
    `${PREFIX} WRITE ${configLabel(id)} =`,
    value,
    `\n        bytes (${bytes.length}): ${hex(bytes)}`,
  );
}

/** Opens a collapsed group; the returned function closes it. */
export function logGroup(title: string): () => void {
  if (!ENABLED) return () => {};
  console.groupCollapsed(`${PREFIX} ${title}`);
  return () => console.groupEnd();
}

/** Tabular output, falling back to plain logging where console.table is absent. */
export function logTable(title: string, rows: Record<string, unknown>[]): void {
  if (!ENABLED) return;
  if (rows.length === 0) {
    console.log(`${PREFIX} ${title}: (nothing)`);
    return;
  }
  console.log(`${PREFIX} ${title}`);
  if (typeof console.table === 'function') console.table(rows);
  else console.log(rows);
}

export const hydraLogEnabled = (): boolean => ENABLED;
