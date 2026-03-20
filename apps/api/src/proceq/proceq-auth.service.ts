import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { ProceqTokenDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return JSON.stringify(error.response?.data) || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

@Injectable()
export class ProceqAuthService {
  private readonly logger = new Logger(ProceqAuthService.name);
  private readonly OPERATOR_EMAIL = 'osvaldo.vallati@sandvik.com'; // TODO: This will be removed and changed dynamically as per user.

  private token?: ProceqTokenDto;
  private refreshPromise: Promise<void> | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.initializeTokenFromDB();
  }

  private async initializeTokenFromDB(): Promise<void> {
    try {
      const storedToken = await this.prisma.proceqToken.findUnique({
        where: { operatorEmail: this.OPERATOR_EMAIL },
      });

      if (
        storedToken &&
        new Date(storedToken.expiresAt) > new Date(Date.now() + 60_000)
      ) {
        this.token = {
          accessToken: storedToken.accessToken,
          refreshToken: storedToken.refreshToken,
          expiresAt: storedToken.expiresAt.getTime(),
        };
        this.logger.log('Proceq token loaded from database');
      } else if (storedToken?.refreshToken) {
        await this.refreshAndStoreToken(storedToken.refreshToken);
      }
    } catch (error) {
      this.logger.error('Failed to initialize token from DB', error);
    }
  }
  private async storeTokenInDB(token: ProceqTokenDto): Promise<void> {
    try {
      const expiresAt = new Date(token.expiresAt);

      await this.prisma.proceqToken.upsert({
        where: { operatorEmail: this.OPERATOR_EMAIL },
        update: {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          expiresAt: expiresAt,
          updatedAt: new Date(),
        },
        create: {
          operatorEmail: this.OPERATOR_EMAIL,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          expiresAt: expiresAt,
        },
      });

      this.logger.log('Proceq token stored in database');
    } catch (error) {
      this.logger.error('Failed to store token in DB', error);
    }
  }

  private async refreshAndStoreToken(refreshToken: string): Promise<void> {
    try {
      const newToken = await this.refreshTokenFlow(refreshToken);
      this.token = newToken;
      await this.storeTokenInDB(newToken);
    } catch (error) {
      this.logger.error('Failed to refresh and store token', error);
      throw error;
    }
  }

  async setAuthorizationCode(code: string): Promise<void> {
    try {
      const newToken = await this.exchangeCodeForToken(code);
      this.token = newToken;
      await this.storeTokenInDB(newToken);

      this.logger.log(
        'Proceq access token acquired successfully via authorization code flow',
      );
    } catch (error) {
      this.logger.error(
        'Failed to exchange authorization code for token',
        extractErrorMessage(error),
      );
      throw new Error('Unable to authenticate with Proceq API');
    }
  }

  async authenticate(): Promise<ProceqTokenDto> {
    if (this.token && Date.now() < this.token.expiresAt - 60_000) {
      return this.token;
    }

    if (this.refreshPromise) {
      await this.refreshPromise;
      if (this.token && Date.now() < this.token.expiresAt - 60_000) {
        return this.token;
      }
    }

    const storedToken = await this.prisma.proceqToken.findUnique({
      where: { operatorEmail: this.OPERATOR_EMAIL },
    });

    if (storedToken?.refreshToken) {
      try {
        this.refreshPromise = this.refreshAndStoreToken(storedToken.refreshToken);
        await this.refreshPromise;
        return this.token!;
      } catch (error) {
        this.logger.error(
          'Failed to refresh Proceq token',
          extractErrorMessage(error),
        );
      } finally {
        this.refreshPromise = null;
      }
    }

    throw new Error(
      'Proceq authentication requires user authorization. Please visit the login endpoint.',
    );
  }

  getAuthorizationUrl(): string {
    const clientId = this.configService.get<string>('PROCEQ_CLIENT_ID');
    const redirectUri = this.configService.get<string>('PROCEQ_REDIRECT_URI');
    const baseURL = this.configService.get<string>('PROCEQ_WORKSPACE_DOMAIN');

    if (!clientId || !redirectUri || !baseURL) {
      throw new Error('Missing Proceq OAuth configuration');
    }

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'openid email profile offline',
      state: 'foobar',
    });
    return `https://${baseURL}/api/id/v1/auth/authorize?${params.toString()}`;
  }

  private async exchangeCodeForToken(
    authorizationCode: string,
  ): Promise<ProceqTokenDto> {
    this.logger.debug('Exchanging authorization code for Proceq token...');
    const clientId = this.configService.get<string>('PROCEQ_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PROCEQ_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('PROCEQ_REDIRECT_URI');
    const baseURL = this.configService.get<string>('PROCEQ_WORKSPACE_DOMAIN');

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing Proceq client credentials or redirect URI');
    }

    const tokenUrl = `https://${baseURL}/api/id/v1/auth/token`;
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', authorizationCode);
    params.append('redirect_uri', redirectUri);

    try {
      const response = await axios.post(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          Authorization: `Basic ${basicAuth}`,
        },
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: Date.now() + response.data.expires_in * 1000,
      };
    } catch (error) {
      this.logger.error('Failed to exchange authorization code for token', extractErrorMessage(error));
      throw error;
    }
  }

  private async refreshTokenFlow(
    refreshToken: string,
  ): Promise<ProceqTokenDto> {
    const clientId = this.configService.get<string>('PROCEQ_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PROCEQ_CLIENT_SECRET');
    const baseURL = this.configService.get<string>('PROCEQ_WORKSPACE_DOMAIN');

    if (!clientId || !clientSecret) {
      throw new Error('Missing Proceq client credentials');
    }

    const tokenUrl = `https://${baseURL}/api/id/v1/auth/token`;
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
      'base64',
    );

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    const response = await axios.post(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: `Basic ${basicAuth}`,
      },
    });

    this.logger.debug('Proceq access token refreshed successfully');

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token || refreshToken,
      expiresAt: Date.now() + response.data.expires_in * 1000,
    };
  }

  async getValidToken(): Promise<ProceqTokenDto> {
    return this.authenticate();
  }

  async getAuthorizationHeader(): Promise<{ Authorization: string }> {
    const token = await this.authenticate();
    return { Authorization: `Bearer ${token.accessToken}` };
  }
}
