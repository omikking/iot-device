import { useCallback, useState } from "react";
import { useProfessor } from "./hooks/useProfessor";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import Header from "./components/Header/Header";
import TabBar from "./components/TabBar/TabBar";
import StatusTab from "./components/tabs/StatusTab";
import CommandTab from "./components/tabs/CommandTab";
import ConfigTab from "./components/tabs/ConfigTab";
import LogTab from "./components/tabs/LogTab";
import DeviceInfoTab from "./components/tabs/DeviceInfoTab";
import type { TabId, CommandDef, CommandResponse, ConfigItem, ConfigResult } from "./types";

export default function App() {
  const prof = useProfessor();
  const isOnline = useNetworkStatus();
  const [tab, setTab] = useState<TabId>("status");

  const bleSupported = typeof navigator !== "undefined" && !!navigator.bluetooth;

  const handleReadConfig = useCallback(
    async (item: ConfigItem): Promise<ConfigResult> => prof.readConfig(item),
    [prof],
  );

  const handleWriteConfig = useCallback(
    async (item: ConfigItem, value: string): Promise<ConfigResult> => prof.writeConfig(item, value),
    [prof],
  );

  const handleSendCommand = useCallback(
    async (cmd: CommandDef, paramValue: string): Promise<CommandResponse | null> => {
      let param: number | null = null;
      if (cmd.param && cmd.param !== "auto") {
        const n = Number(paramValue);
        param = Number.isFinite(n) ? n : null;
      }
      return prof.sendCommand(cmd.code, param);
    },
    [prof],
  );

  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans text-text">
      <Header
        connected={prof.connected}
        connecting={prof.connecting}
        deviceName={prof.deviceName}
        batteryMv={prof.status?.batteryMv ?? null}
        batteryStatus={prof.status?.batteryStatus ?? null}
        onConnect={prof.connect}
        onDisconnect={prof.disconnect}
      />

      {!isOnline && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-600 text-sm font-medium py-2 px-4 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
          You are currently offline. Cached logs remain available.
        </div>
      )}

      <TabBar activeTab={tab} onTabChange={setTab} />

      <main className="flex-1 p-6 w-full max-w-[960px] mx-auto overflow-y-auto">
        {!bleSupported && (
          <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm text-center">
            Web Bluetooth is not supported in this browser. Use Chrome or Edge on desktop, or Chrome on
            Android.
          </div>
        )}

        {tab === "status" && (
          <StatusTab status={prof.status} onRefresh={prof.refreshStatus} />
        )}
        {tab === "commands" && (
          <CommandTab connected={prof.connected} onSendCommand={handleSendCommand} />
        )}
        {tab === "config" && (
          <ConfigTab
            connected={prof.connected}
            onReadConfig={handleReadConfig}
            onWriteConfig={handleWriteConfig}
          />
        )}
        {tab === "log" && <LogTab logs={prof.logs} onClear={prof.clearLog} />}
        {tab === "deviceinfo" && <DeviceInfoTab info={prof.deviceInfo} connected={prof.connected} />}
      </main>

      <PwaInstallPrompt />
    </div>
  );
}
