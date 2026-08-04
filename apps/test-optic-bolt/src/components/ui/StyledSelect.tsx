export interface StyledSelectProps {
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
  ...props
}: StyledSelectProps) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg px-[14px] py-[10px] text-[13px] outline-none font-mono bg-surface-alt border-[1.5px] border-border text-text focus:border-border-focus transition-colors duration-150 disabled:opacity-60"
      {...props}
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
