import { useState, useEffect, useRef } from "react";
import { CONFIG_ITEMS } from "../../constants/commands";
import { Card, SectionTitle, Btn, StyledInput, Select } from "../ui";
import { getValidation } from "../../constants/validation";
import type { ConfigItem, ConfigResult } from "../../types";

const WIFI_KEY_OPTIONS = [
  { value: "0", label: "0 — NONE" },
  { value: "1", label: "1 — WEP" },
  { value: "2", label: "2 — WPA" },
  { value: "3", label: "3 — WPA2" },
  { value: "4", label: "4 — WPA-EAP" },
];

const EAP_PROTO_OPTIONS = [
  { value: "0", label: "0 — TLS" },
  { value: "1", label: "1 — PEAP" },
  { value: "2", label: "2 — TTLS" },
];

interface ConfigTabProps {
  connected: boolean;
  onWriteConfig: (configId: ConfigItem, configVal: string) => Promise<ConfigResult>;
  onReadConfig: (configId: ConfigItem) => Promise<ConfigResult>;
}

interface ConfigValueEntry {
  value: string | null;
  loading: boolean;
  error: boolean;
}

export default function ConfigTab({ connected, onWriteConfig, onReadConfig }: ConfigTabProps) {
  const [configId, setConfigId] = useState<ConfigItem>(CONFIG_ITEMS[0]);
  const [configVal, setConfigVal] = useState("");
  const [configResult, setConfigResult] = useState<ConfigResult | null>(null);
  const [configBusy, setConfigBusy] = useState(false);
  const [currentValues, setCurrentValues] = useState<Record<number, ConfigValueEntry>>({});
  const [readingAll, setReadingAll] = useState(false);
  const hasAutoRead = useRef(false);

  const validation = getValidation(configId.id, configVal);
  const inputInvalid = configVal !== "" && !validation.valid;
  const isEnumSelect = configId.id === 17 || configId.id === 18;

  async function readAllConfigs(): Promise<void> {
    if (!connected) return;
    setReadingAll(true);
    const readableItems = CONFIG_ITEMS.filter(c => !c.writeOnly);
    setCurrentValues(prev => {
      const next = { ...prev };
      readableItems.forEach(c => { next[c.id] = { value: null, loading: true, error: false }; });
      return next;
    });
    for (const item of readableItems) {
      try {
        const result = await onReadConfig(item);
        setCurrentValues(prev => ({
          ...prev,
          [item.id]: { value: result.success ? result.message : null, loading: false, error: !result.success },
        }));
      } catch {
        setCurrentValues(prev => ({ ...prev, [item.id]: { value: null, loading: false, error: true } }));
      }
    }
    setReadingAll(false);
  }

  useEffect(() => {
    if (connected && !hasAutoRead.current) { hasAutoRead.current = true; readAllConfigs(); }
    if (!connected) { hasAutoRead.current = false; setCurrentValues({}); }
  }, [connected]);

  async function doWriteConfig(): Promise<void> {
    if (!configVal || configBusy || configId.readOnly) return;
    setConfigBusy(true);
    setConfigResult(null);
    const result = await onWriteConfig(configId, configVal);
    setConfigResult(result);
    setConfigBusy(false);
    if (result.success && !configId.writeOnly) {
      try {
        const readResult = await onReadConfig(configId);
        setCurrentValues(prev => ({
          ...prev,
          [configId.id]: { value: readResult.success ? readResult.message : null, loading: false, error: !readResult.success },
        }));
      } catch { 
        
      }
    }
  }

  async function doReadConfig(): Promise<void> {
    if (configBusy) return;
    setConfigBusy(true);
    setConfigResult(null);
    const result = await onReadConfig(configId);
    setConfigResult(result);
    setConfigBusy(false);
    if (!configId.writeOnly) {
      setCurrentValues(prev => ({
        ...prev,
        [configId.id]: { value: result.success ? result.message : null, loading: false, error: !result.success },
      }));
    }
  }

  function renderCurrentValue(c: ConfigItem) {
    if (c.writeOnly) return <span className="text-[10px] italic text-text-faint">write-only</span>;
    if (c.readOnly) return <span className="text-[10px] italic text-text-faint">read-only</span>;
    const entry = currentValues[c.id];
    if (!entry) return <span className="text-[10px] text-text-faint">—</span>;
    if (entry.loading) return <span className="inline-block animate-spin max-w-4 text-accent">⏳</span>;
    if (entry.error) return <span className="text-[10px] font-semibold text-[#b91c1c]">✗ error</span>;
    const display =
      entry.value && entry.value.length > 24 ? `${entry.value.slice(0, 24)}…` : entry.value;
    return <span className="text-[11px] font-semibold text-[#15803d] font-mono">{display}</span>;
  }

  return (
    <div className="grid gap-5">

      {/* ── Read / Write Card ───────────────────────────────────────────── */}
      <Card>
        <SectionTitle>Configuration Read / Write</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px] mb-4">
          {/* Config item selector */}
          <div>
            <label className="block text-[11px] font-semibold mb-1.5 tracking-[0.04em] text-text-faint">
              CONFIG ITEM
            </label>
            <select
              value={configId.id}
              onChange={e => {
                const item = CONFIG_ITEMS.find(c => c.id === Number(e.target.value))!;
                setConfigId(item);
                setConfigVal("");
                setConfigResult(null);
              }}
              className="w-full rounded-lg px-[14px] py-[10px] text-[13px] font-medium cursor-pointer outline-none bg-surface-alt border-[1.5px] border-border text-text font-sans"
            >
              {CONFIG_ITEMS.map(c => (
                <option key={c.id} value={c.id}>ID {c.id} — {c.label} ({c.type})</option>
              ))}
            </select>
          </div>

          {/* Value input */}
          <div>
            <label className="block text-[11px] font-semibold mb-1.5 tracking-[0.04em] text-text-faint">
              VALUE ({configId.type}) — default: {String(configId.default)}
            </label>
            {isEnumSelect ? (
              <Select
                value={configVal}
                onChange={(e) => setConfigVal(e.target.value)}
                options={configId.id === 17 ? WIFI_KEY_OPTIONS : EAP_PROTO_OPTIONS}
                disabled={configId.readOnly}
              />
            ) : (
              <StyledInput
                type="text"
                placeholder={
                  configId.type === "uint8[]"
                    ? "hex bytes e.g. 3082010a…"
                    : `e.g. ${configId.default}`
                }
                value={configVal}
                onChange={(e) => setConfigVal(e.target.value)}
                readOnly={configId.readOnly}
              />
            )}
            {inputInvalid && validation.error && (
              <p className="mt-1 text-[11px] font-medium text-error">{validation.error}</p>
            )}
          </div>
        </div>

        {/* Info banner */}
        <div className="rounded-lg px-[14px] py-[10px] mb-4 text-xs font-medium leading-[1.5] bg-info-bg border border-[#bfdbfe] text-[#1e40af]">
          <strong>ID {configId.id}</strong> · {configId.label} · type: <span className="font-mono">{configId.type}</span> · default: <span className="font-mono">{configId.default}</span>
          {configId.readOnly && (
            <div className="mt-1.5 font-bold text-warn">Read-only — Write disabled</div>
          )}
          {configId.longConfig && (
            <div className="mt-1.5 font-bold text-accent">Long config — uses block transfer</div>
          )}
          {configId.writeOnly && (
            <div className="mt-1.5 font-bold text-warn">⚠ Write-Only — Read disabled</div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5">
          <Btn
            onClick={doWriteConfig}
            disabled={!connected || configBusy || !configVal || inputInvalid || configId.readOnly}
            className="bg-[#0f4c81] hover:bg-[#0d3d6b]"
          >
            {configBusy ? "Writing…" : "Write Config"}
          </Btn>
          <Btn
            onClick={doReadConfig}
            disabled={!connected || configBusy || configId.writeOnly}
            className="bg-[#134e4a] hover:bg-[#0f3d39]"
          >
            {configBusy ? "Reading…" : "Read Config"}
          </Btn>
        </div>

        {/* Result display */}
        {configResult && (
          <div className={`mt-4 rounded-lg overflow-hidden border-[1.5px] ${configResult.success ? "border-[#86efac]" : "border-[#fca5a5]"}`}>
            <div className={`flex items-center gap-2.5 px-4 py-[10px] ${configResult.success ? "bg-success-bg" : "bg-error-bg"} ${configResult.raw ? `border-b ${configResult.success ? "border-[#86efac]" : "border-[#fca5a5]"}` : ""}`}>
              <div>
                <span className={`text-[13px] font-bold mr-[5px] ${configResult.success ? "text-[#15803d]" : "text-[#b91c1c]"}`}>
                  {configResult.success ? "Value" : "Error"}
                </span>:
                <span className={`text-[13px] font-semibold ml-[5px] font-mono ${configResult.success ? "text-[#166534]" : "text-[#991b1b]"}`}>
                  {configResult.message}
                </span>
              </div>
            </div>
            {configResult.raw && (
              <div className="px-4 py-[10px] text-[11px] break-all leading-[1.7] bg-surface-alt font-mono text-text-muted">
                <span className="font-semibold mr-2 text-text-faint">RAW:</span>
                {configResult.raw}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* ── All config items reference table ────────────────────────────── */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <SectionTitle>All Configuration Items</SectionTitle>
          <Btn
            onClick={readAllConfigs}
            disabled={!connected || readingAll}
            className="bg-[#0f4c81] hover:bg-[#0d3d6b]"
          >
            {readingAll ? "⏳ Reading All…" : "🔄 Refresh All Values"}
          </Btn>
        </div>

        <div className="rounded-lg overflow-hidden border border-border">
          {/* Table header */}
          <div
            className="grid px-4 py-2 text-[10px] font-bold tracking-[0.06em] bg-surface-alt text-text-faint border-b border-border"
            style={{ gridTemplateColumns: "50px 1fr 80px 100px 120px" }}
          >
            <span>ID</span><span>LABEL</span><span>TYPE</span><span>DEFAULT</span><span>CURRENT VALUE</span>
          </div>

          {/* Table rows */}
          {CONFIG_ITEMS.map((c, i) => (
            <div
              key={c.id}
              onClick={() => { setConfigId(c); setConfigVal(""); setConfigResult(null); }}
              className={`
                grid px-4 py-[9px] text-xs cursor-pointer transition-colors duration-100
                ${i < CONFIG_ITEMS.length - 1 ? "border-b border-border" : ""}
                ${configId.id === c.id
                  ? "bg-info-bg border-l-[3px] border-l-accent"
                  : `border-l-[3px] border-l-transparent hover:bg-[#e0f2fe] ${i % 2 === 0 ? "bg-surface" : "bg-surface-alt"}`
                }
              `}
              style={{ gridTemplateColumns: "50px 1fr 80px 100px 120px" }}
            >
              <span className="font-bold text-accent font-mono">{c.id}</span>
              <span className="text-text">{c.label}</span>
              <span className="text-[11px] text-text-faint font-mono">{c.type}</span>
              <span className="text-[11px] text-text-muted font-mono">{String(c.default)}</span>
              {renderCurrentValue(c)}
            </div>
          ))}
        </div>

        <div className="mt-3 text-[11px] leading-[1.7] text-text-faint">
          Click any row to select it. Write-only items (IDs 4, 16, 210) cannot be read back. Read-only
          items (IDs 0, 130) cannot be written. IDs 1, 6, 129 are preserved across factory reset.
          {connected && !readingAll && Object.keys(currentValues).length > 0 && (
            <span className="text-[#15803d] font-semibold"> · ✓ Current values loaded</span>
          )}
          {readingAll && (
            <span className="text-accent font-semibold"> · ⏳ Reading values from device…</span>
          )}
        </div>
      </Card>
    </div>
  );
}
