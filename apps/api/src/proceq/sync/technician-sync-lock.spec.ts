import { TechnicianSyncLock } from './technician-sync-lock';

describe('TechnicianSyncLock (§5.1 / Scenario 9)', () => {
  let lock: TechnicianSyncLock;

  beforeEach(() => {
    lock = new TechnicianSyncLock();
  });

  it('acquires an idle technician and blocks a second concurrent acquire', () => {
    expect(lock.tryAcquire('tech@x.com')).toBe(true);
    // Same technician cannot be double-synced concurrently.
    expect(lock.tryAcquire('tech@x.com')).toBe(false);
    expect(lock.isLocked('tech@x.com')).toBe(true);
  });

  it('allows different technicians to run in parallel', () => {
    expect(lock.tryAcquire('a@x.com')).toBe(true);
    expect(lock.tryAcquire('b@x.com')).toBe(true);
    expect(lock.tryAcquire('c@x.com')).toBe(true);
    expect(lock.activeCount).toBe(3);
  });

  it('re-acquires after release', () => {
    expect(lock.tryAcquire('tech@x.com')).toBe(true);
    lock.release('tech@x.com');
    expect(lock.isLocked('tech@x.com')).toBe(false);
    expect(lock.tryAcquire('tech@x.com')).toBe(true);
  });

  it('release is idempotent and safe when not held', () => {
    expect(() => lock.release('never-held@x.com')).not.toThrow();
    expect(lock.activeCount).toBe(0);
  });
});
