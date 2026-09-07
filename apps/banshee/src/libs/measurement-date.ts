/**
 * How a measured instant is written wherever the UI dates a bolt: the plots'
 * x-axis labels and the tables' "last measured" / "last reading" cells alike.
 *
 * Every form is UTC, which is the zone the plots have always labelled in. A
 * cell formatted in the viewer's zone instead would print a different clock
 * time — and, near midnight, a different day — for the very instant a chart
 * point sits on, which is exactly the discrepancy these helpers exist to close.
 *
 * The day is written two ways for two audiences — `18 Mar 2025` on the plots
 * and in table columns, `3/18/2025` in the detail views — and the plots carry
 * the full instant while the detail views round to the minute, so two views of
 * the same reading can differ in precision but never in the instant they name.
 */

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const pad = (value: number, length = 2) => String(value).padStart(length, '0');

/** `10:41:31.907` — the time of day, to the millisecond. */
const formatTimeOfDay = (date: Date) =>
  `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
    date.getUTCSeconds(),
  )}.${pad(date.getUTCMilliseconds(), 3)}`;

/**
 * `04:41 pm` — the time of day to the minute on the 12-hour clock, written the
 * way the "Installation date" field writes it.
 */
const formatTimeOfDayShort = (date: Date) => {
  const hours = date.getUTCHours();
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${pad(hour12)}:${pad(date.getUTCMinutes())} ${hours < 12 ? 'am' : 'pm'}`;
};

/** `18 Mar 2025` — the day an instant falls on. */
export function formatMeasurementDay(time: number): string {
  const date = new Date(time);
  return `${pad(date.getUTCDate())} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** `18 Mar 2025 10:41:31.907` — the instant itself, to the millisecond. */
export function formatMeasurementInstant(time: number): string {
  return `${formatMeasurementDay(time)} ${formatTimeOfDay(new Date(time))}`;
}

/**
 * `3/18/2025 10:41 am` — the same instant for a detail view: month-first,
 * numeric, and rounded to the minute. Still UTC, so it names the instant the
 * plots plot; only its precision is coarser than their label.
 */
export function formatMeasurementDateTime(time: number): string {
  const date = new Date(time);
  const day = `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
  return `${day} ${formatTimeOfDayShort(date)}`;
}
