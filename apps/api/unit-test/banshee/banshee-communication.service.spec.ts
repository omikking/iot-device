import { UserInputError } from '@nestjs/apollo';
import { BansheeEmailStatus } from '@prisma/client';
import { BansheeCommunicationService } from 'src/banshee-communication/banshee-communication.service';
import { createPrismaMock, makeCompanyUser, PrismaMock } from '../test-utils';

/**
 * Unit tests for the Contact Us orchestration in BansheeCommunicationService.
 *
 * The flow under test is:
 *   validate company -> save attachments -> create record (PENDING)
 *   -> send email (with attachments) -> mark SENT (or FAILED on error)
 *
 * `saveAttachments` (filesystem + stream parsing) is stubbed so we can focus on
 * the orchestration / status-tracking logic in isolation.
 */
describe('BansheeCommunicationService.contactUs', () => {
  const companyId = '11111111-1111-1111-1111-111111111111';
  const user = makeCompanyUser(companyId);

  let prisma: PrismaMock;
  let emailService: { sendContactUsEmail: jest.Mock };
  let pdfReportService: { generatePlotListReport: jest.Mock };
  let service: BansheeCommunicationService;

  const baseRecord = {
    id: 'banshee-email-id',
    status: BansheeEmailStatus.PENDING,
    message: 'Help please',
    userId: user.id,
    companyId,
    createdAt: new Date(),
    updatedAt: new Date(),
    attachments: [],
  };

  beforeEach(() => {
    prisma = createPrismaMock();
    (prisma as any).bansheeEmail = {
      create: jest.fn(),
      update: jest.fn(),
    };

    emailService = { sendContactUsEmail: jest.fn() };
    pdfReportService = { generatePlotListReport: jest.fn() };

    service = new BansheeCommunicationService(
      prisma as any,
      emailService as any,
      pdfReportService as any,
    );

    // Stub the filesystem-heavy attachment persistence by default.
    jest.spyOn(service as any, 'saveAttachments').mockResolvedValue([]);

    prisma.company.findUnique.mockResolvedValue({ name: 'Acme Mining' });
    (prisma as any).bansheeEmail.create.mockResolvedValue(baseRecord);
    (prisma as any).bansheeEmail.update.mockResolvedValue({
      ...baseRecord,
      status: BansheeEmailStatus.SENT,
    });
  });

  it('persists the request, emails support and marks it SENT', async () => {
    const result = await service.contactUs(
      companyId,
      'Help please',
      [],
      user,
    );

    expect(prisma.company.findUnique).toHaveBeenCalledWith({
      where: { id: companyId },
      select: { name: true },
    });
    expect((prisma as any).bansheeEmail.create).toHaveBeenCalledTimes(1);
    expect(emailService.sendContactUsEmail).toHaveBeenCalledWith(
      'Acme Mining',
      'Help please',
      user.fullName,
      [],
    );
    expect((prisma as any).bansheeEmail.update).toHaveBeenCalledWith({
      where: { id: baseRecord.id },
      data: { status: BansheeEmailStatus.SENT },
      include: { attachments: true },
    });
    expect(result.success).toBe(true);
  });

  it('forwards saved attachments to the email', async () => {
    const files = [
      {
        originalFileName: 'report.pdf',
        storedFileName: 'uuid.pdf',
        filePath: '/tmp/uuid.pdf',
        mimeType: 'application/pdf',
        fileSize: BigInt(1234),
      },
    ];
    (service as any).saveAttachments.mockResolvedValue(files);

    await service.contactUs(companyId, 'Help please', [{} as any], user);

    expect(emailService.sendContactUsEmail).toHaveBeenCalledWith(
      'Acme Mining',
      'Help please',
      user.fullName,
      files,
    );
  });

  it('coerces BigInt attachment fileSize to a number in the response', async () => {
    (prisma as any).bansheeEmail.update.mockResolvedValue({
      ...baseRecord,
      status: BansheeEmailStatus.SENT,
      attachments: [
        {
          id: 'att-1',
          originalFileName: 'report.pdf',
          storedFileName: 'uuid.pdf',
          filePath: '/tmp/uuid.pdf',
          mimeType: 'application/pdf',
          fileSize: BigInt(1234),
          createdAt: new Date(),
        },
      ],
    });

    const result = await service.contactUs(companyId, 'Help', [], user);

    expect(result.email?.attachments?.[0].fileSize).toBe(1234);
    expect(typeof result.email?.attachments?.[0].fileSize).toBe('number');
  });

  it('throws and skips email when the company does not exist', async () => {
    prisma.company.findUnique.mockResolvedValue(null);

    await expect(
      service.contactUs(companyId, 'Help', [], user),
    ).rejects.toBeInstanceOf(UserInputError);

    expect(emailService.sendContactUsEmail).not.toHaveBeenCalled();
    expect((prisma as any).bansheeEmail.create).not.toHaveBeenCalled();
  });

  it('rejects requests with more than the allowed number of attachments', async () => {
    const tooMany = Array.from({ length: 6 }, () => ({}) as any);

    await expect(
      service.contactUs(companyId, 'Help', tooMany, user),
    ).rejects.toMatchObject({
      extensions: { code: 'CONTACT_US_TOO_MANY_ATTACHMENTS' },
    });

    expect((service as any).saveAttachments).not.toHaveBeenCalled();
  });

  it('marks the request FAILED and throws when sending the email fails', async () => {
    emailService.sendContactUsEmail.mockRejectedValue(new Error('SMTP down'));

    await expect(
      service.contactUs(companyId, 'Help', [], user),
    ).rejects.toMatchObject({
      extensions: { code: 'CONTACT_US_EMAIL_ERROR' },
    });

    expect((prisma as any).bansheeEmail.update).toHaveBeenCalledWith({
      where: { id: baseRecord.id },
      data: { status: BansheeEmailStatus.FAILED },
    });
  });

  it('still succeeds when the email is sent but the SENT update fails', async () => {
    (prisma as any).bansheeEmail.update.mockRejectedValue(
      new Error('DB write failed'),
    );

    const result = await service.contactUs(companyId, 'Help', [], user);

    expect(emailService.sendContactUsEmail).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
    expect(result.email?.status).toBe(BansheeEmailStatus.SENT);
  });

  it('cleans up saved files and throws when the DB record cannot be created', async () => {
    const files = [
      {
        originalFileName: 'report.pdf',
        storedFileName: 'uuid.pdf',
        filePath: '/tmp/uuid.pdf',
        mimeType: 'application/pdf',
        fileSize: BigInt(1234),
      },
    ];
    (service as any).saveAttachments.mockResolvedValue(files);
    const cleanupSpy = jest
      .spyOn(service as any, 'cleanupFiles')
      .mockResolvedValue(undefined);
    (prisma as any).bansheeEmail.create.mockRejectedValue(
      new Error('unique constraint'),
    );

    await expect(
      service.contactUs(companyId, 'Help', [{} as any], user),
    ).rejects.toMatchObject({
      extensions: { code: 'CONTACT_US_FAILED' },
    });

    expect(cleanupSpy).toHaveBeenCalledWith(files);
    expect(emailService.sendContactUsEmail).not.toHaveBeenCalled();
  });
});
