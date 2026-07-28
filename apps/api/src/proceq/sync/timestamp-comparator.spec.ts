import { TimestampComparator } from './timestamp-comparator';
import { SyncDecision } from './sync.types';

describe('TimestampComparator (§5.4 / Scenario 3)', () => {
  const comparator = new TimestampComparator();

  const iso = (ms: number) => new Date(ms).toISOString();

  it('classifies a measurement absent from the DB as NEW (3.1)', () => {
    expect(comparator.classify(iso(1_000), undefined)).toBe(SyncDecision.NEW);
    expect(comparator.classify(null, undefined)).toBe(SyncDecision.NEW);
  });

  it('reprocesses (UPDATED) only when the incoming record is strictly newer', () => {
    const db = new Date(1_000);
    expect(comparator.classify(iso(2_000), db)).toBe(SyncDecision.UPDATED);
  });

  it('SKIPs when the timestamps are equal', () => {
    const db = new Date(5_000);
    expect(comparator.classify(iso(5_000), db)).toBe(SyncDecision.SKIP);
  });

  it('SKIPs when the incoming record is older / a previous date (the gap fix)', () => {
    const db = new Date(5_000);
    // Under the OLD `!==` logic this would have (wrongly) reprocessed.
    expect(comparator.classify(iso(4_000), db)).toBe(SyncDecision.SKIP);
  });

  it('SKIPs when either side of the comparison is undecidable', () => {
    expect(comparator.classify(null, new Date(1_000))).toBe(SyncDecision.SKIP);
    expect(comparator.classify(iso(1_000), null)).toBe(SyncDecision.SKIP);
    expect(comparator.classify('not-a-date', new Date(1_000))).toBe(
      SyncDecision.SKIP,
    );
  });
});
