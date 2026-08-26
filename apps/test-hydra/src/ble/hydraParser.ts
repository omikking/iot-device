import type { ConfigItem, ConfigType, DeviceStatus, FaultInfo, MeasurementMeta, HydraMeasurement } from "../types";

const FAULTS: Record<number, string> = {
  0: "Sensor driver internal fault",
  4: "Sensor comms fault",
  8: "Wi-Fi comms fault",
  9: "Server details invalid",
  10: "Wi-Fi connection failed",
  11: "TCP connection failed",
  12: "Status upload failed",
  13: "Sample upload failed",
  14: "Config download failed",
  16: "Storage full",
  17: "Flash IC unrecognised",
  18: "Flash IC not responding",
  19: "Flash erase/program error",
  21: "PSRAM IC not responding",
};

const BATT_LABELS = ["Good", "Low", "Critical", "", "", "Using ext. power"];

/** First byte index of config value in a 0013 notification (id + len + timestamp). */
export const CONFIG_VALUE_OFFSET = 7;

export function parseFaults(flags: number): FaultInfo {
  const active = Object.entries(FAULTS)
    .filter(([b]) => flags & (1 << Number(b)))
    .map(([b, msg]) => ({ bit: Number(b), message: msg }));
  return { hasFaults: active.length > 0, faults: active };
}

export function parseDeviceStatus(v: DataView): DeviceStatus {
  return {
    status: v.getUint8(0),
    faults: parseFaults(v.getUint32(1, true)),
    batteryMv: v.getUint16(5, true),
    batteryStatus: v.getUint8(7),
    timestamp: v.getUint32(8, true),
  };
}

export function batteryStatusLabel(code: number): string {
  return BATT_LABELS[code] ?? `Unknown (${code})`;
}

/** §4.3.2 — ack/unack counts plus sector usage. */
export function parseMeta(v: DataView): MeasurementMeta {
  return {
    total: v.byteLength >= 2 ? v.getUint16(0, true) : 0,
    notUploaded: v.byteLength >= 4 ? v.getUint16(2, true) : 0,
    totalSectors: v.byteLength >= 6 ? v.getUint16(4, true) : 0,
    unusedSectors: v.byteLength >= 8 ? v.getUint16(6, true) : 0,
  };
}

/** Best-effort preview of a measurement notification (COBS/protobuf payload). */
export function parseMeasurementChunk(v: DataView): HydraMeasurement {
  const fullHex = hexDump(v);
  const hexPreview = fullHex.length > 96 ? `${fullHex.slice(0, 96)}` : fullHex;
  let sampleId: number | null = null;
  if (v.byteLength >= 5 && v.getUint8(0) === 1) {
    sampleId = v.getUint32(1, true);
  }
  return {
    sampleId,
    byteLength: v.byteLength,
    hexPreview,
    receivedAt: Date.now(),
  };
}

export function hexDump(view: DataView): string {
  return [...new Uint8Array(view.buffer, view.byteOffset, view.byteLength)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(" ");
}

export function configValueBytesFromNotification(v: DataView): Uint8Array {
  if (v.byteLength <= CONFIG_VALUE_OFFSET) return new Uint8Array(0);
  return new Uint8Array(v.buffer, v.byteOffset + CONFIG_VALUE_OFFSET, v.byteLength - CONFIG_VALUE_OFFSET);
}

export interface LongConfigBlock {
  blockIndex: number;
  totalBlocks: number;
  payload: Uint8Array;
}

/** Parse one 0013 notification for §2.4 long-configuration block transfer. */
export function parseLongConfigBlockNotification(v: DataView): LongConfigBlock | null {
  const value = configValueBytesFromNotification(v);
  if (value.length < 2) return null;
  const blockIndex = value[0];
  const totalBlocks = value[1];
  return {
    blockIndex,
    totalBlocks,
    payload: value.subarray(2),
  };
}

/** Concatenate block payloads in order (block index 0 .. totalBlocks-1). */
export function reassembleLongConfigBlocks(blocks: Map<number, Uint8Array>, totalBlocks: number): Uint8Array {
  const parts: Uint8Array[] = [];
  for (let i = 0; i < totalBlocks; i++) {
    parts.push(blocks.get(i) ?? new Uint8Array(0));
  }
  const len = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function decodeByType(type: ConfigType, bytes: Uint8Array, viewAtOffset: DataView): string {
  if (bytes.length === 0 && type !== "string") return type === "uint8[]" ? "" : "0";

  switch (type) {
    case "uint8":
      return String(viewAtOffset.getUint8(0));
    case "uint16":
      return String(viewAtOffset.getUint16(0, true));
    case "uint32":
      return String(viewAtOffset.getUint32(0, true));
    case "string":
      return new TextDecoder().decode(bytes).replace(/\0/g, "");
    case "uint8[]":
      if (bytes.length === 0) return "";
      return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join(" ");
    default:
      return hexDump(viewAtOffset);
  }
}

/** Decode reassembled or short config value bytes for display. */
export function decodeConfigValue(item: Pick<ConfigItem, "type">, valueBytes: Uint8Array): string {
  const view = new DataView(valueBytes.buffer, valueBytes.byteOffset, valueBytes.byteLength);
  return decodeByType(item.type, valueBytes, view);
}

/** Decode a single 0013 notification (short config, not long-block reassembly). */
export function decodeConfigNotification(item: Pick<ConfigItem, "type" | "longConfig">, v: DataView): string {
  const valueBytes = configValueBytesFromNotification(v);
  if (item.longConfig) {
    const block = parseLongConfigBlockNotification(v);
    if (!block) return "";
    return decodeConfigValue(item, block.payload);
  }
  return decodeConfigValue(item, valueBytes);
}
