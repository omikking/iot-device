import { parseGravity, hexDump } from "../ble/cyclopsParser";
import type { CommandDef, CommandResponse, ConfigItem } from "../types";

// ─── Command Definitions ────────────────────────────────────────────────────

export const COMMANDS: CommandDef[] = [
  { code: 0,   label: "No-op (test connection)",          param: null,   description: "Does nothing — verifies the command channel is working." },
  { code: 1,   label: "Measure distance",                 param: null,   description: "Fires the laser and returns distance, quality, and duration. Result is NOT saved to flash." },
  { code: 2,   label: "Measure orientation",               param: null,   description: "Reads the accelerometer and returns X/Y/Z gravity in ±2G range." },
  { code: 3,   label: "Measure & log to flash",           param: null,   description: "Fires the laser, reads orientation, and saves both to flash storage for later upload." },
  { code: 4,   label: "Enable laser (targeting)",          param: "ms",   description: "Turns on the aiming laser for the specified duration (milliseconds) for alignment." },
  { code: 6,   label: "Connect to Wi-Fi",                 param: null,   description: "Connects the device to its configured Wi-Fi access point." },
  { code: 7,   label: "Connect to server",                param: null,   description: "Opens a TCP connection to the configured server URL. Requires Wi-Fi first." },
  { code: 8,   label: "Trigger Wi-Fi upload",             param: null,   description: "Connects to Wi-Fi and uploads all un-uploaded samples to the server." },
  { code: 9,   label: "Flash LED",                        param: "seq",  description: "Flashes an LED for visual identification. 0 = 4× blue spin, 1 = 3× green pulse." },
  { code: 10,  label: "Disconnect BLE",                   param: null,   description: "Device-initiated Bluetooth disconnect. Config is saved to flash on disconnect." },
  { code: 11,  label: "Set device time",                  param: "auto", description: "Syncs the device RTC to the current browser time (Unix epoch seconds)." },
  { code: 254, label: "Enter shipping mode",              param: null,   description: "Puts the device into deep sleep for shipping. Hard to wake — use with caution." },
  { code: 255, label: "Factory reset",                    param: null,   description: "Resets all configuration to defaults. Server URL, API key, and serial are preserved." },
];

// ─── Result Labels ───────────────────────────────────────────────────────────

export const RESULT_LABELS: Record<string, string> = {
  "1":"Success (with data)", "0":"Success",
  "-1":"General failure", "-2":"Device busy", "-3":"Invalid parameter", "-4":"Invalid command",
  "-10":"Server details invalid", "-11":"Wi-Fi powerup failure",
  "-12":"Wi-Fi connection failure", "-13":"TCP connection failure",
  "-14":"Server endpoint failure",
  "-20":"Laser power low", "-21":"Laser internal error",
  "-22":"Temperature too low", "-23":"Temperature too high",
  "-24":"Laser out of range", "-25":"Invalid result",
  "-26":"Light too strong", "-27":"Laser too weak", "-28":"Laser too strong",
  "-29":"Laser hardware error", "-30":"Laser invalid command",
  "-31":"Laser comms checksum", "-32":"Laser comms timeout",
};

export function resultLabel(code: number): string {
  return RESULT_LABELS[String(code)] ?? `(${code})`;
}

// ─── Configuration Item Definitions ─────────────────────────────────────────

export const CONFIG_ITEMS: ConfigItem[] = [
  { id: 1, label: "BLE Upload Enable", type: "uint8", default: 1, developed: true, writeOnly: false },
  { id: 2, label: "Wi-Fi Upload Enable", type: "uint8", default: 1, developed: true, writeOnly: false },
  { id: 3, label: "Wi-Fi SSID (max 31 chars)", type: "string", default: "wifi", developed: true, writeOnly: false },
  { id: 4, label: "Wi-Fi PSK (max 31 chars)", type: "string", default: "wifiwifi", developed: true, writeOnly: true },
  { id: 5, label: "Measurement Period (min)", type: "uint16", default: 15, developed: true, writeOnly: false },
  { id: 6, label: "Wi-Fi Upload Period (min)", type: "uint16", default: 60, developed: true, writeOnly: false },
  { id: 7, label: "Server URL (max 47 chars)", type: "string", default: "", developed: true, writeOnly: false },
  { id: 8, label: "API Key (max 47 chars)", type: "string", default: "", developed: true, writeOnly: true },
  { id: 9, label: "Distance Priority Threshold (mm)", type: "uint16", default: 50, developed: true, writeOnly: false },
  { id: 10, label: "Orientation Priority Threshold (0-1024)", type: "uint16", default: 64, developed: true, writeOnly: false },
  { id: 11, label: "Laser Repeat Count (0-50)", type: "uint16", default: 5, developed: true, writeOnly: false },
  { id: 12, label: "Laser Repeat Interval (s) (0-3600)", type: "uint16", default: 60, developed: true, writeOnly: false },
  { id: 13, label: "Status LED Flash Interval (min)", type: "uint16", default: 0, developed: true, writeOnly: false },
  { id: 14, label: "Advertising Interval (ms)", type: "uint16", default: 500, developed: true, writeOnly: false },
  { id: 15, label: "Laser Timeout (ms) (0-10000)", type: "uint16", default: 6000, developed: true, writeOnly: false },
  { id: 16, label: "Wi-Fi Key Management (0=None,1=WEP,2=WPA,3=WPA2,4=EAP)", type: "uint8", default: 3, developed: true, writeOnly: false },
  { id: 17, label: "WPA-EAP Protocol (0=TLS,1=PEAP,2=TTLS)", type: "uint8", default: 0, developed: true, writeOnly: false },
  { id: 18, label: "Wi-Fi EAP Anonymous ID (max 31 chars)", type: "string", default: "", developed: true, writeOnly: true },
  { id: 19, label: "Wi-Fi EAP ID (max 31 chars)", type: "string", default: "", developed: true, writeOnly: true },
  { id: 20, label: "Wi-Fi NTP Address (max 43 chars)", type: "string", default: "pool.ntp.org", developed: true, writeOnly: false },
  { id: 21, label: "Wi-Fi NTP Enabled", type: "uint8", default: 1, developed: true, writeOnly: false },
  { id: 129, label: "Serial Number (0-4294967295)", type: "uint32", default: 0, developed: true, writeOnly: false },
  { id: 130, label: "BLE Advertising Name (max 13 chars)", type: "string", default: "", developed: true, writeOnly: false },
  { id: 209, label: "RADIUS Server CA Certificate (WPA-EAP)", type: "uint8[]", default: "", developed: true, writeOnly: true },
  { id: 210, label: "Client Private Key (WPA-EAP)", type: "uint8[]", default: "", developed: true, writeOnly: true },
  { id: 211, label: "Client Certificate (WPA-EAP)", type: "uint8[]", default: "", developed: true, writeOnly: true },
];

// ─── Response Formatter ─────────────────────────────────────────────────────

export function formatCommandResponse(cmdCode: number, view: DataView): CommandResponse {
  if (!view || view.byteLength === 0) return { code: null, label: "Empty response", success: false, fields: [] };

  const resultCode = view.getInt8(5);
  const success = resultCode >= 0;
  const label = resultLabel(resultCode);
  const fields: CommandResponse["fields"] = [
    { key: "Result Code", value: resultCode },
    { key: "Status", value: label },
  ];

  if (cmdCode === 1 && success && view.byteLength >= 15) {
    fields.push(
      { key: "Distance", value: `${view.getUint32(7, true)} mm` },
      { key: "Quality", value: view.getUint16(11, true) },
      { key: "Duration", value: `${view.getUint16(13, true)} ms` },
    );
  }

  if (cmdCode === 2 && success && view.byteLength >= 11) {
    const g = parseGravity(view.getUint32(7, true));
    fields.push(
      { key: "Gravity X", value: `${g.x.toFixed(4)} G` },
      { key: "Gravity Y", value: `${g.y.toFixed(4)} G` },
      { key: "Gravity Z", value: `${g.z.toFixed(4)} G` },
    );
  }

  fields.push({ key: "Raw bytes", value: hexDump(view) });

  return { code: resultCode, label, success, fields };
}
