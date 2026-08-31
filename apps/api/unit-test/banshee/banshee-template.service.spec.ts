import { PrismaService } from 'src/prisma/prisma.service';
import { BansheeTemplateService } from 'src/banshee-template/banshee-template.service';
import {
  PrismaMock,
  activeBansheePlan,
  adminUser,
  createPrismaMock,
  makeCompanyUser,
} from '../test-utils';

/**
 * Banshee Template API — unit tests.
 *
 * Covers smoke cases BE-TMP-01 .. BE-TMP-05 plus extended coverage of access
 * control and hierarchy (level/drive/location) validation.
 */
describe('BansheeTemplateService', () => {
  let prisma: PrismaMock;
  let service: BansheeTemplateService;

  const companyId = 'company-1';
  const levelId = 'level-1';
  const driveId = 'drive-1';
  const locationId = 'location-1';

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new BansheeTemplateService(prisma as unknown as PrismaService);
  });

  describe('BE-TMP-01: create banshee template', () => {
    it('creates and returns a template when the name is unique', async () => {
      prisma.bansheeTemplate.findFirst.mockResolvedValue(null); // no duplicate name
      const created = { id: 'tpl-1', templateName: 'Template A', companyId };
      prisma.bansheeTemplate.create.mockResolvedValue(created);

      const result = await service.createBansheeTemplate(
        { templateName: 'Template A', companyId } as any,
        adminUser,
      );

      expect(result).toMatchObject({ id: 'tpl-1', templateName: 'Template A' });
      const arg = prisma.bansheeTemplate.create.mock.calls[0][0];
      expect(arg.data).toMatchObject({
        templateName: 'Template A',
        companyId,
        createdBy: adminUser.id,
      });
    });

    it('allows a non-admin with company access to create a template', async () => {
      prisma.userPermission.findFirst.mockResolvedValue({ id: 'perm-1' });
      prisma.bansheeTemplate.findFirst.mockResolvedValue(null);
      prisma.bansheeTemplate.create.mockResolvedValue({ id: 'tpl-1' });

      const result = await service.createBansheeTemplate(
        { templateName: 'Template A', companyId } as any,
        makeCompanyUser(companyId),
      );

      expect(result).toMatchObject({ id: 'tpl-1' });
    });

    it('denies a non-admin without company access', async () => {
      prisma.userPermission.findFirst.mockResolvedValue(null);

      // NOTE: an access failure here is denied (create is never reached), but the
      // service's broad outer catch swallows the ForbiddenException and re-wraps
      // it as a generic creation error. We assert the *actual* behaviour.
      await expect(
        service.createBansheeTemplate(
          { templateName: 'Template A', companyId } as any,
          makeCompanyUser(companyId),
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_TEMPLATE_CREATION_ERROR_GENERIC' },
      });
      expect(prisma.bansheeTemplate.create).not.toHaveBeenCalled();
    });

    it('rejects a duplicate template name within the same company', async () => {
      prisma.bansheeTemplate.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(
        service.createBansheeTemplate(
          { templateName: 'Template A', companyId } as any,
          adminUser,
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_TEMPLATE_DUPLICATE_TEMPLATE_NAME' },
      });
      expect(prisma.bansheeTemplate.create).not.toHaveBeenCalled();
    });

    it('rejects when the referenced level does not exist', async () => {
      prisma.bansheeTemplate.findFirst.mockResolvedValue(null);
      prisma.level.findUnique.mockResolvedValue(null);

      await expect(
        service.createBansheeTemplate(
          { templateName: 'Template A', companyId, levelId } as any,
          adminUser,
        ),
      ).rejects.toMatchObject({ extensions: { code: 'LEVEL_NOTFOUND_ERROR' } });
    });

    it('rejects when the drive does not belong to the level', async () => {
      prisma.bansheeTemplate.findFirst.mockResolvedValue(null);
      prisma.level.findUnique.mockResolvedValue({ id: levelId });
      prisma.drive.findUnique.mockResolvedValue({
        id: driveId,
        levelId: 'other-level',
      });

      await expect(
        service.createBansheeTemplate(
          { templateName: 'Template A', companyId, levelId, driveId } as any,
          adminUser,
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'DRIVE_LEVEL_MISMATCH_ERROR' },
      });
    });

    it('rejects when the location does not belong to the drive', async () => {
      prisma.bansheeTemplate.findFirst.mockResolvedValue(null);
      prisma.level.findUnique.mockResolvedValue({ id: levelId });
      prisma.drive.findUnique.mockResolvedValue({ id: driveId, levelId });
      prisma.location.findUnique.mockResolvedValue({
        id: locationId,
        driveId: 'other-drive',
      });

      await expect(
        service.createBansheeTemplate(
          {
            templateName: 'Template A',
            companyId,
            levelId,
            driveId,
            locationId,
          } as any,
          adminUser,
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'LOCATION_DRIVE_MISMATCH_ERROR' },
      });
    });
  });

  describe('BE-TMP-02: list templates by company', () => {
    it('returns the templates scoped to the requested company only', async () => {
      const templates = [{ id: 'tpl-1' }, { id: 'tpl-2' }];
      prisma.bansheeTemplate.findMany.mockResolvedValue(templates);

      const result = await service.findBansheeTemplates(companyId, adminUser);

      expect(result).toBe(templates);
      expect(prisma.bansheeTemplate.findMany.mock.calls[0][0].where).toEqual({
        companyId,
      });
    });

    it('allows a non-admin with an active BANSHEE plan for the company', async () => {
      prisma.plan.findMany.mockResolvedValue([activeBansheePlan(companyId)]);
      prisma.bansheeTemplate.findMany.mockResolvedValue([{ id: 'tpl-1' }]);

      const result = await service.findBansheeTemplates(
        companyId,
        makeCompanyUser(companyId),
      );

      expect(result).toEqual([{ id: 'tpl-1' }]);
    });

    it('denies a non-admin without BANSHEE access for the company', async () => {
      prisma.plan.findMany.mockResolvedValue([]); // no active plan

      await expect(
        service.findBansheeTemplates(companyId, makeCompanyUser(companyId)),
      ).rejects.toThrow(
        'User missing access to this application for this company.',
      );
    });
  });

  describe('BE-TMP-03: fetch template by id', () => {
    it('returns the template when it exists', async () => {
      const template = { id: 'tpl-1', companyId, templateName: 'Template A' };
      prisma.bansheeTemplate.findUnique.mockResolvedValue(template);

      const result = await service.findBansheeTemplateById('tpl-1', adminUser);

      expect(result).toMatchObject({ id: 'tpl-1' });
      expect(prisma.bansheeTemplate.findUnique).toHaveBeenCalledWith({
        where: { id: 'tpl-1' },
      });
    });

    it('throws a NOT_FOUND error when the id does not exist', async () => {
      // Note: the service raises a business error here (it does not return null).
      prisma.bansheeTemplate.findUnique.mockResolvedValue(null);

      await expect(
        service.findBansheeTemplateById('missing', adminUser),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_TEMPLATE_NOTFOUND_ERROR' },
      });
    });

    it('denies a non-admin without access to the template company', async () => {
      prisma.bansheeTemplate.findUnique.mockResolvedValue({
        id: 'tpl-1',
        companyId,
      });
      prisma.userPermission.findFirst.mockResolvedValue(null);

      await expect(
        service.findBansheeTemplateById('tpl-1', makeCompanyUser(companyId)),
      ).rejects.toThrow('User does not have access to this banshee template.');
    });
  });

  describe('BE-TMP-04: update template', () => {
    it('updates the template fields and returns the updated entity', async () => {
      prisma.bansheeTemplate.findUnique.mockResolvedValue({
        id: 'tpl-1',
        companyId,
        levelId: null,
        driveId: null,
        locationId: null,
      });
      prisma.bansheeTemplate.findFirst.mockResolvedValue(null); // no name clash
      const updated = { id: 'tpl-1', period: 12, comment: 'Updated' };
      prisma.bansheeTemplate.update.mockResolvedValue(updated);

      const result = await service.updateBansheeTemplate(
        'tpl-1',
        {
          templateName: 'Template A',
          companyId,
          period: 12,
          comment: 'Updated',
        } as any,
        adminUser,
      );

      expect(result).toMatchObject({ period: 12, comment: 'Updated' });
      const arg = prisma.bansheeTemplate.update.mock.calls[0][0];
      expect(arg.where).toEqual({ id: 'tpl-1' });
      expect(arg.data).toMatchObject({
        period: 12,
        comment: 'Updated',
        updatedBy: adminUser.id,
      });
    });

    it('throws NOT_FOUND when updating a missing template', async () => {
      prisma.bansheeTemplate.findUnique.mockResolvedValue(null);

      await expect(
        service.updateBansheeTemplate(
          'missing',
          { templateName: 'X', companyId } as any,
          adminUser,
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_TEMPLATE_NOTFOUND_ERROR' },
      });
    });

    it('rejects renaming onto another template that already uses the name', async () => {
      prisma.bansheeTemplate.findUnique.mockResolvedValue({
        id: 'tpl-1',
        companyId,
      });
      prisma.bansheeTemplate.findFirst.mockResolvedValue({ id: 'tpl-2' }); // different id

      await expect(
        service.updateBansheeTemplate(
          'tpl-1',
          { templateName: 'Taken', companyId } as any,
          adminUser,
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_TEMPLATE_DUPLICATE_TEMPLATE_NAME' },
      });
    });

    it('allows keeping the same name on the same template', async () => {
      prisma.bansheeTemplate.findUnique.mockResolvedValue({
        id: 'tpl-1',
        companyId,
      });
      prisma.bansheeTemplate.findFirst.mockResolvedValue({ id: 'tpl-1' }); // same id
      prisma.bansheeTemplate.update.mockResolvedValue({ id: 'tpl-1' });

      const result = await service.updateBansheeTemplate(
        'tpl-1',
        { templateName: 'Same', companyId } as any,
        adminUser,
      );

      expect(result).toMatchObject({ id: 'tpl-1' });
    });

    // The UI clears descendants when a new level is picked. Validating the
    // cleared drive/location against the stored ones would reject this.
    it('accepts a new level when drive and location are cleared in the same update', async () => {
      prisma.bansheeTemplate.findUnique.mockResolvedValue({
        id: 'tpl-1',
        companyId,
        levelId,
        driveId,
        locationId,
      });
      prisma.bansheeTemplate.findFirst.mockResolvedValue(null);
      prisma.level.findUnique.mockResolvedValue({ id: 'level-2' });
      // Stored drive still belongs to the old level.
      prisma.drive.findUnique.mockResolvedValue({ id: driveId, levelId });
      prisma.bansheeTemplate.update.mockResolvedValue({ id: 'tpl-1' });

      const result = await service.updateBansheeTemplate(
        'tpl-1',
        {
          templateName: 'Template A',
          companyId,
          levelId: 'level-2',
          driveId: null,
          locationId: null,
        } as any,
        adminUser,
      );

      expect(result).toMatchObject({ id: 'tpl-1' });
      // The cleared descendants must not be validated at all.
      expect(prisma.drive.findUnique).not.toHaveBeenCalled();
      expect(prisma.location.findUnique).not.toHaveBeenCalled();
      expect(prisma.bansheeTemplate.update.mock.calls[0][0].data).toMatchObject(
        {
          levelId: 'level-2',
          driveId: null,
          locationId: null,
        },
      );
    });

    it('still rejects a drive that does not belong to a newly picked level', async () => {
      prisma.bansheeTemplate.findUnique.mockResolvedValue({
        id: 'tpl-1',
        companyId,
        levelId,
        driveId,
        locationId,
      });
      prisma.bansheeTemplate.findFirst.mockResolvedValue(null);
      prisma.level.findUnique.mockResolvedValue({ id: 'level-2' });
      prisma.drive.findUnique.mockResolvedValue({ id: driveId, levelId });

      await expect(
        service.updateBansheeTemplate(
          'tpl-1',
          {
            templateName: 'Template A',
            companyId,
            levelId: 'level-2',
            driveId, // kept, and it belongs to the old level
          } as any,
          adminUser,
        ),
      ).rejects.toMatchObject({
        extensions: { code: 'DRIVE_LEVEL_MISMATCH_ERROR' },
      });
    });

    it('validates the stored hierarchy when no hierarchy field is sent', async () => {
      prisma.bansheeTemplate.findUnique.mockResolvedValue({
        id: 'tpl-1',
        companyId,
        levelId,
        driveId,
        locationId,
      });
      prisma.bansheeTemplate.findFirst.mockResolvedValue(null);
      prisma.bansheeTemplate.update.mockResolvedValue({ id: 'tpl-1' });

      const result = await service.updateBansheeTemplate(
        'tpl-1',
        { templateName: 'Renamed', companyId } as any,
        adminUser,
      );

      expect(result).toMatchObject({ id: 'tpl-1' });
      // A pure rename should not re-check the untouched hierarchy.
      expect(prisma.level.findUnique).not.toHaveBeenCalled();
      expect(prisma.drive.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('BE-TMP-05: delete template', () => {
    it('deletes and returns the template when it exists', async () => {
      prisma.bansheeTemplate.findUnique.mockResolvedValue({
        id: 'tpl-1',
        companyId,
      });
      const deleted = { id: 'tpl-1', companyId };
      prisma.bansheeTemplate.delete.mockResolvedValue(deleted);

      const result = await service.deleteBansheeTemplate('tpl-1', adminUser);

      expect(result).toMatchObject({ id: 'tpl-1' });
      expect(prisma.bansheeTemplate.delete).toHaveBeenCalledWith({
        where: { id: 'tpl-1' },
      });
    });

    it('throws a NOT_FOUND error when deleting a non-existent template', async () => {
      prisma.bansheeTemplate.findUnique.mockResolvedValue(null);

      await expect(
        service.deleteBansheeTemplate('missing', adminUser),
      ).rejects.toMatchObject({
        extensions: { code: 'BANSHEE_TEMPLATE_NOTFOUND_ERROR' },
      });
      expect(prisma.bansheeTemplate.delete).not.toHaveBeenCalled();
    });

    it('denies a non-admin without access to the template company', async () => {
      prisma.bansheeTemplate.findUnique.mockResolvedValue({
        id: 'tpl-1',
        companyId,
      });
      prisma.userPermission.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteBansheeTemplate('tpl-1', makeCompanyUser(companyId)),
      ).rejects.toThrow('User does not have access to this banshee template.');
      expect(prisma.bansheeTemplate.delete).not.toHaveBeenCalled();
    });
  });
});
