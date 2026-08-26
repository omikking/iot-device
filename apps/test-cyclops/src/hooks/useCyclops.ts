import { useState, useRef, useCallback, useEffect } from "react";
import { saveToDB, loadFromDB } from "./useIndexedDB";
import { CyclopsBLE } from "../ble/cyclopsBle";
import { parseDeviceStatus, parseMeta, parsePacket } from "../ble/cyclopsParser";
import { formatCommandResponse } from "../constants/commands";
import type {
  DeviceInfo,
  DeviceStatus,
  MeasurementMeta,
  Sample,
  LogEntry,
  LogType,
  CommandDef,
  CommandResponse,
  ConfigItem,
  ConfigResult,
} from "../types";

export function useCyclops() {
  const bleRef = useRef<CyclopsBLE | null>(null);

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [meta, setMeta] = useState<MeasurementMeta | null>(null);
  const [buttonState, setButtonState] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // ── History Download State ──────────────────────────────────────────────────
  const [history, setHistory] = useState<Sample[]>([]);
  const [histLoading, setHistLoading] = useState(false);
  const [histDownloadMs, setHistDownloadMs] = useState<number | null>(null);
  const seenIds = useRef<Set<number>>(new Set());
  const histSubbed = useRef(false);
  const histDone = useRef(false);
  const unackedPkts = useRef<number[]>([]);

  const log = useCallback((msg: string, type: LogType = "info") => {
    setLogs(p => [{ ts: Date.now(), msg, type }, ...p].slice(0, 200));
  }, []);

  useEffect(() => {
    async function loadData() {
      const cachedLogs = await loadFromDB<LogEntry[]>('logs');
      if (cachedLogs) setLogs(cachedLogs);

      const cachedHistory = await loadFromDB<Sample[]>('history');
      if (cachedHistory) {
        setHistory(cachedHistory);
        cachedHistory.forEach(s => seenIds.current.add(s.sampleId));
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    saveToDB('logs', logs);
  }, [logs.length]);

  useEffect(() => {
    saveToDB('history', history);
  }, [history.length]);

  // ── Connection ──────────────────────────────────────────────────────────

  async function connect(): Promise<void> {
    setConnecting(true);
    log("Opening BLE device picker…");
    try {
      const ble = new CyclopsBLE();
      await ble.connect();
      bleRef.current = ble;

      seenIds.current.clear();
      histSubbed.current = false;
      histDone.current = false;
      setHistory([]);

      setConnected(true);
      setDeviceName(ble.getDeviceName());
      log(`Connected to ${ble.getDeviceName()}`, "success");

      const sv = await ble.readDeviceStatus();
      setStatus(parseDeviceStatus(sv));
      log("Device status read OK", "success");

      const mv = await ble.readMeta();
      setMeta(parseMeta(mv));

      try {
        const di = await ble.readDeviceInfo();
        setDeviceInfo(di);
        log("Device info read OK", "success");
      } catch {
        log("Device Information Service not available", "warn");
      }

      ble.subscribeButtonPress((v: DataView) => {
        const s = v.getUint8(0);
        setButtonState(s);
        log(s === 1 ? "Button PRESSED" : "Button released", s === 1 ? "warn" : "info");
      });

      ble.subscribeMeasurementMeta((v: DataView) => {
        setMeta(parseMeta(v));
      });

    } catch (e: unknown) {
      log(`Connection failed: ${(e as Error).message}`, "error");
    } finally {
      setConnecting(false);
    }
  }

  function disconnect(): void {
    bleRef.current?.disconnect();
    histSubbed.current = false;
    histDone.current = false;
    seenIds.current.clear();
    setConnected(false);
    setStatus(null);
    setMeta(null);
    setDeviceInfo(null);
    log("Disconnected", "warn");
  }

  // ── Status refresh ─────────────────────────────────────────────────────────

  async function refreshStatus(): Promise<void> {
    try {
      log("Reading device status…");
      const v = await bleRef.current!.readDeviceStatus();
      setStatus(parseDeviceStatus(v));
      const mv = await bleRef.current!.readMeta();
      setMeta(parseMeta(mv));
      log("Status refreshed", "success");
    } catch (e: unknown) {
      log(`Status read error: ${(e as Error).message}`, "error");
    }
  }

  // ── Send command ──────────────────────────────────────────────────────────

  async function sendCommand(selectedCmd: CommandDef, paramValue: string): Promise<CommandResponse | null> {
    const cmd = selectedCmd;

    if (cmd.code === 254 && !window.confirm("Enter shipping mode? Device will enter deep sleep.")) return null;
    if (cmd.code === 255 && !window.confirm("FACTORY RESET? All settings will be wiped!")) return null;

    let param: number | null = null;
    if (cmd.param === "auto") {
      param = Math.floor(Date.now() / 1000);
    } else if (cmd.param && paramValue !== "") {
      param = parseInt(paramValue);
      if (isNaN(param)) {
        log(`Invalid parameter "${paramValue}"`, "error");
        return null;
      }
    }

    log(`Sending command ${cmd.code}: ${cmd.label}${param !== null ? ` (param=${param})` : ""}…`);

    try {
      const v = await bleRef.current!.sendCommand(cmd.code, param);
      if (cmd.code === 10) {
        log("Device disconnected (Cmd 10). Config saved to flash.", "warn");
        setConnected(false);
        setStatus(null);
        setMeta(null);
        return {
          code: 0,
          label: "Device disconnected",
          success: true,
          fields: [
            { key: "Result", value: "Device-initiated disconnect sent" },
            { key: "Note", value: "Config saved to flash on disconnect" },
          ]
        };
      }
      const formatted = formatCommandResponse(cmd.code, v!);

      const statusText = formatted.success ? "success" : "error";
      log(`Command ${cmd.code} → ${formatted.label}`, statusText as LogType);

      if (formatted.fields.length > 2) {
        formatted.fields.slice(2, -1).forEach(f => {
          log(`  ${f.key}: ${f.value}`, "info");
        });
      }

      return formatted;
    } catch (e: unknown) {
      log(`Command error: ${(e as Error).message}`, "error");
      return { code: null, label: "Communication error", success: false, fields: [{ key: "Error", value: (e as Error).message }] };
    }
  }

  // ── Config read/write ─────────────────────────────────────────────────────

  async function writeConfig(configId: ConfigItem, configVal: string): Promise<ConfigResult> {
    log(`Writing config ID ${configId.id} (${configId.label}) = "${configVal}"`);
    try {
      let val: string | Uint8Array;
      if (configId.type === "string" || configId.type === "uint8[]") {
        val = configVal;
      } else {
        const n = parseInt(configVal);
        if (configId.type === "uint8") {
          val = new Uint8Array([n]);
        } else if (configId.type === "uint16") {
          const b = new Uint8Array(2);
          new DataView(b.buffer).setUint16(0, n, true);
          val = b;
        } else {
          const b = new Uint8Array(4);
          new DataView(b.buffer).setUint32(0, n, true);
          val = b;
        }
      }

      if (configId.type === "uint8[]") {
        // Certificate configs (209/210/211): 0-based block indexing
        const encoded = typeof val === "string" ? new TextEncoder().encode(val) : val;
        await bleRef.current!.writeLongConfig(configId.id, encoded, 0, false);
      } else {
        await bleRef.current!.writeConfig(configId.id, val);
      }

      log(`Config ${configId.id} written successfully`, "success");
      return { success: true, message: "Value written successfully", raw: null };
    } catch (e: unknown) {
      log(`Config write error: ${(e as Error).message}`, "error");
      return { success: false, message: (e as Error).message, raw: null };
    }
  }


  // ── History Download ─────────────────────────────────────────────────────

  async function loadHistory(): Promise<void> {
    const BATCH_SIZE = 10;
    const ACK_THRESHOLD = 9;
    const STATE_TIMEOUT_MS = 10_000;

    setHistLoading(true);
    setHistDownloadMs(null);
    histDone.current = false;
    unackedPkts.current = [];
    const t0 = performance.now();
    log("State → init_measurements");

    try {
      if (!histSubbed.current) {
        histSubbed.current = true;
        await bleRef.current!.subscribeMeasurementData((v: DataView) => {
          const pkt = parsePacket(v);

          if (pkt.sampleCount === 0) {
            histDone.current = true;
            return;
          }

          unackedPkts.current.push(pkt.packetId);

          const fresh = pkt.samples.filter(s => {
            if (seenIds.current.has(s.sampleId)) return false;
            seenIds.current.add(s.sampleId);
            return true;
          });

          if (fresh.length) {
            log(`+${fresh.length} samples (pkt#${pkt.packetId})`);
            setHistory(prev => [...prev, ...fresh]);
          }
        });
      }

      await bleRef.current!.requestHistoryPackets(BATCH_SIZE);
      log("State → poll_measurements");

      let stateTimer = performance.now();

      while (!histDone.current) {
        await new Promise(r => setTimeout(r, 150));

        if (performance.now() - stateTimer > STATE_TIMEOUT_MS) {
          log("State timeout (10 s) — moving to send_final_ack", "warn");
          break;
        }

        if (unackedPkts.current.length >= ACK_THRESHOLD) {
          const toAck = [...unackedPkts.current];
          unackedPkts.current = [];
          log(`State → send_ack_request_more (ack ${toAck.length} pkts)`);
          await bleRef.current!.requestHistoryPackets(BATCH_SIZE, toAck);
          stateTimer = performance.now();
          log("State → poll_measurements");
        }
      }

      if (unackedPkts.current.length > 0) {
        const remaining = [...unackedPkts.current];
        unackedPkts.current = [];
        log(`State → send_final_ack (ack ${remaining.length} pkts)`);
        try {
          await bleRef.current!.ackPackets(remaining);
        } catch (e: unknown) {
          log(`Final ack failed: ${(e as Error).message}`, "warn");
        }
      }

      const elapsed = Math.round(performance.now() - t0);
      setHistDownloadMs(elapsed);
      log(`History download complete — ${(elapsed / 1000).toFixed(1)}s`, "success");
    } catch (e: unknown) {
      log(`History download error: ${(e as Error).message}`, "error");
    } finally {
      setHistLoading(false);
    }
  }

  function clearHistory(): void {
    setHistory([]);
    seenIds.current.clear();
    histSubbed.current = false;
    unackedPkts.current = [];
    setHistDownloadMs(null);
  }

  async function readConfig(configId: ConfigItem): Promise<ConfigResult> {
    log(`Reading config ID ${configId.id} (${configId.label})…`);
    try {
      const v = await bleRef.current!.readConfig(configId.id);
      const bytes = [...new Uint8Array(v.buffer)].map(b => b.toString(16).padStart(2, "0")).join(" ");
      let decoded = "";
      try {
        if (configId.type === "string") {
          decoded = new TextDecoder().decode(v.buffer.slice(7));
        } else if (configId.type === "uint8") {
          decoded = String(v.getUint8(7));
        } else if (configId.type === "uint16") {
          decoded = v.getUint8(8) === 0
            ? String(v.getUint8(7))
            : String(v.getUint16(7, true));
        } else {
          decoded = String(v.getUint32(7, true));
        }
      } catch (_) { decoded = "(decode error)"; }

      log(`Config ${configId.id}: value = ${decoded}`, "success");
      return { success: true, message: decoded, raw: bytes };
    } catch (e: unknown) {
      log(`Config read error: ${(e as Error).message}`, "error");
      return { success: false, message: (e as Error).message, raw: null };
    }
  }

  return {
    bleRef,
    connected,
    connecting,
    deviceName,
    status,
    meta,
    buttonState,
    deviceInfo,
    logs,
    setLogs,
    log,
    connect,
    disconnect,
    refreshStatus,
    sendCommand,
    writeConfig,
    readConfig,
    history,
    histLoading,
    histDownloadMs,
    loadHistory,
    clearHistory,
  };
}
 