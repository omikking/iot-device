import { hexDump } from "../ble/professorParser";
import type { CommandDef, CommandResponse, ConfigItem } from "../types";

// ─── Professor Commands (Section 5.4.2) ─────────────────────────────────────

export const COMMANDS: CommandDef[] = [
  { code: 0,   label: "No-op (test connection)",  param: null,   description: "Does nothing — verifies the command channel is working." },
  { code: 1,   label: "Flash LED",                param: null,   description: "Flashes the LED for visual identification of the Professor." },
  { code: 2,   label: "Reconnect to server",      param: null,   description: "Attempts to reconnect to the configured server." },
  { code: 3,   label: "Test RTC",                 param: null,   description: "Tests the Real-Time Clock module." },
  { code: 4,   label: "Reconfigure Wi-Fi",        param: null,   description: "Applies any pending Wi-Fi configuration changes." },
  { code: 5,   label: "Set device time",          param: "auto", description: "Sets the Professor RTC to the current browser time (Unix epoch seconds)." },
  { code: 255, label: "Factory reset",            param: null,   description: "Resets all configuration to defaults. Professor ID, Name, API Key, Server URL, and Serial are preserved." },
];

// ─── Result Labels (Section 5.4.2) ──────────────────────────────────────────

const RESULT_LABELS: Record<string, string> = {
  "0":  "Success",
  "-1": "Wi-Fi SET_NETWORK_FAILED",
  "-2": "Wi-Fi ENABLE_NETWORK_FAILED",
  "-3": "Wi-Fi SAVE_CONFIG_FAILED",
  "-4": "Invalid parameter",
  "-5": "Invalid state",
  "-6": "Invalid command",
  "-7": "Invalid command length",
  "-8": "Generic error",
};

export function resultLabel(code: number): string {
  return RESULT_LABELS[String(code)] ?? `Unknown (${code})`;
}

// ─── Professor Configuration Items (Section 5.1) ────────────────────────────

export const CONFIG_ITEMS: ConfigItem[] = [
  { id: 0,   label: "Last Update Timestamp",              type: "uint32", default: 0,                  readOnly: true,  writeOnly: false, longConfig: false },
  { id: 1,   label: "Professor ID",                       type: "uint32", default: 0,                  readOnly: false, writeOnly: false, longConfig: false, validation: { min: 0, max: 4294967295 } },
  { id: 2,   label: "Professor Name",                     type: "string", default: "",                 readOnly: false, writeOnly: false, longConfig: false },
  { id: 3,   label: "Professor Group",                    type: "string", default: "",                 readOnly: false, writeOnly: false, longConfig: false },
  { id: 4,   label: "API Key",                            type: "string", default: "",                 readOnly: false, writeOnly: true,  longConfig: false },
  { id: 6,   label: "Server URL",                         type: "string", default: "https://localhost", readOnly: false, writeOnly: false, longConfig: false },
  { id: 7,   label: "Max FIFO DB Size (MB)",              type: "uint32", default: 8192,               readOnly: false, writeOnly: false, longConfig: false, validation: { min: 5, max: 13000 } },
  { id: 8,   label: "Server Poll Period (s)",             type: "uint32", default: 60,                 readOnly: false, writeOnly: false, longConfig: false, validation: { min: 10, max: 3600 } },
  { id: 9,   label: "FIFO Cache Duration (s)",            type: "uint32", default: 60,                 readOnly: false, writeOnly: false, longConfig: false, validation: { min: 1, max: 3600 } },
  { id: 10,  label: "Max Elements per FIFO Put",          type: "uint32", default: 100,                readOnly: false, writeOnly: false, longConfig: false, validation: { min: 10, max: 500 } },
  { id: 11,  label: "BLE Heartbeat Period (s)",           type: "uint32", default: 5,                  readOnly: false, writeOnly: false, longConfig: false, validation: { min: 1, max: 60 } },
  { id: 12,  label: "Min Shutdown Timeout (s)",           type: "uint32", default: 600,                readOnly: false, writeOnly: false, longConfig: false, validation: { min: 5, max: 600 } },
  { id: 13,  label: "Max Shutdown Timeout (s)",           type: "uint32", default: 600,                readOnly: false, writeOnly: false, longConfig: false, validation: { min: 5, max: 600 } },
  { id: 14,  label: "Max BLE Connections",                type: "uint32", default: 2,                  readOnly: false, writeOnly: false, longConfig: false, validation: { min: 1, max: 4 } },
  { id: 15,  label: "Wi-Fi SSID",                         type: "string", default: "wifi",             readOnly: false, writeOnly: false, longConfig: false },
  { id: 16,  label: "Wi-Fi Password",                     type: "string", default: "",                 readOnly: false, writeOnly: true,  longConfig: false },
  { id: 17,  label: "Wi-Fi Key Management",               type: "uint32", default: 3,                  readOnly: false, writeOnly: false, longConfig: false, validation: { min: 0, max: 4 } },
  { id: 18,  label: "WPA-EAP Protocol",                   type: "uint32", default: 1,                  readOnly: false, writeOnly: false, longConfig: false, validation: { min: 0, max: 2 } },
  { id: 19,  label: "WPA-EAP Anonymous Identity",         type: "string", default: "",                 readOnly: false, writeOnly: false, longConfig: false },
  { id: 20,  label: "WPA-EAP Identity",                   type: "string", default: "",                 readOnly: false, writeOnly: false, longConfig: false },
  { id: 129, label: "Serial Number",                      type: "uint32", default: 0,                  readOnly: false, writeOnly: false, longConfig: false, validation: { min: 0, max: 4294967295 } },
  { id: 130, label: "Wi-Fi MAC Address",                  type: "string", default: "",                 readOnly: true,  writeOnly: false, longConfig: false },
  { id: 209, label: "RADIUS Server CA Certificate",       type: "uint8[]", default: "",                readOnly: false, writeOnly: false, longConfig: true },
  { id: 210, label: "Client Private Key",                 type: "uint8[]", default: "",                readOnly: false, writeOnly: true,  longConfig: true },
  { id: 211, label: "Client Certificate",                 type: "uint8[]", default: "",                readOnly: false, writeOnly: false, longConfig: true },
  { id: 212, label: "Extra wpa_supplicant Args (JSON)",   type: "json",   default: "",                 readOnly: false, writeOnly: false, longConfig: true },
];

// ─── Response Formatter ─────────────────────────────────────────────────────

export function formatCommandResponse(view: DataView): CommandResponse {
  if (!view || view.byteLength === 0)
    return { code: null, label: "Empty response", success: false, fields: [] };

  const resultCode = view.getInt8(0);
  const success = resultCode >= 0;
  const label = resultLabel(resultCode);

  const fields: CommandResponse["fields"] = [
    { key: "Result Code", value: resultCode },
    { key: "Status", value: label },
  ];

  fields.push({ key: "Raw bytes", value: hexDump(view) });

  return { code: resultCode, label, success, fields };
}
