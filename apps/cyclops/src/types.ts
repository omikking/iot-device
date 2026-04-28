// ─── Shared Domain Types ────────────────────────────────────────────────────

export interface Gravity {
  x: number;
  y: number;
  z: number;
  highPriority: boolean;
}

export interface Fault {
  bit: number;
  message: string;
}

export interface FaultInfo {
  hasFaults: boolean;
  faults: Fault[];
}

export interface DeviceStatus {
  status: number;
  faults: FaultInfo;
  batteryMv: number;
  batteryStatus: number;
  timestamp: number;
  lastDistanceMm: number;
  lastGravity: Gravity;
  temperatureC: number;
  lastSensorQuality: number;
}

export interface MeasurementMeta {
  total: number;
  notUploaded: number;
}

export interface Sample {
  sampleId: number;
  timestamp: number;
  distanceMm: number;
  quality: number;
  durationMs: number;
  gravity: Gravity;
}

export interface MeasurementPacket {
  packetId: number;
  sampleCount: number;
  samples: Sample[];
}

// ─── Log ────────────────────────────────────────────────────────────────────

export type LogType = "info" | "success" | "error" | "warn" | "raw";

export interface LogEntry {
  ts: number;
  msg: string;
  type: LogType;
}

// ─── Commands ───────────────────────────────────────────────────────────────

export interface CommandDef {
  code: number;
  label: string;
  param: string | null;
  description: string;
}

export interface CommandField {
  key: string;
  value: string | number;
}

export interface CommandResponse {
  code: number | null;
  label: string;
  success: boolean;
  fields: CommandField[];
}

// ─── Configuration ──────────────────────────────────────────────────────────

export type ConfigType = "uint8" | "uint16" | "uint32" | "string" | "uint8[]";

export interface ConfigItem {
  id: number;
  label: string;
  type: ConfigType;
  default: string | number;
  developed: boolean;
  writeOnly: boolean;
}

export interface ConfigResult {
  success: boolean;
  message: string;
  raw: string | null;
}

// ─── Device Info ────────────────────────────────────────────────────────────

export interface DeviceInfo {
  manufacturerName: string;
  modelNumber: string;
  firmwareRevision: string;
  softwareRevision: string;
  hardwareRevision: string;
  serialNumber: string;
}

// ─── Tabs ───────────────────────────────────────────────────────────────────

export type TabId = "status" | "history" | "advanced" | "config" | "log" | "deviceinfo";
