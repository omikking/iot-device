import React from "react";
import { Card, Badge, Btn, StatRow } from "../ui";
import type { ProfessorStatus } from "../../types";

const BATT_LABELS: Record<number, string> = {
  0: "Good",
  1: "Low",
  2: "Critical",
  3: "Charging",
  4: "Charged",
};

interface StatusTabProps {
  status: ProfessorStatus | null;
  onRefresh: () => void;
}

function fmtTime(epoch: number): string {
  if (epoch === 0) return "Not set";
  return new Date(epoch * 1000).toLocaleString();
}

export default function StatusTab({ status, onRefresh }: StatusTabProps) {
  if (!status)
    return (
      <div className="p-6 text-center text-text-muted">
        No status available — connect to a Professor first.
      </div>
    );

  return (
    <div className="p-4 space-y-4 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-text">Device Status</h2>
        <Btn small onClick={onRefresh}>
          Refresh Status
        </Btn>
      </div>

      <Card>
        <StatRow
          label="Status Flags"
          value={
            <div className="flex gap-2">
              <Badge variant={status.dataInFifo ? "warn" : "success"}>
                FIFO: {status.dataInFifo ? "Data queued" : "Empty"}
              </Badge>
              <Badge variant={status.wifiConnected ? "success" : "error"}>
                Wi-Fi: {status.wifiConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          }
        />
        <StatRow
          label="Battery"
          value={`${status.batteryMv} mV — ${BATT_LABELS[status.batteryStatus] ?? "Unknown"}`}
        />
        <StatRow label="Device Time" value={fmtTime(status.timestamp)} />
      </Card>

      {status.errors.length > 0 && (
        <Card className="border-red-500/40">
          <h3 className="text-sm font-semibold text-red-400 mb-2">Active Errors</h3>
          <div className="space-y-1">
            {status.errors.map((e) => (
              <div
                key={e.bit}
                className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300"
              >
                <span className="font-mono opacity-60">Bit {e.bit}</span>
                <span>{e.message}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {status.errors.length === 0 && (
        <Card className="border-green-500/30">
          <p className="text-sm text-green-400 text-center">No errors reported</p>
        </Card>
      )}
    </div>
  );
}
