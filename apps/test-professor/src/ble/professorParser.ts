import type { ProfessorStatus, ProfessorError } from "../types";

const ERROR_FLAGS: Record<number, string> = {
  0:  "BLE Communication Channel Down",
  1:  "Battery Fault",
  2:  "Server Unavailable",
  3:  "Server Authentication Failure",
  4:  "Professor Configuration Download Error",
  5:  "Sensor Measurement/Status Upload Error",
  6:  "Professor Status Upload Error",
  16: "System Under Voltage",
  17: "Battery Over Temperature (> 40°C)",
  18: "Battery Under Voltage (< 2.85V)",
};

export function parseErrors(flags: number): ProfessorError[] {
  return Object.entries(ERROR_FLAGS)
    .filter(([b]) => flags & (1 << Number(b)))
    .map(([b, msg]) => ({ bit: Number(b), message: msg }));
}

export function parseProfessorStatus(v: DataView): ProfessorStatus {
  const statusFlags = v.getUint8(0);
  const errorFlags = v.getUint32(1, true);
  return {
    statusFlags,
    dataInFifo: Boolean(statusFlags & 1),
    wifiConnected: Boolean(statusFlags & 2),
    errorFlags,
    errors: parseErrors(errorFlags),
    batteryMv: v.getUint16(5, true),
    batteryStatus: v.getUint8(7),
    timestamp: v.getUint32(8, true),
  };
}

export function hexDump(view: DataView): string {
  return [...new Uint8Array(view.buffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join(" ");
}
