import { Card } from './Card';

export interface GraphPlaceholderProps {
  title: string;
}

export function GraphPlaceholder({ title , ...props}: GraphPlaceholderProps) {
  return (
    <Card className="min-h-[220px] flex flex-col items-center justify-center gap-3 border-dashed" {...props}>
      <span className="text-accent opacity-70">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      </span>
      <span className="text-sm font-semibold text-text">{title}</span>
      <span className="text-xs text-text-muted text-center max-w-[220px]">
        Awaiting data visualization integration
      </span>
    </Card>
  );
}
