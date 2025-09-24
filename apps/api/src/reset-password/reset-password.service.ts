import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as argon from 'argon2';
import { EmailService } from 'src/email/email.service';
import { randomBytes } from 'crypto';
import { errorTexts } from 'src/errorTexts/errorTexts';

@Injectable()
export class ResetPasswordService {
  constructor(
    private prisma: PrismaService,
    private mailer: EmailService,
  ) {}

  private async generateUniqueOTP(): Promise<string> {
    // Generate a 6-digit one-time password (OTP)
    const randomBuffer = randomBytes(4);
    const token = ((randomBuffer.readUInt32BE(0) % 900000) + 100000).toString();
    return token;
  }

  private async validateUserResetToken(token: string, email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UserInputError('', {
        extensions: {
          code: 'OTP_VALIDATION_ERROR',
          title: errorTexts.otpValidationError_title,
        },
      });
    }

    const request = await this.prisma.passwordResetRequest.findFirst({
      where: {
        token,
        userId: user.id,
      },
    });

    if (!request) {
      throw new UserInputError('', {
        extensions: {
          code: 'OTP_VALIDATION_ERROR',
          title: errorTexts.otpValidationError_title,
        },
      });
    }

    if (request.expiresAt < new Date()) {
      throw new UserInputError('', {
        extensions: {
          code: 'OTP_EXPIRED_ERROR',
          title: errorTexts.otpTokenExpired_title,
          message: errorTexts.otpTokenExpired_message,
        },
      });
    }

    return { user, request };
  }

  async requestPasswordReset(input: { email: string }): Promise<boolean> {
    const { email } = input;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UserInputError('', {
        extensions: {
          code: 'OTP_CREATE_ERROR',
          title: errorTexts.otpCreateError_title,
        },
      });
    }

    // Remove all existing tokens for user before generating a new one
    await this.prisma.passwordResetRequest.deleteMany({
      where: { userId: user.id },
    });

    const token = await this.generateUniqueOTP();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    await this.prisma.passwordResetRequest.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });

    try {
      await this.mailer.sendOneTimePassword(user.email, token);
    } catch (error) {
      throw error;
    }

    return true;
  }

  async validateResetToken(input: {
    token: string;
    email: string;
  }): Promise<boolean> {
    const { token, email } = input;
    await this.validateUserResetToken(token, email);
    return true;
  }

  async confirmPasswordReset(input: {
    token: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<boolean> {
    const { token, email, newPassword, confirmPassword } = input;

    if (newPassword !== confirmPassword) {
      throw new UserInputError('', {
        extensions: {
          code: 'PASSWORD_MISMATCH_ERROR',
          title: errorTexts.userPasswordMismatch_title,
          message: errorTexts.userPasswordMismatch_message,
        },
      });
    }

    const { user } = await this.validateUserResetToken(token, email);

    const hashedPassword = await argon.hash(newPassword);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: user.id },
        data: { hash: hashedPassword },
      }),
      this.prisma.passwordResetRequest.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    return true;
  }
}
