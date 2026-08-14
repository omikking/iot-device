export interface FieldProps {
  label: string;
  value: string;
  loading?: boolean;
}

export function Field({ label, value, loading,...props }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5" {...props}>
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
