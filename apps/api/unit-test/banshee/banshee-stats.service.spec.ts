import { PrismaService } from 'src/prisma/prisma.service';
import { BansheeStatsService } from 'src/banshee-stats/banshee-stats.service';
import { Application } from '@prisma/client';
import {
  PrismaMock,
  activeBansheePlan,
  adminUser,
  createPrismaMock,
  makeCompanyUser,
} from '../test-utils';

/**
 * Banshee Stats API — unit tests.
 *
 * Covers smoke cases BE-STT-01 .. BE-STT-05 plus extended coverage of access
 * control and the measurement-classification logic in updateStatsForMeasurement.
 */
describe('BansheeStatsService', () => {
  let prisma: PrismaMock;
  let service: BansheeStatsService;

  const companyId = 'company-1';
  const siteId = 'site-1';
  const allowedApps = [Application.BANSHEE];

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new BansheeStatsService(prisma as unknown as PrismaService);
  });

  describe('BE-STT-01: session stats — date range', () => {
    it('queries with day-aligned date bounds and returns the rows ordered by date', async () => {
      const startDate = new Date('2026-01-01T09:30:00');
      const endDate = new Date('2026-01-31T18:00:00');
      const rows = [{ id: 's1' }, { id: 's2' }];
      prisma.bansheeSessionStats.findMany.mockResolvedValue(rows);

      const result = await service.bansheeSessionStats(
        adminUser,
        startDate,
        endDate,
        undefined,
        undefined,
        [],
        allowedApps,
      );

      expect(result).toBe(rows);
      const arg = prisma.bansheeSessionStats.findMany.mock.calls[0][0];
      expect(arg.where.sessionDate.gte).toEqual(
        new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
        ),
      );
      expect(arg.where.sessionDate.lte).toEqual(
        new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          23,
          59,
          59,
        ),
      );
      expect(arg.orderBy).toEqual({ sessionDate: 'desc' });
      expect(arg.include).toEqual({ company: true, site: true });
    });
  });

  describe('BE-STT-02: session stats filtered by company', () => {
    it('restricts the query to the requested company', async () => {
      prisma.bansheeSessionStats.findMany.mockResolvedValue([]);

      await service.bansheeSessionStats(
        adminUser,
        new Date('2026-01-01'),
        new Date('2026-01-31'),
        companyId,
        undefined,
        [],
        allowedApps,
      );

      expect(
        prisma.bansheeSessionStats.findMany.mock.calls[0][0].where.companyId,
      ).toBe(companyId);
    });

    it('denies a non-admin user without access to the requested company', async () => {
      await expect(
        service.bansheeSessionStats(
          makeCompanyUser('company-1'),
          new Date('2026-01-01'),
          new Date('2026-01-31'),
          'company-2', // not in the user's allowed list
          undefined,
          ['company-1'],
          allowedApps,
        ),
      ).rejects.toThrow('User does not have access to this company.');
    });
  });

  describe('BE-STT-03: session stats filtered by site', () => {
    it('restricts the query to the requested site', async () => {
      prisma.bansheeSessionStats.findMany.mockResolvedValue([]);

      await service.bansheeSessionStats(
        adminUser,
        new Date('2026-01-01'),
        new Date('2026-01-31'),
        companyId,
        siteId,
        [],
        allowedApps,
      );

      const where = prisma.bansheeSessionStats.findMany.mock.calls[0][0].where;
      expect(where.siteId).toBe(siteId);
    });
  });

  describe('BE-STT-04: empty range returns an empty array', () => {
    it('returns [] (not null, not an error) when no sessions match', async () => {
      prisma.bansheeSessionStats.findMany.mockResolvedValue([]);

      const result = await service.bansheeSessionStats(
        adminUser,
        new Date('2026-03-01'),
        new Date('2026-03-31'),
        companyId,
        undefined,
        [],
        allowedApps,
      );

      expect(result).toEqual([]);
    });
  });

  describe('BE-STT-05: aggregation accuracy (updateStatsForMeasurement)', () => {
    it('increments the correct counters for a measured + broken measurement (create)', async () => {
      prisma.company.findUnique.mockResolvedValue({ id: companyId });
      prisma.bansheeSessionStats.upsert.mockResolvedValue({});

      await service.updateStatsForMeasurement(
        new Date('2026-01-15T08:00:00'),
        true, // hasReadings -> measured
        true, // hasLogs
        'Bolt is broken',
        siteId,
        companyId,
        'create',
      );

      expect(prisma.bansheeSessionStats.upsert).toHaveBeenCalledTimes(1);
      const arg = prisma.bansheeSessionStats.upsert.mock.calls[0][0];
      expect(arg.update.totalMeasured.increment).toBe(1);
      expect(arg.update.broken.increment).toBe(1);
      expect(arg.update.notMeasurable.increment).toBe(0);
      expect(arg.create).toMatchObject({
        totalMeasured: 1,
        broken: 1,
        notMeasurable: 0,
      });
    });

    it('classifies a "not measurable" comment into notMeasurable', async () => {
      prisma.company.findUnique.mockResolvedValue({ id: companyId });
      prisma.bansheeSessionStats.upsert.mockResolvedValue({});

      await service.updateStatsForMeasurement(
        new Date('2026-01-15T08:00:00'),
        false, // not measured
        true, // hasLogs
        'Sensor not measurable here',
        siteId,
        companyId,
        'create',
      );

      const arg = prisma.bansheeSessionStats.upsert.mock.calls[0][0];
      expect(arg.update.notMeasurable.increment).toBe(1);
      expect(arg.update.broken.increment).toBe(0);
      expect(arg.update.totalMeasured.increment).toBe(0);
    });

    it('does not count broken/notMeasurable when there are no logs', async () => {
      prisma.company.findUnique.mockResolvedValue({ id: companyId });
      prisma.bansheeSessionStats.upsert.mockResolvedValue({});

      await service.updateStatsForMeasurement(
        new Date('2026-01-15T08:00:00'),
        true,
        false, // hasLogs = false
        'broken and not measurable',
        siteId,
        companyId,
        'create',
      );

      const arg = prisma.bansheeSessionStats.upsert.mock.calls[0][0];
      expect(arg.update.totalMeasured.increment).toBe(1);
      expect(arg.update.broken.increment).toBe(0);
      expect(arg.update.notMeasurable.increment).toBe(0);
    });

    it('classifies "temperature error" as broken', async () => {
      prisma.company.findUnique.mockResolvedValue({ id: companyId });
      prisma.bansheeSessionStats.upsert.mockResolvedValue({});

      await service.updateStatsForMeasurement(
        new Date('2026-01-15T08:00:00'),
        true,
        true,
        'Temperature error during reading',
        siteId,
        companyId,
        'create',
      );

      expect(
        prisma.bansheeSessionStats.upsert.mock.calls[0][0].update.broken
          .increment,
      ).toBe(1);
    });

    it('decrements (clamped at 0) when an existing measurement is deleted', async () => {
      prisma.company.findUnique.mockResolvedValue({ id: companyId });
      prisma.bansheeSessionStats.findUnique.mockResolvedValue({
        totalMeasured: 2,
        notMeasurable: 0,
        broken: 1,
      });
      prisma.bansheeSessionStats.update.mockResolvedValue({});

      await service.updateStatsForMeasurement(
        new Date('2026-01-15T08:00:00'),
        true, // was measured
        true, // hasLogs
        'broken',
        siteId,
        companyId,
        'delete',
      );

      const arg = prisma.bansheeSessionStats.update.mock.calls[0][0];
      expect(arg.data.totalMeasured).toBe(1); // 2 - 1
      expect(arg.data.broken).toBe(0); // 1 - 1
      expect(arg.data.notMeasurable).toBe(0); // clamped, never negative
    });

    it('skips the update when createdTimestamp is missing', async () => {
      await service.updateStatsForMeasurement(
        null,
        true,
        true,
        'broken',
        siteId,
        companyId,
        'create',
      );

      expect(prisma.bansheeSessionStats.upsert).not.toHaveBeenCalled();
    });

    it('skips the update when the company does not exist', async () => {
      prisma.company.findUnique.mockResolvedValue(null);

      await service.updateStatsForMeasurement(
        new Date('2026-01-15T08:00:00'),
        true,
        true,
        'broken',
        siteId,
        companyId,
        'create',
      );

      expect(prisma.bansheeSessionStats.upsert).not.toHaveBeenCalled();
    });

    it('skips the decrement when there are no existing stats for the date', async () => {
      prisma.company.findUnique.mockResolvedValue({ id: companyId });
      prisma.bansheeSessionStats.findUnique.mockResolvedValue(null);

      await service.updateStatsForMeasurement(
        new Date('2026-01-15T08:00:00'),
        true,
        true,
        'broken',
        siteId,
        companyId,
        'delete',
      );

      expect(prisma.bansheeSessionStats.update).not.toHaveBeenCalled();
    });
  });

  describe('access control (non-admin)', () => {
    it('allows a non-admin with BANSHEE access in at least one company (no companyId filter)', async () => {
      prisma.plan.findMany.mockResolvedValue([activeBansheePlan(companyId)]);
      prisma.bansheeSessionStats.findMany.mockResolvedValue([{ id: 's1' }]);

      const result = await service.bansheeSessionStats(
        makeCompanyUser(companyId),
        new Date('2026-01-01'),
        new Date('2026-01-31'),
        undefined,
        undefined,
        [companyId],
        allowedApps,
      );

      expect(result).toEqual([{ id: 's1' }]);
      // non-admin queries are scoped to their allowed companies
      expect(
        prisma.bansheeSessionStats.findMany.mock.calls[0][0].where.companyId,
      ).toEqual({
        in: [companyId],
      });
    });

    it('denies a non-admin with no allowed companies', async () => {
      await expect(
        service.bansheeSessionStats(
          makeCompanyUser(companyId),
          new Date('2026-01-01'),
          new Date('2026-01-31'),
          undefined,
          undefined,
          [],
          allowedApps,
        ),
      ).rejects.toThrow('User does not have access to any company.');
    });

    it('denies when the requested company has no valid BANSHEE plan', async () => {
      prisma.plan.findMany.mockResolvedValue([]); // no active plan

      await expect(
        service.bansheeSessionStats(
          makeCompanyUser(companyId),
          new Date('2026-01-01'),
          new Date('2026-01-31'),
          companyId,
          undefined,
          [companyId],
          allowedApps,
        ),
      ).rejects.toThrow('Company does not have a valid BANSHEE plan.');
    });

    it('denies a non-admin with no BANSHEE access in any company', async () => {
      prisma.plan.findMany.mockResolvedValue([]); // no plans anywhere

      await expect(
        service.bansheeSessionStats(
          makeCompanyUser(companyId),
          new Date('2026-01-01'),
          new Date('2026-01-31'),
          undefined,
          undefined,
          [companyId],
          allowedApps,
        ),
      ).rejects.toThrow('User does not have BANSHEE access in any company.');
    });
  });
});
