export function buildInstallationDateTime(
  installationDate: Date,
  installationTime: string,
): Date {
  const [timeStr, period] = installationTime.split(' ');
  const [hours, minutes] = timeStr.split(':').map(Number);
  const isPM = period === 'PM';
  const adjustedHours = isPM
    ? hours === 12
      ? 12
      : hours + 12
    : hours === 12
      ? 0
      : hours;

  const result = new Date(installationDate);
  result.setHours(adjustedHours, minutes, 0, 0);
  return result;
}

export function parseCoordinates(raw: unknown): {
  x: string;
  y: string;
  z: string;
} {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (parsed) {
      return {
        x: parsed.x?.toString() ?? '0',
        y: parsed.y?.toString() ?? '0',
        z: parsed.z?.toString() ?? '0',
      };
    }
  } catch (e) {
    console.error('Error parsing coordinates:', e);
  }
  return { x: '0', y: '0', z: '0' };
}
