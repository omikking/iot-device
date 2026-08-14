import { Btn, StatusDot, Badge } from "../ui";

interface HeaderProps {
  connected: boolean;
  connecting: boolean;
  deviceName: string | null;
  batteryMv: number | null;
  batteryStatus: number | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

const BATT_LABELS: Record<number, string> = {
  0: "Good",
  1: "Low",
  2: "Critical",
  3: "Charging",
  4: "Charged",
};

export default function Header({
  connected,
  connecting,
  deviceName,
  batteryMv,
  batteryStatus,
  onConnect,
  onDisconnect,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-[100] flex items-center justify-between px-7 py-3 shadow-sm bg-surface border-b border-border">
      <div className="flex items-center gap-3">
        <div>
          <div className="text-base font-extrabold tracking-tight text-text">Professor Application</div>
          <div className="text-[10px] font-medium tracking-[0.06em] text-text-faint">
            Sandvik TCSS · BLE configuration
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3.5 flex-wrap justify-end">
        {connected && batteryStatus !== null && (
          <Badge variant={batteryStatus >= 3 ? "success" : batteryStatus === 2 ? "error" : batteryStatus === 1 ? "warn" : "success"}>
            {batteryMv !== null ? `${batteryMv} mV · ` : ""}
            {BATT_LABELS[batteryStatus] ?? "?"}
          </Badge>
        )}

        {connected ? (
          <div className="flex items-center gap-2.5">
            <StatusDot ok />
            <span className="text-xs font-semibold text-text-muted max-w-[140px] truncate">{deviceName}</span>
            <Btn onClick={onDisconnect} danger small>
              Disconnect
            </Btn>
          </div>
        ) : (
          <Btn onClick={onConnect} disabled={connecting} small>
            {connecting ? "Connecting…" : "Connect"}
          </Btn>
        )}
      </div>
    </header>
  );
}
