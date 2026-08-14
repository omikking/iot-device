import { useState } from "react";
import { Card, SectionTitle, StatRow, Badge, Btn, StatusDot } from "../ui";
import { batteryStatusLabel } from "../../ble/hydraParser";
import type { DeviceStatus, MeasurementMeta } from "../../types";

interface StatusTabProps {
  connected: boolean;
  status: DeviceStatus | null;
  meta: MeasurementMeta | null;
  onRefresh: () => Promise<void>;
}

export default function StatusTab({ connected, status, meta, onRefresh }: StatusTabProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      {!connected && (
        <Card>
          <div className="text-center px-6 py-12 text-text-muted">
            <div className="text-base font-bold mb-1.5 text-text">No device connected</div>
            <div className="text-[13px] text-text-faint">
              Click Connect to pair with SVK… Hydra devices
            </div>
          </div>
        </Card>
      )}

      {connected && status && (
        <div>
          <div className="mb-[14px] flex justify-end">
            <Btn onClick={handleRefresh} disabled={!connected || isRefreshing} small>
              {isRefreshing ? "Refreshing…" : "Refresh Status"}
            </Btn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card>
              <SectionTitle>Device Health</SectionTitle>
              <StatRow
                label="Status"
                value={
                  status.status === 0
                    ? "Good"
                    : status.status === 1
                      ? "Non-Fatal Error"
                      : "Fatal Error"
                }
              />
              <StatRow label="Battery" value={`${status.batteryMv} mV`} />
              <StatRow label="Battery Status" value={batteryStatusLabel(status.batteryStatus)} />
              <StatRow
                label="Device Time"
                value={new Date(status.timestamp * 1000).toLocaleString()}
              />
            </Card>

            <Card className="md:col-span-1">
              <SectionTitle icon="⚠️">Fault Flags</SectionTitle>
              {status.faults.hasFaults ? (
                <div className="flex flex-wrap gap-2">
                  {status.faults.faults.map((f) => (
                    <Badge key={f.bit} variant="error">
                      Bit {f.bit}: {f.message}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-success">
                  <StatusDot ok /> No faults detected
                </div>
              )}
            </Card>

            {meta && (
              <Card className="md:col-span-2">
                <SectionTitle>Sample Storage </SectionTitle>
                <StatRow label="Total Samples" value={meta.total} />
                <StatRow label="Not Uploaded" value={meta.notUploaded} />
                <StatRow label="Total Sectors" value={meta.totalSectors} />
                <StatRow label="Unused Sectors" value={meta.unusedSectors} />
              </Card>
            )}
          </div>
        </div>
      )}
    </>
  );
}
