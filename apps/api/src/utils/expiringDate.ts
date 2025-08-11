export function handleExpiringDate(dateValue: any): Date | null {
  const year = dateValue.getFullYear();
  if (!dateValue || dateValue === 0 || dateValue === '0' || year === 1970) {
    return null;
  }

  return new Date(dateValue);
}
