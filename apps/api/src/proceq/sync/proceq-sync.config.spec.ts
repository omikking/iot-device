import { ConfigService } from '@nestjs/config';
import { ProceqSyncConfigService } from './proceq-sync.config';

function makeConfig(values: Record<string, unknown>): ProceqSyncConfigService {
  const fake = {
    get: (key: string) => values[key],
  } as unknown as ConfigService;
  return new ProceqSyncConfigService(fake);
}

describe('ProceqSyncConfigService (§5.5 configuration)', () => {
  describe('isCronDisabled — off by default, opt-in to enable', () => {
    it('treats a missing value as disabled', () => {
      expect(makeConfig({}).isCronDisabled()).toBe(true);
    });

    it('treats "true"/"1" (any case) as disabled', () => {
      expect(
        makeConfig({ PROCEQ_SYNC_DISABLED: 'true' }).isCronDisabled(),
      ).toBe(true);
      expect(
        makeConfig({ PROCEQ_SYNC_DISABLED: 'TRUE' }).isCronDisabled(),
      ).toBe(true);
      expect(makeConfig({ PROCEQ_SYNC_DISABLED: '1' }).isCronDisabled()).toBe(
        true,
      );
    });

    it('treats "false" (and other values) as enabled', () => {
      expect(
        makeConfig({ PROCEQ_SYNC_DISABLED: 'false' }).isCronDisabled(),
      ).toBe(false);
      expect(makeConfig({ PROCEQ_SYNC_DISABLED: '0' }).isCronDisabled()).toBe(
        false,
      );
    });
  });

  describe('getWindowSize — integer floored at 1, default 5', () => {
    it('defaults to 5 when missing or invalid', () => {
      expect(makeConfig({}).getWindowSize()).toBe(5);
      expect(
        makeConfig({ PROCEQ_SYNC_WINDOW_SIZE: 'abc' }).getWindowSize(),
      ).toBe(5);
      expect(makeConfig({ PROCEQ_SYNC_WINDOW_SIZE: '' }).getWindowSize()).toBe(
        5,
      );
    });

    it('falls back to the default for zero/negative values', () => {
      expect(makeConfig({ PROCEQ_SYNC_WINDOW_SIZE: '0' }).getWindowSize()).toBe(
        5,
      );
      expect(
        makeConfig({ PROCEQ_SYNC_WINDOW_SIZE: '-3' }).getWindowSize(),
      ).toBe(5);
    });

    it('honours a valid value, including 1 (the required lower bound)', () => {
      expect(makeConfig({ PROCEQ_SYNC_WINDOW_SIZE: '1' }).getWindowSize()).toBe(
        1,
      );
      expect(makeConfig({ PROCEQ_SYNC_WINDOW_SIZE: '8' }).getWindowSize()).toBe(
        8,
      );
    });
  });

  describe('getIntervalMinutes — clamped to 1..60, default 10', () => {
    it('defaults to 10 when missing or invalid', () => {
      expect(makeConfig({}).getIntervalMinutes()).toBe(10);
      expect(
        makeConfig({
          PROCEQ_SYNC_INTERVAL_MINUTES: 'xyz',
        }).getIntervalMinutes(),
      ).toBe(10);
    });

    it('falls back to the default for non-positive values and clamps the upper bound', () => {
      // Non-positive values are invalid → default (10), not clamped to 1.
      expect(
        makeConfig({ PROCEQ_SYNC_INTERVAL_MINUTES: '0' }).getIntervalMinutes(),
      ).toBe(10);
      expect(
        makeConfig({ PROCEQ_SYNC_INTERVAL_MINUTES: '-5' }).getIntervalMinutes(),
      ).toBe(10);
      // Above the max is clamped to 60.
      expect(
        makeConfig({
          PROCEQ_SYNC_INTERVAL_MINUTES: '120',
        }).getIntervalMinutes(),
      ).toBe(60);
    });

    it('honours an in-range value', () => {
      expect(
        makeConfig({ PROCEQ_SYNC_INTERVAL_MINUTES: '7' }).getIntervalMinutes(),
      ).toBe(7);
    });
  });

  describe('buildCronExpression', () => {
    it('fires on wall-clock minutes divisible by N', () => {
      const config = makeConfig({});
      expect(config.buildCronExpression(10)).toBe('0 */10 * * * *');
      expect(config.buildCronExpression(1)).toBe('0 */1 * * * *');
    });
  });
});
