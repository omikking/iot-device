/**
 * Hydra Measurement Notification Parser
 * ---------------------------------------------------------------------------
 * Implements the decoding pipeline described in the TCSS GATT Profile spec
 * (D0010553 rev 1.06), Appendix A "Measurement Encoding scheme":
 *
 *   Transport layer (A.2): COBS-framed packets, each frame followed by a
 *   0x00 delimiter. A frame = [application payload][2-byte little-endian
 *   CRC-16/CCITT-FALSE of the application payload].
 *
 *   Application layer (A.3): [1-byte packet type][Protobuf v3 payload].
 *   Packet Type 1 = Hydra Measurement -> WaveAmpSample message (A.4).
 *
 * CRC/COBS/protobuf decode logic verified against the spec's worked
 * examples and a real device hex sample. A single sample may be split
 * across BLE notifications, and a single notification may contain multiple
 * samples — see HydraMeasurementStream below.
 */

import type { HydraChannelData, HydraMeasurementSample } from "../types";

// ─────────────────────────────────────────────────────────────────────────
// CRC-16/CCITT-FALSE (Poly 0x1021, Init 0xFFFF, no reflection, XorOut 0x0000)
// Matches the test vectors in spec §A.2 ("123456789" -> 0x29B1, etc.)
// ─────────────────────────────────────────────────────────────────────────
export function crc16CcittFalse(data: Uint8Array): number {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i] << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc & 0xffff;
}

// ─────────────────────────────────────────────────────────────────────────
// COBS (Constant Overhead Byte Stuffing) — spec §A.2
// ─────────────────────────────────────────────────────────────────────────

/** Decode a single COBS-encoded frame (without its trailing 0x00 delimiter). */
export function cobsDecode(encoded: Uint8Array): Uint8Array {
  const out: number[] = [];
  let i = 0;
  while (i < encoded.length) {
    const code = encoded[i];
    i++;
    if (code === 0) break; // malformed - COBS codes are never 0 within a frame
    const blockLen = code - 1;
    for (let j = 0; j < blockLen && i < encoded.length; j++) {
      out.push(encoded[i]);
      i++;
    }
    if (code < 0xff && i < encoded.length) {
      out.push(0x00);
    }
  }
  return new Uint8Array(out);
}

/**
 * Scan a concatenated stream of notification bytes for complete
 * 0x00-delimited COBS frames. Returns every complete frame found plus
 * whatever trailing bytes follow the last delimiter (an as-yet incomplete
 * frame) so the caller can prepend them to the next chunk.
 */
export function extractCompleteFrames(buffer: Uint8Array): {
  frames: Uint8Array[];
  rest: Uint8Array;
} {
  const frames: Uint8Array[] = [];
  let start = 0;
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] === 0x00) {
      if (i > start) frames.push(buffer.slice(start, i));
      start = i + 1;
    }
  }
  return { frames, rest: buffer.slice(start) };
}

// ─────────────────────────────────────────────────────────────────────────
// Minimal Protobuf v3 (wire-format only) decoder — spec §A.3/A.4
// ─────────────────────────────────────────────────────────────────────────

interface RawField {
  wireType: number;
  varint?: number;
  bytes?: Uint8Array;
}

/** Read a varint using float arithmetic so values up to 2^53 decode safely. */
function readVarint(buf: Uint8Array, offset: number): { value: number; bytesRead: number } {
  let value = 0;
  let multiplier = 1;
  let bytesRead = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const byte = buf[offset + bytesRead] ?? 0;
    bytesRead++;
    value += (byte & 0x7f) * multiplier;
    if ((byte & 0x80) === 0) break;
    multiplier *= 128;
  }
  return { value, bytesRead };
}

/** Decode a zigzag-encoded sintNN value. */
function zigzagDecode(n: number): number {
  return n % 2 === 0 ? n / 2 : -((n + 1) / 2);
}

/** Decode all fields of a protobuf message into field-number -> entries[]. */
function decodeFields(buf: Uint8Array): Map<number, RawField[]> {
  const fields = new Map<number, RawField[]>();
  let offset = 0;
  while (offset < buf.length) {
    const { value: tag, bytesRead: tagBytes } = readVarint(buf, offset);
    offset += tagBytes;
    const fieldNumber = Math.floor(tag / 8);
    const wireType = tag % 8;
    const entry: RawField = { wireType };

    switch (wireType) {
      case 0: {
        // varint
        const v = readVarint(buf, offset);
        entry.varint = v.value;
        offset += v.bytesRead;
        break;
      }
      case 1: // 64-bit fixed (unused by this schema)
        offset += 8;
        break;
      case 2: {
        // length-delimited
        const len = readVarint(buf, offset);
        offset += len.bytesRead;
        entry.bytes = buf.slice(offset, offset + len.value);
        offset += len.value;
        break;
      }
      case 5: // 32-bit fixed (unused by this schema)
        offset += 4;
        break;
      default:
        // unknown wire type — stop to avoid an infinite loop on bad data
        return fields;
    }

    const arr = fields.get(fieldNumber) ?? [];
    arr.push(entry);
    fields.set(fieldNumber, arr);
  }
  return fields;
}

/** Decode a packed repeated sint32 field (zigzag varints back-to-back). */
function decodePackedSint32(bytes: Uint8Array): number[] {
  const values: number[] = [];
  let offset = 0;
  while (offset < bytes.length) {
    const v = readVarint(bytes, offset);
    values.push(zigzagDecode(v.value));
    offset += v.bytesRead;
  }
  return values;
}

// ─────────────────────────────────────────────────────────────────────────
// WaveAmpSample / WaveAmpChan decoding — spec §A.4 (WavelengthAmplitudeData.proto)
// ─────────────────────────────────────────────────────────────────────────

enum CompressionMode {
  RAW = 0,
  MODE_1 = 1,
}

function decodeWaveAmpChan(bytes: Uint8Array, compression: CompressionMode): HydraChannelData {
  const fields = decodeFields(bytes);

  const temperatureRaw = fields.get(1)?.[0]?.varint ?? 0;
  const temperature = zigzagDecode(temperatureRaw) / 100;

  const refSlope = fields.get(2)?.[0]?.varint ?? 0;
  const refOffset = fields.get(3)?.[0]?.varint ?? 0;

  const wavelengthRaw = fields.get(4)?.[0]?.bytes
    ? decodePackedSint32(fields.get(4)![0].bytes!)
    : [];
  const amplitudeRaw = fields.get(5)?.[0]?.bytes ? decodePackedSint32(fields.get(5)![0].bytes!) : [];

  // MODE_1: wavelength values are delta-encoded - sum cumulatively to decode
  let wavelengthUnits: number[];
  if (compression === CompressionMode.MODE_1) {
    wavelengthUnits = [];
    let running = 0;
    for (const v of wavelengthRaw) {
      running += v;
      wavelengthUnits.push(running);
    }
  } else {
    wavelengthUnits = wavelengthRaw;
  }
  // units are nanometres * 10,000 (1 lsb = 100 femtometres)
  const wavelengths = wavelengthUnits.map((v) => v / 10000);

  // MODE_1: amplitude values are divided by 10,000 on-wire - multiply back
  const amplitudeUnits =
    compression === CompressionMode.MODE_1 ? amplitudeRaw.map((v) => v * 10000) : amplitudeRaw;
  // units are unitless * 10,000
  const amplitudes = amplitudeUnits.map((v) => v / 10000);

  return { temperature, refSlope, refOffset, wavelengths, amplitudes };
}

function decodeWaveAmpSample(bytes: Uint8Array): Omit<HydraMeasurementSample, "receivedAt"> | null {
  try {
    const fields = decodeFields(bytes);

    let seconds = 0;
    let nanos = 0;
    const timestampBytes = fields.get(1)?.[0]?.bytes;
    if (timestampBytes) {
      const tsFields = decodeFields(timestampBytes);
      seconds = tsFields.get(1)?.[0]?.varint ?? 0;
      nanos = tsFields.get(2)?.[0]?.varint ?? 0;
    }

    const sensorId = fields.get(2)?.[0]?.varint ?? 0;
    const sampleId = fields.get(3)?.[0]?.varint ?? 0;
    const isHighPriority = (fields.get(4)?.[0]?.varint ?? 0) !== 0;
    const compressionVal = (fields.get(5)?.[0]?.varint ?? 0) as CompressionMode;
    const sampleTypeVal = fields.get(7)?.[0]?.varint ?? 0;
    const captureGroup = fields.get(8)?.[0]?.varint ?? 0;

    const channels = (fields.get(6) ?? [])
      .filter((f) => f.bytes)
      .map((f) => decodeWaveAmpChan(f.bytes!, compressionVal));

    const date = new Date(seconds * 1000 + Math.floor(nanos / 1e6));
    const timestamp = Number.isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();

    return {
      sampleId,
      sensorId,
      timestampSeconds: seconds,
      timestampNanos: nanos,
      timestamp,
      isHighPriority,
      compression: compressionVal === CompressionMode.MODE_1 ? "MODE_1" : "RAW",
      sampleType: sampleTypeVal === 1 ? "STATIC" : "DYNAMIC",
      captureGroup,
      channels,
    };
  } catch (err) {
    console.warn("Failed to decode Hydra WaveAmpSample:", err);
    return null;
  }
}

/** Decode one COBS+CRC framed packet (post-delimiter-split) into a sample, or null if invalid. */
function decodeFrame(frame: Uint8Array): Omit<HydraMeasurementSample, "receivedAt"> | null {
  const decoded = cobsDecode(frame);
  if (decoded.length < 3) return null; // too short for payload + 2-byte CRC

  const payload = decoded.slice(0, decoded.length - 2);
  const receivedCrc = decoded[decoded.length - 2] | (decoded[decoded.length - 1] << 8);
  const computedCrc = crc16CcittFalse(payload);

  if (receivedCrc !== computedCrc) {
    console.warn(
      `Hydra measurement frame failed CRC check (got 0x${receivedCrc
        .toString(16)
        .padStart(4, "0")}, expected 0x${computedCrc.toString(16).padStart(4, "0")}) - skipping`,
    );
    return null;
  }

  const packetType = payload[0];
  if (packetType !== 1) return null; // only "Hydra Measurement" (type 1) is handled

  return decodeWaveAmpSample(payload.slice(1));
}

/**
 * Decode a full batch of raw Hydra "Measurement" characteristic notification
 * bytes (already concatenated, in the order received) into structured
 * samples. Any trailing incomplete frame (no closing 0x00 yet) is dropped —
 * use HydraMeasurementStream instead if decoding incrementally as
 * notifications arrive.
 */
export function parseHydraMeasurementPackets(chunks: Uint8Array[]): HydraMeasurementSample[] {
  const totalLength = chunks.reduce((sum, arr) => sum + arr.length, 0);
  const stream = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of chunks) {
    stream.set(arr, offset);
    offset += arr.length;
  }

  const { frames } = extractCompleteFrames(stream);
  const samples: HydraMeasurementSample[] = [];
  for (const frame of frames) {
    const sample = decodeFrame(frame);
    if (sample) samples.push({ ...sample, receivedAt: Date.now() });
  }
  return samples;
}

/**
 * Incremental decoder for live BLE notifications: a single sample may be
 * split across notifications, and a single notification may contain
 * multiple samples, so frames are only ever decoded once a complete
 * 0x00-terminated COBS frame is available. Call push() once per received
 * notification, in order.
 */
export class HydraMeasurementStream {
  private buffer: Uint8Array<ArrayBufferLike> = new Uint8Array(0);

  push(chunk: Uint8Array): HydraMeasurementSample[] {
    const combined = new Uint8Array(this.buffer.length + chunk.length);
    combined.set(this.buffer, 0);
    combined.set(chunk, this.buffer.length);

    const { frames, rest } = extractCompleteFrames(combined);
    this.buffer = rest;

    const samples: HydraMeasurementSample[] = [];
    for (const frame of frames) {
      const sample = decodeFrame(frame);
      if (sample) samples.push({ ...sample, receivedAt: Date.now() });
    }
    return samples;
  }

  reset(): void {
    this.buffer = new Uint8Array(0);
  }
}
