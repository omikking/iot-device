// ─── Professor Domain Types ─────────────────────────────────────────────────

export interface ProfessorStatus {
  statusFlags: number;
  dataInFifo: boolean;
  wifiConnected: boolean;
  errorFlags: number;
  errors: ProfessorError[];
  batteryMv: number;
  batteryStatus: number;
  timestamp: number;
}

export interface ProfessorError {
  bit: number;
  message: string;
}

export interface DeviceInfo {
  manufacturerName: string;
  modelNumber: string;
  firmwareRevision: string;
  softwareRevision: string;
  hardwareRevision: string;
  serialNumber: string;
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

export type ConfigType = "uint32" | "string" | "uint8[]" | "json";

export interface ConfigItem {
  id: number;
  label: string;
  type: ConfigType;
  default: string | number;
  readOnly: boolean;
  writeOnly: boolean;
  longConfig: boolean;
  validation?: { min?: number; max?: number; maxLen?: number };
}

export interface ConfigResult {
  success: boolean;
  message: string;
  raw: string | null;
}

// ─── Tabs ───────────────────────────────────────────────────────────────────

export type TabId = "status" | "config" | "commands" | "log" | "deviceinfo";
