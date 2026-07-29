import type { TabId } from "../../types";

interface TabDef {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: TabDef[] = [
  { id: "status",   label: "Status",        icon: "" },
  { id: "advanced", label: "Commands",      icon: "" },
  { id: "history",  label: "History",       icon: "" },
  { id: "config",   label: "Configuration", icon: "" },
  { id: "deviceinfo", label: "Device Info",   icon: "" },
  { id: "log",        label: "Log",           icon: "📋" },
];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex gap-0.5 px-6 bg-surface border-b border-border">
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onTabChange(t.id)}
          className={`
            flex items-center gap-[7px] px-[18px] py-[11px] text-[13px] font-semibold
            whitespace-nowrap cursor-pointer border-none transition-all duration-150 font-sans
            border-b-2
            ${activeTab === t.id
              ? "bg-bg text-accent border-accent"
              : "bg-transparent text-text-muted border-transparent"
            }
          `}
        >
          <span className="text-[15px]">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}
