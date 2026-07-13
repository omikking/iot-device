import { useState } from "react";
import { Card, SectionTitle, StatRow, Badge, Btn, StatusDot } from "../ui";
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
    try { await onRefresh(); } finally { setIsRefreshing(false); }
  };

  return (
    <>
      {!connected && (
        <Card>
          <div className="text-center px-6 py-12 text-text-muted">
            <div className="text-[52px] mb-4"></div>
            <div className="text-base font-bold mb-1.5 text-text">No device connected</div>
            <div className="text-[13px] text-text-faint">Click "Connect" to scan for SVK… devices via BLE</div>
          </div>
        </Card>
      )}

      {connected && status && (
        <div>
          <div className="mb-[14px] flex justify-end">
            <Btn onClick={handleRefresh} disabled={!connected || isRefreshing} small>
              {isRefreshing ? (
                <div className="flex items-center gap-1.5">
                  <span className="animate-spin inline-block">⏳</span>
                  Refreshing…
                </div>
              ) : "Refresh Status"}
            </Btn>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Card>
              <SectionTitle>Device Health (Service 0003, characteristics 0031)</SectionTitle>
              <StatRow label="Status" value={
                status.status === 0 ? "Good" : status.status === 1 ? "Non-Fatal Error" : "Fatal Error"
              } />
              <StatRow label="Battery"        value={`${status.batteryMv} mV`} />
              <StatRow label="Battery Status" value={["Good", "Low", "Critical"][status.batteryStatus] ?? "Unknown"} />
              <StatRow label="Temperature"    value={`${status.temperatureC} °C`} />
              <StatRow label="Device Time"    value={new Date(status.timestamp * 1000).toLocaleString()} />
              <StatRow label="Sensor Quality" value={status.lastSensorQuality} />
            </Card>

            <Card>
              <SectionTitle>Last Measurement</SectionTitle>
              <StatRow label="Distance"     value={`${status.lastDistanceMm} mm`} />
              <StatRow label="Gravity X"    value={`${status.lastGravity.x.toFixed(4)} G`} />
              <StatRow label="Gravity Y"    value={`${status.lastGravity.y.toFixed(4)} G`} />
              <StatRow label="Gravity Z"    value={`${status.lastGravity.z.toFixed(4)} G`} />
              <StatRow label="High Priority" value={status.lastGravity.highPriority ? "Yes" : "No"} />
            </Card>

            <Card className="col-span-2">
              <SectionTitle icon="⚠️">Fault Flags</SectionTitle>
              {status.faults.hasFaults ? (
                <div className="flex flex-wrap gap-2">
                  {status.faults.faults.map(f => (
                    <Badge key={f.bit} variant="error">Bit {f.bit}: {f.message}</Badge>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-success">
                  <StatusDot ok /> No faults detected
                </div>
              )}
            </Card>

            {meta && (
              <Card>
                <SectionTitle>Sample Storage (Service 0002, characteristics 0022)</SectionTitle>
                <StatRow label="Total Samples" value={meta.total} />
                <StatRow label="Not Uploaded"  value={meta.notUploaded} />
              </Card>
            )}
          </div>
        </div>
      )}
    </>
  );
}
