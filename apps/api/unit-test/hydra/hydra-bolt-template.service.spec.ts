import { Application, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { HydraBoltTemplateService } from 'src/hydra-bolt-template/hydra-bolt-template.service';
import {
  PrismaMock,
  activePlanFor,
  adminUser,
  createPrismaMock,
  makeCompanyUser,
} from '../test-utils';

/**
 * Hydra Bolt Template API — unit tests for the update / delete paths.
 *
 * Both are written to keep the number of database round trips down, so the
 * tests assert the query pattern (what runs, and what is skipped) as well as
 * the returned value.
 */
describe('HydraBoltTemplateService', () => {
  let prisma: PrismaMock;
  let service: HydraBoltTemplateService;

  const companyId = 'company-1';
  const id = 'template-1';
  const levelId = 'level-1';
  const driveId = 'drive-1';
  const locationId = 'location-1';

  const existing = {
    levelId,
    driveId,
    locationId,
  };

  const updateInput = (overrides: Record<string, unknown> = {}) =>
    ({
      name: 'Template A',
      companyId,
      activateNotifications: true,
      ...overrides,
    }) as any;

  const notFoundError = () =>
    new Prisma.PrismaClientKnownRequestError(
      'Record to delete does not exist',
      {
        code: 'P2025',
        clientVersion: '5.13.0',
      },
    );

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new HydraBoltTemplateService(prisma as unknown as PrismaService);
  });

  describe('update', () => {
    it('updates the template and stamps the editing user', async () => {
      prisma.hydraBoltTemplate.findUnique.mockResolvedValue(existing);
      prisma.hydraBoltTemplate.findFirst.mockResolvedValue(null);
      prisma.hydraBoltTemplate.update.mockResolvedValue({
        id,
        name: 'Renamed',
      });

      const result = await service.update(
        id,
        updateInput({ name: 'Renamed' }),
        adminUser,
      );

      expect(result).toMatchObject({ id, name: 'Renamed' });
      const arg = prisma.hydraBoltTemplate.update.mock.calls[0][0];
      expect(arg.where).toEqual({ id });
      expect(arg.data).toMatchObject({
        name: 'Renamed',
        activateNotifications: true,
        updatedBy: adminUser.id,
      });
      // companyId is authorization input, not an editable field.
      expect(arg.data).not.toHaveProperty('companyId');
    });

    it('reads the template scoped to the caller company', async () => {
      prisma.hydraBoltTemplate.findUnique.mockResolvedValue(existing);
      prisma.hydraBoltTemplate.findFirst.mockResolvedValue(null);
      prisma.hydraBoltTemplate.update.mockResolvedValue({ id });

      await service.update(id, updateInput(), adminUser);

      expect(prisma.hydraBoltTemplate.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id, companyId } }),
      );
    });

    it('reports a template from another company as not found', async () => {
      // The company-scoped read comes back empty for a foreign id.
      prisma.hydraBoltTemplate.findUnique.mockResolvedValue(null);
      prisma.hydraBoltTemplate.findFirst.mockResolvedValue(null);

      await expect(
        service.update(id, updateInput(), adminUser),
      ).rejects.toMatchObject({
        extensions: { code: 'HYDRA_BOLT_TEMPLATE_NOTFOUND_ERROR' },
      });
      expect(prisma.hydraBoltTemplate.update).not.toHaveBeenCalled();
    });

    it('rejects a name already used by another template in the company', async () => {
      prisma.hydraBoltTemplate.findUnique.mockResolvedValue(existing);
      prisma.hydraBoltTemplate.findFirst.mockResolvedValue({ id: 'other' });

      await expect(
        service.update(id, updateInput(), adminUser),
      ).rejects.toMatchObject({
        extensions: { code: 'HYDRA_BOLT_TEMPLATE_DUPLICATE_NAME' },
      });
      expect(prisma.hydraBoltTemplate.update).not.toHaveBeenCalled();
    });

    it('excludes the template itself from the name collision check', async () => {
      prisma.hydraBoltTemplate.findUnique.mockResolvedValue(existing);
      prisma.hydraBoltTemplate.findFirst.mockResolvedValue(null);
      prisma.hydraBoltTemplate.update.mockResolvedValue({ id });

      await service.update(id, updateInput(), adminUser);

      expect(prisma.hydraBoltTemplate.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: 'Template A', companyId, id: { not: id } },
        }),
      );
    });

    it('skips hierarchy validation when the hierarchy is unchanged', async () => {
      prisma.hydraBoltTemplate.findUnique.mockResolvedValue(existing);
      prisma.hydraBoltTemplate.findFirst.mockResolvedValue(null);
      prisma.hydraBoltTemplate.update.mockResolvedValue({ id });

      // Same ids as the stored row, plus a field that is not part of the mine
      // hierarchy at all.
      await service.update(
        id,
        updateInput({ levelId, driveId, locationId, comment: 'note' }),
        adminUser,
      );

      expect(prisma.level.findUnique).not.toHaveBeenCalled();
      expect(prisma.drive.findUnique).not.toHaveBeenCalled();
      expect(prisma.location.findUnique).not.toHaveBeenCalled();
      expect(prisma.hydraBoltTemplate.update).toHaveBeenCalled();
    });

    it('validates the hierarchy when the template is moved', async () => {
      prisma.hydraBoltTemplate.findUnique.mockResolvedValue(existing);
      prisma.hydraBoltTemplate.findFirst.mockResolvedValue(null);
      prisma.level.findUnique.mockResolvedValue({ id: 'level-2' });
      prisma.drive.findUnique.mockResolvedValue({
        id: driveId,
        levelId: 'level-2',
      });
      prisma.location.findUnique.mockResolvedValue({ id: locationId, driveId });
      prisma.hydraBoltTemplate.update.mockResolvedValue({ id });

      await service.update(
        id,
        updateInput({ levelId: 'level-2', driveId, locationId }),
        adminUser,
      );

      expect(prisma.level.findUnique).toHaveBeenCalledWith({
        where: { id: 'level-2' },
      });
      expect(prisma.hydraBoltTemplate.update).toHaveBeenCalled();
    });

    it('rejects a move to a level that does not exist', async () => {
      prisma.hydraBoltTemplate.findUnique.mockResolvedValue(existing);
      prisma.hydraBoltTemplate.findFirst.mockResolvedValue(null);
      prisma.level.findUnique.mockResolvedValue(null);

      await expect(
        service.update(
          id,
          updateInput({ levelId: 'missing-level' }),
          adminUser,
        ),
      ).rejects.toMatchObject({ extensions: { code: 'LEVEL_NOTFOUND_ERROR' } });
      expect(prisma.hydraBoltTemplate.update).not.toHaveBeenCalled();
    });

    it('lets a non-admin with HYDRA access update', async () => {
      prisma.plan.findMany.mockResolvedValue([
        activePlanFor(companyId, Application.HYDRA),
      ]);
      prisma.hydraBoltTemplate.findUnique.mockResolvedValue(existing);
      prisma.hydraBoltTemplate.findFirst.mockResolvedValue(null);
      prisma.hydraBoltTemplate.update.mockResolvedValue({ id });

      const result = await service.update(
        id,
        updateInput(),
        makeCompanyUser(companyId, [Application.HYDRA]),
      );

      expect(result).toMatchObject({ id });
    });

    it('does not write when the company has no HYDRA plan', async () => {
      prisma.plan.findMany.mockResolvedValue([]);
      prisma.hydraBoltTemplate.findUnique.mockResolvedValue(existing);
      prisma.hydraBoltTemplate.findFirst.mockResolvedValue(null);

      await expect(
        service.update(
          id,
          updateInput(),
          makeCompanyUser(companyId, [Application.HYDRA]),
        ),
      ).rejects.toBeDefined();
      expect(prisma.hydraBoltTemplate.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the template in a single company-scoped statement', async () => {
      prisma.hydraBoltTemplate.delete.mockResolvedValue({ id, companyId });

      const result = await service.remove(id, adminUser, companyId);

      expect(result).toMatchObject({ id });
      expect(prisma.hydraBoltTemplate.delete).toHaveBeenCalledWith({
        where: { id, companyId },
      });
      // No read-before-delete round trip.
      expect(prisma.hydraBoltTemplate.findUnique).not.toHaveBeenCalled();
    });

    it('maps Prisma P2025 to a not-found error', async () => {
      prisma.hydraBoltTemplate.delete.mockRejectedValue(notFoundError());

      await expect(
        service.remove(id, adminUser, companyId),
      ).rejects.toMatchObject({
        extensions: { code: 'HYDRA_BOLT_TEMPLATE_NOTFOUND_ERROR' },
      });
    });

    it('wraps an unexpected database failure as a generic delete error', async () => {
      prisma.hydraBoltTemplate.delete.mockRejectedValue(new Error('boom'));

      await expect(
        service.remove(id, adminUser, companyId),
      ).rejects.toMatchObject({
        extensions: { code: 'HYDRA_BOLT_TEMPLATE_DELETE_ERROR_GENERIC' },
      });
    });

    it('lets a non-admin with HYDRA access delete', async () => {
      prisma.plan.findMany.mockResolvedValue([
        activePlanFor(companyId, Application.HYDRA),
      ]);
      prisma.hydraBoltTemplate.delete.mockResolvedValue({ id });

      const result = await service.remove(
        id,
        makeCompanyUser(companyId, [Application.HYDRA]),
        companyId,
      );

      expect(result).toMatchObject({ id });
    });

    it('never deletes when the caller lacks HYDRA access', async () => {
      prisma.plan.findMany.mockResolvedValue([]);

      await expect(
        service.remove(
          id,
          makeCompanyUser(companyId, [Application.HYDRA]),
          companyId,
        ),
      ).rejects.toBeDefined();
      expect(prisma.hydraBoltTemplate.delete).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns the template scoped to the caller company', async () => {
      prisma.hydraBoltTemplate.findUnique.mockResolvedValue({ id, companyId });

      const result = await service.findOne(id, companyId, adminUser);

      expect(result).toMatchObject({ id, companyId });
      expect(prisma.hydraBoltTemplate.findUnique).toHaveBeenCalledWith({
        where: { id, companyId },
      });
    });

    it('raises a not-found error for an unknown id', async () => {
      prisma.hydraBoltTemplate.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne(id, companyId, adminUser),
      ).rejects.toMatchObject({
        extensions: { code: 'HYDRA_BOLT_TEMPLATE_NOTFOUND_ERROR' },
      });
    });
  });
});
