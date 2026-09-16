import { useState, useRef, useCallback, useEffect } from "react";
import { saveToDB, loadFromDB } from "./useIndexedDB";
import { HydraBLE } from "../ble/hydraBle";
import { parseDeviceStatus, parseMeta, parseMeasurementChunk, hexDump, decodeConfigValue } from "../ble/hydraParser";
import { HydraMeasurementStream } from "../ble/hydraMeasurementParser";
import { formatCommandResponse } from "../constants/commands";
import {
  isInterrogatorConfigId,
  encodeInterrogatorInitString,
  decodeInterrogatorInitString,
} from "../ble/interrogatorText";
import type {
  DeviceInfo,
  DeviceStatus,
  MeasurementMeta,
  HydraMeasurementSample,
  LogEntry,
  LogType,
  CommandDef,
  CommandResponse,
  ConfigItem,
  ConfigResult,
} from "../types";

export function useHydra() {
  const bleRef = useRef<HydraBLE | null>(null);

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [meta, setMeta] = useState<MeasurementMeta | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const [history, setHistory] = useState<HydraMeasurementSample[]>([]);
  const [histLoading, setHistLoading] = useState(false);
  const [histDownloadMs, setHistDownloadMs] = useState<number | null>(null);
  const seenIds = useRef<Set<number>>(new Set());
  const histSubbed = useRef(false);
    const histDone = useRef(false);
  const pendingAckIds = useRef<number[]>([]);
  const measurementStream = useRef(new HydraMeasurementStream());
 
  const log = useCallback((msg: string, type: LogType = "info") => {
    setLogs((p) => [{ ts: Date.now(), msg, type }, ...p].slice(0, 200));
  }, []);

  useEffect(() => {
    async function loadData() {
      const cachedLogs = await loadFromDB<LogEntry[]>("logs");
      if (cachedLogs) setLogs(cachedLogs);
      const cachedHistory = await loadFromDB<HydraMeasurementSample[]>("history");
      if (cachedHistory) {
        setHistory(cachedHistory);
        cachedHistory.forEach((s) => {
          if (s.sampleId != null) seenIds.current.add(s.sampleId);
        });
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    saveToDB("logs", logs);
  }, [logs.length]);

  useEffect(() => {
    saveToDB("history", history);
  }, [history.length]);

  async function connect(): Promise<void> {
    setConnecting(true);
    log("Opening BLE device picker (SVK…)…");
    try {
      const ble = new HydraBLE();
      await ble.connect();
      bleRef.current = ble;

      seenIds.current.clear();
      histSubbed.current = false;
      histDone.current = false;
      pendingAckIds.current = [];
      measurementStream.current.reset();
      setHistory([]);

      setConnected(true);
      setDeviceName(ble.getDeviceName());
      log(`Connected to ${ble.getDeviceName()}`, "success");

      setStatus(parseDeviceStatus(await ble.readDeviceStatus()));
      setMeta(parseMeta(await ble.readMeta()));

      try {
        setDeviceInfo(await ble.readDeviceInfo());
        log("Device info read OK", "success");
      } catch {
        log("Device Information Service not available", "warn");
      }

      ble.subscribeMeasurementMeta((v) => setMeta(parseMeta(v)));
    } catch (e: unknown) {
      log(`Connection failed: ${e instanceof Error ? e.message : String(e)}`, "error");
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

  async function refreshStatus(): Promise<void> {
    try {
      const v = await bleRef.current!.readDeviceStatus();
      setStatus(parseDeviceStatus(v));
      setMeta(parseMeta(await bleRef.current!.readMeta()));
      log("Status refreshed", "success");
    } catch (e: unknown) {
      log(`Status read error: ${e instanceof Error ? e.message : String(e)}`, "error");
    }
  }

  async function sendCommand(
    selectedCmd: CommandDef,
    paramValue: string,
  ): Promise<CommandResponse | null> {
    const cmd = selectedCmd;
    if (
      cmd.code === 253 &&
      !window.confirm(
        "Clear Sample Non-Volatile Memory? This will erase all stored samples and may take up to 3 minutes.",
      )
    )
      return null;
    if (cmd.code === 254 && !window.confirm("Enter shipping mode? Device will enter deep sleep."))
      return null;
    if (cmd.code === 255 && !window.confirm("FACTORY RESET? Settings will be reset.")) return null;

    let param: number | null = null;
    if (cmd.param === "auto") {
      param = Math.floor(Date.now() / 1000);
    } else if (cmd.param && paramValue !== "") {
      param = parseInt(paramValue, 10);
      if (Number.isNaN(param)) {
        log(`Invalid parameter "${paramValue}"`, "error");
        return null;
      }
    }
    const waitForMeasurement = cmd.code === 2;
    const measurementPromise = waitForMeasurement
      ? bleRef.current!.waitForMeasurementNotification(20_000)
      : null;

    log(`Sending command ${cmd.code}: ${cmd.label}…`);
    try {
      const v = await bleRef.current!.sendCommand(cmd.code, param);
      if (cmd.code === 10) {
        log("Device disconnected (Cmd 10).", "warn");
        setConnected(false);
        setStatus(null);
        setMeta(null);
        return {
          code: 0,
          label: "Device disconnected",
          success: true,
          fields: [{ key: "Result", value: "Disconnect sent" }],
        };
      }

      const formatted = formatCommandResponse(cmd.code, v!);

      if (measurementPromise) {
        try {
          const m = await measurementPromise;
          const chunk = parseMeasurementChunk(m);
          const hex = hexDump(m);
          formatted.measurement = {
            byteLength: m.byteLength,
            hex,
            sampleId: chunk.sampleId,
          };
          formatted.fields.push(
            { key: "Measurement size", value: `${m.byteLength} bytes` },
            ...(chunk.sampleId != null
              ? [{ key: "Sample ID", value: chunk.sampleId }]
              : []),
          );
          log(`Measurement notification: ${m.byteLength} bytes`, "success");
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          formatted.fields.push({ key: "Measurement", value: `Not received: ${msg}` });
          log(`Measurement notification: ${msg}`, "warn");
        }
      }

      log(`Command ${cmd.code} → ${formatted.label}`, formatted.success ? "success" : "error");
      return formatted;
    } catch (e: unknown) {
      log(`Command error: ${e instanceof Error ? e.message : String(e)}`, "error");
      return {
        code: null,
        label: "Communication error",
        success: false,
        fields: [{ key: "Error", value: e instanceof Error ? e.message : String(e) }],
      };
    }
  }

  async function writeConfig(configId: ConfigItem, configVal: string): Promise<ConfigResult> {
    log(`Writing config ID ${configId.id} (${configId.label})`);
    try {
      let val: string | Uint8Array;
      if (configId.longConfig) {
        // Configs 28-30 send every space as CR (0x0d); everything else
        // (e.g. the 209-211 AtPKI blobs) is encoded verbatim.
        // HydraBLE.writeConfig() detects long-config IDs itself and runs
        // the §2.4 block-transfer protocol automatically.
        val = isInterrogatorConfigId(configId.id) ? encodeInterrogatorInitString(configVal) : configVal;
      } else if (configId.type === "string") {
        val = configVal;
      } else {
        const n = parseInt(configVal, 10);
        if (configId.type === "uint8") val = new Uint8Array([n]);
        else if (configId.type === "uint16") {
          const b = new Uint8Array(2);
          new DataView(b.buffer).setUint16(0, n, true);
          val = b;
        } else {
          const b = new Uint8Array(4);
          new DataView(b.buffer).setUint32(0, n, true);
          val = b;
        }
      }

      await bleRef.current!.writeConfig(configId.id, val);
      log(`Config ${configId.id} written`, "success");
      return { success: true, message: "Value written successfully", raw: null };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      log(`Config write error: ${msg}`, "error");
      return { success: false, message: msg, raw: null };
    }
  }

  async function readConfig(configId: ConfigItem): Promise<ConfigResult> {
    log(`Reading config ID ${configId.id} (${configId.label})…`);
    try {
      // HydraBLE.readConfig() detects long-config IDs itself and reassembles
      // the §2.4 block-transfer protocol automatically.
      const { data } = await bleRef.current!.readConfig(configId.id);
      const bytes = Array.from(data).map((b) => b.toString(16).padStart(2, "0")).join(" ");
      let decoded = "";
      try {
        decoded =
          configId.longConfig && isInterrogatorConfigId(configId.id)
            ? decodeInterrogatorInitString(data)
            : decodeConfigValue(configId, data);
      } catch (err) {
        decoded = "(decode error)";
      }
      log(`Config ${configId.id}: ${decoded}`, "success");
      return { success: true, message: decoded, raw: bytes };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      log(`Config read error: ${msg}`, "error");
      return { success: false, message: msg, raw: null };
    }
  }

    async function loadHistory(): Promise<void> {
      const BATCH = 8;
      const ACK_AT = 7;
      const TIMEOUT_MS = 15_000;

      setHistLoading(true);
      setHistDownloadMs(null);
      histDone.current = false;
      pendingAckIds.current = [];
      const t0 = performance.now();
      log("History → subscribe & request samples (cmd 5)");

      try {
        if (!histSubbed.current) {
          histSubbed.current = true;
          await bleRef.current!.subscribeMeasurementData((v) => {
            if (v.byteLength === 0) {
              histDone.current = true;
              log("History complete (zero-length notification)", "success");
              return;
            }
 
            const bytes = new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
            const newSamples = measurementStream.current.push(bytes);
            for (const sample of newSamples) {
              pendingAckIds.current.push(sample.sampleId);
              if (!seenIds.current.has(sample.sampleId)) {
                seenIds.current.add(sample.sampleId);
                setHistory((prev) => [...prev, sample]);
                log(`+sample id=${sample.sampleId} channels=${sample.channels.length}`, "info");
              }
            }
          });
        }

        await bleRef.current!.requestMeasurements(5, BATCH);
        let timer = performance.now();

        while (!histDone.current) {
          await new Promise((r) => setTimeout(r, 150));
          if (performance.now() - timer > TIMEOUT_MS) {
            log("History timeout — stopping", "warn");
            break;
          }
          if (pendingAckIds.current.length >= ACK_AT) {
            const ack = [...pendingAckIds.current];
            pendingAckIds.current = [];
            await bleRef.current!.requestMeasurements(4, BATCH, ack);
            timer = performance.now();
          }
        }

        setHistDownloadMs(Math.round(performance.now() - t0));
        log("History download finished", "success");
      } catch (e: unknown) {
        log(`History error: ${e instanceof Error ? e.message : String(e)}`, "error");
      } finally {
        setHistLoading(false);
      }
    }
 
    function clearHistory(): void {
      setHistory([]);
      seenIds.current.clear();
      histSubbed.current = false;
      histDone.current = false;
      pendingAckIds.current = [];
      measurementStream.current.reset();
      setHistDownloadMs(null);
    }
 
    return {
      connected,
      connecting,
      deviceName,
      status,
      meta,
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
 