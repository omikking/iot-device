// ─── Hydra Domain Types (D0010553 §4) ───────────────────────────────────────

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
}

export interface MeasurementMeta {
  total: number;
  notUploaded: number;
  totalSectors: number;
  unusedSectors: number;
}

/** One BLE notification chunk or reassembled Hydra measurement payload. */
export interface HydraMeasurement {
  sampleId: number | null;
  byteLength: number;
  hexPreview: string;
  receivedAt: number;
}

export type LogType = "info" | "success" | "error" | "warn" | "raw";

export interface LogEntry {
  ts: number;
  msg: string;
  type: LogType;
}

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

export interface MeasurementNotification {
  byteLength: number;
  hex: string;
  sampleId: number | null;
}

export interface CommandResponse {
  code: number | null;
  label: string;
  success: boolean;
  fields: CommandField[];
  /** Populated for cmd 2 — dynamic measurement on characteristic 0023 */
  measurement?: MeasurementNotification | null;
}

export type ConfigType = "uint8" | "uint16" | "uint32" | "string" | "uint8[]";

export interface ConfigItem {
  id: number;
  label: string;
  type: ConfigType;
  default: string | number;
  developed: boolean;
  writeOnly: boolean;
  longConfig?: boolean;
}

export interface ConfigResult {
  success: boolean;
  message: string;
  raw: string | null;
}

export interface DeviceInfo {
  manufacturerName: string;
  modelNumber: string;
  firmwareRevision: string;
  softwareRevision: string;
  hardwareRevision: string;
  serialNumber: string;
}

export type TabId = "status" | "advanced" | "history" | "config" | "log" | "deviceinfo";
