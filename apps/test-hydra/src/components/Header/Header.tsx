import { Btn, StatusDot } from "../ui";

interface HeaderProps {
  connected: boolean;
  connecting: boolean;
  deviceName: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function Header({
  connected,
  connecting,
  deviceName,
  onConnect,
  onDisconnect,
}: HeaderProps) {
  return (
    <div className="sticky top-0 z-[100] flex items-center justify-between px-7 py-3 shadow-sm bg-surface border-b border-border">
      <div>
        <div className="text-base font-extrabold tracking-tight text-text">Hydra Application</div>
        <div className="text-[10px] font-medium tracking-[0.06em] text-text-faint">
          Sandvik TCSS · Optic Sensing Datalogger
        </div>
      </div>

      <div className="flex items-center gap-3.5">
        {connected ? (
          <div className="flex items-center gap-2.5">
            <StatusDot ok />
            <span className="text-xs font-semibold text-text-muted">{deviceName}</span>
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
    </div>
  );
}
