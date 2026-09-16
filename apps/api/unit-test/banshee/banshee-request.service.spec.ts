import { Readable, Writable } from 'stream';
import * as fsSync from 'fs';
import { promises as fs } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
import { BansheeRequestsService } from 'src/banshee-request/banshee-request.service';
import { BansheeStatsService } from 'src/banshee-stats/banshee-stats.service';
import {
  Application,
  BansheeCartItemType,
  BansheeOrderItemStatus,
} from '@prisma/client';
import {
  PrismaMock,
  activeBansheePlan,
  adminUser,
  createPrismaMock,
  makeCompanyUser,
} from '../test-utils';

/**
 * Banshee Request API — unit tests.
 *
 * Covers smoke cases BE-REQ-01 .. BE-REQ-05 plus extended coverage of relation
 * validation, order-item linking, image validation, the period→due-date
 * recompute on update, deletion (with stats roll-back), listing filters/scoping,
 * status distribution and event logs.
 */
describe('BansheeRequestsService', () => {
  let prisma: PrismaMock;
  let statsService: { updateStatsForMeasurement: jest.Mock };
  let service: BansheeRequestsService;

  const companyId = 'company-1';
  const siteId = 'site-1';
  const levelId = 'level-1';
  const driveId = 'drive-1';
  const locationId = 'location-1';

  const validCreateInput = {
    serialNumber: 'SN-1001',
    companyId,
    siteId,
    levelId,
    driveId,
    locationId,
    period: 6,
    ringPosition: 'R1',
    boltType: 'D47_MD_1_8_M',
    measured: false,
    isBrokenBolt: false,
    isNotMeasurable: false,
  };

  beforeEach(() => {
    prisma = createPrismaMock();
    statsService = { updateStatsForMeasurement: jest.fn() };
    service = new BansheeRequestsService(
      prisma as unknown as PrismaService,
      statsService as unknown as BansheeStatsService,
    );

    // Default: hierarchy relations are valid & consistent.
    prisma.level.findUnique.mockResolvedValue({ id: levelId });
    prisma.drive.findUnique.mockResolvedValue({ id: driveId, levelId });
    prisma.location.findUnique.mockResolvedValue({ id: locationId, driveId });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('BE-REQ-01: create — happy path', () => {
    it('creates and returns a new banshee request with a generated id', async () => {
      prisma.bansheeRequest.findFirst.mockResolvedValue(null); // no duplicate serial
      const created = { id: 'req-1', ...validCreateInput };
      prisma.bansheeRequest.create.mockResolvedValue(created);

      const result = await service.create(validCreateInput as any, adminUser);

      expect(result.id).toBe('req-1');
      expect(prisma.bansheeRequest.create).toHaveBeenCalledTimes(1);
      const createArg = prisma.bansheeRequest.create.mock.calls[0][0];
      expect(createArg.data).toMatchObject({
        serialNumber: 'SN-1001',
        companyId,
        siteId,
        levelId,
        driveId,
        locationId,
        period: 6,
        createdBy: adminUser.id,
      });
    });

    it('links the created request to a pending NEW_BANSHEE order item', async () => {
      prisma.bansheeRequest.findFirst.mockResolvedValue(null);
      prisma.bansheeOrderItem.findUnique.mockResolvedValue({
        id: 'oi-1',
        itemType: BansheeCartItemType.NEW_BANSHEE,
        status: BansheeOrderItemStatus.PENDING,
        order: { companyId },
      });
      prisma.bansheeRequest.create.mockResolvedValue({ id: 'req-1' });
      prisma.bansheeOrderItem.update.mockResolvedValue({});

      await service.create(
        { ...validCreateInput, bansheeOrderItemId: 'oi-1' } as any,
        adminUser,
      );

      expect(prisma.bansheeOrderItem.update.mock.calls[0][0]).toMatchObject({
        where: { id: 'oi-1' },
        data: { bansheeRequestId: 'req-1' },
      });
    });
  });

  describe('BE-REQ-02: list banshee requests (paginated)', () => {
    it('returns totalRecords and the requested page, honouring offset/limit', async () => {
      prisma.bansheeRequest.count.mockResolvedValue(42);
      const page = [{ id: 'req-1' }, { id: 'req-2' }];
      prisma.bansheeRequest.findMany.mockResolvedValue(page);

      const result = await service.findAll(
        { companyId, offset: 10, limit: 20 },
        [],
        [Application.BANSHEE],
        adminUser,
      );

      expect(result).toEqual({ totalRecords: 42, results: page });
      const findManyArg = prisma.bansheeRequest.findMany.mock.calls[0][0];
      expect(findManyArg.skip).toBe(10);
      expect(findManyArg.take).toBe(20);
      expect(findManyArg.where.companyId).toBe(companyId);
    });

    it('applies the supported filters to the where clause', async () => {
      prisma.bansheeRequest.count.mockResolvedValue(0);
      prisma.bansheeRequest.findMany.mockResolvedValue([]);

      await service.findAll(
        {
          companyId,
          serialNumber: 'SN',
          measured: true,
          period: 6,
          driveId,
          locationId,
          createdBy: 'user-9',
          siteId,
          isBrokenBolt: true,
          isNotMeasurable: false,
        },
        [],
        [Application.BANSHEE],
        adminUser,
      );

      const where = prisma.bansheeRequest.findMany.mock.calls[0][0].where;
      expect(where.serialNumber).toEqual({
        contains: 'SN',
        mode: 'insensitive',
      });
      expect(where.measured).toBe(true);
      expect(where.period).toBe(6);
      expect(where.driveId).toBe(driveId);
      expect(where.locationId).toBe(locationId);
      expect(where.createdBy).toBe('user-9');
      expect(where.siteId).toBe(siteId);
      expect(where.isBrokenBolt).toBe(true);
      expect(where.isNotMeasurable).toBe(false);
    });

    it('scopes a non-admin without a companyId filter to their allowed companies', async () => {
      prisma.bansheeRequest.count.mockResolvedValue(0);
      prisma.bansheeRequest.findMany.mockResolvedValue([]);

      await service.findAll(
        {},
        [companyId],
        [Application.BANSHEE],
        makeCompanyUser(companyId),
      );

      expect(
        prisma.bansheeRequest.findMany.mock.calls[0][0].where.companyId,
      ).toEqual({
        in: [companyId],
      });
    });

    it('denies a non-admin without app access for the requested company', async () => {
      prisma.plan.findMany.mockResolvedValue([]); // no active BANSHEE plan

      // The access check denies the request (no query is run), but findAll's broad
      // outer catch re-wraps the ForbiddenException as a generic fetch error.
      await expect(
        service.findAll(
          { companyId },
          [companyId],
          [Application.BANSHEE],
          makeCompanyUser(companyId),
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_REQUESTS_FETCH_ERROR' },
      });
      expect(prisma.bansheeRequest.findMany).not.toHaveBeenCalled();
    });

    it('denies a non-admin whose requested company is outside their allowed list', async () => {
      // App access passes (holds a BANSHEE permission for the company) but the
      // company is not in the caller-supplied allowed list -> ForbiddenException,
      // re-wrapped as a generic fetch error by the outer catch.
      prisma.plan.findMany.mockResolvedValue([activeBansheePlan(companyId)]);

      await expect(
        service.findAll(
          { companyId },
          ['other-company'],
          [Application.BANSHEE],
          makeCompanyUser(companyId),
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_REQUESTS_FETCH_ERROR' },
      });
      expect(prisma.bansheeRequest.findMany).not.toHaveBeenCalled();
    });

    it('adds a proceqData date window when start/end/company are all present', async () => {
      const startDate = new Date('2026-01-01');
      const endDate = new Date('2026-02-01');
      prisma.bansheeRequest.count.mockResolvedValue(0);
      prisma.bansheeRequest.findMany.mockResolvedValue([]);

      await service.findAll(
        { companyId, startDate, endDate },
        [],
        [Application.BANSHEE],
        adminUser,
      );

      expect(
        prisma.bansheeRequest.findMany.mock.calls[0][0].where.proceqData,
      ).toEqual({
        some: { updatedTimestamp: { gte: startDate, lte: endDate } },
      });
    });

    it('wraps an unexpected query failure in a generic fetch error', async () => {
      prisma.bansheeRequest.count.mockRejectedValue(new Error('db down'));

      await expect(
        service.findAll({ companyId }, [], [Application.BANSHEE], adminUser),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_REQUESTS_FETCH_ERROR' },
      });
    });
  });

  describe('BE-REQ-03: fetch banshee request by id', () => {
    it('returns the request when it exists', async () => {
      const request = { id: 'req-1', companyId, serialNumber: 'SN-1001' };
      prisma.bansheeRequest.findUnique.mockResolvedValue(request);

      const result = await service.findOne('req-1', adminUser);

      expect(result).toMatchObject({ id: 'req-1', serialNumber: 'SN-1001' });
      expect(prisma.bansheeRequest.findUnique).toHaveBeenCalledWith({
        where: { id: 'req-1' },
      });
    });

    it('returns the request for a non-admin with company access', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue({
        id: 'req-1',
        companyId,
      });
      prisma.userPermission.findFirst.mockResolvedValue({ id: 'perm-1' });

      const result = await service.findOne('req-1', makeCompanyUser(companyId));

      expect(result).toMatchObject({ id: 'req-1' });
    });

    it('denies a non-admin without access to the request company', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue({
        id: 'req-1',
        companyId: 'company-9',
      });
      prisma.userPermission.findFirst.mockResolvedValue(null);

      // Access is denied; findOne's broad outer catch re-wraps the
      // ForbiddenException as a generic fetch error.
      await expect(
        service.findOne('req-1', makeCompanyUser(companyId)),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_REQUEST_FETCH_ERROR' },
      });
    });

    it('throws a NOT_FOUND business error when the request does not exist', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing', adminUser)).rejects.toMatchObject(
        {
          extensions: { code: 'BANSHEE_REQUEST_NOTFOUND_ERROR' },
        },
      );
    });
  });

  describe('BE-REQ-04: update banshee request', () => {
    it('updates only the supplied fields and leaves others untouched', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue({
        id: 'req-1',
        companyId,
        period: 6,
        levelId,
        driveId,
        locationId,
        images: [],
      });
      const updated = {
        id: 'req-1',
        comment: 'updated comment',
        measured: true,
      };
      prisma.bansheeRequest.update.mockResolvedValue(updated);

      const result = await service.update(
        'req-1',
        { comment: 'updated comment', measured: true } as any,
        adminUser,
      );

      expect(result).toMatchObject(updated);
      const updateArg = prisma.bansheeRequest.update.mock.calls[0][0];
      expect(updateArg.where).toEqual({ id: 'req-1' });
      expect(updateArg.data.comment).toBe('updated comment');
      expect(updateArg.data.measured).toBe(true);
      // Untouched fields must be left as `undefined` (no overwrite).
      expect(updateArg.data.serialNumber).toBeUndefined();
      expect(updateArg.data.name).toBeUndefined();
      expect(updateArg.data.period).toBeUndefined();
    });

    it('recomputes proceq due dates when the period changes', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue({
        id: 'req-1',
        companyId,
        period: 6,
        levelId,
        driveId,
        locationId,
        images: [],
      });
      prisma.proceqData.findMany.mockResolvedValue([
        { id: 'p1', updatedTimestamp: new Date('2026-01-01') },
        { id: 'p2', updatedTimestamp: null }, // filtered out (no timestamp)
      ]);
      prisma.proceqData.update.mockResolvedValue({});
      prisma.bansheeRequest.update.mockResolvedValue({
        id: 'req-1',
        period: 12,
      });

      await service.update('req-1', { period: 12 } as any, adminUser);

      expect(prisma.proceqData.update).toHaveBeenCalledTimes(1);
      const arg = prisma.proceqData.update.mock.calls[0][0];
      expect(arg.where).toEqual({ id: 'p1' });
      // 2026-01-01 + 12 months => 2027.
      expect((arg.data.dueDate as Date).getFullYear()).toBe(2027);
    });

    it('validates relations when a hierarchy id changes', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue({
        id: 'req-1',
        companyId,
        period: 6,
        levelId,
        driveId,
        locationId,
        images: [],
      });
      prisma.level.findUnique.mockResolvedValue(null); // new level not found

      await expect(
        service.update('req-1', { levelId: 'level-2' } as any, adminUser),
      ).rejects.toMatchObject({ extensions: { code: 'LEVEL_NOTFOUND_ERROR' } });
    });

    it('throws NOT_FOUND when updating a missing request', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue(null);

      await expect(
        service.update('missing', { comment: 'x' } as any, adminUser),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_REQUEST_NOTFOUND_ERROR' },
      });
    });

    it('denies the update when the caller lacks access to the target company', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue({
        id: 'req-1',
        companyId,
        period: 6,
        levelId,
        driveId,
        locationId,
        images: [],
      });
      prisma.userPermission.findFirst.mockResolvedValue(null); // no access

      await expect(
        service.update(
          'req-1',
          { companyId: 'company-9' } as any,
          makeCompanyUser(companyId),
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'USER_COMPANY_ACCESS_DENIED' },
      });
      expect(prisma.bansheeRequest.update).not.toHaveBeenCalled();
    });

    it('appends newly uploaded images to the existing ones', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue({
        id: 'req-1',
        companyId,
        period: 6,
        levelId,
        driveId,
        locationId,
        images: ['/uploads/bansheeRequests/old.png'],
      });
      prisma.bansheeRequest.update.mockImplementation(({ data }: any) =>
        Promise.resolve({ id: 'req-1', ...data }),
      );
      // Exercise the append logic without re-driving the stream pipeline
      // (the pipeline itself is covered by the `saveImage` tests below).
      jest
        .spyOn(service as any, 'saveImage')
        .mockResolvedValue('/uploads/bansheeRequests/new.png');

      await service.update(
        'req-1',
        { images: [Promise.resolve({}) as any] } as any,
        adminUser,
      );

      const updateArg = prisma.bansheeRequest.update.mock.calls[0][0];
      expect(updateArg.data.images).toEqual([
        '/uploads/bansheeRequests/old.png',
        '/uploads/bansheeRequests/new.png',
      ]);
    });

    it('wraps an unexpected update failure in a generic update error', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue({
        id: 'req-1',
        companyId,
        period: 6,
        levelId,
        driveId,
        locationId,
        images: [],
      });
      prisma.bansheeRequest.update.mockRejectedValue(new Error('db down'));

      await expect(
        service.update('req-1', { comment: 'x' } as any, adminUser),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_REQUEST_UPDATE_ERROR_GENERIC' },
      });
    });
  });

  describe('BE-REQ-05: reject invalid banshee request', () => {
    it('rejects a duplicate serial number and does not write a row', async () => {
      prisma.bansheeRequest.findFirst.mockResolvedValue({
        id: 'existing',
        serialNumber: 'SN-1001',
      });

      await expect(
        service.create(validCreateInput as any, adminUser),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_REQUEST_DUPLICATE_SERIAL_NUMBER' },
      });
      expect(prisma.bansheeRequest.create).not.toHaveBeenCalled();
    });

    it('rejects when the referenced level does not exist', async () => {
      prisma.bansheeRequest.findFirst.mockResolvedValue(null);
      prisma.level.findUnique.mockResolvedValue(null);

      await expect(
        service.create(validCreateInput as any, adminUser),
      ).rejects.toMatchObject({ extensions: { code: 'LEVEL_NOTFOUND_ERROR' } });
      expect(prisma.bansheeRequest.create).not.toHaveBeenCalled();
    });

    it('rejects when the drive does not exist', async () => {
      prisma.bansheeRequest.findFirst.mockResolvedValue(null);
      prisma.drive.findUnique.mockResolvedValue(null);

      await expect(
        service.create(validCreateInput as any, adminUser),
      ).rejects.toMatchObject({ extensions: { code: 'DRIVE_NOTFOUND_ERROR' } });
    });

    it('rejects when the drive does not belong to the level', async () => {
      prisma.bansheeRequest.findFirst.mockResolvedValue(null);
      prisma.drive.findUnique.mockResolvedValue({
        id: driveId,
        levelId: 'other',
      });

      await expect(
        service.create(validCreateInput as any, adminUser),
      ).rejects.toMatchObject({
        extensions: { code: 'DRIVE_LEVEL_MISMATCH_ERROR' },
      });
    });

    it('rejects when the location does not exist', async () => {
      prisma.bansheeRequest.findFirst.mockResolvedValue(null);
      prisma.location.findUnique.mockResolvedValue(null);

      await expect(
        service.create(validCreateInput as any, adminUser),
      ).rejects.toMatchObject({
        extensions: { code: 'LOCATION_NOTFOUND_ERROR' },
      });
    });

    it('rejects when the location does not belong to the drive', async () => {
      prisma.bansheeRequest.findFirst.mockResolvedValue(null);
      prisma.location.findUnique.mockResolvedValue({
        id: locationId,
        driveId: 'other',
      });

      await expect(
        service.create(validCreateInput as any, adminUser),
      ).rejects.toMatchObject({
        extensions: { code: 'LOCATION_DRIVE_MISMATCH_ERROR' },
      });
    });

    it('rejects when the linked order item does not exist', async () => {
      prisma.bansheeRequest.findFirst.mockResolvedValue(null);
      prisma.bansheeOrderItem.findUnique.mockResolvedValue(null);

      await expect(
        service.create(
          { ...validCreateInput, bansheeOrderItemId: 'ghost' } as any,
          adminUser,
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_ORDER_ITEM_NOTFOUND_ERROR' },
      });
    });

    it('rejects when the linked order item is not PENDING', async () => {
      prisma.bansheeRequest.findFirst.mockResolvedValue(null);
      prisma.bansheeOrderItem.findUnique.mockResolvedValue({
        id: 'oi-1',
        itemType: BansheeCartItemType.NEW_BANSHEE,
        status: BansheeOrderItemStatus.FULFILLED,
        order: { companyId },
      });

      await expect(
        service.create(
          { ...validCreateInput, bansheeOrderItemId: 'oi-1' } as any,
          adminUser,
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_ORDER_ITEM_INVALID_TYPE' },
      });
    });

    it('rejects when the linked order item is not a NEW_BANSHEE item', async () => {
      prisma.bansheeRequest.findFirst.mockResolvedValue(null);
      prisma.bansheeOrderItem.findUnique.mockResolvedValue({
        id: 'oi-1',
        itemType: BansheeCartItemType.SERVICE_EXISTING,
        status: BansheeOrderItemStatus.PENDING,
        order: { companyId },
      });

      await expect(
        service.create(
          { ...validCreateInput, bansheeOrderItemId: 'oi-1' } as any,
          adminUser,
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_ORDER_ITEM_INVALID_TYPE' },
      });
    });

    it('rejects a non-admin who cannot access the linked order item company', async () => {
      prisma.bansheeRequest.findFirst.mockResolvedValue(null);
      prisma.bansheeOrderItem.findUnique.mockResolvedValue({
        id: 'oi-1',
        itemType: BansheeCartItemType.NEW_BANSHEE,
        status: BansheeOrderItemStatus.PENDING,
        order: { companyId: 'company-9' },
      });
      // validateUserCompanyAccess finds no permission for company-9.
      prisma.userPermission.findFirst.mockResolvedValue(null);

      await expect(
        service.create(
          { ...validCreateInput, bansheeOrderItemId: 'oi-1' } as any,
          makeCompanyUser(companyId),
        ),
      ).rejects.toThrow('User does not have access to this banshee order.');
      expect(prisma.bansheeRequest.create).not.toHaveBeenCalled();
    });

    it('rejects an invalid image file type', async () => {
      prisma.bansheeRequest.findFirst.mockResolvedValue(null);
      const badImage = Promise.resolve({
        file: {
          filename: 'notes.txt',
          mimetype: 'text/plain',
          createReadStream: () => ({}),
        },
      });

      await expect(
        service.create(
          { ...validCreateInput, images: [badImage] } as any,
          adminUser,
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'INVALID_FILE_TYPE_ERROR' },
      });
      expect(prisma.bansheeRequest.create).not.toHaveBeenCalled();
    });

    it('wraps unexpected errors in a generic creation error', async () => {
      prisma.bansheeRequest.findFirst.mockRejectedValue(new Error('db down'));

      await expect(
        service.create(validCreateInput as any, adminUser),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_REQUEST_CREATION_ERROR_GENERIC' },
      });
    });
  });

  /**
   * The image upload pipeline (`saveImage`) streams bytes to disk. These tests
   * drive it through `create` with in-memory readable streams and a stubbed
   * filesystem so nothing real is written.
   */
  describe('create — image upload pipeline (saveImage)', () => {
    const makeImageUpload = (
      content: Buffer,
      filename = 'photo.png',
      mimetype = 'image/png',
    ) =>
      Promise.resolve({
        file: {
          filename,
          mimetype,
          createReadStream: () => Readable.from([content]),
        },
      });

    it('streams a valid image to disk and persists its path', async () => {
      const mkdirSpy = jest
        .spyOn(fs, 'mkdir')
        .mockResolvedValue(undefined as never);
      // Swallow the piped bytes so nothing touches the real filesystem.
      const sink = new Writable({ write: (_c, _e, cb) => cb() });
      const cwsSpy = jest
        .spyOn(fsSync, 'createWriteStream')
        .mockReturnValue(sink as any);

      prisma.bansheeRequest.findFirst.mockResolvedValue(null);
      prisma.bansheeRequest.create.mockImplementation(({ data }: any) =>
        Promise.resolve({ id: 'req-img', ...data }),
      );

      const result: any = await service.create(
        {
          ...validCreateInput,
          images: [makeImageUpload(Buffer.from('fake-png-bytes'))],
        } as any,
        adminUser,
      );

      expect(mkdirSpy).toHaveBeenCalled();
      expect(cwsSpy).toHaveBeenCalledTimes(1);
      expect(Array.isArray(result.images)).toBe(true);
      expect(result.images).toHaveLength(1);
      expect(result.images[0]).toMatch(/^\/uploads\/bansheeRequests\/.+\.png$/);
    });

    it('rejects an image that exceeds the 10MB size limit', async () => {
      jest.spyOn(fs, 'mkdir').mockResolvedValue(undefined as never);
      jest.spyOn(fs, 'unlink').mockResolvedValue(undefined as never);
      const sink = new Writable({ write: (_c, _e, cb) => cb() });
      jest.spyOn(fsSync, 'createWriteStream').mockReturnValue(sink as any);

      prisma.bansheeRequest.findFirst.mockResolvedValue(null);

      const oversized = Buffer.alloc(10 * 1024 * 1024 + 1);

      await expect(
        service.create(
          { ...validCreateInput, images: [makeImageUpload(oversized)] } as any,
          adminUser,
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'FILE_SIZE_EXCEEDED_ERROR' },
      });
      expect(prisma.bansheeRequest.create).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('rolls back session stats and deletes the request', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue({
        id: 'req-1',
        companyId,
        siteId,
        proceqData: [
          {
            createdTimestamp: new Date('2026-01-10'),
            comments: 'broken',
            readings: [{ id: 'r1' }],
          },
        ],
      });
      prisma.bansheeRequest.delete.mockResolvedValue({ id: 'req-1' });

      const result = await service.remove('req-1', adminUser);

      expect(result).toMatchObject({ id: 'req-1' });
      expect(statsService.updateStatsForMeasurement).toHaveBeenCalledTimes(1);
      // last positional arg is the operation: 'delete'
      const statsCall = statsService.updateStatsForMeasurement.mock.calls[0];
      expect(statsCall[statsCall.length - 1]).toBe('delete');
      expect(prisma.bansheeRequest.delete).toHaveBeenCalledWith({
        where: { id: 'req-1' },
      });
    });

    it('throws NOT_FOUND when the request does not exist', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing', adminUser)).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_REQUEST_NOTFOUND_ERROR' },
      });
    });

    it('denies a non-admin without access to the request company', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue({
        id: 'req-1',
        companyId: 'company-9',
        siteId,
        proceqData: [],
      });
      prisma.userPermission.findFirst.mockResolvedValue(null);

      await expect(
        service.remove('req-1', makeCompanyUser(companyId)),
      ).rejects.toThrow('User does not have access to this banshee request.');
      expect(prisma.bansheeRequest.delete).not.toHaveBeenCalled();
    });

    it('wraps an unexpected delete failure in a generic delete error', async () => {
      prisma.bansheeRequest.findUnique.mockResolvedValue({
        id: 'req-1',
        companyId,
        siteId,
        proceqData: [],
      });
      prisma.bansheeRequest.delete.mockRejectedValue(new Error('fk violation'));

      await expect(service.remove('req-1', adminUser)).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_REQUEST_DELETE_ERROR_GENERIC' },
      });
    });
  });

  describe('getStatusDistribution', () => {
    it('aggregates counts overall and per location, defaulting to NOT_MEASURABLE', async () => {
      prisma.bansheeRequest.findMany.mockResolvedValue([
        {
          id: 'req-1',
          locationId: 'loc-1',
          site: { siteName: 'Site 1' },
          level: { levelName: 'Level 1' },
          drive: { driveName: 'Drive 1' },
          location: { locationName: 'Loc 1' },
          proceqData: [{ status: 'ELASTIC', createdTimestamp: new Date() }],
        },
        {
          id: 'req-2',
          locationId: 'loc-1',
          site: { siteName: 'Site 1' },
          level: { levelName: 'Level 1' },
          drive: { driveName: 'Drive 1' },
          location: { locationName: 'Loc 1' },
          proceqData: [], // no measurement -> NOT_MEASURABLE
        },
      ]);

      const result = await service.getStatusDistribution(
        { companyId },
        [],
        adminUser,
        [Application.BANSHEE],
      );

      expect(result.total).toBe(2);
      const statusMap = Object.fromEntries(
        result.statusCounts.map((s: any) => [s.status, s.count]),
      );
      expect(statusMap.ELASTIC).toBe(1);
      expect(statusMap.NOT_MEASURABLE).toBe(1);
      expect(result.byLocation).toHaveLength(1);
      expect(result.byLocation?.[0]).toMatchObject({
        locationId: 'loc-1',
        locationName: 'Loc 1',
        siteName: 'Site 1',
        levelName: 'Level 1',
        driveName: 'Drive 1',
        total: 2,
      });
    });

    it('applies a proceqData date window and defaults missing relation names to Unknown', async () => {
      const startDate = new Date('2026-01-01');
      const endDate = new Date('2026-02-01');
      prisma.bansheeRequest.findMany.mockResolvedValue([
        {
          id: 'req-1',
          locationId: 'loc-1',
          site: null,
          level: null,
          drive: null,
          location: null,
          proceqData: [{ status: 'ELASTIC', updatedTimestamp: startDate }],
        },
      ]);

      const result = await service.getStatusDistribution(
        { companyId, startDate, endDate },
        [],
        adminUser,
        [Application.BANSHEE],
      );

      const findManyArg = prisma.bansheeRequest.findMany.mock.calls[0][0];
      expect(findManyArg.where.proceqData).toEqual({
        some: { updatedTimestamp: { gte: startDate, lte: endDate } },
      });
      expect(result.byLocation?.[0]).toMatchObject({
        locationName: 'Unknown',
        siteName: 'Unknown',
        levelName: 'Unknown',
        driveName: 'Unknown',
      });
    });

    it('denies a non-admin without app access for the company', async () => {
      prisma.plan.findMany.mockResolvedValue([]);

      await expect(
        service.getStatusDistribution(
          { companyId },
          [companyId],
          makeCompanyUser(companyId),
          [Application.BANSHEE],
        ),
      ).rejects.toThrow(
        'User missing access to this application for this company.',
      );
    });

    it('denies a non-admin whose requested company is outside their allowed list', async () => {
      // App access passes but the company is not in the allowed list.
      prisma.plan.findMany.mockResolvedValue([activeBansheePlan(companyId)]);

      await expect(
        service.getStatusDistribution(
          { companyId },
          ['some-other-company'],
          makeCompanyUser(companyId),
          [Application.BANSHEE],
        ),
      ).rejects.toThrow('User does not have access to this company.');
    });

    it('scopes a non-admin without a companyId filter to their allowed companies', async () => {
      prisma.bansheeRequest.findMany.mockResolvedValue([]);

      await service.getStatusDistribution(
        {},
        [companyId],
        makeCompanyUser(companyId),
        [Application.BANSHEE],
      );

      expect(
        prisma.bansheeRequest.findMany.mock.calls[0][0].where.companyId,
      ).toEqual({
        in: [companyId],
      });
    });
  });

  describe('getEventLogs', () => {
    it('returns paginated event logs for an admin and filters by companyId', async () => {
      prisma.bansheeEventLog.count.mockResolvedValue(3);
      const logs = [{ id: 'evt-1' }, { id: 'evt-2' }, { id: 'evt-3' }];
      prisma.bansheeEventLog.findMany.mockResolvedValue(logs);

      const result = await service.getEventLogs({ companyId }, [], adminUser, [
        Application.BANSHEE,
      ]);

      expect(result.totalRecords).toBe(3);
      expect(result.results).toBe(logs);
      expect(
        prisma.bansheeEventLog.findMany.mock.calls[0][0].where.bansheeRequest,
      ).toMatchObject({ companyId });
    });

    it('scopes a non-admin to their company via the bansheeRequest relation', async () => {
      prisma.plan.findMany.mockResolvedValue([activeBansheePlan(companyId)]);
      prisma.bansheeEventLog.count.mockResolvedValue(0);
      prisma.bansheeEventLog.findMany.mockResolvedValue([]);

      await service.getEventLogs(
        { companyId },
        [companyId],
        makeCompanyUser(companyId),
        [Application.BANSHEE],
      );

      expect(
        prisma.bansheeEventLog.findMany.mock.calls[0][0].where.bansheeRequest,
      ).toMatchObject({ companyId });
    });

    it('scopes a non-admin without a companyId to their allowed companies and honours siteId', async () => {
      prisma.bansheeEventLog.count.mockResolvedValue(0);
      prisma.bansheeEventLog.findMany.mockResolvedValue([]);

      await service.getEventLogs(
        { siteId },
        [companyId],
        makeCompanyUser(companyId),
        [Application.BANSHEE],
      );

      const where = prisma.bansheeEventLog.findMany.mock.calls[0][0].where;
      expect(where.bansheeRequest).toMatchObject({
        companyId: { in: [companyId] },
        siteId,
      });
    });

    it('denies a non-admin whose requested company is outside their allowed list', async () => {
      prisma.plan.findMany.mockResolvedValue([activeBansheePlan(companyId)]);

      // The ForbiddenException is swallowed by the broad catch and re-wrapped.
      await expect(
        service.getEventLogs(
          { companyId },
          ['other-company'],
          makeCompanyUser(companyId),
          [Application.BANSHEE],
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'EVENT_LOGS_FETCH_ERROR' },
      });
      expect(prisma.bansheeEventLog.findMany).not.toHaveBeenCalled();
    });

    it('wraps an unexpected query failure in a generic fetch error', async () => {
      prisma.bansheeEventLog.count.mockRejectedValue(new Error('db down'));

      await expect(
        service.getEventLogs({ companyId }, [], adminUser, [
          Application.BANSHEE,
        ]),
      ).rejects.toMatchObject({
        extensions: { code: 'EVENT_LOGS_FETCH_ERROR' },
      });
    });
  });
});
