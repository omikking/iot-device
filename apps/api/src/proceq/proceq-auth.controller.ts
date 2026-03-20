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

  @Get('proceq/auth/login')
  login(@Res() res: Response) {
    return res.redirect(this.authService.getAuthorizationUrl());
  }

  @Get('callback')
  async callback(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException(
        'Missing authorization code in callback query parameters',
      );
    }

    try {
      await this.authService.setAuthorizationCode(code);
      return {
        status: 'ok',
        message: 'Proceq authentication completed successfully',
      };
    } catch (error) {
      this.logger.error(
        'OAuth callback failed',
        error instanceof Error ? error.message : String(error),
      );
      throw new InternalServerErrorException(
        'Failed to complete Proceq authentication',
      );
    }
  }
}
