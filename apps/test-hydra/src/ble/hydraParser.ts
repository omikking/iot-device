import type { DeviceStatus, FaultInfo, MeasurementMeta, HydraMeasurement } from "../types";

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
