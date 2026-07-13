import { useState } from "react";
import { useHydra } from "./hooks/useHydra";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import Header from "./components/Header/Header";
import TabBar from "./components/TabBar/TabBar";
import StatusTab from "./components/tabs/StatusTab";
import HistoryTab from "./components/tabs/HistoryTab";
import CommandTab from "./components/tabs/CommandTab";
import ConfigTab from "./components/tabs/ConfigTab";
import LogTab from "./components/tabs/LogTab";
import DeviceInfoTab from "./components/tabs/DeviceInfoTab";
import type { TabId, CommandDef, CommandResponse, ConfigItem, ConfigResult } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("status");
  const isOnline = useNetworkStatus();

  const {
    connected,
    connecting,
    deviceName,
    status,
    meta,
    deviceInfo,
    logs,
    setLogs,
    connect,
    disconnect,
    refreshStatus,
    sendCommand,
    writeConfig,
    readConfig,
    history,
    histLoading,
    histDownloadMs,
    loadHistory,
  } = useHydra();

  const [cmdBusy, setCmdBusy] = useState(false);
  const [configBusy, setConfigBusy] = useState(false);

  async function handleSendCommand(
    selectedCmd: CommandDef,
    paramValue: string,
  ): Promise<CommandResponse | null> {
    setCmdBusy(true);
    const result = await sendCommand(selectedCmd, paramValue);
    setCmdBusy(false);
    return result;
  }

  async function handleWriteConfig(configId: ConfigItem, configVal: string): Promise<ConfigResult> {
    setConfigBusy(true);
    const result = await writeConfig(configId, configVal);
    setConfigBusy(false);
    return result;
  }

  async function handleReadConfig(configId: ConfigItem): Promise<ConfigResult> {
    setConfigBusy(true);
    const result = await readConfig(configId);
    setConfigBusy(false);
    return result;
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans text-text">
      <Header
        connected={connected}
        connecting={connecting}
        deviceName={deviceName}
        onConnect={connect}
        onDisconnect={disconnect}
      />

      {!isOnline && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-500 text-sm font-medium py-2 px-4 flex items-center justify-center gap-2">
          You are currently offline. Using cached data.
        </div>
      )}

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 p-6 w-full max-w-[960px] mx-auto grid gap-5">
        {activeTab === "status" && (
          <StatusTab connected={connected} status={status} meta={meta} onRefresh={refreshStatus} />
        )}
        {activeTab === "history" && (
          <HistoryTab
            connected={connected}
            meta={meta}
            history={history}
            histLoading={histLoading}
            histDownloadMs={histDownloadMs}
            onLoadHistory={loadHistory}
          />
        )}
        {activeTab === "advanced" && (
          <CommandTab connected={connected} onSendCommand={handleSendCommand} />
        )}
        {activeTab === "config" && (
          <ConfigTab
            connected={connected}
            onWriteConfig={handleWriteConfig}
            onReadConfig={handleReadConfig}
          />
        )}
        {activeTab === "log" && <LogTab logs={logs} onClear={() => setLogs([])} />}
        {activeTab === "deviceinfo" && (
          <DeviceInfoTab connected={connected} deviceInfo={deviceInfo} />
        )}

        {(cmdBusy || configBusy) && (
          <div className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 rounded-[10px] text-xs font-semibold shadow-card bg-surface border border-border text-accent">
            <span className="animate-spin inline-block">⏳</span>
            {configBusy ? "Config operation…" : "Sending command…"}
          </div>
        )}
      </div>
      <PwaInstallPrompt />
    </div>
  );
}
