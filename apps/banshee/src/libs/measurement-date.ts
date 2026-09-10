/**
 * The one place a date is written in the banshee UI.
 *
 * Every form is `dd/mm/yyyy` on a 24-hour clock, so the same instant reads the
 * same in a table cell, a modal row and a chart label; only the precision
 * differs — a day (`18/03/2025`), the minute (`18/03/2025 16:41`), or the
 * millisecond (`18/03/2025 16:41:31.907`).
 *
 * There are two families, and they differ only in the zone they read an instant
 * in, because the zone is the one thing that must not change:
 *
 *   - `formatMeasurement*` — UTC, for the instants ProceqData and ProceqReading
 *     carry. The plots have always labelled their x-axis in UTC, and a cell
 *     formatted in the viewer's zone would print a different clock time — and,
 *     near midnight, a different day — for the very instant a chart point sits
 *     on, which is exactly the discrepancy these helpers exist to close.
 *   - `formatDate` / `formatDateTime` — the viewer's zone, for the dates the app
 *     itself owns: installation date/time, due date, event dates. An
 *     installation time is picked on a local clock, so it has to be written back
 *     on the same one.
 */

/** Any shape a date reaches the UI in: a DateTime scalar, epoch millis, a Date. */
export type DateInput = string | number | Date | null | undefined;

/**
 * Parses any of those to millis, or null when there is nothing usable. Takes
 * `unknown` because the generated DateTime scalar is untyped, so this is the
 * boundary where a date stops being whatever the API sent.
 */
export function toMillis(value: unknown): number | null {
  if (value == null || (typeof value === 'string' && !value.trim()))
    return null;

  const time =
    value instanceof Date
      ? value.getTime()
      : new Date(value as string | number).getTime();

  return Number.isNaN(time) ? null : time;
}

const pad = (value: number, length = 2) => String(value).padStart(length, '0');

/**
 * The calendar fields of an instant, read in one zone or the other. Every form
 * below is built from these, so the two families cannot drift apart in anything
 * but the zone they were read in.
 */
const partsOf = (time: number, utc: boolean) => {
  const date = new Date(time);
  return utc
    ? {
        day: date.getUTCDate(),
        month: date.getUTCMonth() + 1,
        year: date.getUTCFullYear(),
        hours: date.getUTCHours(),
        minutes: date.getUTCMinutes(),
        seconds: date.getUTCSeconds(),
        millis: date.getUTCMilliseconds(),
      }
    : {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        millis: date.getMilliseconds(),
      };
};

type DateParts = ReturnType<typeof partsOf>;

/** `18/03/2025` */
const asDay = (parts: DateParts) =>
  `${pad(parts.day)}/${pad(parts.month)}/${parts.year}`;

/** `18/03/2025 16:41` */
const asMinute = (parts: DateParts) =>
  `${asDay(parts)} ${pad(parts.hours)}:${pad(parts.minutes)}`;

/** `18/03/2025 16:41:31.907` */
const asMillisecond = (parts: DateParts) =>
  `${asMinute(parts)}:${pad(parts.seconds)}.${pad(parts.millis, 3)}`;

/** `18/03/2025` — the day a measured instant falls on. */
export function formatMeasurementDay(time: number): string {
  return asDay(partsOf(time, true));
}

/** `18/03/2025 16:41:31.907` — a measured instant to the millisecond. */
export function formatMeasurementInstant(time: number): string {
  return asMillisecond(partsOf(time, true));
}

/**
 * `18/03/2025 16:41` — the same instant for a detail view, rounded to the
 * minute. It names the instant the plots plot; only its precision is coarser
 * than their label.
 */
export function formatMeasurementDateTime(time: number): string {
  return asMinute(partsOf(time, true));
}

/** `18/03/2025` in the viewer's zone, or null when there is no usable date. */
export function formatDate(value: DateInput): string | null {
  const time = toMillis(value);
  return time == null ? null : asDay(partsOf(time, false));
}

/**
 * `18/03/2025 16:41` in the viewer's zone, or null when there is no usable
 * date.
 */
export function formatDateTime(value: DateInput): string | null {
  const time = toMillis(value);
  return time == null ? null : asMinute(partsOf(time, false));
}
