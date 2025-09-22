import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as argon from 'argon2';
import { EmailService } from 'src/email/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ResetPasswordService {
  constructor(
    private prisma: PrismaService,
    private mailer: EmailService,
  ) {}

  private async generateUniqueOTP(): Promise<string> {
    const randomBuffer = randomBytes(4);

    // Generate a 6-digit OTP
    const token = ((randomBuffer.readUInt32BE(0) % 900000) + 100000).toString();

    const existing = await this.prisma.passwordResetRequest.findUnique({
      where: { token },
    });

    if (!existing) return token;

    throw new Error('Failed to generate a unique OTP');
  }

  // Step 1: Request password reset //
  async requestPasswordReset(requestPasswordResetInput: {
    email: string;
  }): Promise<boolean> {
    const { email } = requestPasswordResetInput;

    if (!email) {
      throw new UserInputError('Email is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UserInputError('User not found with this email');
    }

    const token = await this.generateUniqueOTP();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // for now its 30 minutes we can update it later accordingly

    const existingRequest = await this.prisma.passwordResetRequest.findFirst({
      where: { userId: user.id },
    });

    if (existingRequest) {
      // Update existing token and expiry
      await this.prisma.passwordResetRequest.update({
        where: { id: existingRequest.id },
        data: { token, expiresAt },
      });
    } else {
      // Create new request
      await this.prisma.passwordResetRequest.create({
        data: {
          token,
          expiresAt,
          userId: user.id,
        },
      });
    }

    await this.mailer.sendOTP(user.email, token);
    return true;
  }
  // Step 2: Verify code with email  //
  async validateResetToken(validateResetTokenInput: {
    token: string;
    email: string;
  }): Promise<boolean> {
    const { token, email } = validateResetTokenInput;

    if (!token || !email) {
      throw new UserInputError('Email and token are required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UserInputError('User not found');
    }

    const request = await this.prisma.passwordResetRequest.findFirst({
      where: {
        token,
        userId: user.id,
      },
    });

    if (!request) {
      throw new UserInputError('Invalid token');
    }

    if (request.expiresAt < new Date()) {
      throw new UserInputError('Token expired');
    }

    return true;
  }

  //Step 3: Confirm and update password //
  async confirmPasswordReset(confirmPasswordResetInput: {
    token: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<boolean> {
    const { token, email, newPassword, confirmPassword } =
      confirmPasswordResetInput;

    if (!token || !email || !newPassword || !confirmPassword) {
      throw new UserInputError('All fields are required');
    }

    if (newPassword !== confirmPassword) {
      throw new UserInputError('Passwords do not match');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UserInputError('User not found');
    }

    const request = await this.prisma.passwordResetRequest.findFirst({
      where: {
        token,
        userId: user.id,
      },
    });

    if (!request) {
      throw new UserInputError('Invalid token');
    }

    if (request.expiresAt < new Date()) {
      throw new UserInputError('Token expired');
    }

    const hashedPassword = await argon.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { hash: hashedPassword },
    });

    await this.prisma.passwordResetRequest.delete({
      where: { token },
    });

    return true;
  }
}
