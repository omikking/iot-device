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

  const needsParam = Boolean(selectedCmd.param && selectedCmd.param !== "auto");
  const isDanger = selectedCmd.code === 255;

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
        <SectionTitle>Send command</SectionTitle>

        <div className="mb-4">
          <label className="block text-[11px] font-semibold mb-1.5 tracking-[0.04em] text-text-faint">
            SELECT COMMAND
          </label>
          <select
            value={selectedCmd.code}
            onChange={(e) => {
              const cmd = COMMANDS.find((c) => c.code === Number(e.target.value))!;
              setSelectedCmd(cmd);
              setParamValue("");
              setCmdResponse(null);
            }}
            className="w-full rounded-lg px-[14px] py-[10px] text-[13px] font-medium cursor-pointer outline-none bg-surface-alt border-[1.5px] border-border text-text font-sans"
          >
            {COMMANDS.map((c) => (
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
              PARAMETER (uint32)
            </label>
            <StyledInput
              type="number"
              placeholder="e.g. Unix timestamp"
              value={paramValue}
              onChange={(e) => setParamValue(e.target.value)}
            />
          </div>
        )}

        {selectedCmd.param === "auto" && (
          <div className="rounded-lg px-[14px] py-[10px] mb-4 text-xs bg-surface-alt text-text-muted font-mono">
            Auto-parameter (Set time): {Math.floor(Date.now() / 1000)} ({new Date().toLocaleString()})
          </div>
        )}

        <Btn
          onClick={doSendCommand}
          disabled={!connected || cmdBusy || (!!needsParam && paramValue === "")}
          danger={isDanger}
        >
          {cmdBusy ? "Sending…" : isDanger ? `⚠ Send cmd ${selectedCmd.code}` : "Send command"}
        </Btn>
      </Card>

      {cmdResponse && (
        <Card
          className={`border-[1.5px] ${cmdResponse.success ? "border-[#bbf7d0]" : "border-[#fecaca]"}`}
        >
          <SectionTitle>Command response</SectionTitle>

          <div
            className={`flex items-center gap-2.5 rounded-lg px-4 py-3 mb-4 border ${
              cmdResponse.success
                ? "bg-success-bg border-[#86efac]"
                : "bg-error-bg border-[#fca5a5]"
            }`}
          >
            <span className="text-[22px]">{cmdResponse.success ? "✅" : "❌"}</span>
            <div>
              <div
                className={`text-sm font-bold ${cmdResponse.success ? "text-[#15803d]" : "text-[#b91c1c]"}`}
              >
                {cmdResponse.label}
              </div>
              <div
                className={`text-[11px] font-mono ${cmdResponse.success ? "text-[#166534]" : "text-[#991b1b]"}`}
              >
                Result code: {cmdResponse.code}
              </div>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-border">
            {cmdResponse.fields.map((f, i) => (
              <div
                key={f.key}
                className={`flex justify-between items-center px-4 py-2.5 gap-3 ${
                  i % 2 === 0 ? "bg-surface" : "bg-surface-alt"
                } ${i < cmdResponse.fields.length - 1 ? "border-b border-border" : ""}`}
              >
                <span className="text-xs font-semibold text-text-muted shrink-0">{f.key}</span>
                <span className="text-xs font-medium max-w-[60%] break-all text-right text-text font-mono">
                  {String(f.value)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <SectionTitle>Command reference</SectionTitle>
        <p className="text-[12px] text-text-muted mb-3">
          All Professor commands (GATT §5.4.2, characteristic 0122). Use the dropdown above to execute.
        </p>
        <div className="rounded-lg overflow-hidden border border-border">
          <table className="w-full text-left text-[12px]">
            <thead>
              <tr className="bg-surface-alt border-b border-border">
                <th className="px-3 py-2 font-semibold text-text-muted">Code</th>
                <th className="px-3 py-2 font-semibold text-text-muted">Name</th>
                <th className="px-3 py-2 font-semibold text-text-muted">Parameter</th>
                <th className="px-3 py-2 font-semibold text-text-muted hidden sm:table-cell">Description</th>
              </tr>
            </thead>
            <tbody>
              {COMMANDS.map((c, i) => (
                <tr
                  key={c.code}
                  className={i % 2 === 0 ? "bg-surface" : "bg-bg"}
                >
                  <td className="px-3 py-2 font-mono font-semibold text-accent">{c.code}</td>
                  <td className="px-3 py-2 font-medium text-text">{c.label}</td>
                  <td className="px-3 py-2 text-text-muted font-mono">
                    {c.param === null ? "—" : c.param === "auto" ? "Auto (browser time)" : c.param}
                  </td>
                  <td className="px-3 py-2 text-text-muted hidden sm:table-cell">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
