import { type ReactNode } from "react";
import type { LogEntry, LogType } from "../../types";

// ─── Card ────────────────────────────────────────────────────────────────────

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-xl px-6 py-5 bg-surface border border-border shadow-card ${className}`}>
      {children}
    </div>
  );
}

// ─── SectionTitle ────────────────────────────────────────────────────────────

interface SectionTitleProps {
  children: ReactNode;
  icon?: string;
}

export function SectionTitle({ children, icon }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2 mb-[14px]">
      {icon && <span className="text-[18px]">{icon}</span>}
      <span className="text-[13px] font-bold tracking-[0.02em] text-text font-sans">
        {children}
      </span>
    </div>
  );
}

// ─── StatRow ─────────────────────────────────────────────────────────────────

interface StatRowProps {
  label: string;
  value: string | number;
}

export function StatRow({ label, value }: StatRowProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-surface-alt">
      <span className="text-[13px] text-text-muted font-sans">{label}</span>
      <span className="text-[13px] font-semibold text-text font-mono">{value}</span>
    </div>
  );
}

// ─── Badge ───────────────────────────────────────────────────────────────────

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "error" | "warn" | "accent";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-surface-alt text-text-muted",
    success: "bg-success-bg text-success",
    error:   "bg-error-bg text-error",
    warn:    "bg-warn-bg text-warn",
    accent:  "bg-info-bg text-accent",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-[3px] rounded-md font-mono ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ─── Btn ─────────────────────────────────────────────────────────────────────

interface BtnProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
  danger?: boolean;
  className?: string;
}

export function Btn({ children, onClick, disabled, small, danger, className = "" }: BtnProps) {
  const base = "flex items-center gap-1.5 border-none font-semibold whitespace-nowrap transition-all duration-150 font-sans cursor-pointer rounded-lg";
  const size = small ? "px-[14px] py-[7px] text-xs" : "px-5 py-[10px] text-[13px]";

  const color = danger
    ? "bg-danger-btn hover:bg-danger-hover text-white"
    : "bg-accent hover:bg-accent-hover text-white";

  const disabledCls = "bg-surface-alt text-text-faint cursor-not-allowed hover:bg-surface-alt";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${size} ${disabled ? disabledCls : color} ${className}`}
    >
      {children}
    </button>
  );
}

// ─── StatusDot ───────────────────────────────────────────────────────────────

interface StatusDotProps {
  ok: boolean;
}

export function StatusDot({ ok }: StatusDotProps) {
  return (
    <span
      className={`inline-block w-[9px] h-[9px] rounded-full ${
        ok
          ? "bg-success shadow-[0_0_6px_var(--color-success)]"
          : "bg-error shadow-[0_0_6px_var(--color-error)]"
      }`}
    />
  );
}

// ─── LogLine ─────────────────────────────────────────────────────────────────

interface LogLineProps {
  entry: LogEntry;
}

export function LogLine({ entry }: LogLineProps) {
  const styles: Record<LogType, string> = {
    info:    "bg-info-bg text-accent",
    success: "bg-success-bg text-success",
    error:   "bg-error-bg text-error",
    warn:    "bg-warn-bg text-warn",
    raw:     "bg-[#f5f3ff] text-[#7c3aed]",
  };

  return (
    <div className={`flex gap-2.5 items-start px-2.5 py-1.5 rounded-md mb-0.5 ${styles[entry.type]}`}>
      <span className="text-[10px] whitespace-nowrap min-w-[72px] pt-0.5 text-text-faint font-mono">
        {new Date(entry.ts).toLocaleTimeString()}
      </span>
      <span className="text-xs break-all leading-[1.5] font-mono">
        {entry.msg}
      </span>
    </div>
  );
}

// ─── StyledInput ─────────────────────────────────────────────────────────────

interface StyledInputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export function StyledInput({ type = "text", value, onChange, placeholder, className = "" }: StyledInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        w-full rounded-lg px-[14px] py-[10px] text-[13px] outline-none font-mono
        bg-surface-alt border-[1.5px] border-border text-text
        focus:border-border-focus
        transition-colors duration-150
        ${className}
      `}
    />
  );
}