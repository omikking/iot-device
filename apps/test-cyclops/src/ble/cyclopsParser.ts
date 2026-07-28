import type {
  Gravity,
  FaultInfo,
  DeviceStatus,
  MeasurementMeta,
  MeasurementPacket,
} from "../types";

// ─── Parsers ────────────────────────────────────────────────────────────────

export function parseGravity(v: number): Gravity {
  let x = v & 0x3FF, y = (v >> 10) & 0x3FF, z = (v >> 20) & 0x3FF;
  if (x & 0x200) x |= 0xFFFFFC00;
  if (y & 0x200) y |= 0xFFFFFC00;
  if (z & 0x200) z |= 0xFFFFFC00;
  const s = 2 / 512;
  return { x: x * s, y: y * s, z: z * s, highPriority: Boolean(v & (1 << 31)) };
}

const FAULTS: Record<number, string> = {
  0:"Laser power fault",1:"Laser quality fault",2:"Laser time fault",
  3:"Laser hardware error",4:"Laser comms fault",8:"Wi-Fi comms fault",
  9:"Server details invalid",10:"Wi-Fi connection failed",11:"TCP connection failed",
  12:"Status upload failed",13:"Sample upload failed",14:"Config download failed",
  16:"Storage full",17:"Flash IC unrecognised",18:"Flash IC not responding",
  19:"Flash erase/program error",
};

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
    lastDistanceMm: v.getUint16(12, true),
    lastGravity: parseGravity(v.getUint32(14, true)),
    temperatureC: v.getInt8(18),
    lastSensorQuality: v.getUint16(19, true),
  };
}

export function parseMeta(v: DataView): MeasurementMeta {
  return { total: v.getUint16(0, true), notUploaded: v.getUint16(2, true) };
}

export function parsePacket(v: DataView): MeasurementPacket {
  let o = 0;
  const packetId = v.getUint8(o++);
  const sampleCount = v.getUint8(o++);

  const samples: MeasurementPacket["samples"] = [];
  for (let i = 0; i < sampleCount; i++) {
    const sampleId = v.getUint32(o, true); o += 4;
    const timestamp = v.getUint32(o, true); o += 4;
    const distanceMm = v.getUint16(o, true); o += 2;
    const quality = v.getUint16(o, true); o += 2;
    const dur64 = v.getUint8(o++);
    const gravity = parseGravity(v.getUint32(o, true)); o += 4;
    samples.push({
      sampleId,
      timestamp,
      distanceMm,
      quality,
      durationMs: dur64 * 64,
      gravity,
    });
  }
  return { packetId, sampleCount, samples };
}

export function hexDump(view: DataView): string {
  return [...new Uint8Array(view.buffer)].map(b => b.toString(16).padStart(2,"0")).join(" ");
}
