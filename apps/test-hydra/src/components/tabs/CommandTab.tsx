import { useState } from "react";
import { COMMANDS } from "../../constants/commands";
import { Card, SectionTitle, Btn, StyledInput } from "../ui";
import type { CommandDef, CommandResponse } from "../../types";

interface CommandTabProps {
  connected: boolean;
  onSendCommand: (cmd: CommandDef, paramValue: string) => Promise<CommandResponse | null>;
}

export default function CommandTab({ connected, onSendCommand }: CommandTabProps) {
  const [selectedCmd, setSelectedCmd] = useState<CommandDef>(COMMANDS[0]);
  const [paramValue, setParamValue] = useState("");
  const [cmdBusy, setCmdBusy] = useState(false);
  const [cmdResponse, setCmdResponse] = useState<CommandResponse | null>(null);

  const needsParam = selectedCmd.param && selectedCmd.param !== "auto";
  const isDanger = [254, 255].includes(selectedCmd.code);

  async function doSendCommand(): Promise<void> {
    if (cmdBusy) return;
    setCmdBusy(true);
    setCmdResponse(null);
    const result = await onSendCommand(selectedCmd, paramValue);
    if (result) setCmdResponse(result);
    setCmdBusy(false);
  }

  return (
    <div className="grid gap-5">
      <Card>
        <SectionTitle>Send Command</SectionTitle>

        <div className="mb-4">
          <label className="block text-[11px] font-semibold mb-1.5 tracking-[0.04em] text-text-faint">
            SELECT COMMAND
          </label>
          <select
            value={selectedCmd.code}
            onChange={e => {
              const cmd = COMMANDS.find(c => c.code === Number(e.target.value))!;
              setSelectedCmd(cmd);
              setParamValue("");
              setCmdResponse(null);
            }}
            className="w-full rounded-lg px-[14px] py-[10px] text-[13px] font-medium cursor-pointer outline-none bg-surface-alt border-[1.5px] border-border text-text font-sans"
          >
            {COMMANDS.map(c => (
              <option key={c.code} value={c.code}>
                Cmd {c.code} — {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-lg px-4 py-3 mb-4 text-xs font-medium leading-relaxed bg-info-bg border border-[#bfdbfe] text-[#1e40af]">
          {selectedCmd.description}
        </div>

        {needsParam && (
          <div className="mb-4">
            <label className="block text-[11px] font-semibold mb-1.5 tracking-[0.04em] text-text-faint">
              PARAMETER ({selectedCmd.param === "ms" ? "milliseconds" : selectedCmd.param === "seq" ? "0 = blue, 1 = green" : "uint32"})
            </label>
            <StyledInput
              type="number"
              placeholder={selectedCmd.param === "ms" ? "e.g. 5000" : selectedCmd.param === "seq" ? "0 or 1" : "value"}
              value={paramValue}
              onChange={e => setParamValue(e.target.value)}
            />
          </div>
        )}

        {selectedCmd.param === "auto" && (
          <div className="rounded-lg px-[14px] py-[10px] mb-4 text-xs bg-surface-alt text-text-muted font-mono">
            Auto-parameter: {Math.floor(Date.now() / 1000)} ({new Date().toLocaleString()})
          </div>
        )}

        <Btn
          onClick={doSendCommand}
          disabled={!connected || cmdBusy || (!!needsParam && paramValue === "")}
          danger={isDanger}
        >
          {cmdBusy ? "Sending…" : isDanger ? `⚠ Send Cmd ${selectedCmd.code}` : "Send Command"}
        </Btn>
      </Card>

      {cmdResponse && (
        <Card className={`border-[1.5px] ${cmdResponse.success ? "border-[#bbf7d0]" : "border-[#fecaca]"}`}>
          <SectionTitle>Command Response</SectionTitle>

          <div className={`flex items-center gap-2.5 rounded-lg px-4 py-3 mb-4 border ${
            cmdResponse.success
              ? "bg-success-bg border-[#86efac]"
              : "bg-error-bg border-[#fca5a5]"
          }`}>
            <span className="text-[22px]">{cmdResponse.success ? "✅" : "❌"}</span>
            <div>
              <div className={`text-sm font-bold ${cmdResponse.success ? "text-[#15803d]" : "text-[#b91c1c]"}`} />
              <div className={`text-[11px] font-mono ${cmdResponse.success ? "text-[#166534]" : "text-[#991b1b]"}`}>
                Result code: {cmdResponse.code}
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-border">
            {cmdResponse.fields.map((f, i) => (
              <div
                key={f.key}
                className={`flex justify-between items-center px-4 py-2.5 ${
                  i % 2 === 0 ? "bg-surface" : "bg-surface-alt"
                } ${i < cmdResponse.fields.length - 1 ? "border-b border-border" : ""}`}
              >
                <span className="text-xs font-semibold text-text-muted">{f.key}</span>
                <span className="text-xs font-medium max-w-[60%] break-all text-right text-text font-mono">
                  {f.value}
                </span>
              </div>
            ))}
          </div>

          {cmdResponse.measurement && (
            <div className="mt-4 rounded-lg overflow-hidden border border-[#bfdbfe]">
              <div className="px-4 py-2.5 bg-info-bg border-b border-[#bfdbfe] flex justify-between items-center gap-2">
                <span className="text-xs font-bold text-[#1e40af]">
                  Measurement notification (0023)
                </span>
                <span className="text-[11px] font-mono text-text-muted">
                  {cmdResponse.measurement.byteLength} bytes
                  {cmdResponse.measurement.sampleId != null &&
                    ` · sample ${cmdResponse.measurement.sampleId}`}
                </span>
              </div>
              <div className="px-4 py-3 max-h-48 overflow-y-auto text-[11px] leading-[1.7] bg-surface-alt font-mono text-text-muted break-all">
                {cmdResponse.measurement.hex}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
