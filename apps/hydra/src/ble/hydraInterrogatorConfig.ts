// Builds the Interrogator init-command strings that back Configuration Items
// 28, 29 and 30 (D0010553 (1.06) §4 config table, transferred with the Long
// Configuration protocol of §2.4).
//
// A Hydra data logger has nine channels: three interrogator modules of three
// fibres each, one fibre per Hydra bolt. Each interrogator owns one config item
// holding its init commands, separated by a single '\n'. The string is derived
// entirely from the channel assignments — there is nothing here for a user to
// type, which is why every export below is a pure function of the assignments.

/** §4 config table — one config item per interrogator module, in order. */
export const INTERROGATOR_CONFIG_IDS = [28, 29, 30] as const;

export const INTERROGATOR_COUNT = INTERROGATOR_CONFIG_IDS.length;
export const FIBRES_PER_INTERROGATOR = 3;
export const CHANNEL_COUNT = INTERROGATOR_COUNT * FIBRES_PER_INTERROGATOR;

/** §4 config table, IDs 28–30 — "Interrogator N init commands (0-1200 chars)". */
export const INTERROGATOR_INIT_MAX_CHARS = 1200;

/**
 * §2.4 — every Long Configuration block carries a 2-byte reassembly header and
 * each non-final block's payload must be a multiple of 4 (188 bytes ceiling).
 * HydraBLE.writeLongConfig chunks at 148 bytes, so block counts surfaced in the
 * UI have to be computed from the same number or they will not match the wire.
 */
export const LONG_CONFIG_BLOCK_BYTES = 148;

/**
 * Whether the Long Configuration block index written for IDs 28–30 starts at 1.
 *
 * §2.4 is explicit that it starts at 0 ("for the first block, index =0", and a
 * single-block value carries the header 0x00,0x01), but apps/test-hydra — the
 * client these strings were first proven against — writes 28/29/30 1-based and
 * only the certificate blobs (209–211) 0-based. Keeping the proven behaviour
 * rather than the documented one, in one named place: if the device rejects an
 * interrogator write (no notification comes back, per §2.4), flip this first.
 */
export const INTERROGATOR_BLOCK_INDEX_ONE_BASED = true;

/** Config ID 9 fixes the wavelength unit at 0.1 pm, so 1 nm is 10 000 units. */
export const WAVELENGTH_UNITS_PER_NM = 10_000;

/**
 * Nominal FBG centre wavelengths in nm, used for any bolt whose own grating
 * wavelengths are unknown. Gratings sit ~6 nm apart across the interrogator's
 * 805–862 nm span, which is what caps the peak-search half-width below.
 */
export const DEFAULT_FBG_GRID_NM = [
  809.851, 815.958, 821.949, 827.957, 833.994, 840.043, 846.044, 852.099, 858.143,
] as const;

/**
 * Half-width of each `Ke` peak-search window, in nm. `Pv,1` follow-peaks tracks
 * a peak once it leaves the window, so a narrow window is correct: it is what
 * keeps a peak from being attributed to the neighbouring grating — i.e. to the
 * wrong depth in the bolt.
 */
export const DEFAULT_WINDOW_HALF_WIDTH_NM = 2;

/** `AO,<hz>` when the device is not in dynamic mode (config 26 default 100 Hz). */
export const DEFAULT_SAMPLE_FREQUENCY_HZ = 100;

/** Factory commands that are USB-only and must never reach a field device. */
const FORBIDDEN_COMMANDS = ['extBdR', 'speichern'] as const;

// ─── Channel model ──────────────────────────────────────────────────────────

/** One channel — one fibre on one interrogator, carrying at most one bolt. */
export interface InterrogatorChannel {
  /**
   * Gratings on the assigned bolt, or 0 when the channel is unassigned. An
   * unassigned channel is still emitted, as `KA,0`, so the interrogator stops
   * searching for peaks on that fibre instead of reporting noise.
   */
  fbgCount: number;
  /** Per-grating centre wavelengths (nm); falls back to DEFAULT_FBG_GRID_NM. */
  centreWavelengthsNm?: readonly number[];
}

export const EMPTY_INTERROGATOR_CHANNEL: InterrogatorChannel = { fbgCount: 0 };

export interface InterrogatorBuildOptions {
  /** Drives `AO,<hz>`; see DEFAULT_SAMPLE_FREQUENCY_HZ. */
  sampleFrequencyHz: number;
  /** Drives every `Ke` window; see DEFAULT_WINDOW_HALF_WIDTH_NM. */
  windowHalfWidthNm: number;
}

export interface GratingWindow {
  index: number;
  centreNm: number;
  minNm: number;
  maxNm: number;
}

// ─── Derivation ─────────────────────────────────────────────────────────────

const toWavelengthUnits = (nm: number): number =>
  Math.round(nm * WAVELENGTH_UNITS_PER_NM);

/**
 * The centre wavelengths actually available for a channel's gratings. A bolt
 * declaring more gratings than there are known centres yields a short list
 * rather than `NaN` windows — validateInterrogatorConfig reports the shortfall.
 */
export function channelCentresNm(channel: InterrogatorChannel): number[] {
  const grid = channel.centreWavelengthsNm ?? DEFAULT_FBG_GRID_NM;
  const usable = Math.max(0, Math.min(channel.fbgCount, grid.length));
  return grid.slice(0, usable).filter((nm) => Number.isFinite(nm));
}

export function gratingWindows(
  channel: InterrogatorChannel,
  windowHalfWidthNm: number,
): GratingWindow[] {
  return channelCentresNm(channel).map((centreNm, index) => ({
    index,
    centreNm,
    minNm: centreNm - windowHalfWidthNm,
    maxNm: centreNm + windowHalfWidthNm,
  }));
}

/** Splits the nine channels into the three fibre triples, in channel order. */
export function fibresForInterrogator(
  channels: readonly InterrogatorChannel[],
  interrogator: number,
): InterrogatorChannel[] {
  const start = interrogator * FIBRES_PER_INTERROGATOR;
  return Array.from(
    { length: FIBRES_PER_INTERROGATOR },
    (_, fibre) => channels[start + fibre] ?? EMPTY_INTERROGATOR_CHANNEL,
  );
}

/**
 * The init-command string for one interrogator.
 *
 * Order matters to the module: it must be told to stop continuous acquisition
 * and how fast to sample before it is told what to look for, so the fixed
 * preamble comes first, then one `KA` per fibre declaring its grating count,
 * then the `Ke` search windows those counts imply.
 */
export function buildInterrogatorInitString(
  fibres: readonly InterrogatorChannel[],
  { sampleFrequencyHz, windowHalfWidthNm }: InterrogatorBuildOptions,
): string {
  const lines = [
    'DauSe,0>',
    'OBB,0>',
    'Pv,1>',
    'RK,1>',
    `AO,${sampleFrequencyHz}>`,
  ];

  fibres.forEach((channel, fibre) => {
    lines.push(`KA,${channel.fbgCount},${fibre}>`);
  });

  fibres.forEach((channel, fibre) => {
    gratingWindows(channel, windowHalfWidthNm).forEach((window) => {
      lines.push(
        `Ke,${window.index},${toWavelengthUnits(window.minNm)},${toWavelengthUnits(
          window.maxNm,
        )},${fibre}>`,
      );
    });
  });

  return lines.join('\n');
}

/** The three strings, index-aligned with INTERROGATOR_CONFIG_IDS. */
export function buildInterrogatorInitStrings(
  channels: readonly InterrogatorChannel[],
  options: InterrogatorBuildOptions,
): string[] {
  return INTERROGATOR_CONFIG_IDS.map((_, interrogator) =>
    buildInterrogatorInitString(
      fibresForInterrogator(channels, interrogator),
      options,
    ),
  );
}

// ─── Wire Encoding ──────────────────────────────────────────────────────────

/** ASCII space, the byte a space would normally encode to. */
export const INTERROGATOR_SPACE_BYTE = 0x20;

/**
 * Carriage return — the byte a space is sent as inside configs 28-30.
 *
 * The interrogator expects CR where the init string carries a space, so every
 * space is swapped for 0x0d on the way out and swapped back on the way in.
 * The swap is byte-for-byte, so it changes no length: `interrogatorByteLength`
 * and `interrogatorBlockCount` are unaffected by it.
 */
export const INTERROGATOR_SPACE_ON_WIRE_BYTE = 0x0d;

/**
 * UTF-8 bytes for an init string, with every space sent as CR (§4 configs
 * 28-30 only — the certificate blobs at 209-211 are binary and must not go
 * through here).
 *
 * Substituting at the byte level is safe: a UTF-8 continuation byte is always
 * >= 0x80, so 0x20 can only ever be a real space and never part of a wider
 * character.
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
 * Inverse of `encodeInterrogatorInitString`, for values read back off the
 * device. Save decides what to write by comparing the read-back against the
 * generated string, so the read has to undo the swap or every config would
 * look permanently unsaved.
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
  return new TextDecoder().decode(bytes).replace(/\0/g, '');
}

// ─── Sizing ─────────────────────────────────────────────────────────────────

/** Bytes on the wire — the init commands are ASCII, but do not assume it. */
export function interrogatorByteLength(initString: string): number {
  return encodeInterrogatorInitString(initString).length;
}

/**
 * Blocks HydraBLE.writeLongConfig will send. §2.4 requires the 0x00,0x01 header
 * even for an empty value, so this is never less than 1.
 */
export function interrogatorBlockCount(initString: string): number {
  return Math.max(
    1,
    Math.ceil(interrogatorByteLength(initString) / LONG_CONFIG_BLOCK_BYTES),
  );
}

// ─── Validation ─────────────────────────────────────────────────────────────

/**
 * Smallest gap between adjacent grating centres across all channels, or null
 * when no channel has two gratings to compare. This is the ceiling on the
 * window half-width: at half the spacing, adjacent windows meet.
 */
export function minGratingSpacingNm(
  channels: readonly InterrogatorChannel[],
): number | null {
  let smallest: number | null = null;

  channels.forEach((channel) => {
    const centres = channelCentresNm(channel);
    for (let i = 1; i < centres.length; i++) {
      const gap = centres[i] - centres[i - 1];
      if (smallest === null || gap < smallest) smallest = gap;
    }
  });

  return smallest;
}

export interface InterrogatorValidation {
  /** False when at least one blocking error is present — save must not write. */
  ok: boolean;
  errors: string[];
  warnings: string[];
  assignedChannels: number;
  longestByteLength: number;
  /** Guard band left either side of a window, or null when unconstrained. */
  guardBandNm: number | null;
}

export function validateInterrogatorConfig(
  channels: readonly InterrogatorChannel[],
  initStrings: readonly string[],
  { windowHalfWidthNm }: Pick<InterrogatorBuildOptions, 'windowHalfWidthNm'>,
): InterrogatorValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  initStrings.forEach((initString, index) => {
    const id = INTERROGATOR_CONFIG_IDS[index];
    const bytes = interrogatorByteLength(initString);

    if (bytes > INTERROGATOR_INIT_MAX_CHARS) {
      errors.push(
        `Interrogator ${index + 1} (config ${id}) is ${bytes} characters, over the ${INTERROGATOR_INIT_MAX_CHARS}-character limit.`,
      );
    } else if (bytes > INTERROGATOR_INIT_MAX_CHARS * 0.8) {
      warnings.push(
        `Interrogator ${index + 1} (config ${id}) is at ${bytes} of ${INTERROGATOR_INIT_MAX_CHARS} characters.`,
      );
    }

    const forbidden = FORBIDDEN_COMMANDS.find((command) =>
      initString.toLowerCase().includes(command.toLowerCase()),
    );
    if (forbidden) {
      errors.push(
        `Interrogator ${index + 1} (config ${id}) contains the USB-only factory command "${forbidden}".`,
      );
    }
  });

  channels.forEach((channel, index) => {
    const available = channelCentresNm(channel).length;
    if (channel.fbgCount > available) {
      errors.push(
        `Channel ${index + 1} declares ${channel.fbgCount} gratings but only ${available} centre wavelengths are known for it.`,
      );
    }
  });

  const spacing = minGratingSpacingNm(channels);
  const guardBandNm =
    spacing === null ? null : (spacing - windowHalfWidthNm * 2) / 2;

  if (spacing !== null && windowHalfWidthNm * 2 >= spacing) {
    errors.push(
      `Peak search windows of ±${windowHalfWidthNm.toFixed(2)} nm overlap: adjacent gratings are ${spacing.toFixed(3)} nm apart, so the half-width ceiling is ±${(spacing / 2).toFixed(3)} nm.`,
    );
  }

  const assignedChannels = channels.filter(
    (channel) => channel.fbgCount > 0,
  ).length;
  if (assignedChannels === 0) {
    warnings.push(
      'No channel is assigned, so the logger has nothing to interrogate.',
    );
  }

  const longestByteLength = initStrings.reduce(
    (longest, initString) => Math.max(longest, interrogatorByteLength(initString)),
    0,
  );

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    assignedChannels,
    longestByteLength,
    guardBandNm,
  };
}
