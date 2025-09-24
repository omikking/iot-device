export function handleExpiringDate(dateValue: any): Date | undefined {
  if (!dateValue || dateValue === 0 || dateValue === '0') {
    return undefined;
  }

  const date = new Date(dateValue);
  if (isNaN(date.getTime()) || date.getFullYear() === 1970) {
    return undefined;
  }
  return date;
}
