import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInputError } from '@nestjs/apollo';
import * as argon from 'argon2';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ResetPasswordService {
  constructor(private prisma: PrismaService, private mailer: MailService) {}

  private async generateUniqueOTP(): Promise<string> {
    while (true) {
      const token = Math.floor(100000 + Math.random() * 900000).toString();
      const existing = await this.prisma.passwordResetRequest.findUnique({
        where: { token },
      });

      if (!existing) return token;
    }
  }

  // Step 1: Request password reset //
  async requestPasswordReset(requestPasswordResetInput: { email: string }): Promise<boolean> {
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
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await this.prisma.passwordResetRequest.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });
    await this.mailer.sendOTP(user.email, token);
    return true;
  }
  // Step 2: Verify code with email  //
  async validateResetToken(validateResetTokenInput: { token: string; email: string }): Promise<boolean> {
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
    const { token, email, newPassword, confirmPassword } = confirmPasswordResetInput;

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
