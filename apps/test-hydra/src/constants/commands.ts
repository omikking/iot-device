import { hexDump } from "../ble/hydraParser";
import type { CommandDef, CommandResponse, ConfigItem } from "../types";

export const COMMANDS: CommandDef[] = [
  { code: 0, label: "No-op (test connection)", param: null, description: "Does nothing — verifies the command channel." },
  { code: 1, label: "Trigger dynamic mode capture", param: null, description: "Starts a dynamic-mode measurement capture." },
  { code: 2, label: "Notify next dynamic measurement", param: null, description: "Next dynamic-mode result is sent on Measurement characteristic 0023." },
  { code: 6, label: "Connect to Wi-Fi", param: null, description: "Connects to the configured Wi-Fi access point." },
  { code: 7, label: "Connect to server", param: null, description: "Opens TCP to the configured server URL (requires Wi-Fi)." },
  { code: 8, label: "Trigger Wi-Fi upload", param: null, description: "Upload cycle for stored measurements." },
  { code: 9, label: "Flash LED", param: "seq", description: "0 = 4× blue spin, 1 = 3× green pulse." },
  { code: 10, label: "Disconnect BLE", param: null, description: "Device disconnects Bluetooth; config saved on disconnect." },
  { code: 11, label: "Set device time", param: "auto", description: "Sets RTC from browser Unix epoch seconds." },
  { code: 12, label: "Set time from NTP", param: null, description: "Sync time using configured NTP server." },
  { code: 13, label: "Get Wi-Fi MAC address", param: null, description: "Returns MAC in little-endian in response data." },
  { code: 253, label: "Clear Sample Non-Volatile Memory", param: null, description: "Clears sample memory in flash. Sampling is paused in Config mode with cyan LEDs (takes up to 3 mins)." },
  { code: 254, label: "Enter shipping mode", param: null, description: "Deep sleep for shipping." },
  { code: 255, label: "Factory reset", param: null, description: "Reset config; serial, server URL, API key preserved." },
];

export const RESULT_LABELS: Record<string, string> = {
  "1": "Success (with data)",
  "0": "Success",
  "-1": "General failure",
  "-2": "Hydra busy",
  "-3": "Invalid parameter",
  "-4": "Invalid command",
  "-10": "Server details invalid",
  "-11": "Wi-Fi powerup failure",
  "-12": "Wi-Fi connection failure",
  "-13": "TCP connection failure",
  "-14": "Server endpoint failure",
};

export function resultLabel(code: number): string {
  return RESULT_LABELS[String(code)] ?? `(${code})`;
}

/** §4 Configuration Service (0001) — D0010553 p.26–27 */
export const CONFIG_ITEMS: ConfigItem[] = [
  { id: 1, label: "BLE Upload Enable", type: "uint8", default: 1, developed: true, writeOnly: false },
  { id: 2, label: "Wi-Fi Upload Enable", type: "uint8", default: 1, developed: true, writeOnly: false },
  { id: 3, label: "Wi-Fi SSID (max 31)", type: "string", default: "wifi", developed: true, writeOnly: false },
  { id: 4, label: "Wi-Fi PSK (max 31)", type: "string", default: "wifiwifi", developed: true, writeOnly: true },
  // { id: 5, label: "Static Measurement Period (s)", type: "uint16", default: 900, developed: true, writeOnly: false },
  { id: 6, label: "Wi-Fi Upload Period (min)", type: "uint16", default: 60, developed: true, writeOnly: false },
  { id: 7, label: "Server URL (max 47)", type: "string", default: "", developed: true, writeOnly: false },
  { id: 8, label: "API Key (max 47)", type: "string", default: "", developed: true, writeOnly: true },
  { id: 9, label: "Wavelength Priority Threshold (0.1 pm)", type: "uint32", default: 5000, developed: true, writeOnly: false },
  { id: 13, label: "Status LED Flash Interval (min)", type: "uint16", default: 0, developed: true, writeOnly: false },
  { id: 14, label: "Advertising Interval (ms)", type: "uint16", default: 500, developed: true, writeOnly: false },
  { id: 16, label: "Wi-Fi Key Management (0–4)", type: "uint8", default: 3, developed: true, writeOnly: false },
  { id: 17, label: "WPA-EAP Protocol (0–2)", type: "uint8", default: 0, developed: true, writeOnly: false },
  { id: 18, label: "Wi-Fi EAP Anonymous ID", type: "string", default: "", developed: true, writeOnly: true },
  { id: 19, label: "Wi-Fi EAP ID", type: "string", default: "", developed: true, writeOnly: true },
  { id: 20, label: "Wi-Fi NTP Address", type: "string", default: "pool.ntp.org", developed: true, writeOnly: false },
  { id: 21, label: "Wi-Fi NTP Enabled", type: "uint8", default: 1, developed: true, writeOnly: false },
  { id: 23, label: "Sampling Mode (0=Config,1=Static,2=Dynamic)", type: "uint8", default: 0, developed: true, writeOnly: false },
  { id: 24, label: "Dynamic Pre-Capture Count", type: "uint32", default: 500, developed: true, writeOnly: false },
  { id: 25, label: "Dynamic Post-Capture Count", type: "uint32", default: 1000, developed: true, writeOnly: false },
  { id: 26, label: "Dynamic Sample Frequency (mHz)", type: "uint32", default: 100000, developed: true, writeOnly: false },
  { id: 27, label: "Static Measurement Period (s)", type: "uint32", default: 900, developed: true, writeOnly: false },
  { id: 28, label: "Interrogator 1 init commands", type: "string", default: "DauSe,0>\nOBB,0>\nAO,100>", developed: true, writeOnly: false , longConfig: true },
  { id: 29, label: "Interrogator 2 init commands", type: "string", default: "DauSe,0>\nOBB,0>\nAO,100>", developed: true, writeOnly: false , longConfig: true },
  { id: 30, label: "Interrogator 3 init commands", type: "string", default: "DauSe,0>\nOBB,0>\nAO,100>", developed: true, writeOnly: false , longConfig: true },
  { id: 31, label: "Interrogator warmup delay (s)", type: "uint16", default: 30, developed: true, writeOnly: false },
  { id: 32, label: "Overwrite ack when storage full", type: "uint8", default: 0, developed: true, writeOnly: false },
  { id: 129, label: "Serial Number", type: "uint32", default: 0, developed: true, writeOnly: false },
  { id: 130, label: "BLE Advertising Name (max 13)", type: "string", default: "", developed: true, writeOnly: false },
  { id: 209, label: "RADIUS Server CA (AtPKI)", type: "uint8[]", default: "", developed: true, writeOnly: true, longConfig: true },
  { id: 210, label: "Client Private Key (AtPKI)", type: "uint8[]", default: "", developed: true, writeOnly: true, longConfig: true },
  { id: 211, label: "Client Certificate (AtPKI)", type: "uint8[]", default: "", developed: true, writeOnly: true, longConfig: true },
];

export function formatCommandResponse(cmdCode: number, view: DataView): CommandResponse {
  if (!view || view.byteLength === 0)
    return { code: null, label: "Empty response", success: false, fields: [] };

  const resultCode = view.getInt8(5);
  const success = resultCode >= 0;
  const label = resultLabel(resultCode);
  const fields: CommandResponse["fields"] = [
    { key: "Result Code", value: resultCode },
    { key: "Status", value: label },
  ];

  if (cmdCode === 13 && success && view.byteLength >= 11) {
    const mac = [
      view.getUint8(7),
      view.getUint8(8),
      view.getUint8(9),
      view.getUint8(10),
      view.getUint8(11),
      view.getUint8(12),
    ]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(":");
    fields.push({ key: "Wi-Fi MAC", value: mac });
  }

  fields.push({ key: "Raw bytes", value: hexDump(view) });
  return { code: resultCode, label, success, fields };
}
