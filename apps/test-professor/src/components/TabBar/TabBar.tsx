import type { TabId } from "../../types";

interface TabDef {
  id: TabId;
  label: string;
}

const TABS: TabDef[] = [
  { id: "status", label: "Status" },
  { id: "config", label: "Configuration" },
  { id: "commands", label: "Commands" },
  { id: "deviceinfo", label: "Device Info" },
  { id: "log", label: "Log" },
];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex gap-0.5 px-6 bg-surface border-b border-border overflow-x-auto">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onTabChange(t.id)}
          className={`
            flex items-center gap-[7px] px-[18px] py-[11px] text-[13px] font-semibold
            whitespace-nowrap border-none transition-all duration-150 font-sans cursor-pointer
            border-b-2
            ${
              activeTab === t.id
                ? "bg-bg text-accent border-accent"
                : "bg-transparent text-text-muted border-transparent hover:text-text"
            }
          `}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
