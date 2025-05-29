import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 2525,
    secure: false,
  });

  async sendOTP(to: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: '"Support" <support@example.com>',
      to,
      subject: 'Password Reset OTP',
      text: `Your password reset code is: ${otp}`,
      html: `<p>Your password reset code is: <strong>${otp}</strong></p>`,
    });
  }
}
