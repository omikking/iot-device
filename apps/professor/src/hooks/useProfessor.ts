import { useCallback, useEffect, useRef, useState } from "react";
import { saveToDB, loadFromDB } from "./useIndexedDB";
import { ProfessorBLE } from "../ble/professorBle";
import { parseProfessorStatus } from "../ble/professorParser";
import { COMMANDS, formatCommandResponse } from "../constants/commands";
import { hexDump } from "../ble/professorParser";
import type {
  ProfessorStatus,
  DeviceInfo,
  LogEntry,
  LogType,
  CommandResponse,
  ConfigItem,
  ConfigResult,
} from "../types";

function decodeConfigValue(item: ConfigItem, v: DataView): string {
  const off = v.byteLength > 7 ? 7 : 0;
  if (item.type === "uint32") return String(v.getUint32(off, true));
  if (item.type === "uint8[]") {
    const bytes = new Uint8Array(v.buffer, v.byteOffset + off, v.byteLength - off);
    if (bytes.length === 0) return "";
    return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join(" ");
  }
  return new TextDecoder().decode(v.buffer.slice(v.byteOffset + off)).replace(/\0/g, "");
}

export interface ProfessorState {
  connected: boolean;
  deviceName: string | null;
  status: ProfessorStatus | null;
  deviceInfo: DeviceInfo | null;
  logs: LogEntry[];
  connecting: boolean;
}

export function useProfessor() {
  const ble = useRef(new ProfessorBLE());
  const [state, setState] = useState<ProfessorState>({
    connected: false,
    deviceName: null,
    status: null,
    deviceInfo: null,
    logs: [],
    connecting: false,
  });

  const log = useCallback((msg: string, type: LogType = "info") => {
    setState((s) => ({
      ...s,
      logs: [{ ts: Date.now(), msg, type }, ...s.logs].slice(0, 500),
    }));
  }, []);

  useEffect(() => {
    loadFromDB<LogEntry[]>("logs").then((cached) => {
      if (cached?.length) setState((s) => ({ ...s, logs: cached }));
    });
  }, []);

  useEffect(() => {
    saveToDB("logs", state.logs);
  }, [state.logs.length]);

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, connecting: true }));

    try {
      await ble.current.connect();
      const deviceName = ble.current.getDeviceName();
      log(`Connected to ${deviceName}`, "success");

      let status: ProfessorStatus | null = null;
      try {
        const raw = await ble.current.readDeviceStatus();
        status = parseProfessorStatus(raw);
        log("Device status retrieved", "info");
      } catch (e: unknown) {
        log(`Status read failed: ${e instanceof Error ? e.message : String(e)}`, "warn");
      }

      let deviceInfo: DeviceInfo | null = null;
      try {
        deviceInfo = await ble.current.readDeviceInfo();
        log("Device info retrieved", "info");
      } catch (e: unknown) {
        log(`Device info read failed: ${e instanceof Error ? e.message : String(e)}`, "warn");
      }

      setState((s) => ({
        ...s,
        connected: true,
        deviceName,
        status,
        deviceInfo,
        connecting: false,
      }));
    } catch (e: unknown) {
      ble.current.disconnect();
      const msg = e instanceof Error ? e.message : String(e);
      log(`Connection failed: ${msg}`, "error");
      setState((s) => ({ ...s, connecting: false }));
    }
  }, [log]);

  const disconnect = useCallback(() => {
    ble.current.disconnect();
    log("Disconnected", "warn");
    setState((s) => ({
      ...s,
      connected: false,
      deviceName: null,
      status: null,
      deviceInfo: null,
    }));
  }, [log]);

  const refreshStatus = useCallback(async () => {
    try {
      const raw = await ble.current.readDeviceStatus();
      const status = parseProfessorStatus(raw);
      log("Status refreshed", "info");
      setState((s) => ({ ...s, status }));
    } catch (e: unknown) {
      log(`Status refresh failed: ${e instanceof Error ? e.message : String(e)}`, "error");
    }
  }, [log]);

  const sendCommand = useCallback(
    async (cmdCode: number, param?: number | null): Promise<CommandResponse> => {
      const def = COMMANDS.find((c) => c.code === cmdCode);
      const label = def?.label ?? `Command ${cmdCode}`;

      let resolvedParam = param ?? null;
      if (def?.param === "auto" && resolvedParam === null) {
        resolvedParam = Math.floor(Date.now() / 1000);
      }

      try {
        log(`Sending: ${label}${resolvedParam !== null ? ` (param=${resolvedParam})` : ""}`, "info");
        const result = await ble.current.sendCommand(cmdCode, resolvedParam);
        const resp = formatCommandResponse(result);
        log(`${label} → ${resp.label}`, resp.success ? "success" : "error");
        return resp;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        log(`${label} failed: ${msg}`, "error");
        return { code: null, label: msg, success: false, fields: [] };
      }
    },
    [log],
  );

  const readConfig = useCallback(
    async (item: ConfigItem): Promise<ConfigResult> => {
      log(`Reading config ID ${item.id} (${item.label})…`);
      try {
        const v = await ble.current.readConfig(item.id);
        const decoded = decodeConfigValue(item, v);
        log(`Config ${item.id}: value = ${decoded}`, "success");
        return { success: true, message: decoded, raw: hexDump(v) };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        log(`Read config #${item.id} failed: ${msg}`, "error");
        return { success: false, message: msg, raw: null };
      }
    },
    [log],
  );

  const writeConfig = useCallback(
    async (item: ConfigItem, raw: string): Promise<ConfigResult> => {
      log(`Writing config ID ${item.id} (${item.label}) = "${raw}"`);
      try {
        let value: string | number | Uint8Array = raw;

        if (item.type === "uint32") {
          value = Number(raw);
        } else if (item.type === "uint8[]") {
          const hex = raw.replace(/[^0-9a-fA-F]/g, "");
          const bytes = new Uint8Array(hex.length / 2);
          for (let i = 0; i < bytes.length; i++)
            bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
          value = bytes;
        }

        if (item.longConfig && value instanceof Uint8Array) {
          await ble.current.writeLongConfig(item.id, value);
        } else if (item.longConfig && typeof value === "string") {
          const enc = new TextEncoder().encode(value);
          await ble.current.writeLongConfig(item.id, enc);
        } else {
          await ble.current.writeConfig(item.id, value);
        }

        log(`Config #${item.id} written successfully`, "success");
        return { success: true, message: "Value written successfully", raw: null };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        log(`Write config #${item.id} failed: ${msg}`, "error");
        return { success: false, message: msg, raw: null };
      }
    },
    [log],
  );

  const clearLog = useCallback(() => {
    setState((s) => ({ ...s, logs: [] }));
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    refreshStatus,
    sendCommand,
    readConfig,
    writeConfig,
    clearLog,
    log,
  };
}
