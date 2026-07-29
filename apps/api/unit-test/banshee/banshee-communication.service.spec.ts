import { BansheeCartItemType, BansheeEmailStatus, Role } from '@prisma/client';
import { Readable } from 'stream';
import { promises as fs } from 'fs';
import { BansheeCommunicationService } from 'src/banshee-communication/banshee-communication.service';
import { createPrismaMock, makeCompanyUser, PrismaMock } from '../test-utils';

/**
 * Unit tests for BansheeCommunicationService.
 *
 * The service orchestrates five outbound flows:
 *   - `sharePlotList`  — validate + render a PDF and email it
 *   - `contactUs`      — persist a Contact Us request, email support, track status
 *   - `shareOrderDetails` — notify a company's Banshee users of a new order
 *   - `shareProceqMeasurementInsights` / `shareProceqStatusChange` — Proceq emails
 *
 * PrismaService, EmailService and PdfReportService are fully mocked. The file
 * IO helpers (`readUpload`, `saveAttachments`) are exercised directly with
 * in-memory streams and a stubbed `fs` so nothing real is written to disk.
 */
describe('BansheeCommunicationService', () => {
  const companyId = '11111111-1111-1111-1111-111111111111';
  const user = makeCompanyUser(companyId);

  let prisma: PrismaMock;
  let emailService: {
    sendContactUsEmail: jest.Mock;
    sendSharePlotListEmail: jest.Mock;
    sendOrderDetailsEmail: jest.Mock;
    sendProceqMeasurementInsightsEmail: jest.Mock;
    sendProceqStatusChangeEmail: jest.Mock;
  };
  let pdfReportService: { generatePlotListReport: jest.Mock };
  let service: BansheeCommunicationService;

  /** A resolved GraphQL Upload backed by an in-memory readable stream. */
  const makeUpload = (
    content: Buffer | string,
    filename: string,
    mimetype: string,
  ) => ({
    file: {
      filename,
      mimetype,
      createReadStream: () => Readable.from([Buffer.from(content)]),
    },
  });

  beforeEach(() => {
    prisma = createPrismaMock();
    // The mock factory doesn't include the bansheeEmail model — add the two
    // methods contactUs touches.
    (prisma as any).bansheeEmail = {
      create: jest.fn(),
      update: jest.fn(),
    };

    emailService = {
      sendContactUsEmail: jest.fn(),
      sendSharePlotListEmail: jest.fn(),
      sendOrderDetailsEmail: jest.fn(),
      sendProceqMeasurementInsightsEmail: jest.fn(),
      sendProceqStatusChangeEmail: jest.fn(),
    };
    pdfReportService = { generatePlotListReport: jest.fn() };

    service = new BansheeCommunicationService(
      prisma as any,
      emailService as any,
      pdfReportService as any,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ---------------------------------------------------------------------------
  // contactUs
  // ---------------------------------------------------------------------------
  describe('contactUs', () => {
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
      // Company exists and has a SANDVIK_ADMIN permission by default.
      prisma.company.findUnique.mockResolvedValue({
        name: 'Acme Mining',
        userPermission: [{ userId: 'sandvik-admin-id' }],
      });
      prisma.user.findUnique.mockResolvedValue({
        id: 'sandvik-admin-id',
        email: 'sandvik.admin@sandvik.com',
      });
      (prisma as any).bansheeEmail.create.mockResolvedValue(baseRecord);
      (prisma as any).bansheeEmail.update.mockResolvedValue({
        ...baseRecord,
        status: BansheeEmailStatus.SENT,
      });

      // Stub the filesystem-heavy attachment persistence by default.
      jest.spyOn(service as any, 'saveAttachments').mockResolvedValue([]);
    });

    it('persists the request, emails support (CC the Sandvik admin) and marks it SENT', async () => {
      const result = await service.contactUs(
        companyId,
        'Help please',
        [],
        user,
      );

      expect(prisma.company.findUnique).toHaveBeenCalledWith({
        where: { id: companyId },
        select: {
          name: true,
          userPermission: {
            where: { role: Role.SANDVIK_ADMIN },
            select: { userId: true },
          },
        },
      });
      expect((prisma as any).bansheeEmail.create).toHaveBeenCalledTimes(1);
      expect(emailService.sendContactUsEmail).toHaveBeenCalledWith(
        'Acme Mining',
        'Help please',
        user.fullName,
        [],
        'sandvik.admin@sandvik.com',
      );
      expect((prisma as any).bansheeEmail.update).toHaveBeenCalledWith({
        where: { id: baseRecord.id },
        data: { status: BansheeEmailStatus.SENT },
        include: { attachments: true },
      });
      expect(result.success).toBe(true);
    });

    it('omits the Sandvik admin email when the company has no SANDVIK_ADMIN', async () => {
      prisma.company.findUnique.mockResolvedValue({
        name: 'Acme Mining',
        userPermission: [],
      });

      await service.contactUs(companyId, 'Help please', [], user);

      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(emailService.sendContactUsEmail).toHaveBeenCalledWith(
        'Acme Mining',
        'Help please',
        user.fullName,
        [],
        undefined,
      );
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
        'sandvik.admin@sandvik.com',
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

    it('returns an email without an attachments array when none were stored', async () => {
      const withoutAttachments = {
        id: baseRecord.id,
        status: BansheeEmailStatus.SENT,
        message: baseRecord.message,
        userId: baseRecord.userId,
        companyId,
        createdAt: baseRecord.createdAt,
        updatedAt: baseRecord.updatedAt,
      };
      (prisma as any).bansheeEmail.update.mockResolvedValue(withoutAttachments);

      const result = await service.contactUs(companyId, 'Help', [], user);

      expect(result.email?.attachments).toBeUndefined();
    });

    it('throws and skips email when the company does not exist', async () => {
      prisma.company.findUnique.mockResolvedValue(null);

      await expect(
        service.contactUs(companyId, 'Help', [], user),
      ).rejects.toMatchObject({
        extensions: { code: 'INVITATION_COMPANY_NOT_FOUND_ERROR' },
      });

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

    it('still surfaces the email error even if marking it FAILED also fails', async () => {
      emailService.sendContactUsEmail.mockRejectedValue(new Error('SMTP down'));
      (prisma as any).bansheeEmail.update.mockRejectedValue(
        new Error('DB write failed'),
      );

      await expect(
        service.contactUs(companyId, 'Help', [], user),
      ).rejects.toMatchObject({
        extensions: { code: 'CONTACT_US_EMAIL_ERROR' },
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
  });

  // ---------------------------------------------------------------------------
  // sharePlotList
  // ---------------------------------------------------------------------------
  describe('sharePlotList', () => {
    const recipient = 'Recipient@Example.com';
    const image = { image: true } as any;
    const csv = { csv: true } as any;

    beforeEach(() => {
      prisma.company.findUnique.mockResolvedValue({ name: 'Acme Mining' });
      // Bypass the stream parsing: return already-read buffers.
      jest
        .spyOn(service as any, 'readUpload')
        .mockImplementation(async (_u, _types, label) => ({
          buffer: Buffer.from(`${label}-bytes`),
          filename: `${String(label).toLowerCase()}-file`,
          mimetype: 'application/octet-stream',
        }));
      jest
        .spyOn(service as any, 'writeTempPdf')
        .mockResolvedValue('/tmp/plot-list-report.pdf');
      jest.spyOn(fs, 'unlink').mockResolvedValue(undefined as never);
      pdfReportService.generatePlotListReport.mockResolvedValue(
        Buffer.from('%PDF-'),
      );
      emailService.sendSharePlotListEmail.mockResolvedValue(undefined);
    });

    it('renders a PDF, emails it to the normalized recipient and cleans up', async () => {
      const result = await service.sharePlotList(
        companyId,
        recipient,
        image,
        csv,
        user,
      );

      expect(pdfReportService.generatePlotListReport).toHaveBeenCalledTimes(1);
      expect(emailService.sendSharePlotListEmail).toHaveBeenCalledWith(
        'recipient@example.com',
        'Acme Mining',
        user.fullName,
        [
          {
            originalFileName: 'plot-list-report.pdf',
            filePath: '/tmp/plot-list-report.pdf',
          },
        ],
      );
      // Temp PDF is always removed afterwards.
      expect(fs.unlink).toHaveBeenCalledWith('/tmp/plot-list-report.pdf');
      expect(result).toEqual({
        success: true,
        sentTo: 'recipient@example.com',
        message: 'Plot list report sent to recipient@example.com',
      });
    });

    it('rejects an invalid recipient email before touching the DB', async () => {
      await expect(
        service.sharePlotList(companyId, 'not-an-email', image, csv, user),
      ).rejects.toMatchObject({
        extensions: { code: 'SHARE_PLOT_LIST_INVALID_EMAIL' },
      });
      expect(prisma.company.findUnique).not.toHaveBeenCalled();
    });

    it('throws when the company does not exist', async () => {
      prisma.company.findUnique.mockResolvedValue(null);

      await expect(
        service.sharePlotList(companyId, recipient, image, csv, user),
      ).rejects.toMatchObject({
        extensions: { code: 'INVITATION_COMPANY_NOT_FOUND_ERROR' },
      });
    });

    it('maps a PDF generation failure to a PDF error', async () => {
      pdfReportService.generatePlotListReport.mockRejectedValue(
        new Error('render boom'),
      );

      await expect(
        service.sharePlotList(companyId, recipient, image, csv, user),
      ).rejects.toMatchObject({
        extensions: { code: 'SHARE_PLOT_LIST_PDF_ERROR' },
      });
      expect(emailService.sendSharePlotListEmail).not.toHaveBeenCalled();
    });

    it('maps an email send failure to an email error but still cleans up', async () => {
      emailService.sendSharePlotListEmail.mockRejectedValue(
        new Error('SMTP down'),
      );

      await expect(
        service.sharePlotList(companyId, recipient, image, csv, user),
      ).rejects.toMatchObject({
        extensions: { code: 'SHARE_PLOT_LIST_EMAIL_ERROR' },
      });
      expect(fs.unlink).toHaveBeenCalledWith('/tmp/plot-list-report.pdf');
    });
  });

  // ---------------------------------------------------------------------------
  // shareOrderDetails
  // ---------------------------------------------------------------------------
  describe('shareOrderDetails', () => {
    const buildOrder = (overrides: Record<string, any> = {}) => ({
      id: 'order-1',
      companyId,
      status: 'SUBMITTED',
      createdAt: new Date('2026-03-01T00:00:00Z'),
      comment: 'Please process',
      attachments: ['fallback.pdf'],
      company: { name: 'Acme Mining' },
      orderItems: [
        {
          itemType: BansheeCartItemType.NEW_BANSHEE,
          name: 'Banshee A',
          period: 6,
          status: 'PENDING',
          bansheeRequest: null,
          site: { siteName: 'Site 1' },
          level: { levelName: 'Level 1' },
          drive: { driveName: 'Drive 1' },
          location: { locationName: 'Loc 1' },
        },
        {
          itemType: BansheeCartItemType.SERVICE_EXISTING,
          name: 'ignored',
          period: 12,
          status: 'PENDING',
          bansheeRequest: { serialNumber: 'SN-999' },
          site: null,
          level: null,
          drive: null,
          location: null,
        },
      ],
      ...overrides,
    });

    it('emails company users and request recipients (deduped, with xCell) and maps items', async () => {
      prisma.userPermission.findMany.mockResolvedValue([
        { role: Role.COMPANY_USER, user: { email: 'cu@acme.com' } },
        { role: Role.COMPANY_ADMIN, user: { email: 'ca@acme.com' } },
        { role: Role.SANDVIK_TECHNICIAN, user: { email: 'tech@sandvik.com' } },
      ]);

      await service.shareOrderDetails(buildOrder() as any, user, []);

      // Two emails: one to company users, one to the request recipients.
      expect(emailService.sendOrderDetailsEmail).toHaveBeenCalledTimes(2);

      const [companyCall, requestCall] =
        emailService.sendOrderDetailsEmail.mock.calls;

      // Company-user email: the creator's own email is appended.
      expect(companyCall[2]).toBe('ORDER_SUBMITTED');
      expect(companyCall[0]).toEqual(
        expect.arrayContaining(['cu@acme.com', user.email]),
      );

      // Request email: admins + technicians + the fixed support inbox, deduped.
      expect(requestCall[2]).toBe('ORDER_REQUEST');
      expect(requestCall[0]).toEqual(
        expect.arrayContaining([
          'ca@acme.com',
          'tech@sandvik.com',
          'xCell@sandvik.com',
        ]),
      );

      // Item mapping: NEW_BANSHEE uses name + joined location; SERVICE uses serial.
      const payload = companyCall[1];
      expect(payload.items[0]).toMatchObject({
        type: 'New Banshee',
        label: 'Banshee A',
        location: 'Site 1 / Level 1 / Drive 1 / Loc 1',
      });
      expect(payload.items[1]).toMatchObject({
        type: 'Recurring Service',
        label: 'SN-999',
        location: '-',
      });
    });

    it('lists uploaded attachment names and passes their buffers', async () => {
      prisma.userPermission.findMany.mockResolvedValue([
        { role: Role.COMPANY_USER, user: { email: 'cu@acme.com' } },
      ]);
      jest.spyOn(service as any, 'readUpload').mockResolvedValue({
        buffer: Buffer.from('data'),
        filename: 'uploaded.pdf',
        mimetype: 'application/pdf',
      });

      await service.shareOrderDetails(buildOrder() as any, user, [{} as any]);

      const payload = emailService.sendOrderDetailsEmail.mock.calls[0][1];
      expect(payload.attachmentNames).toEqual(['uploaded.pdf']);
      expect(payload.files).toEqual([
        { originalFileName: 'uploaded.pdf', content: Buffer.from('data') },
      ]);
    });

    it('falls back gracefully when company, attachments and item names are missing', async () => {
      prisma.userPermission.findMany.mockResolvedValue([
        { role: Role.COMPANY_USER, user: { email: 'cu@acme.com' } },
      ]);

      const order = buildOrder({
        comment: null,
        attachments: undefined,
        company: null,
        orderItems: [
          {
            itemType: BansheeCartItemType.NEW_BANSHEE,
            name: null,
            period: null,
            status: 'PENDING',
            bansheeRequest: null,
            site: null,
            level: null,
            drive: null,
            location: null,
          },
        ],
      });

      await service.shareOrderDetails(order as any, user, []);

      const payload = emailService.sendOrderDetailsEmail.mock.calls[0][1];
      expect(payload.companyName).toBe('your company');
      expect(payload.attachmentNames).toEqual([]);
      expect(payload.items[0]).toMatchObject({ label: '-', location: '-' });
    });

    it('falls back to the raw item type label for an unknown item type', async () => {
      prisma.userPermission.findMany.mockResolvedValue([
        { role: Role.COMPANY_USER, user: { email: 'cu@acme.com' } },
      ]);

      const order = buildOrder({
        orderItems: [
          {
            itemType: 'LEGACY_TYPE', // not in the label map
            name: 'ignored',
            period: 3,
            status: 'PENDING',
            bansheeRequest: { serialNumber: 'SN-legacy' },
            site: { siteName: 'Site X' },
            level: null,
            drive: null,
            location: null,
          },
        ],
      });

      await service.shareOrderDetails(order as any, user, []);

      const payload = emailService.sendOrderDetailsEmail.mock.calls[0][1];
      expect(payload.items[0]).toMatchObject({
        type: 'LEGACY_TYPE',
        label: 'SN-legacy',
        location: 'Site X',
      });
    });

    it('sends only the request email when there are no company users', async () => {
      prisma.userPermission.findMany.mockResolvedValue([
        { role: Role.COMPANY_ADMIN, user: { email: 'ca@acme.com' } },
      ]);

      // The creator is not a COMPANY_USER here, but shareOrderDetails always
      // adds the creator to COMPANY_USER — so pass a creator-less user.
      await service.shareOrderDetails(
        buildOrder() as any,
        { ...user, email: '' } as any,
        [],
      );

      const types = emailService.sendOrderDetailsEmail.mock.calls.map(
        (c) => c[2],
      );
      expect(types).toEqual(['ORDER_REQUEST']);
    });
  });

  // ---------------------------------------------------------------------------
  // shareProceqMeasurementInsights (Flow 1)
  // ---------------------------------------------------------------------------
  describe('shareProceqMeasurementInsights', () => {
    const payload = {
      companyId,
      measured: [
        { serialNumber: 'SN-1', measurementId: 'm1', status: 'ELASTIC' },
      ],
      notMeasured: [],
    } as any;

    it('skips sending when the company has no active Banshee plan', async () => {
      prisma.plan.findFirst.mockResolvedValue(null);
      // Recipient resolution runs in parallel with the plan check.
      prisma.userPermission.findMany.mockResolvedValue([]);

      await service.shareProceqMeasurementInsights(payload);

      expect(
        emailService.sendProceqMeasurementInsightsEmail,
      ).not.toHaveBeenCalled();
    });

    it('sends a deduped summary to company users, technicians and the support inbox', async () => {
      prisma.plan.findFirst.mockResolvedValue({ id: 'plan-1' });
      prisma.userPermission.findMany.mockResolvedValue([
        { role: Role.COMPANY_USER, user: { email: 'cu@acme.com' } },
        { role: Role.SANDVIK_TECHNICIAN, user: { email: 'tech@sandvik.com' } },
        // Admins are intentionally excluded from this flow.
        { role: Role.COMPANY_ADMIN, user: { email: 'ca@acme.com' } },
      ]);

      await service.shareProceqMeasurementInsights(payload);

      expect(
        emailService.sendProceqMeasurementInsightsEmail,
      ).toHaveBeenCalledTimes(1);
      const [recipients, emailData] =
        emailService.sendProceqMeasurementInsightsEmail.mock.calls[0];
      expect(recipients).toEqual(
        expect.arrayContaining([
          'cu@acme.com',
          'tech@sandvik.com',
          'xCell@sandvik.com',
        ]),
      );
      expect(recipients).not.toContain('ca@acme.com');
      // The companyId is stripped from the forwarded email data.
      expect(emailData).not.toHaveProperty('companyId');
    });
  });

  // ---------------------------------------------------------------------------
  // shareProceqStatusChange (Flow 2)
  // ---------------------------------------------------------------------------
  describe('shareProceqStatusChange', () => {
    const payload = {
      companyId,
      serialNumber: 'SN-1',
      bansheeName: 'Banshee A',
      measurementId: 'm1',
      previousStatus: 'ELASTIC',
      newStatus: 'PLASTIC',
    } as any;

    it('skips sending when the company has no active Banshee plan', async () => {
      prisma.plan.findFirst.mockResolvedValue(null);
      // Recipient resolution runs in parallel with the plan check.
      prisma.userPermission.findMany.mockResolvedValue([]);

      await service.shareProceqStatusChange(payload);

      expect(emailService.sendProceqStatusChangeEmail).not.toHaveBeenCalled();
    });

    it('skips sending when there are no COMPANY_USER recipients', async () => {
      prisma.plan.findFirst.mockResolvedValue({ id: 'plan-1' });
      prisma.userPermission.findMany.mockResolvedValue([
        { role: Role.SANDVIK_TECHNICIAN, user: { email: 'tech@sandvik.com' } },
      ]);

      await service.shareProceqStatusChange(payload);

      expect(emailService.sendProceqStatusChangeEmail).not.toHaveBeenCalled();
    });

    it('notifies only COMPANY_USER recipients when a plan is active', async () => {
      prisma.plan.findFirst.mockResolvedValue({ id: 'plan-1' });
      prisma.userPermission.findMany.mockResolvedValue([
        { role: Role.COMPANY_USER, user: { email: 'cu@acme.com' } },
        { role: Role.SANDVIK_TECHNICIAN, user: { email: 'tech@sandvik.com' } },
      ]);

      await service.shareProceqStatusChange(payload);

      expect(emailService.sendProceqStatusChangeEmail).toHaveBeenCalledTimes(1);
      const [recipients] =
        emailService.sendProceqStatusChangeEmail.mock.calls[0];
      expect(recipients).toEqual(['cu@acme.com']);
    });
  });

  // ---------------------------------------------------------------------------
  // readUpload (validation + streaming) — exercised directly
  // ---------------------------------------------------------------------------
  describe('readUpload', () => {
    const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
    const read = (upload: any, types = IMAGE_TYPES, label = 'PNG') =>
      (service as any).readUpload(upload, types, label);

    it('reads a directly-resolved FileUpload into a buffer', async () => {
      const result = await read(makeUpload('hello', 'a.png', 'image/png'));

      expect(result.buffer.toString()).toBe('hello');
      expect(result.filename).toBe('a.png');
      expect(result.mimetype).toBe('image/png');
    });

    it('unwraps an Upload wrapper that exposes a `.promise`', async () => {
      const wrapper = {
        promise: Promise.resolve(
          makeUpload('viaPromise', 'b.png', 'image/png'),
        ),
      };

      const result = await read(wrapper);

      expect(result.buffer.toString()).toBe('viaPromise');
    });

    it('defaults the filename when the upload omits one', async () => {
      const upload = {
        file: {
          filename: undefined,
          mimetype: 'image/png',
          createReadStream: () => Readable.from([Buffer.from('x')]),
        },
      };

      const result = await read(upload);

      expect(result.filename).toBe('png-upload');
    });

    it('rejects a disallowed mime-type', async () => {
      await expect(
        read(makeUpload('x', 'a.txt', 'text/plain')),
      ).rejects.toMatchObject({
        extensions: { code: 'SHARE_PLOT_LIST_INVALID_FILE_TYPE' },
      });
    });

    it('rejects an upload with no readable stream', async () => {
      await expect(
        read({ file: { filename: 'a.png', mimetype: 'image/png' } }),
      ).rejects.toMatchObject({
        extensions: { code: 'SHARE_PLOT_LIST_UPLOAD_ERROR' },
      });
    });

    it('wraps a failure to resolve the upload as an upload error', async () => {
      const upload = { promise: Promise.reject(new Error('resolve boom')) };

      await expect(read(upload)).rejects.toMatchObject({
        extensions: { code: 'SHARE_PLOT_LIST_UPLOAD_ERROR' },
      });
    });

    it('rejects when the stream errors mid-read', async () => {
      const upload = {
        file: {
          filename: 'a.png',
          mimetype: 'image/png',
          createReadStream: () => {
            const s = new Readable({ read() {} });
            setImmediate(() => s.destroy(new Error('stream boom')));
            return s;
          },
        },
      };

      await expect(read(upload)).rejects.toMatchObject({
        extensions: { code: 'SHARE_PLOT_LIST_UPLOAD_ERROR' },
      });
    });

    it('rejects a file that exceeds the 10MB size limit', async () => {
      const upload = makeUpload(
        Buffer.alloc(10 * 1024 * 1024 + 1),
        'big.png',
        'image/png',
      );

      await expect(read(upload)).rejects.toMatchObject({
        extensions: { code: 'SHARE_PLOT_LIST_FILE_TOO_LARGE' },
      });
    });
  });

  // ---------------------------------------------------------------------------
  // saveAttachments (filesystem persistence) — exercised directly
  // ---------------------------------------------------------------------------
  describe('saveAttachments', () => {
    it('returns early without touching the filesystem when there is nothing to save', async () => {
      const mkdirSpy = jest.spyOn(fs, 'mkdir');

      const result = await service.saveAttachments([], 'email-1');

      expect(result).toEqual([]);
      expect(mkdirSpy).not.toHaveBeenCalled();
    });

    it('persists each attachment with a randomized, extension-preserving name', async () => {
      jest.spyOn(fs, 'mkdir').mockResolvedValue(undefined as never);
      const writeSpy = jest
        .spyOn(fs, 'writeFile')
        .mockResolvedValue(undefined as never);
      jest.spyOn(service as any, 'readUpload').mockResolvedValue({
        buffer: Buffer.from('pdf-bytes'),
        filename: 'client report.pdf',
        mimetype: 'application/pdf',
      });

      const [saved] = await service.saveAttachments([{} as any], 'email-1');

      expect(fs.mkdir).toHaveBeenCalledTimes(1);
      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(saved.originalFileName).toBe('client report.pdf');
      expect(saved.mimeType).toBe('application/pdf');
      expect(saved.fileSize).toBe(BigInt('pdf-bytes'.length));
      // Stored name is a random UUID keeping only the sanitized extension.
      expect(saved.storedFileName).toMatch(/\.pdf$/);
      expect(saved.storedFileName).not.toContain('client');
    });

    it('cleans up the upload directory and rethrows when a write fails', async () => {
      jest.spyOn(fs, 'mkdir').mockResolvedValue(undefined as never);
      jest.spyOn(fs, 'unlink').mockResolvedValue(undefined as never);
      const rmSpy = jest.spyOn(fs, 'rm').mockResolvedValue(undefined as never);
      jest.spyOn(service as any, 'readUpload').mockResolvedValue({
        buffer: Buffer.from('bytes'),
        filename: 'a.pdf',
        mimetype: 'application/pdf',
      });
      jest
        .spyOn(fs, 'writeFile')
        .mockResolvedValueOnce(undefined as never)
        .mockRejectedValueOnce(new Error('disk full'));

      await expect(
        service.saveAttachments([{} as any, {} as any], 'email-1'),
      ).rejects.toThrow('disk full');

      // The whole per-request folder is removed on failure.
      expect(rmSpy).toHaveBeenCalledWith(
        expect.stringContaining('email-1'),
        expect.objectContaining({ recursive: true, force: true }),
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Filesystem helpers — exercised directly
  // ---------------------------------------------------------------------------
  describe('writeTempPdf', () => {
    it('creates the temp directory and writes a uniquely-named PDF', async () => {
      jest.spyOn(fs, 'mkdir').mockResolvedValue(undefined as never);
      const writeSpy = jest
        .spyOn(fs, 'writeFile')
        .mockResolvedValue(undefined as never);

      const path = await (service as any).writeTempPdf(Buffer.from('%PDF-'));

      expect(fs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('sharePlotList'),
        { recursive: true },
      );
      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(path).toMatch(/sharePlotList[\\/].+\.pdf$/);
    });
  });

  describe('cleanupFiles', () => {
    it('best-effort unlinks every file, swallowing individual failures', async () => {
      const unlinkSpy = jest
        .spyOn(fs, 'unlink')
        .mockResolvedValueOnce(undefined as never)
        .mockRejectedValueOnce(new Error('already gone'));

      await expect(
        (service as any).cleanupFiles([
          { filePath: '/tmp/a.pdf' },
          { filePath: '/tmp/b.pdf' },
        ]),
      ).resolves.toBeUndefined();

      expect(unlinkSpy).toHaveBeenCalledTimes(2);
    });
  });
});
