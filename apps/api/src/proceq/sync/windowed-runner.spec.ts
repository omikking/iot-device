import { WindowedRunner } from './windowed-runner';

const tick = (ms = 5) => new Promise((resolve) => setTimeout(resolve, ms));

describe('WindowedRunner (§5.1 sliding window)', () => {
  let runner: WindowedRunner;

  beforeEach(() => {
    runner = new WindowedRunner();
  });

  it('with windowSize=1 degenerates to strict sequential processing (required config)', async () => {
    const items = [0, 1, 2, 3, 4];
    const allocationOrder: number[] = [];
    let active = 0;
    let maxActive = 0;

    const outcomes = await runner.run(
      items,
      async (item) => {
        active++;
        maxActive = Math.max(maxActive, active);
        await tick();
        active--;
        return item * 10;
      },
      {
        windowSize: 1,
        onSlotAllocated: (_item, index) => allocationOrder.push(index),
      },
    );

    // Exactly one in flight at any time, items drained in order, none skipped.
    expect(maxActive).toBe(1);
    expect(allocationOrder).toEqual([0, 1, 2, 3, 4]);
    expect(outcomes.map((o) => o.value)).toEqual([0, 10, 20, 30, 40]);
    expect(outcomes.every((o) => o.status === 'fulfilled')).toBe(true);
  });

  it('never exceeds windowSize concurrent workers and processes every item once', async () => {
    const items = Array.from({ length: 12 }, (_, i) => i);
    const processed = new Set<number>();
    let active = 0;
    let maxActive = 0;

    const outcomes = await runner.run(
      items,
      async (item) => {
        active++;
        maxActive = Math.max(maxActive, active);
        await tick();
        active--;
        processed.add(item);
        return item;
      },
      { windowSize: 5 },
    );

    expect(maxActive).toBeLessThanOrEqual(5);
    expect(maxActive).toBeGreaterThan(1); // genuinely concurrent
    expect(processed.size).toBe(12);
    expect(outcomes).toHaveLength(12);
  });

  it('isolates a failing item so the others keep running (Gap 8 / Scenario 1)', async () => {
    const items = ['a', 'b', 'boom', 'c', 'd'];

    const outcomes = await runner.run(
      items,
      async (item) => {
        await tick();
        if (item === 'boom') throw new Error('kaboom');
        return item.toUpperCase();
      },
      { windowSize: 2 },
    );

    const byItem = new Map(outcomes.map((o) => [o.item, o]));
    expect(byItem.get('boom')?.status).toBe('rejected');
    expect(byItem.get('a')?.status).toBe('fulfilled');
    expect(byItem.get('d')?.value).toBe('D');
    // All five were attempted despite the failure.
    expect(outcomes).toHaveLength(5);
  });

  it('stops pulling new items once the signal is aborted mid-run', async () => {
    const controller = new AbortController();
    const items = Array.from({ length: 10 }, (_, i) => i);
    const started: number[] = [];

    const promise = runner.run(
      items,
      async (item) => {
        started.push(item);
        await tick(10);
        // Abort after the first window's worth of items has started.
        if (item === 0) controller.abort();
        return item;
      },
      { windowSize: 2, signal: controller.signal },
    );

    await promise;

    // Far fewer than all 10 items should have been pulled after the abort.
    expect(started.length).toBeLessThan(10);
  });

  it('does not invoke the worker at all when pre-aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    const worker = jest.fn(async (n: number) => n);

    const outcomes = await runner.run([1, 2, 3], worker, {
      windowSize: 3,
      signal: controller.signal,
    });

    expect(worker).not.toHaveBeenCalled();
    expect(outcomes).toHaveLength(0);
  });

  it('returns an empty result for an empty item list', async () => {
    const worker = jest.fn(async (n: number) => n);
    const outcomes = await runner.run([], worker, { windowSize: 5 });
    expect(outcomes).toEqual([]);
    expect(worker).not.toHaveBeenCalled();
  });
});
