// The interrogator expects CR where the init string carries a space, so every
// space is sent as 0x0d instead of 0x20 and swapped back when the value is
// read. This applies to 28-30 ONLY — the certificate blobs at 209-211 are
// binary and must never be routed through here.

/** §4 config table — the three interrogator init-command items. */
export const INTERROGATOR_CONFIG_IDS = [28, 29, 30];

/** ASCII space, the byte a space would normally encode to. */
export const INTERROGATOR_SPACE_BYTE = 0x20;

/** Carriage return, the byte a space is sent as inside configs 28-30. */
export const INTERROGATOR_SPACE_ON_WIRE_BYTE = 0x0d;

/** Whether config `id` uses the space-as-CR encoding. */
export function isInterrogatorConfigId(id: number): boolean {
  return INTERROGATOR_CONFIG_IDS.includes(id);
}

/**
 * UTF-8 bytes for an init string, with every space sent as CR.
 *
 * Substituting at the byte level is safe: a UTF-8 continuation byte is always
 * >= 0x80, so 0x20 can only ever be a real space and never part of a wider
 * character. The swap is byte-for-byte, so it changes no length and the §2.4
 * block count is unaffected.
 */
export function encodeInterrogatorInitString(initString: string): Uint8Array {
  const bytes = new TextEncoder().encode(initString);
  for (let i = 0; i < bytes.length; i += 1) {
    if (bytes[i] === INTERROGATOR_SPACE_BYTE) {
      bytes[i] = INTERROGATOR_SPACE_ON_WIRE_BYTE;
    }
  }
  return bytes;
}

/**
 * Inverse of `encodeInterrogatorInitString`, so a value reads back as it was
 * typed rather than as it sits on the device.
 *
 * Every CR maps back to a space, including one the device might hold for some
 * other reason — a CR and an encoded space are the same byte, so the wire
 * cannot tell them apart.
 */
export function decodeInterrogatorInitString(data: Uint8Array): string {
  const bytes = data.slice();
  for (let i = 0; i < bytes.length; i += 1) {
    if (bytes[i] === INTERROGATOR_SPACE_ON_WIRE_BYTE) {
      bytes[i] = INTERROGATOR_SPACE_BYTE;
    }
  }
  return new TextDecoder().decode(bytes).replace(/\0/g, "");
}