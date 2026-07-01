import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-xl px-6 py-5 bg-surface border border-border shadow-card ${className}`}>
      {children}
    </div>
  );
}

interface SectionTitleProps {
  children: ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <span className="text-[13px] font-bold tracking-[0.02em] text-text font-sans block mb-[14px]">
      {children}
    </span>
  );
}

interface FieldProps {
  label: string;
  value: string;
  loading?: boolean;
}

export function Field({ label, value, loading }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-text-muted">{label}</span>
      <div className="rounded-lg border border-border bg-surface-alt px-3 py-2.5 min-h-[40px] flex items-center">
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-[spin_0.8s_linear_infinite]" />
        ) : (
          <span className="text-sm text-text font-mono">{value}</span>
        )}
      </div>
    </div>
  );
}

interface StyledSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  disabled?: boolean;
}

export function StyledSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: StyledSelectProps) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg px-[14px] py-[10px] text-[13px] outline-none font-mono bg-surface-alt border-[1.5px] border-border text-text focus:border-border-focus transition-colors duration-150 disabled:opacity-60"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface GraphPlaceholderProps {
  title: string;
}

export function GraphPlaceholder({ title }: GraphPlaceholderProps) {
  return (
    <Card className="min-h-[220px] flex flex-col items-center justify-center gap-3 border-dashed">
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
