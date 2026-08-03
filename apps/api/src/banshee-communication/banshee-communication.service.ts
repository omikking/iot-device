import { Injectable, Logger } from '@nestjs/common';
import { UserInputError } from '@nestjs/apollo';
import type { FileUpload } from 'graphql-upload-ts';
import { promises as fs } from 'fs';
import { randomBytes } from 'crypto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data';
import {
  EmailService,
  ProceqMeasurementInsightsEmailData,
  ProceqStatusChangeEmailData,
} from 'src/email/email.service';
import { errorTexts } from 'src/errorTexts/errorTexts';
import { PrismaService } from 'src/prisma/prisma.service';
import * as GraphQLTypes from 'src/graphql-types';
import { PdfReportService } from './pdf-report.service';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import {
  Application,
  BansheeCartItemType,
  BansheeEmailStatus,
  PlanLevel,
  Prisma,
  Role,
} from '@prisma/client';

/** Flow 1 payload: measurement insights email plus the owning company. */
export interface ProceqMeasurementInsightsPayload extends ProceqMeasurementInsightsEmailData {
  companyId: string;
}

/** Flow 2 payload: status-change email plus the owning company. */
export interface ProceqStatusChangePayload extends ProceqStatusChangeEmailData {
  companyId: string;
}

/**
 * A Banshee order loaded with everything the order-details email needs:
 * its line items (each with the related request/site/level/drive/location)
 * and the owning company.
 */
const ORDER_DETAILS_INCLUDE = {
  orderItems: {
    include: {
      bansheeRequest: true,
      site: true,
      level: true,
      drive: true,
      location: true,
    },
  },
  company: true,
} satisfies Prisma.BansheeOrderInclude;

export type BansheeOrderWithDetails = Prisma.BansheeOrderGetPayload<{
  include: typeof ORDER_DETAILS_INCLUDE;
}>;

const ITEM_TYPE_LABELS: Record<BansheeCartItemType, string> = {
  [BansheeCartItemType.NEW_BANSHEE]: 'New Banshee',
  [BansheeCartItemType.SERVICE_EXISTING]: 'Recurring Service',
};

interface ReadUpload {
  buffer: Buffer;
  filename: string;
  mimetype: string;
}

interface SavedFile {
  originalFileName: string;
  storedFileName: string;
  filePath: string;
  mimeType: string;
  fileSize: bigint;
}

@Injectable()
export class BansheeCommunicationService {
  private readonly logger = new Logger(BansheeCommunicationService.name);

  // 10MB per uploaded file
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024;
  // Upper bound on attachments per Contact Us request (DoS / abuse guard).
  private readonly MAX_ATTACHMENTS = 5;
  private readonly IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
  private readonly CSV_MIME_TYPES = [
    'text/csv',
    'application/csv',
    'application/vnd.ms-excel',
    'text/plain',
  ];
  private readonly ALLOWED_ATTACHMENT_MIME_TYPES = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'text/csv',
    'application/csv',
    'application/vnd.ms-excel',
  ];

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private pdfReportService: PdfReportService,
  ) {}

  async sharePlotList(
    companyId: string,
    recipientEmail: string,
    image: FileUpload,
    csv: FileUpload,
    user: ActiveUserData,
  ): Promise<GraphQLTypes.BansheeSharePlotListResponse> {
    const normalizedEmail = recipientEmail.trim().toLowerCase();

    this.validateEmail(normalizedEmail);

    // Check if company exists
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { name: true },
    });

    if (!company) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_COMPANY_NOT_FOUND_ERROR',
          title: errorTexts.invitationCompanyNotFound_title,
          message: errorTexts.invitationCompanyNotFound_message,
        },
      });
    }

    // 1. Read + validate the uploaded files
    const imageFile = await this.readUpload(
      image,
      this.IMAGE_MIME_TYPES,
      'PNG',
    );
    const csvFile = await this.readUpload(csv, this.CSV_MIME_TYPES, 'CSV');

    // 2. Generate the PDF report (graph image + CSV table + metadata)
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await this.pdfReportService.generatePlotListReport({
        companyName: company.name,
        sharedBy: user.fullName,
        generatedAt: new Date(),
        pngBuffer: imageFile.buffer,
        csvContent: csvFile.buffer.toString('utf-8'),
      });
    } catch (error) {
      this.logger.error(
        'PDF generation failed while sharing plot list',
        error instanceof Error ? error.stack : error,
      );
      throw new UserInputError('', {
        extensions: {
          code: 'SHARE_PLOT_LIST_PDF_ERROR',
          title: 'Could not generate plot report',
          message: errorTexts.contactSupportError,
        },
      });
    }

    // 3. Persist the PDF to a temp file so it can be attached, then clean up.
    const pdfPath = await this.writeTempPdf(pdfBuffer);

    try {
      await this.emailService.sendSharePlotListEmail(
        normalizedEmail,
        company.name,
        user.fullName,
        [
          {
            originalFileName: 'plot-list-report.pdf',
            filePath: pdfPath,
          },
        ],
      );
    } catch (error) {
      this.logger.error(
        'Failed to send share plot list email',
        error instanceof Error ? error.stack : error,
      );
      throw new UserInputError('', {
        extensions: {
          code: 'SHARE_PLOT_LIST_EMAIL_ERROR',
          title: 'Could not send the plot list email',
          message: errorTexts.contactSupportError,
        },
      });
    } finally {
      // Best-effort cleanup of the temporary PDF.
      await fs.unlink(pdfPath).catch(() => undefined);
    }

    return {
      success: true,
      sentTo: normalizedEmail,
      message: `Plot list report sent to ${normalizedEmail}`,
    };
  }

  async contactUs(
    companyId: string,
    message: string,
    attachments: FileUpload[] | null | undefined,
    user: ActiveUserData,
  ): Promise<GraphQLTypes.BansheeContactUsResponse> {
    // The RolesGuard already verified the caller is a COMPANY_ADMIN of this
    // company, so its existence is guaranteed — this lookup just gives us the
    // company name for the email body.
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: {
        name: true,
        userPermission: {
          where: {
            role: Role.SANDVIK_ADMIN,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    if (!company) {
      throw new UserInputError('', {
        extensions: {
          code: 'INVITATION_COMPANY_NOT_FOUND_ERROR',
          title: errorTexts.invitationCompanyNotFound_title,
          message: errorTexts.invitationCompanyNotFound_message,
        },
      });
    }

    const safeAttachments = attachments ?? [];

    if (safeAttachments.length > this.MAX_ATTACHMENTS) {
      throw new UserInputError('', {
        extensions: {
          code: 'CONTACT_US_TOO_MANY_ATTACHMENTS',
          title: 'Too many attachments',
          message: `A maximum of ${this.MAX_ATTACHMENTS} attachments is allowed per request.`,
        },
      });
    }

    const sandvikAdminUserId = company.userPermission[0]?.userId;
    const sandvikAdminInfo = sandvikAdminUserId
      ? await this.prisma.user.findUnique({
          where: { id: sandvikAdminUserId },
        })
      : null;
    const sandvikAdminEmail = sandvikAdminInfo?.email;

    // Use a single id for both the on-disk attachment folder and the DB record
    // so the two always line up (and survive a partial failure).
    const bansheeEmailId = randomUUID();

    // 1. Read + validate + persist the uploaded files. This throws specific
    //    UserInputErrors (invalid type / too large) and cleans up its own
    //    partial writes on failure.
    const files = await this.saveAttachments(safeAttachments, bansheeEmailId);

    // 2. Create the DB record (PENDING) together with its attachment rows.
    let contact: Awaited<ReturnType<typeof this.createContactRecord>>;
    try {
      contact = await this.createContactRecord(
        bansheeEmailId,
        companyId,
        user.id,
        message,
        files,
      );
    } catch (error) {
      // No record persisted — don't leak the files we just wrote to disk.
      await this.cleanupFiles(files);
      this.logger.error(
        'Failed to persist contact us request',
        error instanceof Error ? error.stack : error,
      );
      throw new UserInputError('', {
        extensions: {
          code: 'CONTACT_US_FAILED',
          title: 'Could not submit contact request',
          message: errorTexts.contactSupportError,
        },
      });
    }

    // 3. Send the email (with attachments). On provider failure mark FAILED.
    try {
      await this.emailService.sendContactUsEmail(
        company.name,
        message,
        user.fullName,
        files,
        sandvikAdminEmail,
      );
    } catch (error) {
      this.logger.error(
        'Failed to send contact us email',
        error instanceof Error ? error.stack : error,
      );
      await this.prisma.bansheeEmail
        .update({
          where: { id: contact.id },
          data: { status: BansheeEmailStatus.FAILED },
        })
        .catch((updateError) =>
          this.logger.error(
            'Failed to mark contact us request as FAILED',
            updateError,
          ),
        );

      throw new UserInputError('', {
        extensions: {
          code: 'CONTACT_US_EMAIL_ERROR',
          title: 'Could not send your message',
          message: errorTexts.contactSupportError,
        },
      });
    }

    // 4. Email was delivered — mark SENT. If only this update fails the email
    //    has still gone out, so we keep the success response rather than
    //    flipping the request to FAILED.
    try {
      contact = await this.prisma.bansheeEmail.update({
        where: { id: contact.id },
        data: { status: BansheeEmailStatus.SENT },
        include: { attachments: true },
      });
    } catch (error) {
      this.logger.error(
        'Contact us email sent but failed to update status to SENT',
        error instanceof Error ? error.stack : error,
      );
      contact = { ...contact, status: BansheeEmailStatus.SENT };
    }

    return {
      success: true,
      message: 'Your message has been sent to our support team.',
      email: this.toGraphQLEmail(contact),
    };
  }

  /**
   * Notifies every BANSHEE user of the order's company that a new order was
   * placed, emailing them the message, attachment list and line items.
   *
   * The order is passed in already loaded (the submit flow has just created it
   * with all the includes we need) so we don't re-query it here.
   */
  async shareOrderDetails(
    order: BansheeOrderWithDetails,
    user: ActiveUserData,
    attachments: FileUpload[],
  ): Promise<void> {
    const recipientEmails = await this.getCompanyBansheeRecipientEmails(
      order.companyId,
      user.email,
    );

    // if (recipientEmails.length === 0) {
    //   this.logger.warn(
    //     `No BANSHEE users found for company ${order.companyId}; skipping order details email for order ${order.id}`,
    //   );
    //   return;
    // }

    // Read uploaded files into memory so nodemailer can attach them directly.
    // Order attachments are emailed but — unlike Contact Us — never persisted
    // to disk or tracked in the database. `readUpload` still validates each
    // file's mime-type and size.
    const safeAttachments = attachments ?? [];
    const inMemoryFiles = safeAttachments.length
      ? await Promise.all(
          safeAttachments.map((attachment) =>
            this.readUpload(
              attachment,
              this.ALLOWED_ATTACHMENT_MIME_TYPES,
              'Attachment',
            ),
          ),
        )
      : [];

    // The body lists the uploaded file names when present, otherwise the
    // attachment names supplied in the order input.
    const attachmentNames = inMemoryFiles.length
      ? inMemoryFiles.map((file) => file.filename)
      : (order.attachments ?? []);

    const orderDetailsToShare = {
      orderId: order.id,
      status: order.status,
      orderDate: order.createdAt.toUTCString(),
      companyName: order.company?.name ?? 'your company',
      sharedByUser: user.fullName,
      message: order.comment,
      attachmentNames,
      files: inMemoryFiles.map((file) => ({
        originalFileName: file.filename,
        content: file.buffer,
      })),
      items: order.orderItems.map((item) => ({
        type: ITEM_TYPE_LABELS[item.itemType] ?? item.itemType,
        label:
          item.itemType === BansheeCartItemType.NEW_BANSHEE
            ? (item.name ?? '-')
            : (item.bansheeRequest?.serialNumber ?? item.name ?? '-'),
        location:
          [
            item.site?.siteName,
            item.level?.levelName,
            item.drive?.driveName,
            item.location?.locationName,
          ]
            .filter(Boolean)
            .join(' / ') || '-',
        period: item.period,
        status: item.status,
      })),
    };

    const companyUsers = recipientEmails[Role.COMPANY_USER] ?? [];

    const requestRecipients = [
      ...new Set([
        ...(recipientEmails[Role.COMPANY_ADMIN] ?? []),
        ...(recipientEmails[Role.SANDVIK_ADMIN] ?? []),
        ...(recipientEmails[Role.SANDVIK_TECHNICIAN] ?? []),
        'xCell@sandvik.com',
      ]),
    ];

    if (companyUsers.length) {
      await this.emailService.sendOrderDetailsEmail(
        companyUsers,
        orderDetailsToShare,
        'ORDER_SUBMITTED',
      );
    }

    if (requestRecipients.length) {
      await this.emailService.sendOrderDetailsEmail(
        requestRecipients,
        orderDetailsToShare,
        'ORDER_REQUEST',
      );
    }
  }

  /** Distinct emails of every user with BANSHEE access for the company. */
  private async getCompanyBansheeRecipientEmails(
    companyId: string,
    orderCreatorEmail?: string,
  ): Promise<Record<Role, string[]>> {
    const users = await this.prisma.userPermission.findMany({
      where: {
        companyId,
        appsAccess: {
          has: Application.BANSHEE,
        },
        user: { isDeleted: false },
      },
      distinct: ['userId'],
      select: {
        role: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    const usersByRole = users.reduce(
      (acc, { role, user }) => {
        if (!acc[role]) acc[role] = [];
        acc[role].push(user.email);
        return acc;
      },
      {} as Record<Role, string[]>,
    );

    if (orderCreatorEmail) {
      if (!usersByRole[Role.COMPANY_USER]) usersByRole[Role.COMPANY_USER] = [];
      if (!usersByRole[Role.COMPANY_USER].includes(orderCreatorEmail)) {
        usersByRole[Role.COMPANY_USER].push(orderCreatorEmail);
      }
    }

    return usersByRole;
  }

  /**
   * Whether the company has a usable Banshee subscription: an active (non
   * INACTIVE) BANSHEE plan that has not expired. Gates both Proceq flows.
   */
  private async hasActiveBansheePlan(companyId: string): Promise<boolean> {
    const plan = await this.prisma.plan.findFirst({
      where: {
        companyId,
        applicationName: Application.BANSHEE,
        planLevel: { not: PlanLevel.INACTIVE },
        OR: [{ expiringDate: null }, { expiringDate: { gt: new Date() } }],
      },
      select: { id: true },
    });

    return !!plan;
  }

  /**
   * Flow 1 — orchestrates the consolidated Proceq measurement-insights email
   * for a single company. Validates the company's Banshee plan and resolves
   * recipients (COMPANY_USER + SANDVIK_TECHNICIAN, plus the Sandvik support
   * inbox) in parallel, then sends one deduplicated summary email covering all
   * measured/not-measured measurements from the sync. Returns early — without
   * sending — when the company has no active plan.
   */
  async shareProceqMeasurementInsights(
    payload: ProceqMeasurementInsightsPayload,
  ): Promise<void> {
    const { companyId, ...emailData } = payload;

    this.logger.log(
      `Proceq measurement insights: preparing summary for company ${companyId} (${emailData.measured.length} measured, ${emailData.notMeasured.length} not measured)`,
    );

    const [hasPlan, recipientsByRole] = await Promise.all([
      this.hasActiveBansheePlan(companyId),
      this.getCompanyBansheeRecipientEmails(companyId),
    ]);

    if (!hasPlan) {
      this.logger.warn(
        `Proceq measurement insights skipped for company ${companyId}: no active BANSHEE plan`,
      );
      return;
    }

    const recipients = [
      ...new Set([
        ...(recipientsByRole[Role.COMPANY_USER] ?? []),
        ...(recipientsByRole[Role.SANDVIK_TECHNICIAN] ?? []),
        'xCell@sandvik.com',
      ]),
    ];

    await this.emailService.sendProceqMeasurementInsightsEmail(
      recipients,
      emailData,
    );

    this.logger.log(
      `Proceq measurement insights summary sent for company ${companyId} to ${recipients.length} recipient(s)`,
    );
  }

  /**
   * Flow 2 — orchestrates the Proceq status-change email. Validates the
   * company's Banshee plan and resolves recipients in parallel. Only
   * COMPANY_USER recipients are notified: technicians, admins and the support
   * inbox are intentionally excluded for this flow.
   */
  async shareProceqStatusChange(
    payload: ProceqStatusChangePayload,
  ): Promise<void> {
    const { companyId, ...emailData } = payload;

    this.logger.log(
      `Proceq status change: preparing email for measurement ${emailData.measurementId} (serial ${emailData.serialNumber}, ${emailData.previousStatus} -> ${emailData.newStatus}, company ${companyId})`,
    );

    const [hasPlan, recipientsByRole] = await Promise.all([
      this.hasActiveBansheePlan(companyId),
      this.getCompanyBansheeRecipientEmails(companyId),
    ]);

    if (!hasPlan) {
      this.logger.warn(
        `Proceq status change skipped for measurement ${emailData.measurementId}: company ${companyId} has no active BANSHEE plan`,
      );
      return;
    }

    const recipients = [...new Set(recipientsByRole[Role.COMPANY_USER] ?? [])];

    if (recipients.length === 0) {
      this.logger.warn(
        `Proceq status change skipped for measurement ${emailData.measurementId}: company ${companyId} has no COMPANY_USER recipients`,
      );
      return;
    }

    await this.emailService.sendProceqStatusChangeEmail(recipients, emailData);

    this.logger.log(
      `Proceq status change email sent for measurement ${emailData.measurementId} to ${recipients.length} recipient(s)`,
    );
  }

  private createContactRecord(
    id: string,
    companyId: string,
    userId: string,
    message: string,
    files: SavedFile[],
  ) {
    return this.prisma.bansheeEmail.create({
      data: {
        id,
        companyId,
        userId,
        message,
        status: BansheeEmailStatus.PENDING,
        attachments: {
          create: files,
        },
      },
      include: {
        attachments: true,
      },
    });
  }

  /** Best-effort removal of files written to disk for a failed request. */
  private async cleanupFiles(files: SavedFile[]): Promise<void> {
    await Promise.all(
      files.map((file) => fs.unlink(file.filePath).catch(() => undefined)),
    );
  }

  /**
   * Maps a Prisma BansheeEmail onto the GraphQL shape. The attachment
   * `fileSize` is a BigInt in the DB but the schema exposes it as Float, so we
   * coerce it to a number to keep GraphQL serialization happy.
   */
  private toGraphQLEmail(contact: {
    id: string;
    status: BansheeEmailStatus;
    message: string;
    userId: string;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    attachments?: Array<{
      id: string;
      originalFileName: string;
      storedFileName: string;
      filePath: string;
      mimeType: string;
      fileSize: bigint;
      createdAt: Date;
    }>;
  }): GraphQLTypes.BansheeEmail {
    return {
      ...contact,
      // Prisma and the generated GraphQL enum are structurally identical but
      // nominally distinct types — bridge them explicitly.
      status: contact.status as unknown as GraphQLTypes.BansheeEmailStatus,
      attachments: contact.attachments?.map((attachment) => ({
        ...attachment,
        fileSize: Number(attachment.fileSize),
      })),
    };
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new UserInputError('', {
        extensions: {
          code: 'SHARE_PLOT_LIST_INVALID_EMAIL',
          title: 'Invalid email address',
          message: 'Please provide a valid recipient email address.',
        },
      });
    }
  }

  /** Reads a GraphQL Upload into a buffer while validating mime-type and size. */
  private async readUpload(
    upload: FileUpload,
    allowedMimeTypes: string[],
    label: string,
  ): Promise<ReadUpload> {
    let resolved: any;
    try {
      // graphql-upload(-ts) may hand us the Upload wrapper (with `.promise`/
      // `.file`) or the resolved FileUpload directly — normalize all shapes.
      const raw: any = upload;
      resolved = raw?.promise ? await raw.promise : await raw;
    } catch (error) {
      this.logger.error(
        `Failed to resolve ${label} upload`,
        error instanceof Error ? error.stack : error,
      );
      throw this.uploadError(label);
    }

    const file = resolved?.file ?? resolved;
    const { createReadStream, filename, mimetype } = file ?? {};

    if (typeof createReadStream !== 'function') {
      throw this.uploadError(label);
    }

    if (!allowedMimeTypes.includes(mimetype)) {
      throw new UserInputError('', {
        extensions: {
          code: 'SHARE_PLOT_LIST_INVALID_FILE_TYPE',
          title: `Invalid ${label} file type`,
          message: `The uploaded ${label} file type "${mimetype}" is not allowed.`,
        },
      });
    }

    return await new Promise<ReadUpload>((resolve, reject) => {
      const stream = createReadStream();
      const chunks: Uint8Array[] = [];
      let size = 0;

      stream.on('data', (chunk: Uint8Array) => {
        size += chunk.length;

        if (size > this.MAX_FILE_SIZE) {
          stream.destroy();

          reject(
            new UserInputError('', {
              extensions: {
                code: 'SHARE_PLOT_LIST_FILE_TOO_LARGE',
                title: `${label} file is too large`,
                message: `The ${label} file exceeds the ${
                  this.MAX_FILE_SIZE / (1024 * 1024)
                }MB limit.`,
              },
            }),
          );
          return;
        }

        chunks.push(chunk);
      });

      stream.on('end', () =>
        resolve({
          buffer: Buffer.concat(chunks),
          filename: filename ?? `${label.toLowerCase()}-upload`,
          mimetype,
        }),
      );

      stream.on('error', (error: Error) => {
        this.logger.error(`Error reading ${label} upload stream`, error.stack);
        reject(this.uploadError(label));
      });
    });
  }

  private uploadError(label: string): UserInputError {
    return new UserInputError('', {
      extensions: {
        code: 'SHARE_PLOT_LIST_UPLOAD_ERROR',
        title: `Could not read the ${label} file`,
        message: `The uploaded ${label} file could not be processed. Please try again.`,
      },
    });
  }

  private async writeTempPdf(buffer: Buffer): Promise<string> {
    const dir = join(process.cwd(), 'uploads', 'sharePlotList');
    await fs.mkdir(dir, { recursive: true });
    const filePath = join(
      dir,
      `${Date.now()}-${randomBytes(8).toString('hex')}.pdf`,
    );
    await fs.writeFile(filePath, new Uint8Array(buffer));
    return filePath;
  }

  private async saveAttachment(
    upload: FileUpload,
    uploadDir: string,
  ): Promise<SavedFile> {
    const file = await this.readUpload(
      upload,
      this.ALLOWED_ATTACHMENT_MIME_TYPES,
      'Attachment',
    );

    // Never reuse the client-supplied name for the on-disk path. We keep only a
    // sanitized extension (letters/digits) appended to a random UUID, which
    // removes any path-traversal ("../") or null-byte risk from the filename.
    const rawExt = extname(file.filename).replace(/[^a-zA-Z0-9.]/g, '');
    const ext = rawExt.slice(0, 10);
    const storedFileName = `${randomUUID()}${ext}`;

    const filePath = join(uploadDir, storedFileName);

    await fs.writeFile(filePath, new Uint8Array(file.buffer));

    return {
      originalFileName: file.filename,
      storedFileName,
      filePath,
      mimeType: file.mimetype,
      fileSize: BigInt(file.buffer.length),
    };
  }

  async saveAttachments(
    attachments: FileUpload[],
    bansheeEmailId: string,
  ): Promise<SavedFile[]> {
    // Nothing to persist — skip touching the filesystem entirely.
    if (!attachments.length) {
      return [];
    }

    const savedFiles: SavedFile[] = [];

    const dateFolder = new Date().toISOString().split('T')[0];

    const uploadDir = join(
      __dirname,
      '..',
      '..',
      '..',
      'storage',
      'banshee-email-attachments',
      dateFolder,
      bansheeEmailId,
    );

    await fs.mkdir(uploadDir, {
      recursive: true,
    });

    try {
      const results = await Promise.all(
        attachments.map(async (attachment) => {
          const file = await this.saveAttachment(attachment, uploadDir);

          savedFiles.push(file);

          return file;
        }),
      );

      return results;
    } catch (error) {
      await Promise.all(
        savedFiles.map((file) =>
          fs.unlink(file.filePath).catch(() => undefined),
        ),
      );

      await fs
        .rm(uploadDir, {
          recursive: true,
          force: true,
        })
        .catch(() => undefined);

      throw error;
    }
  }
}
