import {
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ProceqAuthService } from './proceq-auth.service';

@Controller()
export class ProceqAuthController {
  private readonly logger = new Logger(ProceqAuthController.name);

  constructor(private readonly authService: ProceqAuthService) {}

  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    if (!code || !state) {
      throw new BadRequestException(
        'Missing authorization code or state in callback query parameters',
      );
    }

    let decodedState: any;
    try {
      decodedState = JSON.parse(Buffer.from(state, 'base64').toString('ascii'));
    } catch (e) {
      throw new BadRequestException('Invalid state payload');
    }

    const { email, callbackUrl } = decodedState;
    console.log('EMAIL', email);
    console.log('CALLBACK URL', callbackUrl);
    if (!email || !callbackUrl) {
      throw new BadRequestException('Incomplete state payload');
    }

    try {
      await this.authService.setAuthorizationCode(code, email);

      const redirectUrl = new URL(callbackUrl);
      redirectUrl.searchParams.append('proceq', 'success');

      return res.redirect(redirectUrl.toString());
    } catch (error) {
      this.logger.error(
        'OAuth callback failed',
        error instanceof Error ? error.message : String(error),
      );

      if (callbackUrl) {
        try {
          const redirectUrl = new URL(callbackUrl);
          redirectUrl.searchParams.append('proceq', 'failed');
          return res.redirect(redirectUrl.toString());
        } catch (e) {
          // ignore error if URL parsing fails on fallback
        }
      }

      throw new InternalServerErrorException(
        'Failed to complete Proceq authentication',
      );
    }
  }
}
