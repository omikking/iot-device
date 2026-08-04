import type { ChangeEvent, ReactNode, ReactElement } from "react";
import type { LogEntry, LogType } from "../../types";

// ─── Card ────────────────────────────────────────────────────────────────────

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl px-6 py-5 bg-surface border border-border shadow-card ${className}`}>
      {children}
    </div>
  );
}

// ─── SectionTitle ────────────────────────────────────────────────────────────

export function SectionTitle({ children, icon }: { children: ReactNode; icon?: string }) {
  return (
    <div className="flex items-center gap-2 mb-[14px]">
      {icon !== undefined && icon !== "" && <span className="text-[18px]">{icon}</span>}
      <span className="text-[13px] font-bold tracking-[0.02em] text-text font-sans">{children}</span>
    </div>
  );
}

// ─── StatRow ─────────────────────────────────────────────────────────────────

export function StatRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex justify-between items-center gap-3 py-2 border-b border-surface-alt last:border-0">
      <span className="text-[13px] text-text-muted font-sans shrink-0">{label}</span>
      <span className="text-[13px] font-semibold text-text font-mono text-right min-w-0">
        {value}
      </span>
    </div>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────────────────

export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "error" | "warn" | "accent";
}) {
  const variants = {
    default: "bg-surface-alt text-text-muted",
    success: "bg-success-bg text-success",
    error: "bg-error-bg text-error",
    warn: "bg-warn-bg text-warn",
    accent: "bg-info-bg text-accent",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md text-[11px] font-semibold px-2.5 py-[3px] font-mono ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

// ─── Btn (matches Cyclops) ───────────────────────────────────────────────────

export function Btn({
  children,
  onClick,
  disabled,
  small,
  danger,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
  danger?: boolean;
  className?: string;
}) {
  const base =
    "flex items-center justify-center gap-1.5 border-none font-semibold whitespace-nowrap transition-all duration-150 font-sans cursor-pointer rounded-lg";
  const size = small ? "px-[14px] py-[7px] text-xs" : "px-5 py-[10px] text-[13px]";
  const color = danger
    ? "bg-danger-btn hover:bg-danger-hover text-white"
    : "bg-accent hover:bg-accent-hover text-white";
  const disabledCls = "bg-surface-alt text-text-faint cursor-not-allowed hover:bg-surface-alt";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${size} ${disabled ? disabledCls : color} ${className}`}
    >
      {children}
    </button>
  );
}

// ─── StatusDot ───────────────────────────────────────────────────────────────

export function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block w-[9px] h-[9px] rounded-full ${
        ok ? "bg-success shadow-[0_0_6px_var(--color-success)]" : "bg-error shadow-[0_0_6px_var(--color-error)]"
      }`}
    />
  );
}

// ─── LogLine ─────────────────────────────────────────────────────────────────

export function LogLine({ entry }: { entry: LogEntry }) {
  const styles: Record<LogType, string> = {
    info: "bg-info-bg text-accent",
    success: "bg-success-bg text-success",
    error: "bg-error-bg text-error",
    warn: "bg-warn-bg text-warn",
    raw: "bg-[#f5f3ff] text-[#7c3aed]",
  };

  return (
    <div className={`flex gap-2.5 items-start px-2.5 py-1.5 rounded-md mb-0.5 ${styles[entry.type]}`}>
      <span className="text-[10px] whitespace-nowrap min-w-[72px] pt-0.5 text-text-faint font-mono">
        {new Date(entry.ts).toLocaleTimeString()}
      </span>
      <span className="text-xs break-all leading-[1.5] font-mono">{entry.msg}</span>
    </div>
  );
}

// ─── StyledInput ─────────────────────────────────────────────────────────────

export function StyledInput({
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly,
  className = "",
}: {
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={`w-full rounded-lg px-[14px] py-[10px] text-[13px] outline-none font-mono bg-surface-alt border-[1.5px] border-border text-text focus:border-border-focus transition-colors duration-150 ${className}`}
    />
  );
}

// ─── Select (ConfigTab / enum fields) ────────────────────────────────────────

export function Select({
  value,
  onChange,
  options,
  disabled,
  className = "",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full rounded-lg px-[14px] py-[10px] text-[13px] font-medium cursor-pointer outline-none bg-surface-alt border-[1.5px] border-border text-text font-sans disabled:opacity-60 ${className}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

// ─── Input with optional validation error (ConfigTab) ───────────────────────

export function Input({
  value,
  onChange,
  placeholder,
  readOnly,
  error,
  className = "",
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  error?: string | null;
  className?: string;
}): ReactElement {
  return (
    <div className="w-full">
      <StyledInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${error ? "border-error" : ""} ${className}`}
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
