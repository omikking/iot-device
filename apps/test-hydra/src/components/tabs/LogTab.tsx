import { Card, SectionTitle, Badge, Btn, LogLine } from "../ui";
import type { LogEntry } from "../../types";

interface LogTabProps {
  logs: LogEntry[];
  onClear: () => void;
}

export default function LogTab({ logs, onClear }: LogTabProps) {
  return (
    <Card>
      <div className="flex justify-between items-center mb-[14px]">
        <SectionTitle icon="">Event Log</SectionTitle>
        <div className="flex items-center gap-2">
          <Badge>{logs.length} entries</Badge>
          <Btn onClick={onClear} danger small>Clear</Btn>
        </div>
      </div>
      <div className="rounded-lg p-2 h-[540px] overflow-y-auto bg-surface-alt border border-border">
        {logs.length === 0 && (
          <div className="text-[13px] text-center p-10 text-text-faint">
            No events yet
          </div>
        )}
        {logs.map((e, i) => <LogLine key={i} entry={e} />)}
      </div>
    </Card>
  );
}
