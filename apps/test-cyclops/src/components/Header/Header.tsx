import { Btn, StatusDot } from "../ui";

interface HeaderProps {
  connected: boolean;
  connecting: boolean;
  deviceName: string | null;
  buttonState: number;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function Header({ connected, connecting, deviceName, buttonState, onConnect, onDisconnect }: HeaderProps) {
  return (
    <div className="sticky top-0 z-[100] flex items-center justify-between px-7 py-3 shadow-sm bg-surface border-b border-border">
      <div className="flex items-center gap-3">
        <div>
          <div className="text-base font-extrabold tracking-tight text-text">
            Cyclops Application
          </div>
          <div className="text-[10px] font-medium tracking-[0.06em] text-text-faint" />
        </div>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-text-faint">BTN</span>
          <div
            className={`w-[18px] h-[18px] rounded-[4px] transition-all duration-200 ${
              buttonState === 1
                ? "bg-success border-[1.5px] border-success"
                : "bg-surface-alt border-[1.5px] border-border"
            }`}
          />
        </div>

        {connected ? (
          <div className="flex items-center gap-2.5">
            <StatusDot ok />
            <span className="text-xs font-semibold text-text-muted">{deviceName}</span>
            <Btn onClick={onDisconnect} danger small>Disconnect</Btn>
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
