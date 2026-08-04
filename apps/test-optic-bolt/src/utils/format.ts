export function formatDate(value?: string | null): string {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
}

export function formatNumber(value?: number | null): string {
  if (value == null) return '-';
  return String(value);
}

export function formatBoolean(value?: boolean | null): string {
  if (value == null) return '-';
  return value ? 'Pass' : 'Fail';
}
